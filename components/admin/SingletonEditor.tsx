import React, { useState, useEffect } from 'react';
import { directus } from '../../lib/directus';
import { readSingleton, updateSingleton } from '@directus/sdk';
import { Save, Loader2, PenTool, Monitor, AlertCircle, Check, Database } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface FieldConfig {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'image' | 'number' | 'color';
    required?: boolean;
    section?: string; // For grouping fields
    helperText?: string;
}

interface SingletonEditorProps {
    collection: string; // 'hero_stats' or 'Informacoes_Gerais'
    title: string;
    fields: FieldConfig[];
}

const SingletonEditor = ({ collection, title, fields }: SingletonEditorProps) => {
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [successMsg, setSuccessMsg] = useState(false); // Added success state

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // @ts-ignore - Directus SDK types can be tricky with dynamic singletons
                const data = await directus.request(readSingleton(collection));
                console.log(`[SingletonEditor] Loaded data for ${collection}:`, data);
                setFormData(data);
            } catch (e) {
                console.error(e);
                setMessage('Erro ao carregar dados. Verifique se a coleção existe.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [collection]);

    const handleChange = (name: string, val: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setSaving(true);
        setMessage('');
        setSuccessMsg(false);

        try {
            // @ts-ignore
            await directus.request(updateSingleton(collection, formData));
            // setMessage('Alterações salvas com sucesso!');
            setSuccessMsg(true);

            // Auto hide message
            setTimeout(() => setSuccessMsg(false), 3000);
        } catch (e: any) {
            console.error(e);
            setMessage('Erro ao salvar: ' + (e.message || 'Erro desconhecido'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    // Group fields by section
    const sections = fields.reduce((acc: any, field) => {
        const sec = field.section || 'Geral';
        if (!acc[sec]) acc[sec] = [];
        acc[sec].push(field);
        return acc;
    }, {});

    return (
        <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <Monitor className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text-main tracking-tight">Editar Conteúdo</h1>
                        <p className="text-sm text-text-muted font-medium mt-1">Gerencie as informações da seção: <span className="text-primary font-bold">{title}</span></p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-floating border border-slate-100 overflow-hidden relative group">
                {/* Decorative top shimmer */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="p-8 md:p-10">
                    <div className="flex items-start gap-10">
                        {/* Main Form Area */}
                        <div className="flex-1">
                            <form onSubmit={handleSubmit} className="space-y-10">
                                {message && !successMsg && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-3 border border-red-100 shadow-sm">
                                        <div className="p-1.5 bg-red-100 rounded-full shrink-0">
                                            <AlertCircle className="w-4 h-4 text-red-600" />
                                        </div>
                                        {message}
                                    </div>
                                )}

                                {Object.entries(sections).map(([section, sectionFields]: [string, any]) => (
                                    <div key={section} className="relative">
                                        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm py-4 mb-6 border-b border-gray-100 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <PenTool className="w-4 h-4 text-primary" />
                                            </div>
                                            <h3 className="text-lg font-bold text-text-main tracking-tight">{section === 'default' ? 'Informações' : section}</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {sectionFields.map((field: FieldConfig) => {
                                                const isFullWidth = field.type === 'textarea' || field.type === 'image';

                                                return (
                                                    <div key={field.name} className={`space-y-3 ${isFullWidth ? 'col-span-1 md:col-span-2' : 'col-span-1'} group/field`}>
                                                        {field.type !== 'image' && (
                                                            <label className="text-text-muted text-[10px] font-bold uppercase tracking-widest block flex items-center gap-2 group-hover/field:text-primary transition-colors pl-1">
                                                                {field.label}
                                                                {field.required && <span className="text-red-500">*</span>}
                                                            </label>
                                                        )}

                                                        {field.type === 'textarea' ? (
                                                            <textarea
                                                                value={formData[field.name] || ''}
                                                                onChange={(e) => handleChange(field.name, e.target.value)}
                                                                rows={5}
                                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-text-body placeholder-gray-400 focus:outline-none focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all resize-y leading-relaxed shadow-sm hover:border-slate-300 text-sm font-medium"
                                                                placeholder={`Digite ${field.label.toLowerCase()}...`}
                                                            />
                                                        ) : field.type === 'image' ? (
                                                            <div className="space-y-3">
                                                                <label className="text-text-muted text-[10px] font-bold uppercase tracking-widest block flex items-center gap-2 group-hover/field:text-primary transition-colors pl-1">
                                                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                                                </label>
                                                                <div className={`bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-primary/5 transition-all group-hover/field:shadow-inner relative overflow-hidden group/image ${field.name.includes('favicon') ? 'w-fit' : ''}`}>
                                                                    <ImageUpload
                                                                        value={formData[field.name]}
                                                                        onChange={(value) => handleChange(field.name, value)}
                                                                        uid={field.name}
                                                                        variant={field.name.includes('favicon') ? 'favicon' : 'default'}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : field.type === 'color' ? (
                                                            <div className="flex items-center gap-4 p-2 bg-slate-50 rounded-xl border border-slate-200 focus-within:ring-4 focus-within:ring-primary/10 transition-all hover:border-slate-300">
                                                                <div className="relative shrink-0">
                                                                    <input
                                                                        type="color"
                                                                        value={formData[field.name] || '#000000'}
                                                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                                                        className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 overflow-hidden shadow-sm hover:scale-105 transition-transform"
                                                                    />
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    value={formData[field.name] || ''}
                                                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                                                    className="flex-1 bg-transparent border-none text-text-main font-mono uppercase focus:ring-0 outline-none text-sm font-bold tracking-wider"
                                                                    placeholder="#000000"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <input
                                                                type={field.type === 'number' ? 'number' : 'text'}
                                                                value={formData[field.name] || ''}
                                                                onChange={(e) => handleChange(field.name, e.target.value)}
                                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-text-main placeholder-gray-400 focus:outline-none focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium shadow-sm hover:border-slate-300 text-sm"
                                                                placeholder={`Digite ${field.label.toLowerCase()}...`}
                                                            />
                                                        )}
                                                        {field.helperText && (
                                                            <p className="text-text-muted/80 text-[10px] leading-tight pl-1 font-medium">{field.helperText}</p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-8 border-t border-slate-100 flex items-center justify-end gap-4 sticky bottom-0 bg-white/95 backdrop-blur-sm py-4 z-40 -mx-4 px-4 translate-y-4 rounded-b-xl border-t-0 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
                                    {successMsg && (
                                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2.5 rounded-xl text-xs font-bold animate-pulse border border-green-100">
                                            <Check className="w-4 h-4" />
                                            Salvo com sucesso!
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-primary/30 disabled:opacity-70 flex items-center gap-2.5 text-xs uppercase tracking-wide hover:-translate-y-0.5 hover:shadow-primary/40 active:translate-y-0 active:shadow-md"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        {saving ? 'Gravando...' : 'Salvar Tudo'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Side Panel (Actions/Info) */}
                        <div className="hidden xl:block w-80 shrink-0 space-y-6 sticky top-8">
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner">
                                <h4 className="text-xs font-bold text-text-main uppercase tracking-widest mb-4 border-b border-slate-200 pb-3">Ações Rápidas</h4>
                                <a href="/" target="_blank" className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer group hover:-translate-y-0.5">
                                    <span className="text-sm font-bold text-text-body group-hover:text-primary transition-colors">Visualizar Site</span>
                                    <Monitor className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                                </a>
                            </div>

                            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl shadow-slate-900/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Database className="w-40 h-40 transform translate-x-12 -translate-y-12" />
                                </div>
                                <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1 relative z-10">Status do Singleton</h4>
                                <p className="text-lg font-bold text-white mb-6 relative z-10 tracking-tight">Sincronizado</p>
                                <div className="flex items-center gap-3 relative z-10 bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                                    <span className="text-xs font-medium text-slate-200">Conectado ao Directus</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingletonEditor;
