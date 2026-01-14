import {
    createDirectus, rest, authentication,
    createRole, createPolicy, createPermission, createPreset,
    readUsers, updateUser
} from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';
const CLIENT_EMAIL = 'ariel@peritoarielmiranda.com.br';

const client = createDirectus(URL).with(authentication()).with(rest());

const CONTENT_COLLECTIONS = [
    'services', 'testimonials', 'faqs', 'differentials',
    'process_steps', 'Informacoes_Gerais', 'hero_stats', 'directus_files'
];

const SYSTEM_COLLECTIONS_READ = [
    'directus_users', 'directus_roles', 'directus_collections', 'directus_fields',
    'directus_relations', 'directus_settings', 'directus_presets', 'directus_shares',
    'directus_flows', 'directus_operations', 'directus_panels', 'directus_dashboards', 'directus_folders'
];

async function setupGestor() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });

        // 1. CREATE Policy
        console.log("🆕 Criando Política 'Gestor Policy'...");
        const policyName = `Gestor Policy ${Math.floor(Math.random() * 1000)}`;

        const policy = await client.request(createPolicy({
            name: policyName,
            icon: 'verified_user',
            app_access: true,
            admin_access: false,
            enforce_tfa: false
        }));
        const policyId = policy.id;
        console.log(`   ✅ Política criada: ${policyId}`);

        // 2. APPLY Permissions to POLICY
        console.log("🔐 Criando permissões na Política...");
        // Content
        for (const col of CONTENT_COLLECTIONS) {
            for (const action of ['create', 'read', 'update', 'delete']) {
                await client.request(createPermission({
                    policy: policyId, // LINK TO POLICY
                    collection: col,
                    action: action,
                    fields: ['*']
                }));
            }
        }
        // System
        for (const col of SYSTEM_COLLECTIONS_READ) {
            await client.request(createPermission({
                policy: policyId, // LINK TO POLICY
                collection: col,
                action: 'read',
                fields: ['*']
            }));
        }
        // Presets Access
        await client.request(createPermission({ policy: policyId, collection: 'directus_presets', action: 'create', fields: ['*'] }));
        await client.request(createPermission({ policy: policyId, collection: 'directus_presets', action: 'update', fields: ['*'] }));


        // 3. CREATE Role linked to Policy
        console.log("🆕 Criando Role 'Gestor do Site'...");
        const roleName = `Gestor do Site ${Math.floor(Math.random() * 1000)}`;
        const role = await client.request(createRole({
            name: roleName,
            icon: 'verified_user',
            description: 'Gerenciamento de Conteúdo',
            policies: [policyId] // Link Policy here
        }));
        const roleId = role.id;
        console.log(`   ✅ Role criada: ${roleId}`);


        // 4. CREATE Presets linked to ROLE (Presets are still Role-based usually)
        console.log("📍 Criando Presets (Menus)...");
        for (const col of CONTENT_COLLECTIONS) {
            if (col === 'directus_files') continue;

            await client.request(createPreset({
                role: roleId,
                collection: col,
                bookmark: true,
                layout: 'tabular',
                refresh_interval: null
            }));
        }
        // Add Files preset specifically
        await client.request(createPreset({
            role: roleId,
            collection: 'directus_files',
            bookmark: true,
            layout: 'cards',
            refresh_interval: null
        }));

        console.log("   ✅ Menus configurados.");

        // 5. ASSIGN User
        console.log("👤 Movendo usuário para a nova Role...");
        const users = await client.request(readUsers({ filter: { email: { _eq: CLIENT_EMAIL } } }));
        if (users.length > 0) {
            await client.request(updateUser(users[0].id, {
                role: roleId
            }));
            console.log("🎉 Usuário atualizado para 'Gestor do Site'!");
        } else {
            console.log("❌ Usuário não encontrado.");
        }

    } catch (e) {
        console.error("❌ Erro:", e.message);
        if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
    }
}

setupGestor();
