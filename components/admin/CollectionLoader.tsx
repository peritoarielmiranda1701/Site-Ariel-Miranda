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
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-text-muted font-medium animate-pulse">Carregando dados...</p>
        </div>
    );

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto pb-12 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                        <Database className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-text-main tracking-tight leading-none mb-1">{title}</h1>
                        <p className="text-text-muted text-sm font-medium">Gerencie os {title.toLowerCase()} do site.</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate(`/painel/${basePath}/novo`)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl transition-all font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 text-sm uppercase tracking-wide group"
                >
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Novo {singularName}
                </button>
            </div>

            {/* Search & Content Area */}
            <div className="bg-transparent rounded-xl overflow-hidden mt-6">
                {/* Search Bar */}
                <div className="mb-6 relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none text-text-body placeholder:text-text-muted text-base font-medium transition-all hover:border-slate-300"
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
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold uppercase tracking-widest text-text-muted/70">
                        {columns.map((col, idx) => (
                            <div key={col.key} className={`${idx === 0 ? 'col-span-5' : 'col-span-3'}`}>
                                {col.label}
                            </div>
                        ))}
                        <div className="col-span-full md:col-span-1 text-right">Ações</div>
                    </div>

                    {/* Data Rows */}
                    {filteredItems.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center flex flex-col items-center justify-center gap-4 shadow-sm">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-700">Nenhum item encontrado</h3>
                                <p className="text-slate-500 text-sm mt-1">Tente buscar por outro termo ou adicione um novo item.</p>
                            </div>
                        </div>
                    ) : (
                        filteredItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-floating hover:border-primary/20 transition-all duration-300 relative overflow-hidden flex flex-col md:grid md:grid-cols-12 gap-4 items-center"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {columns.map((col, idx) => (
                                    <div key={col.key} className={`w-full ${idx === 0 ? 'md:col-span-5 font-bold text-text-main' : 'md:col-span-3 text-text-muted text-sm font-medium'}`}>
                                        <span className="md:hidden text-[10px] font-bold uppercase tracking-widest text-text-muted block mb-1">{col.label}</span>
                                        {col.render ? col.render(item[col.key]) : item[col.key]}
                                    </div>
                                ))}

                                <div className="w-full md:col-span-full md:col-end-13 md:col-span-1 flex justify-end gap-2 mt-4 md:mt-0 border-t md:border-t-0 border-slate-50 pt-3 md:pt-0">
                                    <button
                                        onClick={() => navigate(`/painel/${basePath}/${item.id}`)}
                                        className="p-2.5 bg-slate-50 hover:bg-primary text-slate-500 hover:text-white rounded-xl transition-all group/edit"
                                        title="Editar"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2.5 bg-slate-50 hover:bg-red-500 text-slate-500 hover:text-white rounded-xl transition-all group/delete"
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
