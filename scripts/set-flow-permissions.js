import { createDirectus, rest, authentication, readMe, readFlows, updateFlow } from '@directus/sdk';

async function main() {
    console.log("=== Configurando Permissões do Fluxo (Executar como Admin) ===");

    const email = "admin@example.com";
    const password = "Perito2025Aa@";

    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        await client.login({ email, password });
        console.log("✅ Login realizado.");

        // 1. Get Admin ID
        const currentUser = await client.request(readMe());
        const adminId = currentUser.id;
        console.log(`👤 Admin ID: ${adminId}`);

        // 2. Find Flow
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

        // 3. Update Flow to run as Admin
        // The property 'user' on the flow object determines the execution user.
        await client.request(updateFlow(flow.id, {
            user: adminId // Set flow to run as valid Admin User
        }));

        console.log("✅ Permissões do Fluxo atualizadas!");
        console.log("Agora o fluxo rodará com privilégios de Admin (System), ignorando restrições do Public.");

    } catch (error) {
        console.error("Erro:", error);
    }
}

main();
