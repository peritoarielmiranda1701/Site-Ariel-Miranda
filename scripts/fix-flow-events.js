import { createDirectus, rest, authentication, readFlows, updateFlow } from '@directus/sdk';

async function main() {
    console.log("=== Corrigindo Trigger do Fluxo (v2) ===");

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
        console.log("Options Antigas:", JSON.stringify(flow.options));

        // 2. Update Flow Options (Replace 'event' with 'scope')
        // Current: { collection: "messages", event: "items.create" }
        // Needed: { collection: "messages", scope: ["items.create"] }

        await client.request(updateFlow(flow.id, {
            options: {
                collection: "messages",
                scope: ["items.create"] // Correct property for Flow Events
            }
        }));

        console.log("✅ Options Atualizadas! Agora está usando 'scope'.");
        console.log("Novo Trigger: Items Create (messages)");

    } catch (error) {
        console.error("Erro:", error);
    }
}

main();
