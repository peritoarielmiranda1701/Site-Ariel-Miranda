import { createDirectus, rest, authentication } from '@directus/sdk';

async function main() {
    console.log("=== Teste de Envio Direto de E-mail (Via API) ===");

    const email = "admin@example.com";
    const password = "Perito2025Aa@";
    const fileId = "c16d8a60-af49-4c64-841d-f8acecd38070"; // Known valid file ID

    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        await client.login({ email, password });
        console.log("✅ Login Admin realizado.");

        console.log("📧 Tentando enviar e-mail direto pela API /mail...");

        // Determine the payload structure (SDK doesn't have a direct 'sendHash' helper for /mail usually, 
        // need to check if SDK exposes 'mail' endpoint or verify custom request)
        // Directus API expects POST /mail

        const response = await client.request(() => ({
            path: '/mail',
            method: 'POST',
            body: JSON.stringify({
                to: "contato@peritoarielmiranda.com.br",
                subject: "Teste API Direta - Anexo",
                body: "<h1>Teste API</h1><p>Esta mensagem foi enviada diretamente pelo endpoint /mail para testar anexos.</p>",
                // Directus /mail endpoint expects 'attachments' as an array of IDs? 
                // Or file objects? Documentation usually says IDs works for internal files.
                // Let's try passing the ID object structure if needed, or just ID.
                attachments: [fileId]
            })
        }));

        console.log("✅ API respondeu com sucesso!");
        console.log("Resposta:", response);
        console.log("Verifique se o e-mail chegou com anexo.");

    } catch (error) {
        console.error("❌ Erro ao enviar e-mail via API:", error);
        if (error.response) {
            console.error("Detalhes:", error.response.status, error.response.statusText);
            console.error("Body:", JSON.stringify(error.response.data));
        }
    }
}

main();
