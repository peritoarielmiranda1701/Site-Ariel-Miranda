import { createDirectus, rest, authentication, createRole, createUser } from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';
const CLIENT_EMAIL = 'ariel@peritoarielmiranda.com.br';
const CLIENT_PASSWORD = 'Cliente123!';

const client = createDirectus(URL).with(authentication()).with(rest());

async function emergencySetup() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });

        console.log("🆕 Criando Role 'Cliente Admin' (Permissão Total)...");
        // Try setting admin_access directly on Role, hoping it triggers legacy/auto-policy behavior
        const role = await client.request(createRole({
            name: 'Cliente Admin',
            icon: 'verified',
            description: 'Acesso Administrativo Temporário',
            admin_access: true,
            app_access: true
        }));
        console.log(`   ✅ Role criada: ${role.id}`);

        console.log("🆕 Criando Usuário...");
        await client.request(createUser({
            first_name: 'Ariel',
            last_name: 'Miranda',
            email: CLIENT_EMAIL,
            password: CLIENT_PASSWORD,
            role: role.id,
            status: 'active'
        }));
        console.log(`   ✅ Usuário criado!`);

        console.log("\n🎉 ACESSO LIBERADO (MODO ADMIN)!");

    } catch (e) {
        console.error("❌ Erro:", e.message);
        if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
    }
}

emergencySetup();
