import { createDirectus, rest, authentication, readUsers, updateUser } from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';
const CLIENT_EMAIL = 'ariel@peritoarielmiranda.com.br';
const POLICY_ID = 'd6d44b16-05fa-4856-83c5-e2eceb08d26f'; // Created in previous step

const client = createDirectus(URL).with(authentication()).with(rest());

async function attachPolicy() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });

        console.log(`🔍 Buscando usuário ${CLIENT_EMAIL}...`);
        const users = await client.request(readUsers({
            filter: { email: { _eq: CLIENT_EMAIL } }
        }));

        if (users.length > 0) {
            const user = users[0];
            console.log(`ℹ️  Usuário encontrado: ${user.id}`);

            console.log("🔗 Anexando política ao usuário...");
            // User policies are separate from role permissions usually, but lets try.
            await client.request(updateUser(user.id, {
                policies: [POLICY_ID]
            }));

            console.log("✅ Política anexada com sucesso!");

        } else {
            console.log("❌ Usuário não encontrado.");
        }

    } catch (e) {
        console.error("❌ Erro:", e.message);
        if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
    }
}

attachPolicy();
