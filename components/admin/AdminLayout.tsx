import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSiteData } from '../../hooks/useSiteData';
import { getAssetUrl } from '../../lib/directus';
import { Navigate, Outlet, NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Briefcase, MessageSquare,
    HelpCircle, Settings, LogOut, FileText, Loader2, Search, UserCheck, Monitor, Tablet, Smartphone
} from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, label, end = false }: { to: string, icon: any, label: string, end?: boolean }) => (
    <NavLink to={to} end={end} className={({ isActive }) => `group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all border ${isActive ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-transparent border-transparent hover:bg-gray-50 hover:border-border-light hover:shadow-sm'}`}>
        {({ isActive }) => (
            <>
                <div className={`p-1.5 rounded-md transition-colors ${isActive ? 'bg-primary text-white shadow-sm' : 'bg-white text-text-muted border border-gray-100 group-hover:text-primary group-hover:border-primary/20'}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                    <p className={`text-sm font-medium transition-colors ${isActive ? 'text-primary font-bold' : 'text-text-body group-hover:text-text-main'}`}>{label}</p>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.5)]"></div>}
            </>
        )}
    </NavLink>
);

const SidebarSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="flex flex-col gap-1 mb-6">
        <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-text-muted/70 mb-2">{title}</h3>
        {children}
    </div>
);

const AdminLayout = () => {
    const { isAuthenticated, logout, loading } = useAuth();
    const { customization } = useSiteData();

    // Inject Brand Colors
    useEffect(() => {
        if (customization.colors.primary) {
            document.documentElement.style.setProperty('--color-primary', customization.colors.primary);
            // Optional: calculate hover/light variants if needed, but Tailwind might rely on HSL/RGB if using recent configs.
            // Assuming the simple hex override works for text-primary/bg-primary if they are mapped to the var.
        }
    }, [customization.colors.primary]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/painel/login" replace />;
    }

    return (
        <div className="bg-slate-50/50 text-text-body font-sans overflow-hidden h-screen flex flex-col antialiased selection:bg-primary/20 selection:text-primary">
            {/* Header - Glassmorphic */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200/60 bg-white/80 backdrop-blur-md px-8 py-3 shrink-0 z-40 relative h-16 transition-all duration-300">
                <div className="flex items-center gap-6 w-64 border-r border-gray-100 h-full mr-6">
                    {customization.logo ? (
                        <div className="flex items-center gap-3">
                            <img
                                src={getAssetUrl(customization.logo)}
                                alt="Brand Logo"
                                className="h-9 w-auto object-contain max-w-[160px] drop-shadow-sm"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 group cursor-default">
                            <div className="size-9 flex items-center justify-center bg-gradient-to-br from-primary to-slate-800 text-white rounded-xl shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform duration-300">
                                <LayoutDashboard className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-text-main text-sm font-bold leading-tight tracking-tight group-hover:text-primary transition-colors">Painel Admin</h2>
                                <p className="text-text-muted text-[10px] uppercase font-bold tracking-wide opacity-80">Gerenciamento</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-6 flex-1 items-center h-full">
                    <a href="/" target="_blank" className="flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-white border border-gray-200 text-text-body text-xs font-bold uppercase tracking-wide hover:bg-gray-50 hover:text-primary hover:border-primary/30 transition-all shadow-sm hover:shadow-md group">
                        Ver Site
                        <Monitor className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                    </a>

                    <div className="w-px bg-gray-200 h-8"></div>

                    <div className="flex items-center gap-3 pl-2">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-text-main">Administrador</p>
                            <button onClick={logout} className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-wide flex items-center justify-end gap-1 transition-colors hover:underline">
                                Sair <LogOut className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="bg-gradient-to-tr from-gray-100 to-white text-primary font-bold rounded-xl size-10 flex items-center justify-center border border-gray-100 shadow-md cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden">
                            {customization.favicon ? (
                                <img src={getAssetUrl(customization.favicon)} className="w-6 h-6 object-contain relative z-10" alt="User" />
                            ) : (
                                <span className="group-hover:scale-110 transition-transform relative z-10">AM</span>
                            )}
                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors"></div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Enhanced */}
                <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shrink-0 z-30 overflow-hidden shadow-[4px_0_24px_-12px_rgba(0,0,0,0.03)] pb-4">
                    <nav className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-2">
                        <SidebarSection title="Principal">
                            <SidebarLink to="/painel/dashboard" icon={LayoutDashboard} label="Visão Geral" />
                        </SidebarSection>

                        <SidebarSection title="Conteúdo do Site">
                            <SidebarLink to="/painel/hero" icon={FileText} label="Topo & Stats" />
                            <SidebarLink to="/painel/sobre" icon={UserCheck} label="Sobre / Quem Sou" />
                            <SidebarLink to="/painel/servicos" icon={Briefcase} label="Serviços" />
                            <SidebarLink to="/painel/processo" icon={FileText} label="Processos" />
                            <SidebarLink to="/painel/depoimentos" icon={MessageSquare} label="Depoimentos" />
                            <SidebarLink to="/painel/faqs" icon={HelpCircle} label="Perguntas Frequentes" />
                        </SidebarSection>

                        <SidebarSection title="Configurações">
                            <SidebarLink to="/painel/info" icon={Settings} label="Informações Gerais" />
                            <SidebarLink to="/painel/seo" icon={Search} label="SEO & Metadados" />
                        </SidebarSection>
                    </nav>

                    <div className="px-6 py-4 border-t border-gray-50 flex flex-col gap-1 opacity-60 hover:opacity-100 transition-opacity">
                        <p className="text-[10px] text-center text-text-muted font-medium">
                            &copy; 2024 Painel Gerencial v2.0
                        </p>
                    </div>
                </aside>

                {/* Main Content - Premium Background */}
                <main className="flex-1 flex flex-col bg-slate-50/70 overflow-hidden relative">
                    {/* Subtle Gradient & Texture */}
                    <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-multiply" style={{
                        backgroundImage: `
                            radial-gradient(circle at 100% 0%, rgba(var(--color-primary-rgb), 0.03) 0%, transparent 25%),
                            radial-gradient(circle at 0% 100%, rgba(var(--color-primary-rgb), 0.03) 0%, transparent 25%)
                        `
                    }}></div>
                    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                    {/* Content Scroll Area */}
                    <div className="flex-1 overflow-y-auto z-10 scroll-smooth relative custom-scrollbar">
                        <div className="min-h-full w-full max-w-[1920px] mx-auto p-8 md:p-12 transition-all duration-300 ease-out">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
