import {
    createDirectus, rest, authentication,
    readRoles, readUsers, updateUser, readPresets, deletePreset, createPreset
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

async function fallbackSetup() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });

        // 1. Find ADMIN Role
        console.log("🔍 Buscando Role Administrator...");
        const roles = await client.request(readRoles({
            filter: { name: { _eq: 'Administrator' } },
            limit: 1
        }));

        if (roles.length === 0) { console.log("❌ Role Administrator não encontrada??"); return; }
        const adminRole = roles[0];
        console.log(`✅ Role Admin encontrada: ${adminRole.id}`);

        // 2. Update User
        console.log(`👤 Atualizando usuário para Administrator...`);
        const users = await client.request(readUsers({ filter: { email: { _eq: CLIENT_EMAIL } } }));
        if (users.length === 0) { console.log("❌ Usuário não encontrado."); return; }
        const userId = users[0].id;

        await client.request(updateUser(userId, {
            role: adminRole.id
        }));
        console.log("   ✅ Usuário agora é ADMIN (Acesso garantido).");

        // 3. Force Presets (Simulate Simple View)
        console.log("📍 Configurando Menu Simplificado...");
        // Wipe old
        const userPresets = await client.request(readPresets({ filter: { user: { _eq: userId } }, limit: 100 }));
        for (const p of userPresets) {
            await client.request(deletePreset(p.id));
        }

        // Create new bookmarks
        for (const col of CONTENT_COLLECTIONS) {
            if (col === 'directus_files') continue;
            await client.request(createPreset({
                user: userId,
                collection: col,
                bookmark: true, // This puts it in the menu
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
        console.log("   ✅ Menu configurado.");

        console.log("\n🎉 SOLUÇÃO FINAL PRONTA! O usuário verá o conteúdo.");

    } catch (e) {
        console.error("❌ Erro:", e.message);
        if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
    }
}

fallbackSetup();
