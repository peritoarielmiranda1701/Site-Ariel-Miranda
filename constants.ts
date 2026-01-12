import { Zap, HardHat, Binary, Calculator, CheckCircle2, Clock, Lock, MessageSquare, FileText, Search, FileCheck } from 'lucide-react';
import { SectionId, Service, ProcessStep, FAQItem, Testimonial } from './types';

export const NAV_LINKS = [
  { label: 'Início', href: `#${SectionId.HOME}` },
  { label: 'Sobre', href: `#${SectionId.ABOUT}` },
  { label: 'Serviços', href: `#${SectionId.SERVICES}` },
  { label: 'Como Funciona', href: `#${SectionId.PROCESS}` },
  { label: 'Diferenciais', href: `#${SectionId.TESTIMONIALS}` },
  { label: 'Depoimentos', href: `#${SectionId.FEEDBACK}` },
  { label: 'Dúvidas', href: `#${SectionId.FAQ}` },
  { label: 'Contato', href: `#${SectionId.CONTACT}` },
];

export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Engenharia Elétrica',
    description: 'Laudos técnicos especializados para identificar causas de acidentes, falhas e irregularidades em sistemas elétricos.',
    icon: Zap,
    features: [
      'Laudos para Concessionárias',
      'Análise de Consumo e Fraudes',
      'Investigação de Acidentes Elétricos',
      'Vistoria de Instalações (NR-10)'
    ]
  },
  {
    id: '2',
    title: 'Segurança do Trabalho',
    description: 'Avaliação técnica de ambientes laborais para garantir conformidade com normas regulamentadoras e segurança jurídica.',
    icon: HardHat,
    features: [
      'Laudos de Insalubridade (NR-15)',
      'Laudos de Periculosidade (NR-16)',
      'Elaboração de LTCAT e PPP',
      'Assistência Técnica em Perícias'
    ]
  },
  {
    id: '3',
    title: 'Forense Digital',
    description: 'Coleta, preservação e análise de evidências digitais para validação de provas em processos judiciais.',
    icon: Binary,
    features: [
      'Verificação de Áudio e Vídeo',
      'Autenticidade de Documentos Digitais',
      'Análise de Metadados',
      'Perícia em WhatsApp e E-mails'
    ]
  },
  {
    id: '4',
    title: 'Cálculos Trabalhistas',
    description: 'Cálculos precisos para liquidação de sentenças e suporte técnico em demandas trabalhistas complexas.',
    icon: Calculator,
    features: [
      'Liquidação de Sentença',
      'Cálculos de Rescisão',
      'Atualização Monetária',
      'Pareceres Contábeis'
    ]
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'p1',
    number: '01',
    title: 'Contato Inicial',
    description: 'Envie sua solicitação via WhatsApp ou E-mail com um breve resumo do caso.',
    icon: MessageSquare
  },
  {
    id: 'p2',
    number: '02',
    title: 'Análise Preliminar',
    description: 'Avaliamos a viabilidade técnica e os documentos disponíveis para o exame.',
    icon: Search
  },
  {
    id: 'p3',
    number: '03',
    title: 'Proposta e Execução',
    description: 'Envio do orçamento e, após aprovação, início imediato dos trabalhos periciais.',
    icon: FileText
  },
  {
    id: 'p4',
    number: '04',
    title: 'Entrega do Laudo',
    description: 'Envio do Parecer Técnico conclusivo, fundamentado e assinado por perito certificado.',
    icon: FileCheck
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'f1',
    question: 'Qual a diferença entre perícia judicial e extrajudicial?',
    answer: 'A perícia judicial é solicitada por um juiz no andamento de um processo. Já a extrajudicial é contratada por empresas ou pessoas físicas que precisam de um laudo técnico para prevenir ou resolver disputas fora do tribunal.'
  },
  {
    id: 'f2',
    question: 'O laudo técnico tem validade jurídica?',
    answer: 'Sim. Todos os nossos laudos seguem normas técnicas e legislações vigentes, podendo ser apresentados em processos judiciais e administrativos.'
  },
  {
    id: 'f3',
    question: 'Atendem somente em São Paulo?',
    answer: 'Não. O Perito Ariel Miranda atua em nível nacional, oferecendo atendimento presencial e remoto em todo o Brasil, 24 horas por dia, 7 dias por semana.'
  }
];

export const DIFFERENTIALS = [
  {
    id: 'd1',
    title: 'Precisão que Gera Confiança',
    description: 'Cada laudo é elaborado com base científica e total imparcialidade, garantindo credibilidade perante juízes, advogados e empresas.',
    icon: CheckCircle2
  },
  {
    id: 'd2',
    title: 'Soluções Personalizadas',
    description: 'Atuamos em todo o Brasil, adaptando cada parecer às particularidades de cada caso — judicial ou extrajudicial.',
    icon: Lock
  },
  {
    id: 'd3',
    title: 'Agilidade Técnica',
    description: 'Processos técnicos otimizados e comunicação direta para entregar laudos com rapidez, sem comprometer a qualidade.',
    icon: Clock
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Dr. Ricardo A.',
    role: 'Advogado Trabalhista',
    content: 'Profissional extremamente técnico e confiável. Os laudos do Perito Ariel já fizeram diferença em várias ações que conduzimos.',
  },
  {
    id: 't2',
    name: 'Eng. Fernanda L.',
    role: 'Consultora de Energia',
    content: 'Excelente domínio na área elétrica e postura ética exemplar. Atendimento rápido e preciso.',
  },
  {
    id: 't3',
    name: 'Marcos P.',
    role: 'Empresário do setor industrial',
    content: 'A perícia extrajudicial nos ajudou a resolver uma disputa com a concessionária sem precisar ir à Justiça. Recomendo!',
  },
  {
    id: 't4',
    name: 'Ana C.',
    role: 'Perita parceira',
    content: 'Equipe organizada, comprometida e sempre atualizada com as normas. Um exemplo de profissionalismo técnico.',
  },
  {
    id: 't5',
    name: 'Luiz S.',
    role: 'Cliente pessoa física',
    content: 'Sofri cobranças indevidas na conta de luz e o laudo do Ariel provou o erro. Serviço sério e muito eficiente.',
  }
];

export const STATS = [
  { label: 'Laudos Emitidos', value: '+1.500' },
  { label: 'Anos de Experiência', value: '+10' },
  { label: 'Satisfação Garantida', value: '100%' },
  { label: 'Atendimento', value: 'Nacional' },
];

export const CONTACT_INFO = {
  whatsapp: '(11) 97497-2685',
  email: 'contato@peritoarielmiranda.com.br',
  address: 'Atendimento em todo o Brasil',
  instagram: '@perito.arielmiranda',
  social: {
    instagram: 'https://www.instagram.com/perito.arielmiranda?igsh=MTd6aXM0djV5eGRpYg==',
    linkedin: 'https://www.linkedin.com/in/peritoarielmiranda',
    whatsapp: 'https://wa.me/5511974972685'
  }
};