import { createDirectus, rest, authentication, readField } from '@directus/sdk';

async function main() {
    console.log("=== Inspecionar Campo Attachment ===");
    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        await client.login({ email: "admin@example.com", password: "Perito2025Aa@" });

        console.log("Lendo configuração do campo 'attachment'...");
        const field = await client.request(readField('messages', 'attachment'));

        console.log("--- Configuração Atual ---");
        console.log("Type:", field.type); // Should be 'uuid'
        console.log("Schema:", field.schema);
        console.log("Meta:", field.meta);

    } catch (e) {
        console.error("ERRO:", e.message);
        if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
    }
}

main();
