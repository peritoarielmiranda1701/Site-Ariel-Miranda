import React, { useState, useEffect } from 'react';
import { directus } from '../../lib/directus';
import { createItem, readItem, updateItem } from '@directus/sdk';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Plus, X, HelpCircle, Edit2, AlertCircle } from 'lucide-react';
import ImageUpload from './ImageUpload';
import QuillEditor from './QuillEditor';

interface FieldConfig {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'list' | 'icon' | 'image' | 'richtext' | 'boolean';
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

            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden relative group">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 bg-white relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-2xl shadow-inner ${isNew ? 'bg-emerald-50 text-emerald-600' : 'bg-navy-50 text-navy-900'}`}>
                            {isNew ? <Plus className="w-6 h-6" /> : <Edit2 className="w-6 h-6" />}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-navy-900 tracking-tight">{title}</h1>
                            <p className="text-sm text-slate-500 font-medium mt-1">
                                {isNew ? 'Preencha os dados abaixo para criar um novo registro.' : 'Edite as informações abaixo para atualizar este registro.'}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-12 bg-slate-50/30">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-3 border border-red-100 shadow-sm mb-8 animate-shake">
                            <div className="p-1.5 bg-red-100 rounded-full shrink-0">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                            </div>
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                        {fields.map((field) => {
                            const isFullWidth = field.type === 'textarea' || field.type === 'list' || field.type === 'image' || field.type === 'richtext';
                            return (
                                <div key={field.name} className={`space-y-3 ${isFullWidth ? 'col-span-1 md:col-span-2' : 'col-span-1'} group/field`}>
                                    {field.type !== 'image' && (
                                        <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 group-focus-within/field:text-gold-600 transition-colors pl-1 flex items-center gap-1">
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </label>
                                    )}

                                    {field.type === 'textarea' ? (
                                        <textarea
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            className="premium-input min-h-[150px] resize-y"
                                            required={field.required}
                                            placeholder={field.helperText}
                                        />
                                    ) : field.type === 'richtext' ? (
                                        <QuillEditor
                                            value={formData[field.name] || ''}
                                            onChange={(val) => handleChange(field.name, val)}
                                        />
                                    ) : field.type === 'list' ? (
                                        <div className="space-y-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-gold-500/30 transition-colors">
                                            {(formData[field.name] || []).map((item: string, idx: number) => (
                                                <div key={idx} className="flex gap-3 items-center group/item animate-fade-in-up">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                                                        {idx + 1}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={item}
                                                        onChange={(e) => updateListItem(field.name, idx, e.target.value)}
                                                        className="premium-input shadow-none"
                                                        placeholder="Digite o item..."
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeListItem(field.name, idx)}
                                                        className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addListItem(field.name)}
                                                className="flex items-center gap-2 text-xs font-bold text-navy-900 hover:text-gold-600 uppercase tracking-wider mt-4 px-6 py-4 rounded-xl hover:bg-white hover:shadow-md border border-dashed border-slate-300 hover:border-gold-500/50 transition-all w-full justify-center bg-slate-50"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Adicionar Item
                                            </button>
                                        </div>
                                    ) : field.type === 'image' ? (
                                        <div className="space-y-4">
                                            <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 flex items-center gap-1 pl-1">
                                                {field.label} {field.required && <span className="text-red-500">*</span>}
                                            </label>
                                            <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm hover:border-gold-500/50 transition-all group/image">
                                                <ImageUpload
                                                    value={formData[field.name]}
                                                    onChange={(val) => handleChange(field.name, val)}
                                                    uid={field.name}
                                                />
                                            </div>
                                        </div>
                                    ) : field.type === 'boolean' ? (
                                        <label className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-gold-500/30 transition-all shadow-sm cursor-pointer group/toggle">
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={!!formData[field.name]}
                                                    onChange={(e) => handleChange(field.name, e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                                            </div>
                                            <span className="text-sm font-bold text-navy-900 uppercase tracking-wide group-hover/toggle:text-gold-600 transition-colors">
                                                {field.label}
                                            </span>
                                        </label>
                                    ) : (
                                        <input
                                            type="text"
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            className="premium-input"
                                            required={field.required}
                                            placeholder={field.helperText}
                                        />
                                    )}
                                    {/* Simple helper for icons */}
                                    {field.type === 'icon' && (
                                        <p className="text-slate-400 text-[10px] pl-1 flex items-center gap-1.5 pt-1">
                                            <HelpCircle className="w-3 h-3" />
                                            Use nomes do Lucide React (ex: scale, gavel)
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-end gap-4 mt-12 pt-8 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-8 py-4 rounded-xl text-slate-500 font-bold hover:bg-slate-100 hover:text-navy-900 transition-all text-xs uppercase tracking-widest border border-transparent hover:border-slate-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-navy-900/20 disabled:opacity-70 flex items-center gap-3 text-xs uppercase tracking-widest hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/30 active:translate-y-0 border border-navy-800"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin text-gold-500" /> : <Save className="w-4 h-4 text-gold-500" />}
                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItemEditor;
