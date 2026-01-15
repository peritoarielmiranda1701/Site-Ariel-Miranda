import { createDirectus, rest, authentication } from '@directus/sdk';

export interface DirectusService {
    id: number;
    title: string;
    description: string;
    icon: string;
    features: string[]; // JSON list
    details?: string;
}

export interface DirectusTestimonial {
    id: number;
    name: string;
    role: string;
    content: string;
}

export interface DirectusFAQ {
    id: number;
    question: string;
    answer: string;
}

export interface DirectusProcessStep {
    id: number;
    number: string;
    title: string;
    description: string;
    icon: string;
}

export interface DirectusSiteInfo {
    whatsapp: string;
    phone_display: string;
    email: string;
    address: string;
    instagram: string;
    linkedin: string;
}

export interface DirectusHeroStats {
    hero_title: string;
    hero_subtitle: string;
    cta_label: string;
    stat_1_label: string;
    stat_1_value: string;
    stat_2_label: string;
    stat_2_value: string;
    stat_3_label: string;
    stat_3_value: string;
    stat_4_label: string;
    stat_4_value: string;
}

export interface DirectusDifferential {
    id: number;
    title: string;
    description: string;
    icon: string;
}

interface Schema {
    services: DirectusService[];
    testimonials: DirectusTestimonial[];
    faqs: DirectusFAQ[];
    process_steps: DirectusProcessStep[];
    differentials: DirectusDifferential[];
    Informacoes_Gerais: DirectusSiteInfo; // Singleton
    hero_stats: DirectusHeroStats; // Singleton
}

// Client for Authenticated Admin Actions
export const directus = createDirectus<Schema>('https://admin.peritoarielmiranda.com.br')
    .with(authentication('json'))
    .with(rest());

// Client for Public Site Data (No Auth headers to avoid 401s from expired tokens)
export const publicDirectus = createDirectus<Schema>('https://admin.peritoarielmiranda.com.br')
    .with(rest());

export const getAssetUrl = (id: string) => {
    if (!id) return '';
    return `https://admin.peritoarielmiranda.com.br/assets/${id}`;
};
