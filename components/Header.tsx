import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, MapPin, ArrowRight, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { NAV_LINKS, CONTACT_INFO } from '../constants';
import { SectionId } from '../types';

const Header: React.FC<{ logo?: string }> = ({ logo }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoUrl = logo
    ? `https://admin.peritoarielmiranda.com.br/assets/${logo}`
    : "https://cache2net3.com/Repositorio/19349/Logo/LOGO.png";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-navy-950 text-slate-400 py-2.5 hidden md:block border-b border-navy-900 z-50 relative">
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center text-[11px] font-medium tracking-wide uppercase">
          <div className="flex items-center gap-6">
            <a
              href={`https://wa.me/55${CONTACT_INFO.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gold-400 transition-colors"
            >
              <Phone size={12} className="text-gold-500" />
              {CONTACT_INFO.whatsapp}
            </a>
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="flex items-center gap-2 hover:text-gold-400 transition-colors"
            >
              <Mail size={12} className="text-gold-500" />
              {CONTACT_INFO.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-slate-500 cursor-default">
            <MapPin size={12} className="text-gold-500" />
            <span>Atendimento em todo o Brasil</span>
          </div>
        </div>
      </div>

      <header
        className={`fixed w-full z-40 transition-all duration-500 ${isScrolled
          ? 'top-0 bg-white shadow-lg py-3'
          : 'md:top-[38px] top-0 bg-transparent py-5 shadow-none'
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href={`#${SectionId.HOME}`} className="flex flex-col group cursor-pointer" aria-label="Ariel Miranda - Início">
              <img
                src={logoUrl}
                alt="Ariel Miranda"
                className="h-10 md:h-12 w-auto object-contain"
                width="168"
                height="48"
              />
            </a>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`relative text-xs font-bold uppercase tracking-widest py-2 group transition-colors ${isScrolled ? 'text-navy-800' : 'text-white'
                  } hover:text-gold-600`}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}

            {/* Social Icons */}
            <div className={`flex items-center gap-4 ml-4 pl-4 border-l ${isScrolled ? 'border-slate-200' : 'border-white/20'}`}>
              <a
                href={CONTACT_INFO.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-transform hover:-translate-y-0.5 hover:text-gold-600 ${isScrolled ? 'text-navy-900' : 'text-white'
                  }`}
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={CONTACT_INFO.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-transform hover:-translate-y-0.5 hover:text-gold-600 ${isScrolled ? 'text-navy-900' : 'text-white'
                  }`}
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={CONTACT_INFO.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-transform hover:-translate-y-0.5 hover:text-gold-600 ${isScrolled ? 'text-navy-900' : 'text-white'
                  }`}
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 hover:bg-white/20 rounded-md transition-colors ${isScrolled ? 'text-navy-900' : 'text-white'
              }`}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-navy-950/40 backdrop-blur-[2px] z-50 transition-opacity duration-500 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] shadow-2xl z-50 transform transition-all duration-500 ease-in-out md:hidden flex flex-col border-l border-white/20 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } ${isScrolled
            ? 'bg-white'
            : 'bg-white/20 backdrop-blur-xl'
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-6 border-b border-navy-900/5">
          <div className="flex flex-col">
            <img
              src={logoUrl}
              alt="Ariel Miranda"
              className="h-10 w-auto object-contain"
              width="140"
              height="40"
            />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 bg-navy-900/5 rounded-full text-navy-900 hover:bg-red-50 hover:text-red-500 transition-colors"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-6 space-y-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group flex items-center justify-between py-4 text-navy-900 font-heading font-bold uppercase text-sm tracking-wider border-b border-navy-900/5 hover:text-gold-600 hover:pl-2 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
              <ArrowRight size={16} className="text-slate-400 group-hover:text-gold-500 transition-colors" />
            </a>
          ))}
        </nav>

        {/* Sidebar Footer / CTA */}
        <div className="p-6 bg-navy-900/5 border-t border-navy-900/5">
          <a
            href={`https://wa.me/55${CONTACT_INFO.whatsapp.replace(/\D/g, '')}`}
            className="flex items-center justify-center gap-2 w-full py-4 bg-gold-500 text-white font-bold uppercase text-xs tracking-widest rounded-md shadow-lg shadow-gold-500/30 mb-6 hover:bg-gold-600 transition-colors"
          >
            WhatsApp Agora
          </a>

          <div className="space-y-4">
            <a
              href={`https://wa.me/55${CONTACT_INFO.whatsapp.replace(/\D/g, '')}`}
              className="flex items-center gap-3 text-slate-500 text-sm hover:text-gold-600 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center shadow-sm text-gold-600">
                <Phone size={14} />
              </div>
              <span className="font-medium">{CONTACT_INFO.whatsapp}</span>
            </a>
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="flex items-center gap-3 text-slate-500 text-sm hover:text-gold-600 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center shadow-sm text-gold-600">
                <Mail size={14} />
              </div>
              <span className="font-medium truncate">{CONTACT_INFO.email}</span>
            </a>
            <a
              href={CONTACT_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-slate-500 text-sm hover:text-gold-600 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center shadow-sm text-gold-600">
                <Instagram size={14} />
              </div>
              <span className="font-medium">@perito.arielmiranda</span>
            </a>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button (Global) with Enhanced Animation */}
      <div className="fixed bottom-8 right-8 z-50 group">
        {/* Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-white text-navy-900 text-xs font-bold uppercase tracking-wide rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap hidden md:block border border-slate-100">
          Falar com Perito
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white transform rotate-45 border-r border-t border-slate-100"></div>
        </div>

        <a
          href={`https://wa.me/55${CONTACT_INFO.whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-16 h-16 bg-[#25D366] rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-green-900/30"
          aria-label="Falar no WhatsApp"
        >
          {/* Ripple Effect */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-20 animate-[pulse_3s_infinite]"></span>

          {/* Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="w-8 h-8 text-white relative z-10 transform group-hover:rotate-12 transition-transform duration-300"
            fill="currentColor"
          >
            {/* Official FontAwesome WhatsApp Path */}
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
          </svg>
        </a>
      </div>
    </>
  );
};

export default Header;