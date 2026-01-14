import { createDirectus, rest, authentication, readUsers, readRole } from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';

const CLIENT_EMAIL = 'ariel@peritoarielmiranda.com.br';

const client = createDirectus(URL).with(authentication()).with(rest());

async function debugAccess() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });

        console.log(`🔍 Investigando usuário ${CLIENT_EMAIL}...`);
        const users = await client.request(readUsers({
            filter: { email: { _eq: CLIENT_EMAIL } },
            fields: ['id', 'email', 'role', 'status']
        }));

        if (users.length === 0) {
            console.log("❌ Usuário não encontrado!");
            return;
        }

        const user = users[users.length - 1]; // Get latest if multiple? Should be unique email.
        console.log("👤 Usuário encontrado:", user);

        if (!user.role) {
            console.log("❌ Usuário SEM função (role) atribuída!");
            return;
        }

        console.log(`🔍 Buscando detalhes da função (Role ID: ${user.role})...`);
        try {
            const role = await client.request(readRole(user.role));
            console.log("🛡️ Detalhes da Função:", role);

            console.log("---------------------------------------------------");
            if (role.app_access) {
                console.log("✅ app_access: TRUE (Permissão de login OK)");
            } else {
                console.log("❌ app_access: FALSE (Isso impede o login)");
            }

            if (role.admin_access) {
                console.log("⚠️ admin_access: TRUE (Acesso total)");
            } else {
                console.log("ℹ️ admin_access: FALSE (Acesso restrito)");
            }
            console.log("---------------------------------------------------");

        } catch (e) {
            console.log("❌ Erro ao ler role:", e.message);
        }

    } catch (e) {
        console.error("❌ Erro:", e.message);
    }
}

debugAccess();
