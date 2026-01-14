import {
    createDirectus, rest, authentication,
    createRole, createPolicy, createPermission, createPreset,
    readUsers, updateUser, deletePreset, readPresets
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
    'directus_collections', // ESSENTIAL
    'directus_fields',
    'directus_relations',
    'directus_settings',
    'directus_presets',
    'directus_users', 'directus_roles', 'directus_shares',
    'directus_flows', 'directus_operations', 'directus_panels', 'directus_dashboards', 'directus_folders'
];

async function ultimateSetup() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });

        // 1. CREATE Policy
        const policyName = `Gestor Content Policy ${Math.floor(Math.random() * 1000)}`;
        console.log(`🆕 Criando Policy: ${policyName}...`);

        const policy = await client.request(createPolicy({
            name: policyName,
            icon: 'verified_user',
            app_access: true,
            admin_access: false,
            enforce_tfa: false
        }));
        const policyId = policy.id;
        console.log(`   ✅ Policy ID: ${policyId}`);

        // 2. APPLY Permissions to POLICY
        console.log("🔐 Aplicando permissões...");
        // Content
        for (const col of CONTENT_COLLECTIONS) {
            for (const action of ['create', 'read', 'update', 'delete']) {
                await client.request(createPermission({
                    policy: policyId,
                    collection: col,
                    action: action,
                    fields: ['*']
                }));
            }
        }
        // System
        for (const col of SYSTEM_COLLECTIONS_READ) {
            await client.request(createPermission({
                policy: policyId,
                collection: col,
                action: 'read',
                fields: ['*']
            }));
        }
        // Presets Access
        await client.request(createPermission({ policy: policyId, collection: 'directus_presets', action: 'create', fields: ['*'] }));
        await client.request(createPermission({ policy: policyId, collection: 'directus_presets', action: 'update', fields: ['*'] }));


        // 3. CREATE Role linked to Policy
        const roleName = `Gestor de Conteúdo ${Math.floor(Math.random() * 1000)}`;
        console.log(`🆕 Criando Role: ${roleName}...`);

        const role = await client.request(createRole({
            name: roleName,
            icon: 'verified_user',
            description: 'Acesso Gestor',
            policies: [policyId] // Link Policy HERE
        }));
        const roleId = role.id;
        console.log(`   ✅ Role ID: ${roleId}`);


        // 4. MIGRATE USER
        console.log("👤 Movendo usuário...");
        const users = await client.request(readUsers({ filter: { email: { _eq: CLIENT_EMAIL } } }));
        if (users.length > 0) {
            const userId = users[0].id;
            await client.request(updateUser(userId, { role: roleId }));
            console.log("   ✅ Usuário atualizado com nova Role.");

            // 5. FORCE USER PRESETS (Safety Net)
            console.log("📍 Forçando User Presets...");

            // Wipe old
            const userPresets = await client.request(readPresets({ filter: { user: { _eq: userId } }, limit: 100 }));
            for (const p of userPresets) {
                await client.request(deletePreset(p.id));
            }

            // Create new
            for (const col of CONTENT_COLLECTIONS) {
                if (col === 'directus_files') continue;
                await client.request(createPreset({
                    user: userId,
                    collection: col,
                    bookmark: true,
                    layout: 'tabular',
                    refresh_interval: null
                }));
            }
            await client.request(createPreset({
                user: userId,
                collection: 'directus_files',
                bookmark: true,
                layout: 'cards',
                refresh_interval: null
            }));
            console.log("   ✅ Presets Forçados.");
        }

        console.log("\n🎉 CONFIGURAÇÃO DEFINITIVA CONCLUÍDA!");

    } catch (e) {
        console.error("❌ Erro:", e.message);
        if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
    }
}

ultimateSetup();
