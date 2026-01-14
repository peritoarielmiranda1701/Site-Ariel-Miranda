import {
    createDirectus, rest, authentication,
    readRole, createPermission, readPermissions, readUsers, readPolicies, updateRole
} from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';
const CLIENT_EMAIL = 'ariel@peritoarielmiranda.com.br';

const client = createDirectus(URL).with(authentication()).with(rest());

const SYSTEM_COLLECTIONS_ESSENTIAL = [
    'directus_collections',
    'directus_fields',
    'directus_relations',
    'directus_settings',
    'directus_presets'
];

async function patchPermissions() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });

        // 1. Get User dynamically to ensure we target correct role
        console.log(`🔍 Buscando usuário ${CLIENT_EMAIL}...`);
        const users = await client.request(readUsers({ filter: { email: { _eq: CLIENT_EMAIL } } }));
        if (users.length === 0) { console.log("❌ User not found"); return; }
        const user = users[0];
        const ROLE_ID = user.role;
        console.log(`ℹ️  User Role ID: ${ROLE_ID}`);

        console.log(`🔍 Buscando Policy da Role...`);
        // Explicitly request policies field
        const role = await client.request(readRole(ROLE_ID, {
            fields: ['*', 'policies']
        }));

        console.log("ℹ️ Role object keys:", Object.keys(role));

        if (!role.policies || role.policies.length === 0) {
            console.log("❌ Role sem policies! Tentando encontrar 'Gestor Policy' perdida...");

            // Search for the policy
            const policies = await client.request(readPolicies({
                filter: { name: { _contains: 'Gestor Policy' } },
                limit: 1
            }));

            if (policies.length === 0) {
                console.log("❌ Nenhuma política 'Gestor Policy' encontrada para recuperar.");
                return;
            }

            const foundPolicy = policies[0];
            console.log(`✅ Política encontrada: ${foundPolicy.id} (${foundPolicy.name})`);

            // Attach to Role
            console.log("🔗 Re-anexando política à Role...");
            await client.request(updateRole(ROLE_ID, {
                policies: [foundPolicy.id]
            }));

            // Use this policy for the next steps
            role.policies = [foundPolicy.id];
        }

        const policyId = role.policies[0];
        console.log(`✅ Usando Policy: ${policyId}`);

        console.log("🔐 Aplicando permissões de Sistema FALTANTES...");

        for (const col of SYSTEM_COLLECTIONS_ESSENTIAL) {
            // Check if exists to avoid error
            const existing = await client.request(readPermissions({
                filter: {
                    policy: { _eq: policyId },
                    collection: { _eq: col },
                    action: { _eq: 'read' }
                }
            }));

            if (existing.length === 0) {
                console.log(`   ➕ Adicionando READ para: ${col}`);
                await client.request(createPermission({
                    policy: policyId,
                    collection: col,
                    action: 'read',
                    fields: ['*']
                }));
            } else {
                console.log(`   ℹ️  JÁ EXISTE: ${col}`);
            }
        }

        console.log("\n🎉 CORREÇÃO FINALIZADA! Agora o menu deve aparecer.");

    } catch (e) {
        console.error("❌ Erro:", e.message);
        if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
    }
}

patchPermissions();
