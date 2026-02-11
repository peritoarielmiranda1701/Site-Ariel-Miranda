import { createDirectus, rest, authentication, readPermissions, updatePermission } from '@directus/sdk';

async function main() {
    console.log("=== Debug Permissões ===");
    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        await client.login({ email: "admin@example.com", password: "Perito2025Aa@" });
        console.log("Login OK");

        // List ALL permissions for messages
        const perms = await client.request(readPermissions({
            limit: 100,
            filter: { collection: { _eq: 'messages' } }
        }));

        console.log(`Encontrei ${perms.length} permissões.`);

        // Log them all to see what's what
        for (const p of perms) {
            console.log(`ID: ${p.id} | Role: ${p.role} | Action: ${p.action} | Fields: ${JSON.stringify(p.fields)}`);

            // If this looks like the public permission (role null) and action create
            if (p.role === null && p.action === 'create') {
                console.log(">>> ESTA É A PERMISSÃO PÚBLICA DE CRIAÇÃO <<<");

                if (Array.isArray(p.fields) && !p.fields.includes('attachment')) {
                    console.log("!!! FALTANDO ATTACHMENT !!!");
                    console.log("Corrigindo...");
                    await client.request(updatePermission(p.id, {
                        fields: [...p.fields, 'attachment']
                    }));
                    console.log("CORRIGIDO!");
                } else if (p.fields === '*') {
                    console.log("Permissão global (*). Deveria funcionar.");
                } else {
                    console.log("Attachment já parece estar lá.");
                }
            }
        }

    } catch (e) {
        console.error("ERRO:", e);
    }
}

main();
