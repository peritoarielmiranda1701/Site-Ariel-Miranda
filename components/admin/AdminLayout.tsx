import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet, NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Briefcase, MessageSquare,
    HelpCircle, Settings, LogOut, FileText, Loader2, Search, UserCheck
} from 'lucide-react';

const AdminLayout = () => {
    const { isAuthenticated, logout, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/painel/login" replace />;
    }

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
                <div className="p-8 border-b border-slate-800">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                        Ariel Miranda
                    </h1>
                    <p className="text-slate-500 text-xs mt-1 uppercase tracking-wider">Painel Administrativo</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest mt-4 mb-2">Conteúdo</p>

                    <NavLink to="/painel/dashboard" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <LayoutDashboard className="w-5 h-5" />
                        Visão Geral
                    </NavLink>

                    <NavLink to="/painel/servicos" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <Briefcase className="w-5 h-5" />
                        Serviços
                    </NavLink>

                    <NavLink to="/painel/depoimentos" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <MessageSquare className="w-5 h-5" />
                        Depoimentos
                    </NavLink>

                    <NavLink to="/painel/faqs" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <HelpCircle className="w-5 h-5" />
                        Perguntas (FAQ)
                    </NavLink>

                    <NavLink to="/painel/hero" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <FileText className="w-5 h-5" />
                        Topo & Stats (Hero)
                    </NavLink>

                    <NavLink to="/painel/sobre" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <UserCheck className="w-5 h-5" />
                        Sobre / Quem Sou
                    </NavLink>

                    <NavLink to="/painel/info" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <Settings className="w-5 h-5" />
                        Informações Gerais
                    </NavLink>

                    <NavLink to="/painel/seo" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <Search className="w-5 h-5" />
                        SEO & Metadados
                    </NavLink>

                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 w-full transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 relative custom-scrollbar">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
