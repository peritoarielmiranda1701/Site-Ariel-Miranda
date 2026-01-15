import React, { useState, useEffect } from 'react';
import { directus } from '../../lib/directus';
import { readItems, deleteItem } from '@directus/sdk';
import { Plus, Edit2, Trash2, Search, Loader2, AlertCircle, ArrowRight, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Column {
    key: string;
    label: string;
    render?: (value: any) => React.ReactNode;
}

interface CollectionProps {
    collection: string;
    title: string;
    columns: Column[];
    singularName: string;
    routePath?: string; // Optional override for URL path
}

const CollectionLoader = ({ collection, title, columns, singularName, routePath }: CollectionProps) => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const basePath = routePath || collection;

    const fetchItems = async () => {
        try {
            setLoading(true);
            const data = await directus.request(readItems(collection as any));
            setItems(data);
        } catch (e) {
            setError('Erro ao carregar dados. Verifique sua conexão.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [collection]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este item?')) {
            try {
                await directus.request(deleteItem(collection as any, id));
                setItems(items.filter(i => i.id !== id));
            } catch (e) {
                alert('Erro ao excluir item.');
            }
        }
    };

    const filteredItems = items.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(search.toLowerCase())
        )
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4 animate-fade-in">
            <Loader2 className="w-10 h-10 animate-spin text-gold-500" />
            <p className="text-slate-400 font-medium animate-pulse tracking-wide uppercase text-xs">Carregando dados...</p>
        </div>
    );

    return (
        <div className="flex-1 w-full max-w-[1600px] mx-auto pb-12 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-navy-950 p-4 rounded-2xl shadow-lg shadow-navy-900/10 border border-navy-800">
                        <Database className="w-6 h-6 text-gold-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-navy-900 tracking-tight leading-none mb-1">{title}</h1>
                        <p className="text-slate-500 text-sm font-medium">Gerencie os {title.toLowerCase()} do site.</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate(`/painel/${basePath}/novo`)}
                    className="flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white px-6 py-3 rounded-xl transition-all font-bold shadow-lg shadow-navy-900/20 hover:shadow-navy-900/30 hover:-translate-y-0.5 active:translate-y-0 text-xs uppercase tracking-widest group border border-navy-800 hover:border-gold-500/50"
                >
                    <Plus className="w-4 h-4 text-gold-500 group-hover:scale-110 transition-transform" />
                    Novo {singularName}
                </button>
            </div>

            {/* Search & Content Area */}
            <div className="bg-transparent rounded-xl overflow-hidden mt-6">
                {/* Search Bar */}
                <div className="mb-6 relative group max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-slate-400 group-focus-within:text-gold-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="premium-input pl-12"
                    />
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3 text-sm font-bold shadow-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        {error}
                    </div>
                )}

                <div className="space-y-3">
                    {/* Header Row (Desktop) */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-white/50 backdrop-blur-sm border-b border-slate-200/60 rounded-t-2xl text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        {columns.map((col, idx) => (
                            <div key={col.key} className={`${idx === 0 ? 'col-span-5' : 'col-span-3'}`}>
                                {col.label}
                            </div>
                        ))}
                        <div className="col-span-full md:col-start-12 md:col-span-1 text-right">Ações</div>
                    </div>

                    {/* Data Rows */}
                    {filteredItems.length === 0 ? (
                        <div className="bg-white rounded-b-2xl border border-top-0 border-slate-200/60 p-16 text-center flex flex-col items-center justify-center gap-4 shadow-sm">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-navy-900">Nenhum item encontrado</h3>
                                <p className="text-slate-500 text-sm mt-1">Tente buscar por outro termo ou adicione um novo item.</p>
                            </div>
                        </div>
                    ) : (
                        filteredItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="group admin-card px-6 py-4 flex flex-col md:grid md:grid-cols-12 gap-4 items-center hover:border-gold-500/30"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {columns.map((col, idx) => (
                                    <div key={col.key} className={`w-full ${idx === 0 ? 'md:col-span-5 font-bold text-navy-900 text-sm' : 'md:col-span-3 text-slate-600 text-sm font-medium'}`}>
                                        <span className="md:hidden text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">{col.label}</span>
                                        {col.render ? col.render(item[col.key]) : item[col.key]}
                                    </div>
                                ))}

                                <div className="w-full md:col-span-full md:col-end-13 md:col-span-1 flex justify-end gap-2 mt-4 md:mt-0 border-t md:border-t-0 border-slate-50 pt-3 md:pt-0">
                                    <button
                                        onClick={() => navigate(`/painel/${basePath}/${item.id}`)}
                                        className="p-2.5 bg-slate-50 hover:bg-navy-900 text-slate-500 hover:text-white rounded-lg transition-all group/edit hover:shadow-lg"
                                        title="Editar"
                                    >
                                        <Edit2 className="w-4 h-4 group-hover/edit:text-gold-400 transition-colors" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2.5 bg-slate-50 hover:bg-red-500 text-slate-500 hover:text-white rounded-lg transition-all group/delete"
                                        title="Excluir"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollectionLoader;
