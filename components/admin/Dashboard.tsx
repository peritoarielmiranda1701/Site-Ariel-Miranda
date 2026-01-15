import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, MessageSquare, Layout, HelpCircle, Loader2, Settings, Shield, UserCheck, FileText } from 'lucide-react';
import { directus } from '../../lib/directus';
import { aggregate } from '@directus/sdk';

const Dashboard = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const navigate = useNavigate();
    const [counts, setCounts] = useState({ services: 0, testimonials: 0, processos: 0, faqs: 0 });
    const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [services, testimonials, process_steps, faqs] = await Promise.all([
                    directus.request(aggregate('services' as any, { aggregate: { count: '*' } })).catch(() => [{ count: 0 }]),
                    directus.request(aggregate('testimonials' as any, { aggregate: { count: '*' } })).catch(() => [{ count: 0 }]),
                    directus.request(aggregate('process_steps' as any, { aggregate: { count: '*' } })).catch(() => [{ count: 0 }]),
                    directus.request(aggregate('faqs' as any, { aggregate: { count: '*' } })).catch(() => [{ count: 0 }])
                ]);

                setCounts({
                    services: Number(services[0]?.count) || 0,
                    testimonials: Number(testimonials[0]?.count) || 0,
                    processos: Number(process_steps[0]?.count) || 0,
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

    const isLoading = apiStatus === 'checking';

    const stats = [
        { label: 'Serviços Ativos', value: counts.services.toString(), icon: Briefcase, color: 'text-white', bg: 'bg-navy-800', border: 'border-navy-700', path: '/painel/servicos' },
        { label: 'Depoimentos', value: counts.testimonials.toString(), icon: MessageSquare, color: 'text-navy-900', bg: 'bg-gold-500', border: 'border-gold-400', path: '/painel/depoimentos' },
        { label: 'Fluxo de Trabalho', value: counts.processos.toString(), icon: Layout, color: 'text-white', bg: 'bg-navy-800', border: 'border-navy-700', path: '/painel/processo' },
        { label: 'Perguntas Freq.', value: counts.faqs.toString(), icon: HelpCircle, color: 'text-white', bg: 'bg-navy-800', border: 'border-navy-700', path: '/painel/faqs' },
    ];

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12">

            {/* Sovereign Banner */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-navy-950 text-white p-8 md:p-12 border border-navy-800 group">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-3xl group-hover:bg-gold-500/20 transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-900/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 text-[10px] font-bold uppercase tracking-widest border border-gold-500/20">
                            Dashboard v2.0
                        </span>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${apiStatus === 'online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${apiStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                            {apiStatus === 'online' ? 'API Conectada' : 'API Offline'}
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                        Painel de <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-200">Gestão Pericial</span>
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg mb-8">
                        Controle total sobre o conteúdo do seu site. Gerencie serviços, depoimentos e configurações de SEO em um ambiente seguro e otimizado.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <a href="/" target="_blank" className="px-6 py-3 rounded-xl bg-white text-navy-950 font-bold text-sm shadow-lg shadow-white/5 hover:scale-105 transition-transform flex items-center gap-2" rel="noreferrer">
                            <Layout className="w-4 h-4" /> Visualizar Site
                        </a>
                        <Link to="/painel/info" className="px-6 py-3 rounded-xl bg-navy-800 text-white font-bold text-sm border border-navy-700 hover:border-gold-500/50 hover:text-gold-400 transition-colors flex items-center gap-2">
                            <Settings className="w-4 h-4" /> Ajustes Gerais
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Cards Grid - Sovereign Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    const isGold = stat.bg === 'bg-gold-500';
                    return (
                        <Link to={stat.path} key={idx} className={`relative overflow-hidden rounded-xl p-6 border transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl ${isGold ? 'bg-gradient-to-br from-gold-400 to-gold-600 border-gold-400 shadow-lg shadow-gold-500/20' : 'bg-white border-slate-100 shadow-sm hover:border-gold-500/30'}`}>
                            {/* Background Pattern */}
                            {!isGold && <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0B1120_1px,transparent_1px)] bg-[size:16px_16px]"></div>}

                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isGold ? 'text-navy-900/70' : 'text-slate-400'}`}>
                                        {stat.label}
                                    </p>
                                    <h3 className={`text-3xl font-bold tracking-tight ${isGold ? 'text-navy-950' : 'text-navy-900'}`}>
                                        {stat.value}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-xl ${isGold ? 'bg-navy-950/10 text-navy-950' : 'bg-navy-50 text-navy-900'}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>

                            {/* Hover Effect */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions Grid - Replacing old simple list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6 relative overflow-hidden group hover:border-gold-500/20 transition-colors">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-navy-900 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                            Gestão de Conteúdo
                        </h3>
                        <Link to="/painel/servicos" className="text-xs font-bold text-gold-600 hover:underline">Ver Todos</Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Serviços', icon: Briefcase, path: '/painel/servicos' },
                            { label: 'Depoimentos', icon: MessageSquare, path: '/painel/depoimentos' },
                            { label: 'Fluxo', icon: Layout, path: '/painel/processo' },
                            { label: 'FAQs', icon: HelpCircle, path: '/painel/faqs' },
                            { label: 'Mensagens', icon: MessageSquare, path: '/painel/mensagens' },
                            { label: 'Sobre Mim', icon: UserCheck, path: '/painel/sobre' },
                            { label: 'Hero / Topo', icon: FileText, path: '/painel/hero' },
                        ].map((item, i) => (
                            <Link key={i} to={item.path} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:bg-white hover:border-gold-500/30 hover:shadow-md transition-all group/item">
                                <item.icon className="w-6 h-6 text-slate-400 group-hover/item:text-gold-500 transition-colors" />
                                <span className="text-xs font-medium text-slate-600 group-hover/item:text-navy-900">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="bg-navy-950 rounded-xl shadow-lg border border-navy-800 p-6 relative overflow-hidden text-white flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl"></div>
                    <div>
                        <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-4 text-gold-400">
                            <Settings className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Configurações Gerais</h3>
                        <p className="text-sm text-slate-400 mb-6">Atualize suas informações de contato, redes sociais e identidade visual.</p>
                    </div>
                    <Link to="/painel/info" className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/5 text-center text-xs font-bold uppercase tracking-wider transition-colors">
                        Acessar Configurações
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
