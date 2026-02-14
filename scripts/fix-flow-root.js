import { createDirectus, rest, authentication, readFlows, readOperations, updateFlow } from '@directus/sdk';

async function main() {
    console.log("=== Corrigindo Root do Fluxo (v2) ===");

    const email = "admin@example.com";
    const password = "Perito2025Aa@";

    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        await client.login({ email, password });
        console.log("✅ Login realizado.");

        // 1. Find the Flow
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
        console.log(`Fluxo encontrado: ${flow.id}`);

        // 2. Find the Root Operation (read_message)
        const operations = await client.request(readOperations({
            filter: {
                flow: { _eq: flow.id },
                key: { _eq: 'read_message' }
            }
        }));

        if (operations.length === 0) {
            console.log("❌ Operação 'read_message' não encontrada.");
            return;
        }
        const rootOp = operations[0];
        console.log(`Operação Root encontrada: ${rootOp.id} (${rootOp.name})`);

        // 3. Link Flow -> Root Operation
        await client.request(updateFlow(flow.id, {
            operation: rootOp.id
        }));

        console.log("✅ Fluxo atualizado com sucesso! O root agora aponta para a operação de leitura.");
        console.log("O diagrama deve aparecer corretamente agora.");

    } catch (error) {
        console.error("Erro:", error);
    }
}

main();
