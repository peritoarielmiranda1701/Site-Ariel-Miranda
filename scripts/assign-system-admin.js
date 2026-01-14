import { createDirectus, rest, authentication, readRoles, readUsers, updateUser } from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';
const CLIENT_EMAIL = 'ariel@peritoarielmiranda.com.br';

const client = createDirectus(URL).with(authentication()).with(rest());

async function assignSystemAdmin() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });

        // 1. Get System Administrator Role
        console.log("🔍 Buscando role 'Administrator' original...");
        const roles = await client.request(readRoles({
            filter: { name: { _eq: 'Administrator' } }
        }));

        if (roles.length === 0) {
            console.log("❌ Role Administrator não encontrada!");
            return;
        }
        const adminRole = roles[0];
        console.log(`✅ Role Admin encontrada: ${adminRole.id}`);

        // 2. Find User
        console.log(`🔍 Buscando usuário ${CLIENT_EMAIL}...`);
        const users = await client.request(readUsers({
            filter: { email: { _eq: CLIENT_EMAIL } }
        }));

        if (users.length > 0) {
            const user = users[0];
            console.log(`ℹ️  Usuário encontrado: ${user.id}`);
            console.log(`   Role atual: ${user.role}`);

            // 3. Update Role
            console.log(`🔧 Alterando role para System Administrator (${adminRole.id})...`);
            await client.request(updateUser(user.id, {
                role: adminRole.id
            }));

            console.log("✅ Usuário promovido a Super Admin com sucesso!");

        } else {
            console.log("❌ Usuário não encontrado.");
        }

    } catch (e) {
        console.error("❌ Erro:", e.message);
    }
}

assignSystemAdmin();
