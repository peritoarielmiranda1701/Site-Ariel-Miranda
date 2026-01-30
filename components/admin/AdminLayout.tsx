import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSiteData } from '../../hooks/useSiteData';
import { getAssetUrl } from '../../lib/directus';
import { Navigate, Outlet, NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Briefcase, MessageSquare,
    HelpCircle, Settings, LogOut, FileText, Loader2, Search, UserCheck, Monitor, Crown, Star
} from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, label, end = false }: { to: string, icon: any, label: string, end?: boolean }) => (
    <NavLink to={to} end={end} className={({ isActive }) => `group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border border-transparent ${isActive ? 'bg-gradient-to-r from-gold-500/20 to-transparent border-l-gold-500' : 'hover:bg-white/5 hover:text-white'}`}>
        {({ isActive }) => (
            <>
                <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'text-gold-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'text-slate-400 group-hover:text-white'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <p className={`text-sm tracking-wide transition-colors ${isActive ? 'text-white font-bold' : 'text-slate-400 font-medium group-hover:text-white'}`}>{label}</p>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></div>}
            </>
        )}
    </NavLink>
);

const SidebarSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="flex flex-col gap-1 mb-8">
        <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1 border-l-2 border-slate-700 pl-2">{title}</h3>
        <div className="space-y-0.5">
            {children}
        </div>
    </div>
);

const AdminLayout = () => {
    const { isAuthenticated, logout, loading } = useAuth();
    const { customization } = useSiteData();

    // Inject Brand Colors
    useEffect(() => {
        if (customization.colors.primary) {
            document.documentElement.style.setProperty('--color-primary', customization.colors.primary);
        }
    }, [customization.colors.primary]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-navy-950">
                <div className="relative">
                    <div className="absolute inset-0 bg-gold-500/20 blur-xl rounded-full animate-pulse"></div>
                    <Loader2 className="w-10 h-10 animate-spin text-gold-500 relative z-10" />
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/painel/login" replace />;
    }

    return (
        <div className="bg-slate-50 text-slate-800 font-sans overflow-hidden h-screen flex antialiased selection:bg-gold-500/30 selection:text-gold-600">

            {/* Sidebar "The Sovereign Command" */}
            <aside className="w-72 bg-navy-950 flex flex-col shrink-0 z-50 shadow-2xl relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-navy-900 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                <div className="absolute top-[-10%] right-[-50%] w-[300px] h-[300px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Brand */}
                <div className="p-8 pb-6 relative z-10 flex items-center gap-4">
                    {customization.logo ? (
                        <div className="p-2 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                            <img
                                src={getAssetUrl(customization.logo)}
                                alt="Brand Logo"
                                className="h-8 w-auto object-contain brightness-0 invert opacity-90"
                            />
                        </div>
                    ) : (
                        <div className="size-10 flex items-center justify-center bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl shadow-lg shadow-gold-500/20">
                            <Crown className="w-5 h-5 text-navy-950" />
                        </div>
                    )}
                    <div>
                        <h2 className="text-white text-sm font-bold leading-tight tracking-tight">Site Painel Admin</h2>
                        <p className="text-gold-500/80 text-[10px] uppercase font-bold tracking-widest">Ariel Miranda v2</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar space-y-2 relative z-10">
                    <SidebarSection title="Principal">
                        <SidebarLink to="/painel/dashboard" icon={LayoutDashboard} label="Visão Geral" />
                    </SidebarSection>

                    <SidebarSection title="Gestão de Conteúdo">
                        <SidebarLink to="/painel/hero" icon={FileText} label="Topo & Stats" />
                        <SidebarLink to="/painel/sobre" icon={UserCheck} label="Sobre / Quem Sou" />
                        <SidebarLink to="/painel/servicos" icon={Briefcase} label="Serviços Oferecidos" />
                        <SidebarLink to="/painel/diferenciais" icon={Star} label="Diferenciais" />
                        <SidebarLink to="/painel/processo" icon={FileText} label="Fluxo de Trabalho" />
                        <SidebarLink to="/painel/depoimentos" icon={MessageSquare} label="Depoimentos" />
                        <SidebarLink to="/painel/faqs" icon={HelpCircle} label="Perguntas Frequentes" />
                    </SidebarSection>

                    <SidebarSection title="Configurações">
                        <SidebarLink to="/painel/info" icon={Settings} label="Informações Gerais" />
                        <SidebarLink to="/painel/seo" icon={Search} label="SEO & Metadados" />
                    </SidebarSection>
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-navy-900/50 backdrop-blur-sm relative z-10">
                    <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 transition-all group">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-red-400 transition-colors">Encerrar Sessão</span>
                        <LogOut className="w-3 h-3 text-slate-500 group-hover:text-red-400" />
                    </button>
                    <p className="text-[10px] text-center text-slate-600 mt-4 font-medium tracking-wide">
                        &copy; 2026 Perito Ariel Miranda
                    </p>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-50">
                {/* Glass Header */}
                <header className="glass-header h-20 px-8 flex items-center justify-between z-40 sticky top-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-navy-900 tracking-tight">
                            Olá, <span className="text-gold-600">Administrador</span>
                        </h2>
                    </div>

                    <div className="flex justify-end gap-6 items-center">
                        <a href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-xs font-bold uppercase tracking-wide hover:border-gold-500/50 hover:text-gold-600 hover:shadow-md transition-all group">
                            Visualizar Site
                            <Monitor className="w-3.5 h-3.5 text-slate-400 group-hover:text-gold-500 transition-colors" />
                        </a>

                        <div className="w-px bg-slate-200 h-8"></div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold-100 to-white border border-gold-200 p-0.5 shadow-sm">
                                {customization.favicon ? (
                                    <img src={getAssetUrl(customization.favicon)} className="w-full h-full object-contain rounded-full" alt="User" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-gold-500 flex items-center justify-center text-white font-bold text-xs">AM</div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar relative">
                    {/* Background Texture */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0B1120 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                    <div className="max-w-[1600px] mx-auto relative z-10 pb-20">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
