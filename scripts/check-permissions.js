import { createDirectus, rest, authentication, readPermissions, readRoles, updatePermission } from '@directus/sdk';

async function main() {
    console.log("=== Verificador de Permissões (v3) ===");

    const email = "admin@example.com";
    const password = "Perito2025Aa@";

    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        console.log("Autenticando...");
        await client.login({ email, password });
        console.log("✅ Login realizado.");

        // 1. Find Public Role ID
        console.log("Buscando Role 'Public'...");
        const roles = await client.request(readRoles());
        const publicRole = roles.find(r => r.name === 'Public');

        let publicRoleId = null;
        if (publicRole) {
            console.log(`Role 'Public' encontrada com ID: ${publicRole.id}`);
            publicRoleId = publicRole.id;
        } else {
            console.log("⚠️ Role 'Public' não encontrada pelo nome. Assumindo ID nulo (padrão).");
        }

        // 2. Fetch Permissions
        console.log("Buscando permissões da coleção 'messages'...");
        const permissions = await client.request(readPermissions({
            limit: 100,
            filter: {
                collection: { _eq: 'messages' }
            }
        }));

        console.log(`Encontradas ${permissions.length} regras de permissão para 'messages'.`);

        // Debug: List all permissions
        // permissions.forEach(p => console.log(`- Role: ${p.role}, Action: ${p.action}`));

        // Find the Public permission
        // If publicRoleId is null, check for null. If not null, check for ID.
        let targetPerm = permissions.find(p => p.role === publicRoleId);

        // Fallback: if we didn't find by ID, maybe it's null after all?
        if (!targetPerm && publicRoleId !== null) {
            targetPerm = permissions.find(p => p.role === null);
            if (targetPerm) console.log("Achei uma permissão com role NULL (que costuma ser Public).");
        }

        if (!targetPerm) {
            console.log("❌ ERRO: Não encontrei a permissão de CRIAÇÃO para o público.");
            console.log("IDs de Roles nas permissões encontradas:", permissions.map(p => p.role));
            process.exit(1);
        }

        console.log(`\nPermissão Alvo Encontrada (ID: ${targetPerm.id})`);
        console.log(`Role: ${targetPerm.role}`);
        console.log(`Ação: ${targetPerm.action}`);
        console.log(`Campos atuais: ${JSON.stringify(targetPerm.fields)}`);

        const currentFields = targetPerm.fields;
        let newFields = [];

        if (currentFields === '*') {
            console.log("✅ Permissão é TOTAL (*). O campo 'attachment' deve funcionar.");
        } else if (Array.isArray(currentFields)) {
            if (currentFields.includes('attachment')) {
                console.log("✅ Campo 'attachment' JÁ ESTÁ permitido.");
            } else {
                console.log("❌ Campo 'attachment' ESTÁ FALTANDO!");

                // Add attachment
                newFields = [...currentFields, 'attachment'];

                console.log(`Atualizando permissões para incluir 'attachment'...`);
                await client.request(updatePermission(targetPerm.id, {
                    fields: newFields
                }));
                console.log("✅ Permissão ATUALIZADA com sucesso!");
            }
        } else {
            console.log("⚠️ Formato de campos desconhecido:", currentFields);
        }

    } catch (e) {
        console.error("ERRO FATAL:", e);
    }
}

main().catch(console.error);
