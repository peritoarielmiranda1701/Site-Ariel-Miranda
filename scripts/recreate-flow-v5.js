import { createDirectus, rest, authentication, createFlow, createOperation, readFlows, deleteFlow, updateFlow } from '@directus/sdk';

async function main() {
  console.log("=== Recriando Fluxo (v5 - Link no Corpo) ===");

  const email = "admin@example.com";
  const password = "Perito2025Aa@";
  const BASE_URL = 'https://admin.peritoarielmiranda.com.br';

  const client = createDirectus(BASE_URL)
    .with(authentication('json'))
    .with(rest());

  try {
    await client.login({ email, password });
    console.log("✅ Login realizado.");

    // 1. Delete Old Flows (Cleanup)
    const existingFlows = await client.request(readFlows({
      filter: {
        name: { _contains: 'Notificação de Nova Mensagem' }
      }
    }));

    for (const flow of existingFlows) {
      console.log(`🗑️ Deletando: ${flow.name} (${flow.id})`);
      await client.request(deleteFlow(flow.id));
    }

    // 2. Create Flow V5
    const flow = await client.request(createFlow({
      name: "Notificação de Nova Mensagem (v5 - Link)",
      icon: "link",
      color: "#663399",
      options: {
        collection: "messages",
        scope: ["items.create"],
        type: "action"
      },
      trigger: "event",
      status: "active"
    }));
    console.log(`✅ Fluxo V5 criado: ${flow.id}`);

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
        rules: [{
          "name": "rule",
          "conditions": [{
            "a": "{{read_message.attachment}}",
            "operator": "nnull"
          }]
        }]
      }
    }));

    // 5. TRUE Path -> Read File Metadata (needed for filename)
    const readFileOp = await client.request(createOperation({
      flow: flow.id,
      key: "read_file",
      name: "Ler Metadados Arquivo",
      type: "item-read",
      position_x: 40,
      position_y: 60,
      resolve: conditionOp.id,
      options: {
        collection: "directus_files",
        key: "{{read_message.attachment}}",
        query: { fields: ["id", "filename_download"] }
      }
    }));

    // 6. TRUE Path -> Send Email (User Template with Link)
    // User requested: "nome do arquivo como um link" in "Documento" column.
    const emailBodyWithLink = `
<body>
<h2>Nova Solicitação de Orçamento</h2><br>

<table style="background:#f3f4f6; font-size:13px; color:#374151; width:100%; border-collapse:collapse;">
  <tr>
    <td colspan="5" bgcolor="#1f2937" style="color:#ffffff; padding:15px; font-size:18px; font-weight:bold;">
      Nova Solicitação de Orçamento
    </td>
  </tr>

  <tr bgcolor="#f2f2f2" style="font-size:13px;">
    <th align="left" style="padding:8px; border:1px solid #dddddd;">Nome</th>
    <th align="left" style="padding:8px; border:1px solid #dddddd;">E-mail</th>
    <th align="left" style="padding:8px; border:1px solid #dddddd;">Telefone</th>
    <th align="left" style="padding:8px; border:1px solid #dddddd;">Assunto</th>
    <th align="left" style="padding:8px; border:1px solid #dddddd;">Documento</th>
  </tr>

  <tr style="font-size:14px;">
    <td style="padding:8px; border:1px solid #dddddd;">{{read_message.name}}</td>
    <td style="padding:8px; border:1px solid #dddddd;">
      <a href="mailto:{{read_message.email}}">{{read_message.email}}</a>
    </td>
    <td style="padding:8px; border:1px solid #dddddd;">
      <a href="https://wa.me/55{{read_message.phone}}">{{read_message.phone}}</a>
    </td>
    <td style="padding:8px; border:1px solid #dddddd;">{{read_message.subject}}</td>
    <td style="padding:8px; border:1px solid #dddddd;">
        <!-- LINK FALLBACK -->
        <a href="https://admin.peritoarielmiranda.com.br/assets/{{read_message.attachment}}?download" target="_blank">
            {{read_file.filename_download}}
        </a>
    </td>
  </tr>

  <tr>
    <td colspan="5" bgcolor="#f9f9f9" style="padding:10px; font-weight:bold; border-top:2px solid #dddddd;">
      Mensagem
    </td>
  </tr>

  <tr>
    <td colspan="5" style="padding:15px; line-height:1.5;">
      {{read_message.message}}
    </td>
  </tr>

  <tr>
    <td colspan="5" bgcolor="#f2f2f2" style="padding:8px; font-size:11px; color:#666666;">
      Enviado via Website — Perito Ariel Miranda
    </td>
  </tr>

</table>
</body>
`;

    await client.request(createOperation({
      flow: flow.id,
      key: "send_email_link",
      name: "Enviar Email (Link)",
      type: "mail",
      position_x: 40,
      position_y: 80,
      resolve: readFileOp.id,
      options: {
        to: "contato@peritoarielmiranda.com.br",
        subject: "{{read_message.subject}}",
        body: emailBodyWithLink
        // NO attachments array here, just the link in body
      }
    }));

    // 7. FALSE Path (No Attachment) -> Send Email (Simple Template)
    const emailBodySimple = `
<body>
<h2>Nova Solicitação de Orçamento</h2><br>

<table style="background:#f3f4f6; font-size:13px; color:#374151; width:100%; border-collapse:collapse;">
  <tr>
    <td colspan="4" bgcolor="#1f2937" style="color:#ffffff; padding:15px; font-size:18px; font-weight:bold;">
      Nova Solicitação de Orçamento
    </td>
  </tr>

  <tr bgcolor="#f2f2f2" style="font-size:13px;">
    <th align="left" style="padding:8px; border:1px solid #dddddd;">Nome</th>
    <th align="left" style="padding:8px; border:1px solid #dddddd;">E-mail</th>
    <th align="left" style="padding:8px; border:1px solid #dddddd;">Telefone</th>
    <th align="left" style="padding:8px; border:1px solid #dddddd;">Assunto</th>
  </tr>

  <tr style="font-size:14px;">
    <td style="padding:8px; border:1px solid #dddddd;">{{read_message.name}}</td>
    <td style="padding:8px; border:1px solid #dddddd;">
      <a href="mailto:{{read_message.email}}">{{read_message.email}}</a>
    </td>
    <td style="padding:8px; border:1px solid #dddddd;">
      <a href="https://wa.me/55{{read_message.phone}}">{{read_message.phone}}</a>
    </td>
    <td style="padding:8px; border:1px solid #dddddd;">{{read_message.subject}}</td>
  </tr>

  <tr>
    <td colspan="4" bgcolor="#f9f9f9" style="padding:10px; font-weight:bold; border-top:2px solid #dddddd;">
      Mensagem
    </td>
  </tr>

  <tr>
    <td colspan="4" style="padding:15px; line-height:1.5;">
      {{read_message.message}}
    </td>
  </tr>
</table>
</body>
`;

    await client.request(createOperation({
      flow: flow.id,
      key: "send_email_basic",
      name: "Enviar Email (Sem Anexo)",
      type: "mail",
      position_x: 0,
      position_y: 60,
      reject: conditionOp.id,
      options: {
        to: "contato@peritoarielmiranda.com.br",
        subject: "{{read_message.subject}}",
        body: emailBodySimple
      }
    }));

    console.log("\n🚀 Fluxo V5 (Link Fallback) criado com sucesso!");

  } catch (error) {
    console.error("Erro:", error);
  }
}

main();
