import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MessageSquare, Layout, ExternalLink, ArrowRight, Activity, Users, Shield } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();

    const stats = [
        { label: 'Serviços Ativos', value: '4', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', path: '/painel/servicos' },
        { label: 'Depoimentos', value: '6', icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50', path: '/painel/depoimentos' },
        { label: 'Processos', value: '5', icon: Layout, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/painel/processo' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Painel de Controle</h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Sistema Online • {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <a href="/" target="_blank" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-amber-600 hover:border-amber-200 hover:shadow-sm transition-all font-medium text-sm">
                    <ExternalLink className="w-4 h-4" />
                    Visualizar Site
                </a>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(stat.path)}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 cursor-pointer transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-amber-600 transition-colors">
                                Acessar <ArrowRight className="w-3 h-3" />
                            </div>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
                        <p className="text-4xl font-bold text-slate-900 mt-2 tracking-tight">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions / Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity Placeholder */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <Activity className="w-5 h-5 text-slate-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Status do sistema</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-sm font-medium text-slate-700">API Directus</span>
                            </div>
                            <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded">Operacional</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-sm font-medium text-slate-700">Banco de Dados</span>
                            </div>
                            <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded">Operacional</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-sm font-medium text-slate-700">Versão do App</span>
                            </div>
                            <span className="text-xs text-slate-500 font-bold">v2.1.0 (SPA)</span>
                        </div>
                    </div>
                </div>

                {/* Support Banner */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-12 opacity-5">
                        <Shield className="w-64 h-64" />
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Precisa de suporte técnico?</h3>
                        <p className="text-slate-300 mb-6 text-sm leading-relaxed max-w-sm">
                            Nossa equipe está disponível para ajudar com qualquer dúvida sobre a gestão do conteúdo ou problemas técnicos no painel.
                        </p>

                        <div className="flex gap-3">
                            <a
                                href="https://wa.me/5567999999999"
                                target="_blank"
                                rel="noreferrer"
                                className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-900/20 text-sm"
                            >
                                Iniciar WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
