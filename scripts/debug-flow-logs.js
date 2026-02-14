import { createDirectus, rest, authentication, readItems, readFlows } from '@directus/sdk';

async function main() {
    console.log("=== Debugging Última Execução do Fluxo ===");

    const email = "admin@example.com";
    const password = "Perito2025Aa@";

    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        await client.login({ email, password });
        console.log("✅ Login realizado.");

        // 1. Check Latest Message
        console.log("🔍 Buscando última mensagem...");
        const messages = await client.request(readItems('messages', {
            sort: ['-date_created'],
            limit: 1,
            fields: ['id', 'date_created', 'attachment', 'subject']
        }));

        if (messages.length > 0) {
            const msg = messages[0];
            console.log("\n📦 Última Mensagem:");
            console.log(`   ID: ${msg.id}`);
            console.log(`   Data: ${msg.date_created}`);
            console.log(`   Assunto: ${msg.subject}`);
            console.log(`   Anexo (DB): ${msg.attachment ? msg.attachment : '❌ NULL/VAZIO'}`);
        } else {
            console.log("\n❌ Nenhuma mensagem encontrada.");
        }

    } catch (error) {
        console.error("\n❌ ERRO AO LER DADOS:", error);
    }
}

main();
