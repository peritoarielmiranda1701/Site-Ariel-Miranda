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
        <div className="max-w-[1600px] mx-auto pb-12 animate-fade-in-up">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-navy-950 rounded-2xl shadow-lg shadow-navy-900/10 border border-navy-800">
                        <Monitor className="w-6 h-6 text-gold-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-navy-900 tracking-tight leading-none mb-1">Editar Conteúdo</h1>
                        <p className="text-sm text-slate-500 font-medium">Gerencie as informações da seção: <span className="text-navy-900 font-bold">{title}</span></p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden relative group">
                {/* Decorative top shimmer */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-navy-900/0 via-gold-500/50 to-navy-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="p-8 md:p-10">
                    <div className="flex items-start gap-10">
                        {/* Main Form Area */}
                        <div className="flex-1">
                            <form onSubmit={handleSubmit} className="space-y-10">
                                {message && !successMsg && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-3 border border-red-100 shadow-sm animate-shake">
                                        <div className="p-1.5 bg-red-100 rounded-full shrink-0">
                                            <AlertCircle className="w-4 h-4 text-red-600" />
                                        </div>
                                        {message}
                                    </div>
                                )}

                                {Object.entries(sections).map(([section, sectionFields]: [string, any]) => (
                                    <div key={section} className="relative">
                                        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm py-4 mb-8 border-b border-slate-100 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-navy-50 flex items-center justify-center">
                                                <PenTool className="w-4 h-4 text-navy-900" />
                                            </div>
                                            <h3 className="text-lg font-bold text-navy-900 tracking-tight uppercase">{section === 'default' ? 'Informações' : section}</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                                            {sectionFields.map((field: FieldConfig) => {
                                                const isFullWidth = field.type === 'textarea' || field.type === 'image';

                                                return (
                                                    <div key={field.name} className={`space-y-3 ${isFullWidth ? 'col-span-1 md:col-span-2' : 'col-span-1'} group/field`}>
                                                        {field.type !== 'image' && (
                                                            <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 group-focus-within/field:text-gold-600 transition-colors pl-1 flex items-center gap-1">
                                                                {field.label}
                                                                {field.required && <span className="text-red-500">*</span>}
                                                            </label>
                                                        )}

                                                        {field.type === 'textarea' ? (
                                                            <textarea
                                                                value={formData[field.name] || ''}
                                                                onChange={(e) => handleChange(field.name, e.target.value)}
                                                                rows={5}
                                                                className="premium-input min-h-[150px] resize-y"
                                                                placeholder={`Digite ${field.label.toLowerCase()}...`}
                                                            />
                                                        ) : field.type === 'image' ? (
                                                            <div className="space-y-4">
                                                                <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 flex items-center gap-1 pl-1">
                                                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                                                </label>
                                                                <div className={`bg-white rounded-2xl border border-slate-200 p-2 shadow-sm hover:border-gold-500/50 transition-all group/image ${field.name.includes('favicon') ? 'w-fit' : ''}`}>
                                                                    <ImageUpload
                                                                        value={formData[field.name]}
                                                                        onChange={(value) => handleChange(field.name, value)}
                                                                        uid={field.name}
                                                                        variant={field.name.includes('favicon') ? 'favicon' : 'default'}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : field.type === 'color' ? (
                                                            <div className="flex items-center gap-4 p-2 bg-white rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-gold-500/20 focus-within:border-gold-500/50 transition-all hover:border-slate-300 shadow-sm">
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
                                                                    className="flex-1 bg-transparent border-none text-navy-900 font-mono uppercase focus:ring-0 outline-none text-sm font-bold tracking-wider"
                                                                    placeholder="#000000"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <input
                                                                type={field.type === 'number' ? 'number' : 'text'}
                                                                value={formData[field.name] || ''}
                                                                onChange={(e) => handleChange(field.name, e.target.value)}
                                                                className="premium-input"
                                                                placeholder={`Digite ${field.label.toLowerCase()}...`}
                                                            />
                                                        )}
                                                        {field.helperText && (
                                                            <p className="text-slate-400 text-[10px] pl-1 font-medium">{field.helperText}</p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-8 border-t border-slate-100 flex items-center justify-end gap-4 sticky bottom-0 bg-white/95 backdrop-blur-sm py-6 z-40 -mx-10 px-10 translate-y-4 rounded-b-xl border-t-0 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
                                    {successMsg && (
                                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl text-xs font-bold animate-pulse border border-emerald-100 uppercase tracking-wide">
                                            <Check className="w-4 h-4" />
                                            Salvo com sucesso!
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-navy-900/20 disabled:opacity-70 flex items-center gap-3 text-xs uppercase tracking-widest hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/30 active:translate-y-0 border border-navy-800"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin text-gold-500" /> : <Save className="w-4 h-4 text-gold-500" />}
                                        {saving ? 'Gravando...' : 'Salvar Tudo'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Side Panel (Actions/Info) */}
                        <div className="hidden xl:block w-80 shrink-0 space-y-6 sticky top-8">
                            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-slate-100 pb-3">Ações Rápidas</h4>
                                <a href="/" target="_blank" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-navy-900 hover:border-navy-800 group cursor-pointer transition-all hover:-translate-y-0.5" rel="noreferrer">
                                    <span className="text-sm font-bold text-slate-600 group-hover:text-white transition-colors">Visualizar Site</span>
                                    <Monitor className="w-4 h-4 text-slate-400 group-hover:text-gold-500 transition-colors" />
                                </a>
                            </div>

                            <div className="bg-navy-950 text-white rounded-2xl p-6 shadow-xl shadow-navy-900/20 relative overflow-hidden group border border-navy-800">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Database className="w-40 h-40 transform translate-x-12 -translate-y-12" />
                                </div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 relative z-10">Status do Singleton</h4>
                                <p className="text-xl font-bold text-white mb-6 relative z-10 tracking-tight">Sincronizado</p>
                                <div className="flex items-center gap-3 relative z-10 bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></div>
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Conectado ao Directus</span>
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
