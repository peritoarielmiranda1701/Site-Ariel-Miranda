import React, { useState, useEffect } from 'react';
import { directus } from '../../lib/directus';
import { createItem, readItem, updateItem } from '@directus/sdk';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Plus, X, HelpCircle, Edit2, AlertCircle } from 'lucide-react';
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
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-12 animate-fade-in-up">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors font-bold text-xs uppercase tracking-wide px-4 py-2 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </button>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${isNew ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {isNew ? 'Criando Novo' : 'Editando Item'}
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-floating border border-slate-100 overflow-hidden relative group">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 bg-white relative z-10">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${isNew ? 'bg-green-50' : 'bg-blue-50'}`}>
                            {isNew ? <Plus className={`w-6 h-6 ${isNew ? 'text-green-600' : 'text-blue-600'}`} /> : <Edit2 className={`w-6 h-6 ${isNew ? 'text-green-600' : 'text-blue-600'}`} />}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-text-main tracking-tight">{title}</h1>
                            <p className="text-sm text-text-muted font-medium mt-1">Preencha os campos abaixo para {isNew ? 'criar um novo registro' : 'atualizar este registro'}.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-10">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-3 border border-red-100 shadow-sm mb-8">
                            <div className="p-1.5 bg-red-100 rounded-full shrink-0">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                            </div>
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {fields.map((field) => {
                            const isFullWidth = field.type === 'textarea' || field.type === 'list' || field.type === 'image';
                            return (
                                <div key={field.name} className={`space-y-3 ${isFullWidth ? 'col-span-1 md:col-span-2' : 'col-span-1'} group/field`}>
                                    {field.type !== 'image' && (
                                        <label className="text-text-muted text-[10px] font-bold uppercase tracking-widest block flex items-center gap-2 group-hover/field:text-primary transition-colors pl-1">
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </label>
                                    )}

                                    {field.type === 'textarea' ? (
                                        <textarea
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-text-body placeholder-gray-400 focus:outline-none focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all resize-y leading-relaxed shadow-sm hover:border-slate-300 text-sm font-medium h-32"
                                            required={field.required}
                                            placeholder={field.helperText}
                                        />
                                    ) : field.type === 'list' ? (
                                        <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors">
                                            {(formData[field.name] || []).map((item: string, idx: number) => (
                                                <div key={idx} className="flex gap-3 items-center group/item">
                                                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-text-muted shrink-0 shadow-sm">
                                                        {idx + 1}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={item}
                                                        onChange={(e) => updateListItem(field.name, idx, e.target.value)}
                                                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none shadow-sm transition-all text-sm font-medium text-text-main"
                                                        placeholder="Digite o item..."
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeListItem(field.name, idx)}
                                                        className="p-2.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addListItem(field.name)}
                                                className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-hover uppercase tracking-wider mt-2 px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-primary/20 transition-all w-full justify-center border-dashed border-2 border-primary/20 bg-primary/5"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Adicionar Item
                                            </button>
                                        </div>
                                    ) : field.type === 'image' ? (
                                        <div className="space-y-3">
                                            <label className="text-text-muted text-[10px] font-bold uppercase tracking-widest block flex items-center gap-2 group-hover/field:text-primary transition-colors pl-1">
                                                {field.label} {field.required && <span className="text-red-500">*</span>}
                                            </label>
                                            <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-primary/5 transition-all p-1 group-hover/field:shadow-inner relative overflow-hidden group/image">
                                                <ImageUpload
                                                    value={formData[field.name]}
                                                    onChange={(val) => handleChange(field.name, val)}
                                                    uid={field.name}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-text-main placeholder-gray-400 focus:outline-none focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium shadow-sm hover:border-slate-300 text-sm"
                                            required={field.required}
                                            placeholder={field.helperText}
                                        />
                                    )}
                                    {/* Simple helper for icons */}
                                    {field.type === 'icon' && (
                                        <p className="text-text-muted/80 text-[10px] leading-tight pl-1 font-medium flex items-center gap-1.5 bg-slate-50 w-fit px-2 py-1 rounded-lg border border-slate-100">
                                            <HelpCircle className="w-3 h-3 text-primary" />
                                            Use nomes do Lucide React (ex: scale, gavel)
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex justify-end gap-4 mt-8 sticky bottom-0 bg-white/95 backdrop-blur-sm py-6 -mb-8 -mx-8 px-8 z-20 border-t-0 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3.5 rounded-xl border border-slate-200 text-text-muted font-bold hover:bg-slate-50 hover:text-text-main transition-all text-xs uppercase tracking-wide"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-primary/30 disabled:opacity-70 flex items-center gap-2.5 text-xs uppercase tracking-wide hover:-translate-y-0.5 hover:shadow-primary/40 active:translate-y-0 active:shadow-md"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItemEditor;
