import { createDirectus, rest, authentication, readRoles, updateRole, createPolicy } from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';

const client = createDirectus(URL).with(authentication()).with(rest());

async function setupPolicy() {
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

            // 1. Create Policy
            console.log("🆕 Criando Política 'Access App'...");
            const policy = await client.request(createPolicy({
                name: 'Editor App Access',
                icon: 'lock_open',
                description: 'Permite login no App sem acesso Admin',
                app_access: true,
                admin_access: false,
                enforce_tfa: false
            }));
            console.log(`✅ Política criada: ${policy.id}`);

            // 2. Attach to Role
            console.log("🔗 Anexando política à função...");
            const currentPolicies = role.policies || [];
            await client.request(updateRole(role.id, {
                policies: [...currentPolicies, policy.id]
            }));

            console.log("✅ Política anexada com sucesso!");

        } else {
            console.log("❌ Função 'Editor' não encontrada.");
        }

    } catch (e) {
        console.error("❌ Erro:", e.message);
        if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
    }
}

setupPolicy();
