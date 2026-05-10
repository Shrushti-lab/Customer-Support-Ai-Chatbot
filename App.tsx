import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, MessageCircle, Info, ExternalLink } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'bot' | 'human';
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  text: "Hello! I'm your SupportAI assistant. How can I help you today? You can ask about shipping, refunds, or technical support, or click one of the quick options below.",
  sender: 'bot',
  timestamp: new Date(),
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      } catch (e) {
        return [INITIAL_MESSAGE];
      }
    }
    return [INITIAL_MESSAGE];
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages]);

  const FAQS = [
    { label: 'Refund Policy', query: 'How do refunds work?', icon: '💸' },
    { label: 'Company Careers', query: 'Are you hiring?', icon: '💼' },
    { label: 'Data Privacy', query: 'Is my data safe?', icon: '🛡️' },
    { label: 'Pricing Plans', query: 'Tell me about pricing', icon: '💎' },
    { label: 'Promo Codes', query: 'Do you have any discounts?', icon: '🏷️' },
    { label: 'Account Help', query: 'How do I delete my account?', icon: '👤' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleFAQClick = (query: string) => {
    // We update the input and immediately trigger send logic
    // But since handleSend uses the state 'inputValue', we pass the query directly
    processMessage(query);
  };

  const processMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
        status: data.status,
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    processMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-sky-500/30 flex flex-col md:flex-row h-screen overflow-hidden">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-[280px] border-r border-slate-800 flex-col p-6 space-y-8 bg-[#0B0F1A] z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-sky-500/10">
            S
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">Support Hub</h1>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Assistant</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Service Navigation</p>
            <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-900/50 rounded-md border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 status-dot animate-pulse" />
              <span className="text-sm font-medium text-emerald-500">Always Online</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Resources</p>
            <nav className="space-y-1">
              {[
                { icon: Info, label: 'Shipping & Logistics' },
                { icon: MessageCircle, label: 'Refund Policy' },
                { icon: ExternalLink, label: 'Technical Support' }
              ].map((item, idx) => (
                <button key={idx} className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-800 transition-colors group cursor-pointer text-left">
                  <div className="flex items-center gap-3 text-slate-400 group-hover:text-white">
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase">
              AS
            </div>
            <div>
              <p className="text-xs font-medium text-white/80">Aarav Sharma</p>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">Verified Profile</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[radial-gradient(circle_at_top_right,#0f172a,#020617)] z-10">
        <div className="geometric-grid" />
        
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 md:px-8 bg-slate-950/50 backdrop-blur-md z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="md:hidden w-8 h-8 rounded bg-sky-500 flex items-center justify-center text-xs font-bold text-slate-950 mr-1">S</div>
            <div className="text-sm font-semibold truncate max-w-[200px] md:max-w-none">
              Customer Support Center
              <span className="text-slate-500 mx-2 hidden sm:inline">/</span> 
              <span className="text-sky-400 font-mono text-xs uppercase hidden sm:inline">Active Session</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={() => {
                 setMessages([{
                   id: Date.now().toString(),
                   text: "Chat cleared. How else can I assist you?",
                   sender: 'bot',
                   timestamp: new Date(),
                 }]);
               }}
               className="text-[10px] uppercase font-bold tracking-wider text-slate-500 hover:text-white transition-colors hidden sm:block"
             >
               Clear Chat
             </button>
             <button className="text-xs bg-sky-500/10 text-sky-500 border border-sky-500/20 px-3 py-1.5 rounded-md font-semibold hover:bg-sky-500/20 transition-all">
               Connect Human
             </button>
          </div>
        </header>

        {/* Message Viewport */}
        <div className="flex-1 overflow-y-auto px-6 py-10 space-y-8 scrollbar-thin z-10">
          <div className="max-w-3xl mx-auto w-full">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <React.Fragment key={msg.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex items-start gap-4 mb-8 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center text-[10px] font-bold shadow-sm mt-1 ${
                      msg.sender === 'user' 
                        ? 'bg-slate-700 text-slate-200' 
                        : 'bg-sky-500 text-slate-950'
                    }`}>
                      {msg.sender === 'user' ? 'USR' : 'AI'}
                    </div>
                    <div className={`flex flex-col max-w-[85%] md:max-w-[80%] space-y-1 ${msg.sender === 'user' ? 'items-end' : ''}`}>
                      <div className={`p-4 text-sm leading-relaxed border ${
                        msg.sender === 'user' 
                          ? 'bg-sky-500 text-slate-950 font-medium border-sky-400/30 rounded-2xl rounded-br-[4px]' 
                          : 'bg-slate-800/80 text-slate-200 border-slate-700/50 rounded-2xl rounded-bl-[4px] backdrop-blur-sm shadow-sm'
                      }`}>
                        {msg.text}
                        {msg.status === 'human' && (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-sky-400 hover:text-sky-300 transition-colors">
                               Ping Finance Department <ExternalLink size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase px-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>

                  {/* Show FAQs after the first bot message */}
                  {idx === 0 && messages.length === 1 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8 ml-12"
                    >
                      {FAQS.map((faq, fIdx) => (
                        <button
                          key={fIdx}
                          onClick={() => handleFAQClick(faq.query)}
                          className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-sky-500/50 hover:bg-slate-800 transition-all text-left group"
                        >
                          <span className="text-xl group-hover:scale-110 transition-transform">{faq.icon}</span>
                          <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white leading-tight">
                            {faq.label}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4 ml-0"
              >
                <div className="w-8 h-8 rounded bg-sky-500 shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-950">AI</div>
                <div className="flex gap-1 px-3 py-2 rounded-full bg-slate-800/50 border border-slate-700/30">
                  <div className="w-1.5 h-1.5 bg-sky-500/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-sky-500/70 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Footer */}
        <footer className="p-6 md:p-8 shrink-0 z-20 bg-[#020617]/50 backdrop-blur-sm border-t border-slate-800/50">
          <div className="max-w-4xl mx-auto relative group">
            <form 
              onSubmit={handleSend}
              className="relative flex items-center"
            >
              <input
                type="text"
                placeholder="Type your message here..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 px-6 pr-32 focus:outline-none focus:border-sky-500 transition-all text-sm placeholder:text-slate-600 shadow-2xl"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <span className="text-[9px] font-mono text-slate-600 mr-2 uppercase hidden sm:block tracking-widest">Press Enter ↵</span>
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold p-2.5 rounded-lg transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50 disabled:grayscale"
                >
                  <Send size={18} strokeWidth={2.5} />
                </button>
              </div>
            </form>
            <div className="mt-4 flex items-center justify-center">
               <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.2em]">
                  Secured by SupportCore Engine &bull; Zero Log Policy Active
               </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

