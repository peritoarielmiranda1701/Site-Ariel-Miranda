import { createDirectus, rest, authentication, readPolicies, readUsers, updateUser } from '@directus/sdk';

// Using HTTPS here - if it fails, we know SSL is hard broken
const URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';
const CLIENT_EMAIL = 'ariel@peritoarielmiranda.com.br';

const client = createDirectus(URL).with(authentication()).with(rest());

async function fixPermissionsUltimate() {
    console.log(`🔌 Conectando como Admin (via API)...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });

        // 1. Find the REAL Administrator Policy
        console.log("🔍 Buscando política de Administrador...");
        const policies = await client.request(readPolicies({
            filter: { admin_access: { _eq: true } }
        }));

        if (policies.length === 0) {
            console.log("❌ Nenhuma política de admin encontrada? Impossível.");
            return;
        }

        const adminPolicy = policies[0];
        console.log(`✅ Política Admin encontrada: ${adminPolicy.id} (${adminPolicy.name})`);

        // 2. Find User
        console.log(`🔍 Buscando usuário ${CLIENT_EMAIL}...`);
        const users = await client.request(readUsers({
            filter: { email: { _eq: CLIENT_EMAIL } }
        }));

        if (users.length > 0) {
            const user = users[0];
            console.log(`👤 Usuário encontrado: ${user.id}`);

            // 3. Attach Policy DIRECTLY to User (Bypass Role issues)
            console.log("🔗 Anexando Política Admin TOTAL ao usuário...");
            await client.request(updateUser(user.id, {
                policies: [adminPolicy.id]
            }));

            console.log("✅ SUCCESSO! O usuário agora tem a política de Admin direta.");

        } else {
            console.log("❌ Usuário não encontrado.");
        }

    } catch (e) {
        console.error("❌ Erro:", e.message);
        if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
    }
}

fixPermissionsUltimate();
