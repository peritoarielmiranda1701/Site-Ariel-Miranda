import React, { useState, useEffect } from 'react';
import { directus, DirectusService, DirectusTestimonial, DirectusFAQ } from '../../lib/directus';
import { rest, readItems, deleteItem } from '@directus/sdk';
import { Plus, Edit2, Trash2, Search, Loader2, AlertCircle } from 'lucide-react';
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
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                    <p className="text-slate-500">Gerencie os {title.toLowerCase()} do site.</p>
                </div>
                <button
                    onClick={() => navigate(`/painel/${basePath}/novo`)}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-slate-900/10"
                >
                    <Plus className="w-4 h-4" />
                    Novo {singularName}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 outline-none text-slate-600 placeholder:text-slate-400"
                    />
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                {columns.map(col => (
                                    <th key={col.key} className="px-6 py-4">{col.label}</th>
                                ))}
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-slate-400">
                                        Nenhum item encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        {columns.map(col => (
                                            <td key={col.key} className="px-6 py-4 text-slate-700">
                                                {col.render ? col.render(item[col.key]) : item[col.key]}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/painel/${basePath}/${item.id}`)}
                                                    className="p-2 hover:bg-amber-50 text-slate-400 hover:text-amber-600 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CollectionLoader;
