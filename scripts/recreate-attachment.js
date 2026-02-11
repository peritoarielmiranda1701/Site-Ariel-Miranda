import { createDirectus, rest, authentication, createField, createRelation, deleteField } from '@directus/sdk';

async function main() {
    console.log("=== Recriando Campo Anexo (Reset Total) ===");
    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        console.log("Autenticando...");
        await client.login({ email: "admin@example.com", password: "Perito2025Aa@" });
        console.log("✅ Login OK.");

        // 1. Delete Field (if exists)
        console.log("Removendo campo antigo (se existir)...");
        try {
            await client.request(deleteField('messages', 'attachment'));
            console.log("✅ Campo antigo removido (Limpeza concluída).");
        } catch (e) {
            console.log("Aviso ao remover (pode não existir):", e.message);
        }

        // Wait a bit
        await new Promise(r => setTimeout(r, 2000));

        console.log("Criando campo 'attachment' NOVO e LIMPO...");

        // 2. Create Field
        await client.request(createField('messages', {
            field: 'attachment',
            type: 'uuid',
            meta: {
                interface: 'file',
                display: 'file',
                special: ['file'],
                note: 'Anexo enviado pelo site (Recriado)',
                width: 'full',
                readonly: false,
                hidden: false
            },
            schema: {
                is_nullable: true
            }
        }));
        console.log("✅ Campo 'attachment' criado com sucesso!");

        console.log("Recriando relacionamento...");

        // 3. Create Relation
        try {
            await client.request(createRelation({
                collection: 'messages',
                field: 'attachment',
                related_collection: 'directus_files',
                schema: {
                    on_delete: 'SET NULL'
                },
                meta: {
                    sort_field: null,
                    junction_field: null
                }
            }));
            console.log("✅ Relacionamento criado com sucesso!");
        } catch (e) {
            console.log("Aviso relacionamento:", e.message);
        }

        console.log("\nProcesso concluído! Agora o campo está 100% calibrado.");

    } catch (e) {
        console.error("ERRO FATAL:", e);
    }
}

main();
