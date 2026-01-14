import {
    createDirectus, rest, authentication,
    readUsers, updateUser, readPolicies, createPreset, deletePreset, readPresets
} from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';
const CLIENT_EMAIL = 'ariel@peritoarielmiranda.com.br';
// The policy we created in ultimate-setup.js that has permissions
// 1bfa9f2b-cca8-4f67-8657-c0c06dd130d5
const POLICY_ID = '1bfa9f2b-cca8-4f67-8657-c0c06dd130d5';

const client = createDirectus(URL).with(authentication()).with(rest());

const CONTENT_COLLECTIONS = [
    'services', 'testimonials', 'faqs', 'differentials',
    'process_steps', 'Informacoes_Gerais', 'hero_stats', 'directus_files'
];

async function attachDirect() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });

        console.log(`🔍 Buscando usuário...`);
        const users = await client.request(readUsers({ filter: { email: { _eq: CLIENT_EMAIL } } }));
        if (users.length === 0) { console.log("❌ Usuário não encontrado."); return; }
        const userId = users[0].id;
        console.log(`✅ Usuário: ${userId}`);

        // 1. ATTACH POLICY DIRECTLY
        console.log(`🔗 Anexando Policy ${POLICY_ID} diretamente ao usuário...`);
        try {
            await client.request(updateUser(userId, {
                policies: [POLICY_ID]
            }));
            console.log("   ✅ Policy anexada ao usuário!");
        } catch (e) {
            console.log("   ❌ Falha ao anexar policy ao usuário: " + e.message);
            // If this fails, we are in trouble.
        }

        // 2. Refresh Presets (Just to be sure)
        console.log("📍 Garantindo menu (Presets)...");
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
        console.log("   ✅ Menu Regerado.");

        console.log("\n🎉 Tentativa 'Direct Policy' concluída!");

    } catch (e) {
        console.error("❌ Erro:", e.message);
        if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
    }
}

attachDirect();
