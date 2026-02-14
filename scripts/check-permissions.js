import { createDirectus, rest, authentication, readPermissions, createPermission, updatePermission } from '@directus/sdk';

async function main() {
    console.log("=== Corrigindo Permissões Públicas (Abordagem Segura) ===");

    const email = "admin@example.com";
    const password = "Perito2025Aa@";

    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        await client.login({ email, password });
        console.log("✅ Login Admin realizado.");

        // Fetch ALL permissions for 'messages' collection locally, then filter in JS
        const permissions = await client.request(readPermissions({
            filter: {
                collection: { _eq: 'messages' }
            },
            limit: 100
        }));

        console.log(`Encontradas ${permissions.length} regras de permissão para 'messages'.`);

        // Find Public Create Permission (role is null or undefined)
        const publicCreatePerm = permissions.find(p =>
            (p.role === null || p.role === undefined) &&
            p.action === 'create'
        );

        if (publicCreatePerm) {
            console.log(`\nPermissão Pública de CRIAÇÃO encontrada (ID: ${publicCreatePerm.id}).`);
            console.log(`Campos atuais: ${JSON.stringify(publicCreatePerm.fields)}`);

            // Check if it is already wildcard
            if (JSON.stringify(publicCreatePerm.fields) === '["*"]') {
                console.log("✅ Já está configurado como '*'. Forçando update apenas para garantir cache flush.");
            }

            // Update to wildcard
            await client.request(updatePermission(publicCreatePerm.id, {
                fields: ['*']
            }));
            console.log("✅ Permissão atualizada para ['*'].");

        } else {
            console.log("\n⚠️ Permissão Pública de CRIAÇÃO NÃO encontrada.");
            console.log("Criando nova regra...");

            await client.request(createPermission({
                role: null, // Public
                collection: 'messages',
                action: 'create',
                fields: ['*']
            }));
            console.log("✅ Nova permissão criada com sucesso.");
        }

    } catch (error) {
        console.error("Erro:", error);
    }
}

main();
