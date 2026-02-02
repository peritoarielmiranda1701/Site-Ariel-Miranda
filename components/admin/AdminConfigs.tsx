import React from 'react';
import { Briefcase, MessageSquare, HelpCircle, Star, FileText } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// --- Services ---
export const ServiceColumns = [
    { key: 'title', label: 'Título' },
    {
        key: 'icon',
        label: 'Ícone',
        render: (val: string) => {
            // @ts-ignore
            const Icon = LucideIcons[val] || HelpCircle;
            return <Icon className="w-5 h-5 text-slate-400" />;
        }
    }
];

export const ServiceFields: any[] = [
    { name: 'title', label: 'Título do Serviço', type: 'text', required: true },
    { name: 'icon', label: 'Nome do Ícone (Lucide)', type: 'icon', required: true, helperText: 'Ex: scale, gavel' },
    { name: 'description', label: 'Descrição Curta', type: 'textarea', required: true },
    { name: 'features', label: 'Lista de Diferenciais (Resumo)', type: 'list' },
    { name: 'hero_image', label: 'Imagem de Cabeçalho (Fundo)', type: 'image' },
    {
        name: 'detailed_topics',
        label: 'Seções Detalhadas (Índice Automático)',
        type: 'repeater',
        helperText: 'Adicione seções com Título e Conteúdo para gerar o índice lateral.',
        fields: [
            { name: 'title', label: 'Título da Seção', type: 'text', width: 'half' },
            { name: 'content', label: 'Conteúdo', type: 'textarea', width: 'full' }
        ]
    },
    { name: 'details', label: 'Detalhes (Legado/Avançado)', type: 'textarea', required: false }
];

// --- Testimonials ---
export const TestimonialColumns = [
    { key: 'name', label: 'Nome do Cliente' },
    { key: 'role', label: 'Cargo/Empresa' }
];

export const TestimonialFields: any[] = [
    { name: 'name', label: 'Nome do Cliente', type: 'text', required: true },
    { name: 'role', label: 'Cargo ou Empresa', type: 'text', required: true },
    { name: 'content', label: 'Depoimento', type: 'textarea', required: true }
];

// --- FAQs ---
export const FAQColumns = [
    { key: 'question', label: 'Pergunta' },
    {
        key: 'answer',
        label: 'Resposta',
        render: (val: string) => (
            <span className="text-slate-500 text-xs font-normal line-clamp-2 leading-relaxed" title={val}>
                {val}
            </span>
        )
    }
];

export const FAQFields: any[] = [
    { name: 'question', label: 'Pergunta', type: 'text', required: true },
    { name: 'answer', label: 'Resposta', type: 'textarea', required: true }
];

// --- Info (Singleton-ish but editable as collection for now or custom form?)
// Information_Gerais is a singleton. Directus singletons are just collections with one item usually,
// but creating/listing them is different.
// For simplicty, let's treat it as a collection but maybe we only show the first item or 'Edit Global Info'.
// Or just link directly to /painel/info/1 if ID is known.
// Providing a "Site Info" editor would be nice. I'll stick to collections first.

// --- Info (Contacts & Social) ---
export const InfoFields: any[] = [
    { name: 'site_logo', label: 'Logo do Site (Header/Footer)', type: 'image', section: 'Identidade Visual' },
    { name: 'site_favicon', label: 'Favicon (Aba do Navegador)', type: 'image', section: 'Identidade Visual', helperText: 'Recomendado: 32x32px ou 64x64px (PNG/ICO)' },
    { name: 'primary_color', label: 'Cor Principal (Dourado)', type: 'color', section: 'Identidade Visual', helperText: 'Código Hex (ex: #D4AF37)' },
    { name: 'accent_color', label: 'Cor de Destaque (Fundo)', type: 'color', section: 'Identidade Visual', helperText: 'Código Hex (ex: #020617)' },

    { name: 'contact_email', label: 'E-mail para Receber Contatos', type: 'text', section: 'Mensagens' },

    { name: 'email', label: 'E-mail de Contato (Exibição)', type: 'text', section: 'Contatos' },
    { name: 'phone_display', label: 'Telefone (Exibição)', type: 'text', section: 'Contatos' },
    { name: 'whatsapp', label: 'WhatsApp (Link)', type: 'text', section: 'Contatos' },
    { name: 'address', label: 'Endereço Completo', type: 'textarea', section: 'Contatos' },
    { name: 'instagram', label: 'Link do Instagram', type: 'text', section: 'Redes Sociais' },
    { name: 'linkedin', label: 'Link do LinkedIn', type: 'text', section: 'Redes Sociais' }
];

// --- Hero & Stats Singleton ---
export const HeroFields: any[] = [
    { name: 'hero_title', label: 'Título Principal', type: 'text', section: 'Hero', helperText: 'Use *asteriscos* para destacar em Dourado. Ex: Excelência Técnica a *Serviço da Verdade*' },
    { name: 'hero_subtitle', label: 'Subtítulo', type: 'textarea', section: 'Hero' },
    { name: 'hero_bg', label: 'Imagem de Fundo', type: 'image', section: 'Hero' },
    { name: 'cta_text', label: 'Texto do Botão', type: 'text', section: 'Hero' },
    // Stats
    { name: 'stat_1_value', label: 'Dado 1 (Valor)', type: 'text', section: 'Estatísticas' },
    { name: 'stat_1_label', label: 'Dado 1 (Rótulo)', type: 'text', section: 'Estatísticas' },
    { name: 'stat_2_value', label: 'Dado 2 (Valor)', type: 'text', section: 'Estatísticas' },
    { name: 'stat_2_label', label: 'Dado 2 (Rótulo)', type: 'text', section: 'Estatísticas' },
    { name: 'stat_3_value', label: 'Dado 3 (Valor)', type: 'text', section: 'Estatísticas' },
    { name: 'stat_3_label', label: 'Dado 3 (Rótulo)', type: 'text', section: 'Estatísticas' },
    { name: 'stat_4_value', label: 'Dado 4 (Valor)', type: 'text', section: 'Estatísticas' },
    { name: 'stat_4_label', label: 'Dado 4 (Rótulo)', type: 'text', section: 'Estatísticas' },
];

// --- About Section ---
export const AboutFields: any[] = [
    { name: 'title', label: 'Título', type: 'text', section: 'Conteúdo', helperText: 'Ex: Perito Ariel Miranda' },
    { name: 'subtitle', label: 'Subtítulo', type: 'text', section: 'Conteúdo', helperText: 'Ex: Engenharia, Segurança & Forense Digital' },
    { name: 'text_1', label: 'Parágrafo 1', type: 'textarea', section: 'Conteúdo' },
    { name: 'text_2', label: 'Parágrafo 2', type: 'textarea', section: 'Conteúdo' },
    { name: 'image', label: 'Foto do Perito', type: 'image', section: 'Mídia' },
    { name: 'badge_title', label: 'Título do Selo', type: 'text', section: 'Selo', helperText: 'Ex: Perito Especialista' },
    { name: 'badge_subtitle', label: 'Subtítulo do Selo', type: 'text', section: 'Selo', helperText: 'Ex: Atuação Nacional' },
];

// --- SEO & Metadata ---
export const SeoFields: any[] = [
    { name: 'site_title', label: 'Título do Site (Browser)', type: 'text', section: 'Básico', helperText: 'Aparece na aba do navegador. Ex: Perito Ariel Miranda | Engenharia' },
    { name: 'site_description', label: 'Meta Descrição', type: 'textarea', section: 'Básico', helperText: 'Resumo curto para o Google (max 160 caracteres).' },
    { name: 'site_keywords', label: 'Palavras-chave', type: 'text', section: 'Básico', helperText: 'Ex: perícia, engenharia, laudo, elétrica' },
    { name: 'og_image', label: 'Imagem de Compartilhamento (Social)', type: 'image', section: 'Redes Sociais', helperText: 'Imagem que aparece ao compartilhar o link no WhatsApp/Facebook.' },
    { name: 'og_title', label: 'Título Social', type: 'text', section: 'Redes Sociais', helperText: 'Opcional. Se vazio, usa o Título do Site.' },
];

// --- Workflow (Process Steps) ---
export const ProcessStepColumns = [
    { key: 'number', label: '# Passo' },
    { key: 'title', label: 'Título da Etapa' },
    {
        key: 'icon',
        label: 'Ícone',
        render: (val: string) => {
            // @ts-ignore
            const Icon = LucideIcons[val] || HelpCircle;
            return <Icon className="w-5 h-5 text-slate-400" />;
        }
    }
];

export const ProcessStepFields: any[] = [
    { name: 'number', label: 'Número da Etapa', type: 'text', required: true, helperText: 'Ex: 01, 02...' },
    { name: 'title', label: 'Título', type: 'text', required: true, helperText: 'Ex: Contato Inicial' },
    { name: 'icon', label: 'Ícone (Lucide)', type: 'icon', required: true, helperText: 'Ex: phone, file-search' },
    { name: 'description', label: 'Descrição da Etapa', type: 'textarea', required: true },
];

// --- Differentials ---
export const DifferentialColumns = [
    { key: 'title', label: 'Título' },
    {
        key: 'icon',
        label: 'Ícone',
        render: (val: string) => {
            // @ts-ignore
            const Icon = LucideIcons[val] || HelpCircle;
            return <Icon className="w-5 h-5 text-slate-400" />;
        }
    }
];

export const DifferentialFields: any[] = [
    { name: 'title', label: 'Título do Diferencial', type: 'text', required: true },
    { name: 'icon', label: 'Nome do Ícone (Lucide)', type: 'icon', required: true, helperText: 'Ex: award, shield, zap' },
    { name: 'description', label: 'Descrição', type: 'textarea', required: true },
];
// --- Messages ---
export const MessageColumns = [
    { key: 'subject', label: 'Assunto' },
    { key: 'name', label: 'Nome' },
    {
        key: 'status',
        label: 'Status',
        render: (val: string) => {
            const styles: any = {
                new: 'bg-gold-500/10 text-gold-600 border-gold-500/20',
                read: 'bg-slate-100 text-slate-500 border-slate-200'
            };
            const labels: any = { new: 'Novo', read: 'Lido' };
            return (
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[val] || styles.read}`}>
                    {labels[val] || val}
                </span>
            );
        }
    }
];

export const MessageFields: any[] = [
    { name: 'status', label: 'Status da Mensagem', type: 'select', options: [{ value: 'new', label: 'Novo' }, { value: 'read', label: 'Lido' }], required: true },
    { name: 'name', label: 'Nome do Remetente', type: 'text', readOnly: true },
    { name: 'email', label: 'E-mail', type: 'text', readOnly: true },
    { name: 'phone', label: 'Telefone', type: 'text', readOnly: true },
    { name: 'subject', label: 'Assunto', type: 'text', readOnly: true },
    { name: 'message', label: 'Mensagem', type: 'textarea', readOnly: true },
];
