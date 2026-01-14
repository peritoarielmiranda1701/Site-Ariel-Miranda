import React, { useState, useEffect } from 'react';
import { directus } from '../../lib/directus';
import { readSingleton, updateSingleton } from '@directus/sdk';
import { Save, Loader2, HelpCircle } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface FieldConfig {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'image' | 'number';
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // @ts-ignore - Directus SDK types can be tricky with dynamic singletons
                const data = await directus.request(readSingleton(collection));
                console.log(`[SingletonEditor] Loaded data for ${collection}:`, data); // DEBUG
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            // @ts-ignore
            await directus.request(updateSingleton(collection, formData));
            setMessage('Alterações salvas com sucesso!');
            // Auto hide message
            setTimeout(() => setMessage(''), 3000);
        } catch (e) {
            console.error(e);
            setMessage('Erro ao salvar.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
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
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                    <p className="text-slate-500">Edite as informações globais desta seção.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {message && (
                    <div className={`p-4 rounded-xl text-center font-medium ${message.includes('Erro') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {message}
                    </div>
                )}

                {Object.entries(sections).map(([sectionName, sectionFields]: [string, any]) => (
                    <div key={sectionName} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                        <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">{sectionName}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {sectionFields.map((field: FieldConfig) => (
                                <div key={field.name} className={field.type === 'textarea' || field.type === 'image' ? 'md:col-span-2' : ''}>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>

                                    {field.type === 'image' ? (
                                        <ImageUpload
                                            value={formData[field.name]}
                                            onChange={(val) => handleChange(field.name, val)}
                                            label={field.label}
                                        />
                                    ) : field.type === 'textarea' ? (
                                        <textarea
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none transition-all h-32 resize-y"
                                        />
                                    ) : (
                                        <input
                                            type={field.type === 'number' ? 'number' : 'text'}
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                            placeholder={field.helperText}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="flex justify-end sticky bottom-4 z-10">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-12 rounded-xl transition-all shadow-xl shadow-amber-500/20 disabled:opacity-70 flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {saving ? 'Salvando...' : 'Salvar Tudo'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SingletonEditor;
