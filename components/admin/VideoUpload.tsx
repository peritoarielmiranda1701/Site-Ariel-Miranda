import React, { useState } from 'react';
import { directus } from '../../lib/directus';
import { uploadFiles } from '@directus/sdk';
import { Upload, X, Loader2, Video as VideoIcon, PlayCircle } from 'lucide-react';

interface VideoUploadProps {
    value?: string; // The file ID (UUID)
    onChange: (fileId: string | null) => void;
    label?: string;
    uid: string;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ value, onChange, label, uid }) => {
    const [uploading, setUploading] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string>('');

    const previewUrl = value ? `https://admin.peritoarielmiranda.com.br/assets/${value}` : null;

    const handleFile = async (file: File) => {
        if (!file) return;

        // Validating type
        if (!file.type.startsWith('video/')) {
            alert('Por favor, selecione um arquivo de vídeo válido (ex: MP4, WebM, MOV).');
            return;
        }

        setUploading(true);
        setUploadProgress(`Preparando upload (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`);

        try {
            const formData = new FormData();
            formData.append('file', file);

            setUploadProgress('Enviando para o servidor...');
            const result = await directus.request(uploadFiles(formData));

            if (result && result.id) {
                onChange(result.id);
            } else if (result && Array.isArray(result) && result[0]?.id) {
                onChange(result[0].id);
            }
        } catch (e) {
            console.error('Falha no upload do vídeo:', e);
            alert('Erro ao enviar o vídeo para o servidor. Verifique o tamanho do arquivo ou tente novamente.');
        } finally {
            setUploading(false);
            setUploadProgress('');
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="space-y-2 w-full">
            {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}

            {value ? (
                <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-md group">
                    <div className="aspect-video w-full flex items-center justify-center bg-black/80">
                        <video
                            src={previewUrl!}
                            controls
                            preload="metadata"
                            className="w-full h-full object-contain max-h-[380px]"
                        />
                    </div>

                    {/* Action buttons bar */}
                    <div className="p-3 bg-navy-950 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                            <PlayCircle className="w-4 h-4 text-gold-400" />
                            <span className="truncate font-mono text-[11px] text-slate-400 max-w-[200px]">ID: {value}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => document.getElementById(`upload-video-${uid}`)?.click()}
                                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                                title="Substituir Vídeo"
                            >
                                <Upload className="w-3.5 h-3.5 text-gold-400" />
                                <span>Substituir</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => onChange(null)}
                                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-red-500/20"
                                title="Remover Vídeo"
                            >
                                <X className="w-3.5 h-3.5" />
                                <span>Remover</span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    className={`border-2 border-dashed rounded-2xl h-56 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                        dragging ? 'border-gold-500 bg-gold-500/5' : 'border-slate-300 hover:border-gold-500/60 hover:bg-slate-50'
                    }`}
                    onClick={() => document.getElementById(`upload-video-${uid}`)?.click()}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2 px-4 text-center">
                            <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
                            <p className="text-sm text-slate-700 font-semibold">{uploadProgress || 'Enviando vídeo...'}</p>
                            <p className="text-xs text-slate-400">Por favor, aguarde o processamento.</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-600 border border-gold-500/20 shadow-sm">
                                <VideoIcon className="w-7 h-7" />
                            </div>
                            <div className="text-center px-4">
                                <p className="text-sm text-slate-700 font-bold">
                                    Clique ou arraste um vídeo para cá
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Formatos aceitos: MP4, WebM ou MOV
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            <input
                id={`upload-video-${uid}`}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
        </div>
    );
};

export default VideoUpload;
