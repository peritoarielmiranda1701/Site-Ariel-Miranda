import { createDirectus, rest, authentication, readFlows, readOperations } from '@directus/sdk';

async function main() {
    console.log("=== Inspecionando Fluxo V2 ===");

    const email = "admin@example.com";
    const password = "Perito2025Aa@";

    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        await client.login({ email, password });

        const flows = await client.request(readFlows({
            filter: {
                name: { _contains: 'Notificação de Nova Mensagem (v2)' }
            }
        }));

        if (flows.length === 0) {
            console.log("❌ Fluxo não encontrado!");
            return;
        }

        const flow = flows[0];
        console.log("Fluxo Encontrado:", JSON.stringify(flow, null, 2));

        const operations = await client.request(readOperations({
            filter: {
                flow: { _eq: flow.id }
            }
        }));

        console.log("\nOperações do Fluxo:", JSON.stringify(operations, null, 2));

    } catch (error) {
        console.error("Erro:", error);
    }
}

main();
