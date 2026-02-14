import React, { useState, useEffect } from 'react';
import { X, Send, User, Phone, Mail, MessageSquare, Paperclip } from 'lucide-react';
import { publicDirectus } from '../lib/directus'; // Use publicDirectus
import { createItem, uploadFiles } from '@directus/sdk';

interface RequestQuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceTitle?: string;
    allowAttachments?: boolean;
}

const RequestQuoteModal: React.FC<RequestQuoteModalProps> = ({ isOpen, onClose, serviceTitle, allowAttachments }) => {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            let messageBody = formState.message;
            let uploadedFileId: string | null = null; // Initialize as null

            // 1. Upload File if selected and allowed
            if (file && allowAttachments) {
                console.log("Iniciando upload modal...");
                const formData = new FormData();
                formData.append('file', file);

                // @ts-ignore
                const fileUpload = await publicDirectus.request(uploadFiles(formData));

                if (fileUpload && fileUpload.id) {
                    uploadedFileId = fileUpload.id;
                }
            }

            // 2. Build Payload
            const payload: any = {
                name: formState.name,
                email: formState.email,
                phone: formState.phone,
                message: messageBody,
                subject: serviceTitle || 'Solicitação de Orçamento',
                status: 'new'
            };

            // Explicitly add attachment field
            if (uploadedFileId) {
                payload.attachment = uploadedFileId;
            }

            console.log("Enviando Payload Modal:", payload);

            // 3. Save Message
            // @ts-ignore
            await publicDirectus.request(createItem('messages', payload));

            setStatus('success');
            setFormState({ name: '', email: '', phone: '', message: '' });
            setFile(null);
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            setStatus('error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative bg-navy-900 border border-white/10 w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh] animate-fade-in-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div>
                        <h3 className="text-xl font-heading font-bold text-white">Solicitar Orçamento</h3>
                        {serviceTitle && <p className="text-gold-500 text-sm mt-1 font-medium">{serviceTitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {status === 'success' ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400">
                                <Send className="w-8 h-8" />
                            </div>
                            <h4 className="text-white font-bold text-xl mb-2">Solicitação Enviada!</h4>
                            <p className="text-slate-300 mb-8 max-w-xs mx-auto">Recebemos seu pedido de orçamento. Nossa equipe entrará em contato em breve.</p>
                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
                            >
                                Fechar
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="modal-name" className="block text-xs font-bold uppercase text-slate-400 mb-2">Nome Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        id="modal-name"
                                        name="name"
                                        required
                                        placeholder="Seu nome"
                                        value={formState.name}
                                        onChange={handleChange}
                                        className="w-full bg-navy-950/50 border border-navy-800 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-slate-600"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="modal-phone" className="block text-xs font-bold uppercase text-slate-400 mb-2">Telefone (WhatsApp)</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="tel"
                                            id="modal-phone"
                                            name="phone"
                                            required
                                            placeholder="(00) 00000-0000"
                                            value={formState.phone}
                                            onChange={handleChange}
                                            className="w-full bg-navy-950/50 border border-navy-800 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="modal-email" className="block text-xs font-bold uppercase text-slate-400 mb-2">E-mail</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="email"
                                            id="modal-email"
                                            name="email"
                                            required
                                            placeholder="seu@email.com"
                                            value={formState.email}
                                            onChange={handleChange}
                                            className="w-full bg-navy-950/50 border border-navy-800 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="modal-message" className="block text-xs font-bold uppercase text-slate-400 mb-2">Mensagem (Opcional)</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-3 text-slate-500" size={18} />
                                    <textarea
                                        id="modal-message"
                                        name="message"
                                        rows={3}
                                        placeholder="Descreva brevemente sua necessidade..."
                                        value={formState.message}
                                        onChange={handleChange}
                                        className="w-full bg-navy-950/50 border border-navy-800 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-slate-600 resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Conditional File Upload */}
                            {allowAttachments && (
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Documento / Anexo</label>
                                    <div className="flex items-center gap-4">
                                        <label
                                            htmlFor="modal-file-upload"
                                            className="cursor-pointer flex items-center gap-2 px-4 py-3 bg-navy-900/50 border border-navy-800 rounded-lg text-slate-300 hover:text-white hover:border-gold-500/50 transition-all text-sm group w-full sm:w-auto overflow-hidden"
                                        >
                                            <Paperclip size={18} className="text-gold-500 group-hover:scale-110 transition-transform shrink-0" />
                                            <span className="truncate">
                                                {file ? file.name : 'Anexar Arquivo...'}
                                            </span>
                                            <input
                                                id="modal-file-upload"
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                disabled={status === 'submitting'}
                                            />
                                        </label>
                                        {file && (
                                            <button
                                                type="button"
                                                onClick={() => setFile(null)}
                                                className="text-red-400 hover:text-red-300 text-xs uppercase font-bold shrink-0"
                                            >
                                                Remover
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white font-bold uppercase tracking-widest py-4 rounded-lg shadow-lg shadow-gold-900/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 text-xs disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {status === 'submitting' ? (
                                    'Enviando...'
                                ) : (
                                    <>Enviar Solicitação <Send size={16} className="group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>

                            {status === 'error' && (
                                <p className="text-red-400 text-xs text-center font-bold animate-pulse">
                                    Ocorreu um erro. Tente novamente ou use o WhatsApp.
                                </p>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestQuoteModal;
