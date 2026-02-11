import { createDirectus, rest, authentication, createField, createRelation } from '@directus/sdk';

async function main() {
    console.log("=== Configurando Anexo (Setup Completo) ===");
    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        console.log("Autenticando...");
        await client.login({ email: "admin@example.com", password: "Perito2025Aa@" });
        console.log("✅ Login OK.");

        console.log("Criando campo 'attachment' na coleção 'messages'...");

        // 1. Create Field
        try {
            await client.request(createField('messages', {
                field: 'attachment',
                type: 'uuid',
                meta: {
                    interface: 'file',
                    display: 'file',
                    special: ['file'], // Treats as file
                    note: 'Anexo enviado pelo site',
                    width: 'full'
                },
                schema: {
                    is_nullable: true
                }
            }));
            console.log("✅ Campo 'attachment' criado com sucesso!");
        } catch (e) {
            if (e.errors && e.errors[0].code === 'FIELD_EXISTING') {
                console.log("⚠️ O campo 'attachment' já existe. Verifique se ele aparece na interface.");
            } else {
                console.log("Erro ao criar campo (talvez já exista?):", e.message);
            }
        }

        console.log("Criando relacionamento com directus_files...");

        // 2. Create Relation
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
            console.log("Erro ao criar relacionamento (talvez já exista?):", e.message);
        }

        console.log("\nConfiguração concluída. Agora o Directus reconhece o campo oficialmente.");

    } catch (e) {
        console.error("ERRO FATAL:", e);
    }
}

main();
