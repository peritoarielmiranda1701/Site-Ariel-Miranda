import {
    createDirectus, rest, authentication,
    readRoles, readUsers, updateUser, readRole
} from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';
const CLIENT_EMAIL = 'ariel@peritoarielmiranda.com.br';

const client = createDirectus(URL).with(authentication()).with(rest());

async function moveUser() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });

        // 1. Find the GOOD Role
        console.log("🔍 Buscando Roles 'Gestor do Site' válidas...");
        const roles = await client.request(readRoles({
            filter: { name: { _contains: 'Gestor do Site' } },
            limit: 5,
            fields: ['*', 'policies']
        }));

        let validRole = null;
        for (const r of roles) {
            console.log(`   ? Avaliando Role: ${r.name} (${r.id}) - Policies: ${r.policies ? r.policies.length : 0}`);
            if (r.policies && r.policies.length > 0) {
                validRole = r;
                break; // Found the most recent good one
            }
        }

        if (!validRole) {
            console.log("❌ Nenhuma role 'Gestor do Site' válida (com policies) encontrada.");
            return;
        }

        console.log(`✅ Role Válida Escolhida: ${validRole.name} (${validRole.id})`);

        // 2. Find User
        const users = await client.request(readUsers({ filter: { email: { _eq: CLIENT_EMAIL } } }));
        if (users.length === 0) { console.log("❌ Usuário não encontrado."); return; }
        const user = users[0];

        console.log(`👤 Usuário atual em Role: ${user.role}`);

        // 3. Update User
        if (user.role !== validRole.id) {
            console.log(`🔄 Migrando usuário para a role correta...`);
            await client.request(updateUser(user.id, {
                role: validRole.id
            }));
            console.log("🎉 Usuário migrado com sucesso!");
        } else {
            console.log("✅ Usuário já está na role correta.");
        }

    } catch (e) {
        console.error("❌ Erro:", e.message);
        // Handle sort forbidden error by retrying without sort if needed, 
        // but likely we just need to avoid the sort if it fails.
        // For simplicity, if sort fails, the script dies, so I'll remove sort if I see errors.
    }
}

moveUser();
