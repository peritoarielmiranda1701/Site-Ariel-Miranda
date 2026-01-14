import { createDirectus, rest, authentication, readRoles } from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';

const client = createDirectus(URL).with(authentication()).with(rest());

async function debugAdmin() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });

        console.log("🔍 Buscando função 'Administrator'...");
        const roles = await client.request(readRoles({
            filter: { name: { _eq: 'Administrator' } },
            fields: ['*']
        }));

        if (roles.length > 0) {
            const role = roles[0];
            console.log("🛡️ Admin Role Keys:", Object.keys(role));
            console.log("🛡️ Admin Role Full:", JSON.stringify(role, null, 2));

            if (role.policies) {
                console.log("📜 Policies found! This role uses policies.");
            } else {
                console.log("🚫 No policies field found on role.");
            }
        }

    } catch (e) {
        console.error("❌ Erro:", e.message);
    }
}

debugAdmin();
