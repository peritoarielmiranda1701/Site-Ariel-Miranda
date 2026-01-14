import { createDirectus, rest, authentication, readRoles, updateRole } from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';

const client = createDirectus(URL).with(authentication()).with(rest());

async function forceUpdate() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });

        console.log("🔍 Buscando função 'Editor'...");
        const roles = await client.request(readRoles({
            filter: { name: { _eq: 'Editor' } },
            fields: ['*']
        }));

        if (roles.length > 0) {
            const role = roles[0];
            console.log(`ℹ️  Função encontrada: ${role.id}`);
            console.log(`   Status ATUAL: app_access=${role.app_access}`);

            console.log("🔧 Forçando 'app_access' para true...");
            const updated = await client.request(updateRole(role.id, {
                app_access: true
            }, {
                fields: ['*']
            }));

            console.log("-----------------------------------------");
            console.log(`✅ Resultado do Update: app_access=${updated.app_access}`);
            console.log("-----------------------------------------");

        } else {
            console.log("❌ Função 'Editor' não encontrada.");
        }

    } catch (e) {
        console.error("❌ Erro:", e.message);
        if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
    }
}

forceUpdate();
