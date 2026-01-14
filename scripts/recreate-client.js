import { createDirectus, rest, authentication, deleteUser, deleteRole, createRole, createUser, readUsers, readRoles, createPolicy, readPolicies, deletePolicy } from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';
const CLIENT_EMAIL = 'ariel@peritoarielmiranda.com.br';
const CLIENT_PASSWORD = 'Cliente123!';

const client = createDirectus(URL).with(authentication()).with(rest());

async function recreateClient() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });

        // 1. Cleanup
        console.log("🧹 Limpando usuário antigo...");
        const users = await client.request(readUsers({ filter: { email: { _eq: CLIENT_EMAIL } } }));
        for (const u of users) {
            await client.request(deleteUser(u.id));
            console.log(`   🗑️ Usuário ${u.id} deletado.`);
        }

        console.log("🧹 Limpando role antiga...");
        const roles = await client.request(readRoles({ filter: { name: { _in: ['Editor', 'Cliente'] } } }));
        for (const r of roles) {
            try {
                await client.request(deleteRole(r.id));
                console.log(`   🗑️ Role ${r.id} (${r.name}) deletada.`);
            } catch (e) { console.log("Erro ao deletar role (pode ter users):", e.message) }
        }

        // 2. Prepare Policy
        console.log("🛡️ Preparando Política de Acesso...");
        let policyId;
        // Check if policy exists from previous attempts
        // Note: filtering policies might be restricted or complex syntax, so we blindly create a new one distinct name
        const policyName = 'Acesso Cliente V2';

        const newPolicy = await client.request(createPolicy({
            name: policyName,
            icon: 'verified_user',
            app_access: true,
            admin_access: false,
            enforce_tfa: false,
            permissions: [
                { collection: 'services', action: 'create', fields: ['*'] },
                { collection: 'services', action: 'read', fields: ['*'] },
                { collection: 'services', action: 'update', fields: ['*'] },
                { collection: 'services', action: 'delete', fields: ['*'] },

                { collection: 'testimonials', action: 'read', fields: ['*'] },
                { collection: 'testimonials', action: 'update', fields: ['*'] }, // Client can edit testimonials

                { collection: 'Informacoes_Gerais', action: 'read', fields: ['*'] },
                { collection: 'Informacoes_Gerais', action: 'update', fields: ['*'] },

                { collection: 'hero_stats', action: 'read', fields: ['*'] },
                { collection: 'hero_stats', action: 'update', fields: ['*'] },

                { collection: 'directus_files', action: 'read', fields: ['*'] },
                { collection: 'directus_files', action: 'create', fields: ['*'] },
                { collection: 'directus_files', action: 'update', fields: ['*'] },
            ]
        }));
        policyId = newPolicy.id;
        console.log(`   ✅ Política criada: ${policyId}`);

        // 3. Create Role LINKED to Policy
        console.log("🆕 Criando Role 'Cliente'...");
        const role = await client.request(createRole({
            name: 'Cliente',
            icon: 'face',
            description: 'Acesso Simples',
            policies: [policyId] // Attach at creation
        }));
        console.log(`   ✅ Role criada: ${role.id}`);

        // 4. Create User LINKED to Role
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

        console.log("\n🎉 RECRIAÇÃO COMPLETA! Tentar logar agora.");

    } catch (e) {
        console.error("❌ Erro:", e.message);
        if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
    }
}

recreateClient();
