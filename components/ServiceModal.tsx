import React, { useEffect } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import { Service } from '../types';

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: Service | null;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, service }) => {
    // Prevent body scroll when modal is open
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

    if (!isOpen || !service) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 flex flex-col">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-navy-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="bg-slate-50 p-8 border-b border-slate-100">
                    <div className="w-14 h-14 bg-white rounded-lg shadow-sm flex items-center justify-center mb-6 text-gold-500 border border-slate-100">
                        <service.icon size={32} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy-900 mb-2">
                        {service.title}
                    </h2>
                    <div className="w-12 h-1 bg-gold-500 rounded-full"></div>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8">
                    <div className="prose prose-slate max-w-none">
                        <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                            {service.details || service.description}
                        </p>
                    </div>

                    {/* Features List */}
                    {service.features && service.features.length > 0 && (
                        <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
                            <h4 className="text-sm font-bold text-navy-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                O que incluímos
                            </h4>
                            <ul className="grid sm:grid-cols-2 gap-3">
                                {service.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span className="text-slate-600 text-sm font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-end items-center sticky bottom-0">
                    <button
                        onClick={onClose}
                        className="text-slate-500 font-bold uppercase text-xs tracking-widest hover:text-navy-900 transition-colors px-4 py-2"
                    >
                        Voltar
                    </button>
                    <a
                        href="#contact"
                        onClick={onClose}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white font-bold uppercase tracking-widest rounded-md shadow-lg shadow-gold-900/20 transition-all transform hover:-translate-y-1 text-xs"
                    >
                        Solicitar Avaliação <ArrowRight size={16} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ServiceModal;
