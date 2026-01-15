import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MessageSquare, Layout, ExternalLink, ArrowRight, Activity, Users, Shield, HelpCircle } from 'lucide-react';
import { directus } from '../../lib/directus';
import { aggregate, readItems } from '@directus/sdk';

const Dashboard = () => {
    const navigate = useNavigate();
    const [counts, setCounts] = useState({ services: 0, testimonials: 0, processos: 0, faqs: 0 });
    const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check API Status & Fetch Counts via Aggregation
                // Note: aggregate requires permission. If fails, we fallback or show 0.
                const [services, testimonials, processos, faqs] = await Promise.all([
                    directus.request(aggregate('services' as any, { aggregate: { count: '*' } })).catch(() => [{ count: 0 }]),
                    directus.request(aggregate('testimonials' as any, { aggregate: { count: '*' } })).catch(() => [{ count: 0 }]),
                    directus.request(aggregate('processos' as any, { aggregate: { count: '*' } })).catch(() => [{ count: 0 }]),
                    directus.request(aggregate('faqs' as any, { aggregate: { count: '*' } })).catch(() => [{ count: 0 }])
                ]);

                setCounts({
                    services: Number(services[0]?.count) || 0,
                    testimonials: Number(testimonials[0]?.count) || 0,
                    processos: Number(processos[0]?.count) || 0,
                    faqs: Number(faqs[0]?.count) || 0
                });
                setApiStatus('online');
            } catch (e) {
                console.error("Dashboard Error:", e);
                setApiStatus('offline');
            }
        };

        fetchData();
    }, []);

    const stats = [
        { label: 'Serviços Ativos', value: counts.services.toString(), icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', path: '/painel/servicos' },
        { label: 'Depoimentos', value: counts.testimonials.toString(), icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50', path: '/painel/depoimentos' },
        { label: 'Processos', value: counts.processos.toString(), icon: Layout, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/painel/processo' },
        { label: 'Perguntas Freq.', value: counts.faqs.toString(), icon: HelpCircle, color: 'text-purple-600', bg: 'bg-purple-50', path: '/painel/faqs' },
    ];

    return (
        <div className="space-y-8 w-full pb-12 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-main tracking-tight">Painel de Controle</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors ${apiStatus === 'online' ? 'bg-green-100 border-green-200 text-green-700' : apiStatus === 'offline' ? 'bg-red-100 border-red-200 text-red-700' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${apiStatus === 'online' ? 'bg-green-500 animate-pulse' : apiStatus === 'offline' ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                            <span className="text-[10px] font-bold uppercase tracking-wide">
                                {apiStatus === 'online' ? 'Sistema Online' : apiStatus === 'offline' ? 'Sistema Offline' : 'Verificando...'}
                            </span>
                        </span>
                        <span className="text-text-muted text-sm font-medium">
                            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>
                <a href="/" target="_blank" className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-text-body hover:text-primary hover:border-primary/50 hover:shadow-md transition-all font-bold text-sm shadow-sm group">
                    <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                    Visualizar Site
                </a>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(stat.path)}
                        className="bg-white p-6 rounded-2xl shadow-floating border border-slate-100 hover:border-primary/30 hover:-translate-y-1 transition-all group relative overflow-hidden cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                            <stat.icon className="w-32 h-32 transform translate-x-8 -translate-y-8" />
                        </div>

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} ring-1 ring-inset ring-black/5`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-text-muted group-hover:text-primary transition-colors bg-gray-50 px-2 py-1 rounded-lg group-hover:bg-primary/5">
                                Acessar <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
                            <p className="text-4xl font-bold text-text-main tracking-tighter">
                                {apiStatus === 'checking' ? '...' : stat.value}
                            </p>
                        </div>

                        {/* Bottom decorative line */}
                        <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity ${stat.color}`}></div>
                    </div>
                ))}
            </div>

            {/* Quick Actions / Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* System Status */}
                <div className="bg-white rounded-2xl shadow-floating border border-slate-100 p-8 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <Activity className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-text-main tracking-tight">Status dos Serviços</h3>
                            <p className="text-xs text-text-muted font-medium mt-0.5">Monitoramento em tempo real da infraestrutura.</p>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all group">
                            <div className="flex items-center gap-3">
                                <span className="flex h-2.5 w-2.5 relative">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${apiStatus === 'online' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${apiStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                </span>
                                <span className="text-sm font-bold text-text-body group-hover:text-text-main transition-colors">API Directus</span>
                            </div>
                            <span className={`text-[10px] font-bold border px-2.5 py-1 rounded-lg uppercase tracking-wider ${apiStatus === 'online' ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-100 border-red-200 text-red-700'}`}>
                                {apiStatus === 'online' ? 'Operacional' : 'Indisponível'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all group">
                            <div className="flex items-center gap-3">
                                <span className="flex h-2.5 w-2.5 relative">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${apiStatus === 'online' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${apiStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                </span>
                                <span className="text-sm font-bold text-text-body group-hover:text-text-main transition-colors">Banco de Dados</span>
                            </div>
                            <span className={`text-[10px] font-bold border px-2.5 py-1 rounded-lg uppercase tracking-wider ${apiStatus === 'online' ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-100 border-red-200 text-red-700'}`}>
                                {apiStatus === 'online' ? 'Operacional' : 'Indisponível'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Support Banner */}
                <div className="bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/20 p-8 text-white relative overflow-hidden flex flex-col justify-center border border-slate-800 h-full group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 mix-blend-overlay group-hover:opacity-100 transition-opacity duration-700">
                        <Shield className="w-64 h-64 transform rotate-12" />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                                <MessageSquare className="w-6 h-6 text-primary-light" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">Suporte Técnico Premium</h3>
                            <p className="text-slate-400 mb-8 text-sm leading-relaxed max-w-sm font-medium">
                                Nossa equipe especializada está pronta para auxiliar você com qualquer dúvida ou ajuste no seu painel.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <a
                                href="https://wa.me/5567999999999"
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 text-xs uppercase tracking-wide flex items-center gap-2.5 group/btn hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <MessageSquare className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                Iniciar Atendimento
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
