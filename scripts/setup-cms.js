// We can't import TS directly easily in node without compilation, so I will hardcode the schema to avoid complexity.
// Actually, I'll just define the schema here to keep it simple and independent.

import { createDirectus, rest, staticToken, authentication, createCollection, createField, readCollections, createItems, readItems, updateSingleton } from '@directus/sdk';
import 'dotenv/config';

const URL = 'https://admin.peritoarielmiranda.com.br';
const EMAIL = 'admin@example.com';
const PASSWORD = 'Perito2025Aa@';

// DADOS DO SITE (Copiados de constants.ts)
const SITE_DATA = {
    services: [
        {
            title: 'Engenharia Elétrica',
            description: 'Laudos técnicos especializados para identificar causas de acidentes, falhas e irregularidades em sistemas elétricos.',
            icon: 'Zap',
            features: [
                'Laudos para Concessionárias', 'Análise de Consumo e Fraudes', 'Investigação de Acidentes Elétricos', 'Vistoria de Instalações (NR-10)'
            ]
        },
        {
            title: 'Segurança do Trabalho',
            description: 'Avaliação técnica de ambientes laborais para garantir conformidade com normas regulamentadoras e segurança jurídica.',
            icon: 'HardHat',
            features: [
                'Laudos de Insalubridade (NR-15)', 'Laudos de Periculosidade (NR-16)', 'Elaboração de LTCAT e PPP', 'Assistência Técnica em Perícias'
            ]
        },
        {
            title: 'Forense Digital',
            description: 'Coleta, preservação e análise de evidências digitais para validação de provas em processos judiciais.',
            icon: 'Binary',
            features: [
                'Verificação de Áudio e Vídeo', 'Autenticidade de Documentos Digitais', 'Análise de Metadados', 'Perícia em WhatsApp e E-mails'
            ]
        },
        {
            title: 'Cálculos Trabalhistas',
            description: 'Cálculos precisos para liquidação de sentenças e suporte técnico em demandas trabalhistas complexas.',
            icon: 'Calculator',
            features: [
                'Liquidação de Sentença', 'Cálculos de Rescisão', 'Atualização Monetária', 'Pareceres Contábeis'
            ]
        }
    ],
    testimonials: [
        { name: 'Dr. Ricardo A.', role: 'Advogado Trabalhista', content: 'Profissional extremamente técnico e confiável. Os laudos do Perito Ariel já fizeram diferença em várias ações que conduzimos.' },
        { name: 'Eng. Fernanda L.', role: 'Consultora de Energia', content: 'Excelente domínio na área elétrica e postura ética exemplar. Atendimento rápido e preciso.' },
        { name: 'Marcos P.', role: 'Empresário do setor industrial', content: 'A perícia extrajudicial nos ajudou a resolver uma disputa com a concessionária sem precisar ir à Justiça. Recomendo!' },
        { name: 'Ana C.', role: 'Perita parceira', content: 'Equipe organizada, comprometida e sempre atualizada com as normas. Um exemplo de profissionalismo técnico.' },
        { name: 'Luiz S.', role: 'Cliente pessoa física', content: 'Sofri cobranças indevidas na conta de luz e o laudo do Ariel provou o erro. Serviço sério e muito eficiente.' }
    ],
    faqs: [
        { question: 'Qual a diferença entre perícia judicial e extrajudicial?', answer: 'A perícia judicial é solicitada por um juiz no andamento de um processo. Já a extrajudicial é contratada por empresas ou pessoas físicas que precisam de um laudo técnico para prevenir ou resolver disputas fora do tribunal.' },
        { question: 'O laudo técnico tem validade jurídica?', answer: 'Sim. Todos os nossos laudos seguem normas técnicas e legislações vigentes, podendo ser apresentados em processos judiciais e administrativos.' },
        { question: 'Atendem somente em São Paulo?', answer: 'Não. O Perito Ariel Miranda atua em nível nacional, oferecendo atendimento presencial e remoto em todo o Brasil, 24 horas por dia, 7 dias por semana.' }
    ],
    differentials: [
        { title: 'Precisão que Gera Confiança', description: 'Cada laudo é elaborado com base científica e total imparcialidade, garantindo credibilidade perante juízes, advogados e empresas.', icon: 'CheckCircle2' },
        { title: 'Soluções Personalizadas', description: 'Atuamos em todo o Brasil, adaptando cada parecer às particularidades de cada caso — judicial ou extrajudicial.', icon: 'Lock' },
        { title: 'Agilidade Técnica', description: 'Processos técnicos otimizados e comunicação direta para entregar laudos com rapidez, sem comprometer a qualidade.', icon: 'Clock' }
    ],
    process_steps: [
        { number: '01', title: 'Contato Inicial', description: 'Envie sua solicitação via WhatsApp ou E-mail com um breve resumo do caso.', icon: 'MessageSquare' },
        { number: '02', title: 'Análise Preliminar', description: 'Avaliamos a viabilidade técnica e os documentos disponíveis para o exame.', icon: 'Search' },
        { number: '03', title: 'Proposta e Execução', description: 'Envio do orçamento e, após aprovação, início imediato dos trabalhos periciais.', icon: 'FileText' },
        { number: '04', title: 'Entrega do Laudo', description: 'Envio do Parecer Técnico conclusivo, fundamentado e assinado por perito certificado.', icon: 'FileCheck' }
    ],
    hero_stats: {
        hero_title: 'Perícia Técnica Especializada com Rigor Científico',
        hero_subtitle: 'Soluções periciais em engenharia elétrica, segurança do trabalho, forense digital e cálculos trabalhistas para advogados, empresas e justiça.',
        cta_label: 'Fale com o Perito',
        stat_1_label: 'Laudos Emitidos', stat_1_value: '+1.500',
        stat_2_label: 'Anos de Experiência', stat_2_value: '+10',
        stat_3_label: 'Satisfação Garantida', stat_3_value: '100%',
        stat_4_label: 'Atendimento', stat_4_value: 'Nacional'
    }
};

const client = createDirectus(URL).with(authentication()).with(rest());

const SCHEMA = {
    services: {
        name: 'Serviços',
        singleton: false,
        fields: [
            { field: 'title', type: 'string', name: 'Título', meta: { width: 'half' } },
            { field: 'icon', type: 'string', name: 'Ícone (Lucide Name)', meta: { width: 'half' } },
            { field: 'description', type: 'text', name: 'Descrição', meta: { interface: 'input-multiline' } },
            { field: 'features', type: 'json', name: 'Lista de Diferenciais', meta: { interface: 'list', note: 'Digite e aperte Enter' } }
        ]
    },
    testimonials: {
        name: 'Depoimentos',
        singleton: false,
        fields: [
            { field: 'name', type: 'string', name: 'Nome do Cliente', meta: { width: 'half' } },
            { field: 'role', type: 'string', name: 'Cargo/Profissão', meta: { width: 'half' } },
            { field: 'content', type: 'text', name: 'Depoimento', meta: { interface: 'input-multiline' } }
        ]
    },
    faqs: {
        name: 'Perguntas Frequentes',
        singleton: false,
        fields: [
            { field: 'question', type: 'string', name: 'Pergunta' },
            { field: 'answer', type: 'text', name: 'Resposta', meta: { interface: 'input-multiline' } }
        ]
    },
    differentials: {
        name: 'Diferenciais Competitivos',
        singleton: false,
        fields: [
            { field: 'title', type: 'string', name: 'Título', meta: { width: 'half' } },
            { field: 'description', type: 'text', name: 'Descrição', meta: { interface: 'input-multiline' } },
            { field: 'icon', type: 'string', name: 'Ícone (Lucide)' }
        ]
    },
    process_steps: {
        name: 'Como Funciona (Passos)',
        singleton: false,
        fields: [
            { field: 'number', type: 'string', name: 'Número (01)', meta: { width: 'half' } },
            { field: 'title', type: 'string', name: 'Título do Passo', meta: { width: 'half' } },
            { field: 'description', type: 'text', name: 'Descrição' },
            { field: 'icon', type: 'string', name: 'Ícone' }
        ]
    },
    hero_stats: {
        name: 'Home: Hero & Estatísticas',
        singleton: true,
        fields: [
            { field: 'hero_title', type: 'string', name: 'Título Principal' },
            { field: 'hero_subtitle', type: 'text', name: 'Subtítulo' },
            { field: 'cta_label', type: 'string', name: 'Texto do Botão (CTA)', schema: { default_value: 'Fale com o Perito' } },
            { field: 'stat_1_label', type: 'string', name: 'Estatística 1: Rótulo', meta: { width: 'half' } },
            { field: 'stat_1_value', type: 'string', name: 'Estatística 1: Valor', meta: { width: 'half' } },
            { field: 'stat_2_label', type: 'string', name: 'Estatística 2: Rótulo', meta: { width: 'half' } },
            { field: 'stat_2_value', type: 'string', name: 'Estatística 2: Valor', meta: { width: 'half' } },
            { field: 'stat_3_label', type: 'string', name: 'Estatística 3: Rótulo', meta: { width: 'half' } },
            { field: 'stat_3_value', type: 'string', name: 'Estatística 3: Valor', meta: { width: 'half' } },
            { field: 'stat_4_label', type: 'string', name: 'Estatística 4: Rótulo', meta: { width: 'half' } },
            { field: 'stat_4_value', type: 'string', name: 'Estatística 4: Valor', meta: { width: 'half' } },
        ]
    }
};

async function setup() {
    console.log(`🔌 Conectando em ${URL}...`);
    try {
        await client.login({ email: EMAIL, password: PASSWORD }, { mode: 'json' });
        console.log('✅ Login realizado com sucesso!');
    } catch (e) {
        console.error('❌ Falha no login.');
        console.error('Mensagem:', e.message);
        if (e.errors) console.error('Detalhes da API:', JSON.stringify(e.errors, null, 2));
        else console.error('Erro completo:', e);
        process.exit(1);
    }

    const existingCollections = await client.request(readCollections());
    const existingNames = existingCollections.map(c => c.collection);

    for (const [key, config] of Object.entries(SCHEMA)) {
        console.log(`\n📦 Processando coleção: ${config.name} (${key})...`);

        // 1. Create Collection
        if (!existingNames.includes(key)) {
            try {
                await client.request(createCollection({
                    collection: key,
                    meta: {
                        note: config.name,
                        singleton: config.singleton,
                        icon: 'folder'
                    },
                    schema: {}, // Let Directus handle default ID
                }));
                console.log(`   ✨ Coleção criada.`);
            } catch (e) {
                console.error(`   ❌ Erro ao criar coleção ${key}:`, e.message);
            }
        } else {
            console.log(`   ℹ️  Coleção já existe.`);
        }

        // 2. Create Fields
        for (const field of config.fields) {
            try {
                await client.request(createField(key, {
                    field: field.field,
                    type: field.type,
                    meta: {
                        interface: field.meta?.interface || 'input',
                        display: field.meta?.display || 'raw',
                        special: field.meta?.special || null,
                        options: field.meta?.options || null,
                        width: field.meta?.width || 'full',
                        note: field.meta?.note,
                        label: field.name
                    },
                    schema: field.schema || {}
                }));
                console.log(`      ➕ Campo criado: ${field.name}`);
            } catch (e) {
                // Ignore if field already exists error
                if (e.errors?.[0]?.extensions?.code === 'FIELD_ALREADY_EXISTS') {
                    console.log(`      ℹ️  Campo ${field.name} já existe.`);
                } else {
                    console.error(`      ❌ Erro ao criar campo ${field.name}:`, e.message);
                }
            }
        }
    }

    console.log('\n💾 INSERINDO DADOS...');

    for (const [key, data] of Object.entries(SITE_DATA)) {
        console.log(`\n📝 Populando: ${key}...`);

        try {
            // Check if user has permission or if items exist (simple check)
            // For singleton, we update. For lists, we check if empty then create.
            if (key === 'hero_stats') {
                await client.request(updateSingleton(key, data));
                console.log('   ✅ Singleton atualizado.');
            } else {
                const existing = await client.request(readItems(key, { limit: 1 }));
                if (existing.length === 0) {
                    await client.request(createItems(key, data));
                    console.log(`   ✅ ${data.length} itens inseridos.`);
                } else {
                    console.log('   ℹ️  Já existem itens (pulando para não duplicar).');
                }
            }
        } catch (e) {
            console.error(`   ❌ Erro ao inserir dados em ${key}:`, e.message);
        }
    }



    console.log('\n🎉 INSTALAÇÃO E POPULAÇÃO CONCLUÍDA! Acesse o painel para ver.');
}

setup();
