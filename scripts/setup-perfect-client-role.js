import { createDirectus, rest, authentication, readRoles, createRole, updateRole, createPermission, readUsers, updateUser } from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';
const CLIENT_EMAIL = 'ariel@peritoarielmiranda.com.br';

const client = createDirectus(URL).with(authentication()).with(rest());

// Collections the client can EDIT
const CONTENT_COLLECTIONS = [
    'services', 'testimonials', 'faqs', 'differentials', 'process_steps', 'Informacoes_Gerais', 'hero_stats', 'directus_files'
];

// System collections needed for the APP UI to work (Read-Only)
const SYSTEM_COLLECTIONS_READ = [
    'directus_users', 'directus_roles', 'directus_collections', 'directus_fields',
    'directus_relations', 'directus_settings', 'directus_presets', 'directus_shares',
    'directus_flows', 'directus_operations', 'directus_panels', 'directus_dashboards'
];

async function setupPerfectClient() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });

        // 1. Create or Get 'Cliente' Role
        console.log("🔍 Configurando Role 'Cliente'...");
        let roleId;
        const roles = await client.request(readRoles({ filter: { name: { _eq: 'Cliente' } } }));

        if (roles.length > 0) {
            roleId = roles[0].id;
            console.log(`   ℹ️  Role já existe: ${roleId}`);
        } else {
            console.log("   🆕 Criando Role...");
            const role = await client.request(createRole({
                name: 'Cliente',
                icon: 'storefront',
                description: 'Acesso simplificado ao conteúdo',
                app_access: true,
                admin_access: false,
                enforce_tfa: false
            }));
            roleId = role.id;
        }

        // 2. Grant Permissions
        console.log("🔐 Aplicando permissões...");

        // A. Content Permissions (CRUD)
        for (const col of CONTENT_COLLECTIONS) {
            try {
                for (const action of ['create', 'read', 'update', 'delete']) {
                    await client.request(createPermission({
                        role: roleId,
                        collection: col,
                        action: action,
                        fields: ['*']
                    }));
                }
            } catch (e) { } // Ignore exists errors
        }

        // B. System Read Permissions (Essential for UI)
        for (const col of SYSTEM_COLLECTIONS_READ) {
            try {
                await client.request(createPermission({
                    role: roleId,
                    collection: col,
                    action: 'read',
                    fields: ['*']
                }));
            } catch (e) { }
        }

        // Grant Preset creation (for user preferences/bookmarks)
        try {
            await client.request(createPermission({
                role: roleId,
                collection: 'directus_presets',
                action: 'create',
                fields: ['*']
            }));
            await client.request(createPermission({
                role: roleId,
                collection: 'directus_presets',
                action: 'update',
                fields: ['*']
            }));
        } catch (e) { }


        // 3. Assign User to this Role
        console.log("👤 Movendo usuário para a nova Role...");
        const users = await client.request(readUsers({ filter: { email: { _eq: CLIENT_EMAIL } } }));
        if (users.length > 0) {
            await client.request(updateUser(users[0].id, {
                role: roleId
            }));
            console.log("🎉 Usuário atualizado para perfil CLIENTE (Simplificado)!");
        } else {
            console.log("❌ Usuário não encontrado.");
        }

    } catch (e) {
        console.error("❌ Erro:", e.message);
        if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
    }
}

setupPerfectClient();
