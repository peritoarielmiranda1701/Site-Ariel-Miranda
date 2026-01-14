import {
    createDirectus, rest, authentication,
    readUsers, readPresets, createPreset, deletePreset, readPermissions, readPolicies, readRole
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

async function forceSidebar() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });

        // 1. Get User
        console.log(`🔍 Buscando usuário ${CLIENT_EMAIL}...`);
        const users = await client.request(readUsers({ filter: { email: { _eq: CLIENT_EMAIL } } }));
        if (users.length === 0) { console.log("❌ User not found"); return; }
        const user = users[0];
        console.log(`✅ Usuário: ${user.id} (Role: ${user.role})`);

        // 2. DEBUG: Check Permissions
        console.log("🔍 Verificando Permissões de Sistema...");
        // Need to find the policy attached to this role
        const role = await client.request(readRole(user.role));

        let hasCollectionPerm = false;

        if (role.policies && role.policies.length > 0) {
            const policyId = role.policies[0];
            const perms = await client.request(readPermissions({
                filter: {
                    policy: { _eq: policyId },
                    collection: { _eq: 'directus_collections' }
                }
            }));
            if (perms.length > 0) {
                console.log("✅ Permissão 'directus_collections' (read) EXISTE.");
                hasCollectionPerm = true;
            }
        }

        if (!hasCollectionPerm) {
            console.log("⚠️ ALERTA: Permissão 'directus_collections' NÃO encontrada! O app não sabe listar coleções.");
        }

        // 3. CLEANUP User Presets
        console.log("🧹 Limpando presets PESSOAIS do usuário...");
        const userPresets = await client.request(readPresets({ filter: { user: { _eq: user.id } }, limit: 100 }));
        for (const p of userPresets) {
            await client.request(deletePreset(p.id));
        }
        console.log("   ✅ Presets pessoais limpos.");

        // 4. INJECT User Presets (Force Sidebar)
        console.log("📍 Forçando menu PESSOAL...");
        for (const col of CONTENT_COLLECTIONS) {
            if (col === 'directus_files') continue;

            await client.request(createPreset({
                user: user.id, // Explicitly linking to USER, not Role
                collection: col,
                bookmark: true,
                layout: 'tabular',
                refresh_interval: null
            }));
            console.log(`   📌 Menu Adicionado: ${col}`);
        }
        // Files
        await client.request(createPreset({
            user: user.id,
            collection: 'directus_files',
            bookmark: true,
            layout: 'cards',
            refresh_interval: null
        }));
        console.log(`   📌 Menu Adicionado: directus_files`);


        console.log("\n🎉 MENU FORÇADO! Peça para o cliente dar F5.");

    } catch (e) {
        console.error("❌ Erro:", e.message);
        if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
    }
}

forceSidebar();
