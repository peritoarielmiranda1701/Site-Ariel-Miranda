import { createDirectus, rest, authentication, createFlow, createOperation, readFlows, deleteFlow, updateFlow, readMe } from '@directus/sdk';

async function main() {
    console.log("=== Recriando Fluxo (v4 - Conditional Branching) ===");

    const email = "admin@example.com";
    const password = "Perito2025Aa@";

    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        await client.login({ email, password });
        console.log("✅ Login realizado.");

        // 1. Delete Old Flows
        const existingFlows = await client.request(readFlows({
            filter: {
                name: { _contains: 'Notificação de Nova Mensagem' }
            }
        }));

        for (const flow of existingFlows) {
            console.log(`🗑️ Deletando: ${flow.name} (${flow.id})`);
            await client.request(deleteFlow(flow.id));
        }

        // 2. Create Flow V4
        const flow = await client.request(createFlow({
            name: "Notificação de Nova Mensagem (v4)",
            icon: "fork_right",
            color: "#00C897",
            options: {
                collection: "messages",
                scope: ["items.create"],
                type: "action"
            },
            trigger: "event",
            status: "active",
            user: "75ed60b3-ee4c-4916-8cc8-9258914e3bb9" // Hardcoded Admin ID
        }));
        console.log(`✅ Fluxo V4 criado: ${flow.id}`);

        // 3. Op 1: Read Message (Root)
        const readMessageOp = await client.request(createOperation({
            flow: flow.id,
            key: "read_message",
            name: "Ler Mensagem",
            type: "item-read",
            position_x: 20,
            position_y: 20,
            options: {
                collection: "messages",
                key: "{{$trigger.key}}",
                query: { fields: ["name", "email", "phone", "subject", "message", "attachment"] }
            }
        }));

        await client.request(updateFlow(flow.id, { operation: readMessageOp.id }));

        // 4. Op 2: Condition (Check Attachment)
        const conditionOp = await client.request(createOperation({
            flow: flow.id,
            key: "check_attachment",
            name: "Tem Anexo?",
            type: "condition",
            position_x: 20,
            position_y: 40,
            resolve: readMessageOp.id,
            options: {
                rules: [
                    {
                        "name": "rule",
                        "conditions": [
                            {
                                "a": "{{read_message.attachment}}",
                                "operator": "nnull" // Not Null
                            }
                        ]
                    }
                ]
            }
        }));

        // 5. TRUE Path (Has Attachment) -> Read File
        const readFileOp = await client.request(createOperation({
            flow: flow.id,
            key: "read_file",
            name: "Ler Arquivo",
            type: "item-read",
            position_x: 40,
            position_y: 60,
            resolve: conditionOp.id, // Connected to Success/True of Condition
            options: {
                collection: "directus_files",
                key: "{{read_message.attachment}}",
                query: { fields: ["id", "filename_download"] }
            }
        }));

        // 6. TRUE Path -> Send Email (With Attachment)
        await client.request(createOperation({
            flow: flow.id,
            key: "send_email_pro",
            name: "Enviar Email (Com Anexo)",
            type: "mail",
            position_x: 40,
            position_y: 80,
            resolve: readFileOp.id,
            options: {
                to: "contato@peritoarielmiranda.com.br",
                subject: "Novo Contato (Anexo): {{read_message.name}}",
                body: `
                    <h2>Nova Solicitação (Com Anexo/V4)</h2>
                    <p><strong>Nome:</strong> {{read_message.name}}</p>
                    <p><strong>Assunto:</strong> {{read_message.subject}}</p>
                    <hr>
                    <p>{{read_message.message}}</p>
                    <hr>
                    <p style="color:green">[DEBUG V4] File ID: {{read_file.id}}</p>
                `,
                attachments: ["{{read_file.id}}"]
            }
        }));

        // 7. FALSE Path (No Attachment) -> Send Email (Simple)
        await client.request(createOperation({
            flow: flow.id,
            key: "send_email_basic",
            name: "Enviar Email (Sem Anexo)",
            type: "mail",
            position_x: 0,
            position_y: 60,
            reject: conditionOp.id, // Connected to Reject/False of Condition
            options: {
                to: "contato@peritoarielmiranda.com.br",
                subject: "Novo Contato: {{read_message.name}}",
                body: `
                    <h2>Nova Solicitação (Sem Anexo/V4)</h2>
                    <p><strong>Nome:</strong> {{read_message.name}}</p>
                    <p><strong>Assunto:</strong> {{read_message.subject}}</p>
                    <hr>
                    <p>{{read_message.message}}</p>
                `
            }
        }));

        console.log("\n🚀 Fluxo V4 (Condicional) criado!");
        console.log("Agora tratamos mensagens COM e SEM anexo separadamente.");

    } catch (error) {
        console.error("Erro:", error);
    }
}

main();
