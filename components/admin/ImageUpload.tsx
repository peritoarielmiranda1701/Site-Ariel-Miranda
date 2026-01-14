import React, { useState } from 'react';
import { directus } from '../../lib/directus';
import { uploadFiles } from '@directus/sdk';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    value?: string; // The file ID (UUID)
    onChange: (fileId: string | null) => void;
    label?: string;
}

const ImageUpload = ({ value, onChange, label }: ImageUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [dragging, setDragging] = useState(false);

    // If we have a value (ID), we construct the URL to show the preview
    // Directus file URL: https://admin.peritoarielmiranda.com.br/assets/<id>
    const previewUrl = value ? `https://admin.peritoarielmiranda.com.br/assets/${value}` : null;

    const handleFile = async (file: File) => {
        if (!file) return;
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Directus SDK uploadFiles takes a specific format or we can use the raw Request
            // but the SDK helper is cleanest: uploadFiles(formData)
            const result = await directus.request(uploadFiles(formData));

            // result is robust object, we need the ID of the first file
            if (result && result.id) {
                onChange(result.id);
            } else if (result && Array.isArray(result) && result[0]?.id) {
                onChange(result[0].id);
            }

        } catch (e) {
            console.error('Upload failed:', e);
            alert('Erro ao enviar imagem.');
        } finally {
            setUploading(false);
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
        <div className="space-y-2">
            {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}

            {value ? (
                <div className="relative w-full h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group">
                    <img
                        src={previewUrl!}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => document.getElementById(`upload-${label}`)?.click()}
                            className="p-2 bg-white rounded-full text-slate-900 hover:text-amber-600 transition-colors"
                            title="Trocar Imagem"
                        >
                            <Upload className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors"
                            title="Remover Imagem"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    className={`border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${dragging ? 'border-amber-500 bg-amber-50' : 'border-slate-300 hover:border-amber-400 hover:bg-slate-50'
                        }`}
                    onClick={() => document.getElementById(`upload-${label}`)?.click()}
                >
                    {uploading ? (
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-slate-400" />
                            </div>
                            <p className="text-sm text-slate-500 font-medium">
                                Clique para enviar ou arraste aqui
                            </p>
                            <p className="text-xs text-slate-400">JPG, PNG, WEBP (Max 5MB)</p>
                        </>
                    )}
                </div>
            )}

            <input
                id={`upload-${label}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
        </div>
    );
};

export default ImageUpload;
