import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from '../types';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Olá! Sou o assistente virtual do Perito Ariel Miranda. Como posso ajudar você hoje com laudos técnicos, perícias em engenharia, segurança ou cálculos?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const prompt = `
        Você é um assistente virtual profissional para o site do Perito Ariel Miranda.
        
        Contexto sobre Ariel Miranda:
        - Especialista em perícias judiciais e extrajudiciais.
        - Áreas: Engenharia Elétrica, Segurança do Trabalho, Forense Digital e Cálculos Trabalhistas.
        - Atua em todo o Brasil (Atendimento Nacional).
        - Contato: (11) 97497-2685.
        
        Diretrizes:
        1. Responda de forma concisa e profissional (máximo 3 frases).
        2. Se a pergunta for técnica demais ou exigir um orçamento, sugira que o usuário entre em contato pelo WhatsApp (botão no site) ou pelo telefone (11) 97497-2685.
        3. Nunca invente preços específicos.
        4. Mantenha um tom de autoridade e confiança.

        Pergunta do usuário: "${userMessage}"
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text || "Desculpe, não consegui processar sua dúvida no momento. Por favor, entre em contato via WhatsApp.";

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);

    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Ocorreu um erro temporário. Por favor, tente novamente ou use o WhatsApp.", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden border border-slate-200 flex flex-col h-[500px] animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy-950 to-navy-900 p-4 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm border border-white/20">
                <Bot size={20} className="text-gold-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-wide">Assistente Virtual</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-[10px] text-slate-300 uppercase tracking-wider">Online</p>
                </div>
              </div>
            </div>
            <button onClick={toggleChat} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded">
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 text-sm rounded-lg shadow-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-navy-900 text-white rounded-br-none' 
                      : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                  } ${msg.isError ? 'border-red-300 bg-red-50 text-red-600' : ''}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 p-3 rounded-lg rounded-bl-none shadow-sm flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-gold-500" />
                    <span className="text-xs text-slate-400 font-medium">Digitando...</span>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Digite sua dúvida..."
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-full text-sm focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all outline-none"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-navy-900 text-white rounded-full hover:bg-gold-500 hover:text-navy-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={toggleChat}
        className={`${isOpen ? 'bg-navy-800 rotate-90' : 'bg-gold-500 hover:bg-gold-400 hover:-translate-y-1'} text-navy-900 p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center border-4 border-white/20 backdrop-blur-sm`}
      >
        {isOpen ? <X size={24} className="text-white" /> : <MessageCircle size={28} className="text-white" />}
      </button>
    </div>
  );
};

export default ChatWidget;