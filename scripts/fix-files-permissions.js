import { createDirectus, rest, authentication, readPermissions, createPermission, updatePermission } from '@directus/sdk';

async function main() {
    console.log("=== Corrigindo Permissões de Arquivos (Public Files) ===");

    const email = "admin@example.com";
    const password = "Perito2025Aa@";

    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        await client.login({ email, password });
        console.log("✅ Login Admin realizado.");

        // Fetch ALL permissions for 'directus_files'
        const permissions = await client.request(readPermissions({
            filter: {
                collection: { _eq: 'directus_files' }
            },
            limit: 100
        }));

        console.log(`Encontradas ${permissions.length} regras de permissão para 'directus_files'.`);

        // Update/Create permissions for Public (role: null)
        const actions = ['create', 'read', 'update', 'delete'];

        for (const action of actions) {
            const publicPerm = permissions.find(p =>
                (p.role === null || p.role === undefined) &&
                p.action === action
            );

            if (publicPerm) {
                console.log(`[${action}] Permissão existente (ID: ${publicPerm.id}). Atualizando para '*'...`);
                await client.request(updatePermission(publicPerm.id, {
                    fields: ['*']
                }));
            } else {
                console.log(`[${action}] Permissão NÃO encontrada. Criando nova...`);
                await client.request(createPermission({
                    role: null,
                    collection: 'directus_files',
                    action: action,
                    fields: ['*']
                }));
            }
        }

        console.log("✅ Permissões de 'directus_files' atualizadas para Public (CRUD Completo).");

    } catch (error) {
        console.error("Erro:", error);
    }
}

main();
