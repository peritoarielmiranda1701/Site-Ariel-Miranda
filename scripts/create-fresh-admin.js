import { createDirectus, rest, authentication, readRoles, createUser } from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';

// New distinct email to avoid cache collision
const NEW_USER_EMAIL = 'ariel.admin@peritoarielmiranda.com.br';
const NEW_USER_PASSWORD = 'Cliente123!';

const client = createDirectus(URL).with(authentication()).with(rest());

async function createFreshAdmin() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });

        // 1. Get the REAL System Administrator Role
        console.log("🔍 Buscando role 'Administrator' do sistema...");
        const roles = await client.request(readRoles({
            filter: { name: { _eq: 'Administrator' } }
        }));

        if (roles.length === 0) {
            console.log("❌ Role Administrator não encontrada!");
            return;
        }

        const adminRole = roles[0];
        console.log(`✅ Role encontrada: ${adminRole.id} (${adminRole.name})`);

        // 2. Create User assigned to this Role
        console.log(`🆕 Criando usuário ${NEW_USER_EMAIL}...`);
        try {
            const user = await client.request(createUser({
                first_name: 'Ariel',
                last_name: 'Miranda (Admin)',
                email: NEW_USER_EMAIL,
                password: NEW_USER_PASSWORD,
                role: adminRole.id, // Assign directly to System Admin role
                status: 'active'
            }));

            console.log("🎉 Usuário criado com sucesso!");
            console.log(`👉 ID: ${user.id}`);
            console.log(`👉 Role: ${user.role}`);

        } catch (e) {
            console.log("❌ Erro ao criar usuário (email já existe?):", e.message);
            if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
        }

    } catch (e) {
        console.error("❌ Erro de conexão:", e.message);
    }
}

createFreshAdmin();
