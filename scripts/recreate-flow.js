import { createDirectus, rest, authentication, createFlow, createOperation, readFlows, deleteFlow, updateFlow, readMe } from '@directus/sdk';

async function main() {
    console.log("=== Recriando Fluxo de Notificação (v3 - Robust) ===");

    const email = "admin@example.com";
    const password = "Perito2025Aa@";

    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        await client.login({ email, password });
        console.log("✅ Login realizado.");

        // 0. Get Admin ID
        const currentUser = await client.request(readMe());
        const adminId = currentUser.id;
        console.log(`👤 Admin ID: ${adminId}`);

        // 1. Find and Delete Existing Flows (v2 and v3)
        const existingFlows = await client.request(readFlows({
            filter: {
                _or: [
                    { name: { _contains: 'Notificação de Nova Mensagem (v2)' } },
                    { name: { _contains: 'Notificação de Nova Mensagem (v3)' } }
                ]
            }
        }));

        for (const flow of existingFlows) {
            console.log(`🗑️ Deletando fluxo antigo: ${flow.name} (${flow.id})`);
            await client.request(deleteFlow(flow.id));
        }

        // 2. Create New Flow (v3)
        console.log("✨ Criando novo fluxo (v3)...");
        const flow = await client.request(createFlow({
            name: "Notificação de Nova Mensagem (v3)",
            icon: "mail",
            color: "#66ccff",
            options: {
                collection: "messages",
                scope: ["items.create"], // Correct Trigger Scope
                type: "action" // Correct Non-blocking Type
            },
            trigger: "event",
            status: "active",
            user: "75ed60b3-ee4c-4916-8cc8-9258914e3bb9" // SET USER DIRECTLY ON CREATION
        }));

        console.log(`✅ Fluxo criado: ${flow.id}`);
        // No need for separate update if set during creation, but let's keep it safe.


        // 3. Operation 1: Read Message (to get attachment ID)
        console.log("📝 Criando Op: Ler Mensagem...");
        const readMessageOp = await client.request(createOperation({
            flow: flow.id,
            key: "read_message",
            name: "Ler Dados da Mensagem",
            type: "item-read",
            position_x: 19,
            position_y: 19,
            options: {
                collection: "messages",
                key: "{{$trigger.key}}",
                query: {
                    fields: ["name", "email", "phone", "subject", "message", "attachment"]
                }
            }
        }));

        // Link Flow -> Op 1 (Root)
        await client.request(updateFlow(flow.id, {
            operation: readMessageOp.id
        }));

        // 4. Operation 2: Read File (Explicitly fetch the file to ensure ID is clean)
        console.log("📂 Criando Op: Ler Arquivo (Anexo)...");
        const readFileOp = await client.request(createOperation({
            flow: flow.id,
            key: "read_file",
            name: "Ler Arquivo do Anexo",
            type: "item-read",
            position_x: 19,
            position_y: 35,
            resolve: readMessageOp.id,
            options: {
                collection: "directus_files",
                key: "{{read_message.attachment}}", // Use the ID from message
                query: {
                    fields: ["id", "filename_download"]
                }
            }
        }));

        // 5. Operation 3: Send Email
        console.log("📧 Criando Op: Enviar E-mail...");

        const emailBody = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Nova Solicitação de Orçamento</h2>
            <p><strong>Nome:</strong> {{read_message.name}}</p>
            <p><strong>E-mail:</strong> {{read_message.email}}</p>
            <p><strong>Telefone:</strong> <a href="https://wa.me/55{{read_message.phone}}">{{read_message.phone}}</a></p>
            <p><strong>Assunto:</strong> {{read_message.subject}}</p>
            <hr>
            <h3>Mensagem:</h3>
            <p style="white-space: pre-wrap;">{{read_message.message}}</p>
            <hr>
            <p style="font-size: 12px; color: #999;">Enviado via Website Perito Ariel Miranda</p>
            <p style="color: red; font-size: 10px;">[DEBUG V3] Msg Attach: {{read_message.attachment}} / File ID: {{read_file.id}}</p>
        </div>
        `;

        await client.request(createOperation({
            flow: flow.id,
            key: "send_email",
            name: "Disparar E-mail",
            type: "mail",
            position_x: 35,
            position_y: 35,
            resolve: readFileOp.id, // Link to read_file operation
            options: {
                to: "contato@peritoarielmiranda.com.br",
                subject: "Novo Contato do Site: {{read_message.name}}",
                body: emailBody,
                attachments: ["{{read_file.id}}"] // Using the Explicit File ID from Op 2
            }
        }));

        console.log("\n🚀 Fluxo V3 (Blindado) recriado com sucesso!");
        console.log("Lógica: Trigger -> Read Message -> Read File -> Send Email");
        console.log("Permissão: Admin | Tipo: Action (Async)");

    } catch (error) {
        console.error("\n❌ ERRO FATAL:", error);
    }
}

main();
