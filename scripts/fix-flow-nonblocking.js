import { createDirectus, rest, authentication, readFlows, updateFlow } from '@directus/sdk';

async function main() {
    console.log("=== Convertendo Fluxo para 'Action' (Não-Bloqueante) ===");

    const email = "admin@example.com";
    const password = "Perito2025Aa@";

    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        await client.login({ email, password });
        console.log("✅ Login realizado.");

        // 1. Find Flow
        const flows = await client.request(readFlows({
            filter: {
                name: { _contains: 'Notificação de Nova Mensagem (v2)' }
            }
        }));

        if (flows.length === 0) {
            console.log("❌ Fluxo não encontrado.");
            return;
        }
        const flow = flows[0];
        console.log(`Fluxo encontrado: ${flow.id}`);
        console.log("Options Atuais:", JSON.stringify(flow.options));

        // 2. Update Flow Options to include "type": "action"
        const newOptions = {
            collection: "messages",
            scope: ["items.create"],
            type: "action" // CRITICAL: This makes it async/non-blocking
        };

        await client.request(updateFlow(flow.id, {
            options: newOptions
        }));

        console.log("✅ Fluxo atualizado para TYPE: ACTION.");
        console.log("Agora o envio do formulário não vai esperar (nem bloquear) pelo erro do email.");

    } catch (error) {
        console.error("Erro:", error);
    }
}

main();
