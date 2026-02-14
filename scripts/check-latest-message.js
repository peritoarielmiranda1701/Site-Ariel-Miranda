import { createDirectus, rest, authentication, readItems } from '@directus/sdk';

async function main() {
    console.log("=== Verificando Últimas Mensagens ===");

    const email = "admin@example.com";
    const password = "Perito2025Aa@";

    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        await client.login({ email, password });
        console.log("✅ Login realizado.");

        const messages = await client.request(readItems('messages', {
            sort: ['-date_created'],
            limit: 5,
            fields: ['id', 'name', 'subject', 'attachment', 'date_created']
        }));

        console.log("\n--- Últimas 5 Mensagens ---");
        messages.forEach(msg => {
            console.log(`[${msg.date_created}] ID: ${msg.id}`);
            console.log(`   De: ${msg.name}`);
            console.log(`   Assunto: ${msg.subject}`);
            console.log(`   Anexo (DB): ${msg.attachment ? msg.attachment : '❌ NULL/VAZIO'}`);
            console.log("------------------------------------------------");
        });

    } catch (error) {
        console.error("Erro:", error);
    }
}

main();
