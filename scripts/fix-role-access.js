import { createDirectus, rest, authentication, readRoles, updateRole } from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';

const client = createDirectus(URL).with(authentication()).with(rest());

async function fixRole() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });
        console.log('✅ Login realizado!');

        console.log("🔍 Buscando função 'Editor'...");
        const roles = await client.request(readRoles({ filter: { name: { _eq: 'Editor' } } }));

        if (roles.length > 0) {
            const role = roles[0];
            console.log(`ℹ️  Função encontrada: ${role.id}`);
            console.log(`   Status atual: app_access=${role.app_access}, admin_access=${role.admin_access}`);

            if (!role.app_access) {
                console.log("🔧 Corrigindo 'app_access' para true...");
                await client.request(updateRole(role.id, {
                    app_access: true,
                    admin_access: false
                }));
                console.log("✅ Permissão corrigida com sucesso!");
            } else {
                console.log("✅ 'app_access' já estava habilitado. Talvez seja outra coisa?");
                // Force update just in case
                await client.request(updateRole(role.id, { app_access: true }));
                console.log("🔄 Forcei atualização para garantir.");
            }
        } else {
            console.log("❌ Função 'Editor' não encontrada.");
        }

    } catch (e) {
        console.error("❌ Erro:", e.message);
    }
}

fixRole();
