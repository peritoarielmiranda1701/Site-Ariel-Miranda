import React, { useState } from 'react';
import { Mail, MapPin, Phone, ArrowUpRight, Send, User, Instagram, Linkedin, MessageCircle, Paperclip } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import { SectionId } from '../types';
import { publicDirectus } from '../lib/directus'; // Use publicDirectus
import { createItem, uploadFiles } from '@directus/sdk';

interface ContactProps {
  data?: typeof CONTACT_INFO;
  logo?: string;
  allowAttachments?: boolean;
}

const Contact: React.FC<ContactProps> = ({ data = CONTACT_INFO, logo, allowAttachments = true }) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [file, setFile] = useState<File | null>(null);

  const logoUrl = logo
    ? `https://admin.peritoarielmiranda.com.br/assets/${logo}`
    : "https://cache2net3.com/Repositorio/19349/Logo/LOGO.png";

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

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

      // 1. Upload File if selected
      if (file) {
        console.log("Iniciando upload do arquivo...");
        const formData = new FormData();
        formData.append('file', file);

        // Upload using publicDirectus
        // @ts-ignore
        const fileUpload = await publicDirectus.request(uploadFiles(formData));

        if (fileUpload && fileUpload.id) {
          uploadedFileId = fileUpload.id;
          console.log("Upload sucesso. ID:", uploadedFileId);

          const fileUrl = `https://admin.peritoarielmiranda.com.br/assets/${fileUpload.id}`;
          messageBody += `\n\n--- ANEXO ---\nArquivo: ${file.name}\nLink: ${fileUrl}`;
        } else {
          console.warn("Upload retornou sucesso mas sem ID?", fileUpload);
        }
      }

      // 2. Build Payload
      const payload: any = {
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        message: messageBody,
        subject: `Contato do Site: ${formState.name} ${file ? '(Com Anexo)' : ''}`,
        status: 'new'
      };

      // Explicitly add attachment if it exists
      if (uploadedFileId) {
        payload.attachment = uploadedFileId;
      }

      console.log("Enviando Payload para mensagens:", payload);

      // 3. Save to Database
      // @ts-ignore
      await publicDirectus.request(createItem('messages', payload));

      console.log("Mensagem salva com sucesso!");
      setStatus('success');
      setFormState({ name: '', email: '', phone: '', message: '' });
      setFile(null);

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setStatus('error');
    }
  };

  return (
    <footer id={SectionId.CONTACT} className="bg-navy-950 text-white border-t border-navy-900 pt-20 pb-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 mb-20">

          {/* Left Column: Contact Information */}
          <div className="space-y-12">
            <div className="flex flex-col items-start">
              <img
                src={logoUrl}
                alt="Logo"
                className="h-24 md:h-32 w-auto object-contain mb-2"
                width="400"
                height="128"
              />
              <p className="text-slate-400 text-sm leading-relaxed max-w-md font-light">
                Compromisso com a verdade real. Serviços de perícia técnica com alto padrão de qualidade e rigor científico.
              </p>

              <div className="pt-4">
                <a
                  href={`https://wa.me/55${data.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shine-effect inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white rounded-md font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-gold-900/20 rounded-md"
                >
                  Iniciar Atendimento <ArrowUpRight size={16} />
                </a>
              </div>
            </div>

            <div className="space-y-8 border-t border-navy-900 pt-10">
              <a
                href={`https://wa.me/55${data.whatsapp.replace(/\D/g, '')}`}
                className="group flex items-start gap-5 hover:opacity-90 transition-opacity"
              >
                <div className="bg-navy-900 p-3 rounded text-gold-500 group-hover:bg-gold-500 group-hover:text-navy-900 transition-colors duration-300">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 group-hover:text-gold-500 transition-colors">Telefone / WhatsApp</p>
                  <p className="text-white font-medium text-lg tracking-wide">{data.whatsapp}</p>
                </div>
              </a>

              <a
                href={`mailto:${data.email}`}
                className="group flex items-start gap-5 hover:opacity-90 transition-opacity"
              >
                <div className="bg-navy-900 p-3 rounded text-gold-500 group-hover:bg-gold-500 group-hover:text-navy-900 transition-colors duration-300">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 group-hover:text-gold-500 transition-colors">E-mail Profissional</p>
                  <p className="text-white font-medium text-lg tracking-wide">{data.email}</p>
                </div>
              </a>

              <div className="group flex items-start gap-5">
                <div className="bg-navy-900 p-3 rounded text-gold-500 group-hover:bg-gold-500 group-hover:text-navy-900 transition-colors duration-300">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 group-hover:text-gold-500 transition-colors">Localização</p>
                  <p className="text-white font-medium text-lg">{data.address}</p>
                  <p className="text-slate-400 text-xs mt-1">Atendimento em todo o Brasil.</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4 border-t border-navy-900 pt-8">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Siga nas Redes Sociais</p>
              <div className="flex gap-4">
                <a
                  href={data.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-navy-900 rounded-md flex items-center justify-center text-white hover:bg-gold-500 hover:text-navy-900 transition-all duration-300 hover:-translate-y-1 shadow-md"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href={data.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-navy-900 rounded-md flex items-center justify-center text-white hover:bg-gold-500 hover:text-navy-900 transition-all duration-300 hover:-translate-y-1 shadow-md"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href={data.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-navy-900 rounded-md flex items-center justify-center text-white hover:bg-gold-500 hover:text-navy-900 transition-all duration-300 hover:-translate-y-1 shadow-md"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-white/5 p-8 md:p-10 rounded-lg border border-white/10 backdrop-blur-sm self-start">
            <h3 className="font-heading font-bold text-white text-xl mb-6">Envie uma Mensagem</h3>

            {status === 'success' ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-6 text-center animate-fade-in">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                  <Send className="w-6 h-6" />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Mensagem Enviada!</h4>
                <p className="text-slate-300 text-sm mb-6">Recebemos seu contato e retornaremos em breve.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-xs font-bold uppercase tracking-widest text-gold-500 hover:text-white transition-colors"
                >
                  Enviar nova mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase text-slate-400 mb-2">
                    Seu Nome
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Digite seu nome completo"
                      value={formState.name}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      className="w-full bg-navy-900/50 border border-navy-800 rounded-md py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-slate-600 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold uppercase text-slate-400 mb-2">Telefone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="(00) 00000-0000"
                      value={formState.phone}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      className="w-full bg-navy-900/50 border border-navy-800 rounded-md py-3 px-4 text-white text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-slate-600 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase text-slate-400 mb-2">E-mail</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="seu@email.com"
                      value={formState.email}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      className="w-full bg-navy-900/50 border border-navy-800 rounded-md py-3 px-4 text-white text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-slate-600 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase text-slate-400 mb-2">Mensagem</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Como podemos ajudar?"
                    value={formState.message}
                    onChange={handleChange}
                    disabled={status === 'submitting'}
                    className="w-full bg-navy-900/50 border border-navy-800 rounded-md py-3 px-4 text-white text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-slate-600 resize-none disabled:opacity-50"
                  ></textarea>
                </div>

                {/* File Upload - Conditional */}
                {allowAttachments && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Anexo (Opcional)</label>
                    <div className="flex items-center gap-4">
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex items-center gap-2 px-4 py-3 bg-navy-900/50 border border-navy-800 rounded-md text-slate-300 hover:text-white hover:border-gold-500/50 transition-all text-sm group"
                      >
                        <Paperclip size={18} className="text-gold-500 group-hover:scale-110 transition-transform" />
                        <span className="truncate max-w-[200px]">
                          {file ? file.name : 'Escolher arquivo...'}
                        </span>
                        <input
                          id="file-upload"
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
                          className="text-red-400 hover:text-red-300 text-xs uppercase font-bold"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Formatos aceitos: PDF, JPG, PNG.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white font-bold uppercase tracking-widest py-4 rounded-md shadow-lg shadow-gold-900/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 text-xs disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? 'Enviando...' : 'Enviar Mensagem (v3 Fix)'} <Send size={16} />
                </button>

                {status === 'error' && (
                  <p className="text-red-400 text-xs text-center font-bold">Ocorreu um erro ao enviar. Tente novamente ou use o WhatsApp.</p>
                )}
              </form>
            )}
          </div>

        </div>

        <div className="border-t border-navy-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 font-medium uppercase tracking-wide gap-4">
          <p>
            &copy; {new Date().getFullYear()} Ariel Miranda. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" onClick={(e) => e.preventDefault()} className="cursor-pointer hover:text-gold-500 transition-colors">Política de Privacidade</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="cursor-pointer hover:text-gold-500 transition-colors">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
