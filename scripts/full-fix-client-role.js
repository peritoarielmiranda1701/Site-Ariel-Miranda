import {
    createDirectus, rest, authentication,
    readRoles,
    readPermissions, deletePermission, createPermission,
    readPresets, deletePreset, createPreset
} from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';

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

async function fullFix() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });

        // 1. Get Role
        console.log("🔍 Buscando Role 'Cliente'...");
        const roles = await client.request(readRoles({ filter: { name: { _eq: 'Cliente' } } }));
        if (roles.length === 0) { console.log("❌ Role não encontrada"); return; }
        const roleId = roles[0].id;

        // 2. CLEANUP Permissions
        console.log("🧹 Limpando permissões antigas...");
        const perms = await client.request(readPermissions({ filter: { role: { _eq: roleId } }, limit: 100 }));
        for (const p of perms) {
            await client.request(deletePermission(p.id));
        }
        console.log("   ✅ Permissões limpas.");

        // 3. CLEANUP Presets
        console.log("🧹 Limpando presets (menu) antigos...");
        const presets = await client.request(readPresets({ filter: { role: { _eq: roleId } }, limit: 100 }));
        for (const p of presets) {
            await client.request(deletePreset(p.id));
        }
        console.log("   ✅ Presets limpos.");

        // 4. CREATE Permissions
        console.log("🔐 Criando novas permissões...");
        // Content
        for (const col of CONTENT_COLLECTIONS) {
            for (const action of ['create', 'read', 'update', 'delete']) {
                await client.request(createPermission({
                    role: roleId,
                    collection: col,
                    action: action,
                    fields: ['*']
                }));
            }
        }
        // System
        for (const col of SYSTEM_COLLECTIONS_READ) {
            await client.request(createPermission({
                role: roleId,
                collection: col,
                action: 'read',
                fields: ['*']
            }));
        }
        // Presets (must be editable by user to save own views)
        await client.request(createPermission({ role: roleId, collection: 'directus_presets', action: 'create', fields: ['*'] }));
        await client.request(createPermission({ role: roleId, collection: 'directus_presets', action: 'update', fields: ['*'] }));

        console.log("   ✅ Permissões aplicadas.");

        // 5. CREATE Presets (The "Pinned" Menu Items)
        console.log("📍 Fixando coleções no menu...");
        for (const col of CONTENT_COLLECTIONS) {
            if (col === 'directus_files') continue; // Libraries usually separate

            await client.request(createPreset({
                role: roleId,
                collection: col,
                bookmark: true,
                layout: 'tabular',
                refresh_interval: null
            }));
            console.log(`   📌 Menu: ${col}`);
        }

        console.log("\n🎉 CORREÇÃO COMPLETA! O menu do usuário deve aparecer agora.");

    } catch (e) {
        console.error("❌ Erro:", e.message);
        if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
    }
}

fullFix();
