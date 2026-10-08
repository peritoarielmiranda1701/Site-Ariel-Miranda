import React, { useEffect, useRef, useState } from 'react';
import { X, Play, ArrowRight, Volume2, Sparkles } from 'lucide-react';

interface VideoPopupModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoFileId: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
}

const VideoPopupModal: React.FC<VideoPopupModalProps> = ({
    isOpen,
    onClose,
    videoFileId,
    title,
    subtitle,
    ctaText
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const videoUrl = videoFileId
        ? `https://admin.peritoarielmiranda.com.br/assets/${videoFileId}`
        : '';

    // Prevent background scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            if (videoRef.current) {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle ESC key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const handleClose = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
        onClose();
    };

    const handlePlayClick = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    if (!isOpen || !videoFileId) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
            onClick={handleClose}
            aria-modal="true"
            role="dialog"
        >
            {/* Modal Card */}
            <div
                className="relative w-full max-w-3xl bg-navy-950 border border-gold-500/30 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(212,175,55,0.18)] overflow-hidden flex flex-col transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative glow gradients */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-navy-800/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

                {/* Header bar */}
                <div className="relative z-10 px-6 pt-5 pb-4 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold-500/80 block">
                                Apresentação Exclusiva
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight line-clamp-1">
                                {title || 'Mensagem do Perito Ariel Miranda'}
                            </h3>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all border border-white/10 hover:scale-105 active:scale-95"
                        aria-label="Fechar popup"
                        title="Fechar e continuar no site"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Video container */}
                <div className="relative z-10 w-full bg-black aspect-video flex items-center justify-center overflow-hidden group">
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        controls
                        playsInline
                        preload="metadata"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        className="w-full h-full object-contain"
                    />

                    {/* Play button overlay before playing */}
                    {!isPlaying && (
                        <div
                            onClick={handlePlayClick}
                            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer group-hover:bg-black/30 transition-all"
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold-500 hover:bg-gold-400 text-navy-950 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.6)] transform group-hover:scale-110 active:scale-95 transition-all pl-1">
                                <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-navy-950" />
                            </div>
                            <span className="mt-4 px-4 py-1.5 rounded-full bg-navy-950/80 border border-gold-500/30 text-white text-xs font-semibold tracking-wide backdrop-blur-sm flex items-center gap-2">
                                <Volume2 className="w-3.5 h-3.5 text-gold-400" />
                                Clique para dar o play
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer with subtitle & close CTA */}
                <div className="relative z-10 px-6 py-4 bg-navy-900/60 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-slate-300 text-center sm:text-left leading-relaxed max-w-md">
                        {subtitle || 'Assista ao vídeo para saber mais sobre nossa atuação técnica em laudos e perícias ou continue para o site.'}
                    </p>

                    <button
                        onClick={handleClose}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 shrink-0"
                    >
                        <span>{ctaText || 'Continuar no site'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoPopupModal;
