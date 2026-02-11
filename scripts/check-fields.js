import { createDirectus, rest, authentication, readFields } from '@directus/sdk';

async function main() {
    console.log("=== Verificador de Campos ===");
    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        await client.login({ email: "admin@example.com", password: "Perito2025Aa@" });
        console.log("Login OK");

        const fields = await client.request(readFields('messages'));
        const attachmentField = fields.find(f => f.field === 'attachment');

        if (attachmentField) {
            console.log("✅ Campo 'attachment' EXISTE no esquema do Directus.");
            console.log(attachmentField);
        } else {
            console.log("❌ Campo 'attachment' NÃO EXISTE no esquema do Directus (tabela directus_fields).");
            console.log("Isso explica por que o Directus ignora o valor enviado.");
        }

    } catch (e) {
        console.error("ERRO:", e);
    }
}

main();
