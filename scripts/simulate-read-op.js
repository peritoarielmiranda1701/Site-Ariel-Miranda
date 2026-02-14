import { createDirectus, rest, authentication, readItems } from '@directus/sdk';

async function main() {
    console.log("=== Simulando Operação de Leitura do Fluxo ===");

    const email = "admin@example.com";
    const password = "Perito2025Aa@";

    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        await client.login({ email, password });
        console.log("✅ Login realizado.");

        // 1. Get Latest Message ID
        const messages = await client.request(readItems('messages', {
            sort: ['-date_created'],
            limit: 1,
            fields: ['id']
        }));

        if (messages.length === 0) {
            console.log("❌ Nenhuma mensagem encontrada.");
            return;
        }
        const messageId = messages[0].id;
        console.log(`Mensagem ID (Trigger Key): ${messageId}`);

        // 2. Simulate the EXACT Flow Read Operation
        console.log("🔍 Executando leitura idêntica ao fluxo...");
        const result = await client.request(readItems('messages', {
            filter: { id: { _eq: messageId } },
            fields: ["name", "email", "phone", "subject", "message", "attachment"]
            // Note: readOperation uses 'key' directly, which is equivalent to reading by ID.
        }));

        const item = result[0];
        console.log("\n📦 Resultado da Leitura:");
        console.log("Attachment Field Type:", typeof item.attachment);
        console.log("Attachment Value:", item.attachment);

        if (typeof item.attachment === 'object' && item.attachment !== null) {
            console.log("⚠️ AVISO: O campo 'attachment' é um OBJETO. O fluxo deve usar {{read_message.attachment.id}}");
        } else {
            console.log("✅ O campo 'attachment' é um ID/STRING. O fluxo está correto com {{read_message.attachment}}");
        }

    } catch (error) {
        console.error("Erro:", error);
    }
}

main();
