import React, { useState, useEffect } from 'react';
import { directus } from '../../lib/directus';
import { createItem, readItem, updateItem } from '@directus/sdk';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Plus, X, HelpCircle } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface FieldConfig {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'list' | 'icon' | 'image';
    required?: boolean;
    helperText?: string;
}

interface ItemEditorProps {
    collection: string;
    title: string;
    fields: FieldConfig[];
    routePath?: string;
}

const ItemEditor = ({ collection, title, fields, routePath }: ItemEditorProps) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Determine where to go back to (e.g. 'servicos' instead of 'services')
    const basePath = routePath || collection;

    const isNew = id === 'novo';

    useEffect(() => {
        if (!isNew) {
            const fetchItem = async () => {
                try {
                    setLoading(true);
                    const data = await directus.request(readItem(collection as any, id as any));
                    setFormData(data);
                } catch (e) {
                    setError('Erro ao carregar item.');
                } finally {
                    setLoading(false);
                }
            };
            fetchItem();
        }
    }, [collection, id, isNew]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            if (isNew) {
                await directus.request(createItem(collection as any, formData));
            } else {
                await directus.request(updateItem(collection as any, id as any, formData));
            }
            navigate(`/painel/${basePath}`);
        } catch (e: any) {
            console.error('Save failed:', e);
            // Try to extract a useful message from Directus error
            const msg = e?.errors?.[0]?.message || e?.message || 'Erro desconhecido ao salvar.';
            setError(`Erro: ${msg}`);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (name: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    // List Field Helpers
    const addListItem = (fieldName: string) => {
        const currentList = formData[fieldName] || [];
        handleChange(fieldName, [...currentList, '']);
    };

    const updateListItem = (fieldName: string, index: number, value: string) => {
        const currentList = [...(formData[fieldName] || [])];
        currentList[index] = value;
        handleChange(fieldName, currentList);
    };

    const removeListItem = (fieldName: string, index: number) => {
        const currentList = [...(formData[fieldName] || [])];
        currentList.splice(index, 1);
        handleChange(fieldName, currentList);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </button>
                <h1 className="text-2xl font-bold text-slate-900">{isNew ? 'Novo' : 'Editar'} {title}</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {fields.map((field) => (
                    <div key={field.name}>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>

                        {field.type === 'textarea' ? (
                            <textarea
                                value={formData[field.name] || ''}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all h-32 resize-y"
                                required={field.required}
                            />
                        ) : field.type === 'list' ? (
                            <div className="space-y-2">
                                {(formData[field.name] || []).map((item: string, idx: number) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => updateListItem(field.name, idx, e.target.value)}
                                            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeListItem(field.name, idx)}
                                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addListItem(field.name)}
                                    className="flex items-center gap-2 text-xs font-bold text-amber-600 hover:text-amber-700 uppercase tracking-wider mt-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Adicionar Item
                                </button>
                            </div>
                        ) : field.type === 'image' ? (
                            <ImageUpload
                                value={formData[field.name]}
                                onChange={(val) => handleChange(field.name, val)}
                                label={field.label}
                            />
                        ) : (
                            <input
                                type="text"
                                value={formData[field.name] || ''}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                                required={field.required}
                                placeholder={field.helperText}
                            />
                        )}
                        {/* Simple helper for icons */}
                        {field.type === 'icon' && (
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                <HelpCircle className="w-3 h-3" />
                                Use nomes de ícones do Lucide React (ex: scale, gavel, file-text)
                            </p>
                        )}
                    </div>
                ))}

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-70 flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ItemEditor;
