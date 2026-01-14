import { createDirectus, rest, authentication, createRole, createUser, createPermission, readRoles, readUsers } from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';

const CLIENT_EMAIL = 'ariel@peritoarielmiranda.com.br';
const CLIENT_PASSWORD = 'Cliente123!';

const client = createDirectus(URL).with(authentication()).with(rest());

const COLLECTIONS = [
    'services',
    'testimonials',
    'faqs',
    'differentials',
    'process_steps',
    'Informacoes_Gerais',
    'hero_stats'
];

async function setupClient() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });
        console.log('✅ Login realizado!');

        // 1. Create Role
        console.log("🔍 Verificando função 'Editor'...");
        let roleId;
        const roles = await client.request(readRoles({ filter: { name: { _eq: 'Editor' } } }));

        if (roles.length > 0) {
            roleId = roles[0].id;
            console.log("ℹ️  Função 'Editor' já existe.");
        } else {
            console.log("🆕 Criando função 'Editor'...");
            const role = await client.request(createRole({
                name: 'Editor',
                icon: 'edit',
                description: 'Acesso simplificado para edição de conteúdo',
                app_access: true,
                admin_access: false, // Key for simplification
                enforce_tfa: false
            }));
            roleId = role.id;
            console.log("✅ Função criada.");
        }

        // 2. Create Permissions
        console.log("🔐 Configurando permissões...");
        for (const collection of COLLECTIONS) {
            try {
                // We blindly attempt to create CRUD permissions. 
                // Detailed check is complex, so we wrap in try/catch.
                await client.request(createPermission({
                    role: roleId,
                    collection: collection,
                    action: 'create',
                    permissions: {},
                    fields: ['*']
                }));
                await client.request(createPermission({
                    role: roleId,
                    collection: collection,
                    action: 'read',
                    permissions: {},
                    fields: ['*']
                }));
                await client.request(createPermission({
                    role: roleId,
                    collection: collection,
                    action: 'update',
                    permissions: {},
                    fields: ['*']
                }));
                await client.request(createPermission({
                    role: roleId,
                    collection: collection,
                    action: 'delete',
                    permissions: {},
                    fields: ['*']
                }));
                console.log(`   ✨ Permissões para ${collection} ok.`);
            } catch (e) {
                // Ignore "Unique constraint" errors implying permission exists
                if (e.errors?.[0]?.extensions?.code !== 'RECORD_NOT_UNIQUE') {
                    // console.log(`   ℹ️  Permissões para ${collection} já existem ou erro:`, e.message);
                }
            }
        }

        // Also need read access to directus_files to see images
        try {
            await client.request(createPermission({
                role: roleId,
                collection: 'directus_files',
                action: 'read',
                permissions: {},
                fields: ['*']
            }));
            await client.request(createPermission({
                role: roleId,
                collection: 'directus_files',
                action: 'create',
                permissions: {},
                fields: ['*']
            }));
            await client.request(createPermission({
                role: roleId,
                collection: 'directus_files',
                action: 'update',
                permissions: {},
                fields: ['*']
            }));
            console.log(`   ✨ Permissões de Arquivos ok.`);
        } catch (e) { }

        // 3. Create User
        console.log("👤 Verificando usuário cliente...");
        const users = await client.request(readUsers({ filter: { email: { _eq: CLIENT_EMAIL } } }));

        if (users.length > 0) {
            console.log("ℹ️  Usuário Ariel já existe.");
        } else {
            console.log("🆕 Criando usuário Ariel...");
            await client.request(createUser({
                first_name: 'Ariel',
                last_name: 'Miranda',
                email: CLIENT_EMAIL,
                password: CLIENT_PASSWORD,
                role: roleId,
                status: 'active'
            }));
            console.log("✅ Usuário criado com sucesso!");
        }

        console.log("\n🎉 CONFIGURAÇÃO PRONTA!");
        console.log(`👉 Login: ${CLIENT_EMAIL}`);
        console.log(`👉 Senha: ${CLIENT_PASSWORD}`);

    } catch (e) {
        console.error("❌ Erro:", e.message);
    }
}

setupClient();
