import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "SYSTEM ONLINE: DKG Forge Assistant powered by AI is ready. I can answer any questions about our manufacturing capabilities, specific products, or commercial kitchen setups.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [systemContext, setSystemContext] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch full knowledge base on mount
  useEffect(() => {
    const loadKnowledgeBase = async () => {
      try {
        const [infoRes, catalogRes] = await Promise.all([
          fetch('/assets/allinfo.txt'),
          fetch('/assets/DKG_Metalcraft_Product_Catalogue_Details.txt')
        ]);

        const infoText = await infoRes.text();
        const catalogText = await catalogRes.text();

        setSystemContext(`
You are the official AI Assistant for DKG Metal Craft Private Limited. 
You must be helpful, professional, and knowledgeable. Answer questions accurately based ONLY on the provided context below.
If a user asks for a price, tell them to email dkgmetalcraft@gmail.com with their specific dimensions for a custom quote.
Do not invent or hallucinate products that are not in the catalog.
CRITICAL: Do NOT write down your thinking process, "Here's a thinking process:" text, or internal planning steps. Answer directly, using only the final response that is meant for the user.
Provide full and complete answers so the user gets all the necessary information, but format your response in a highly concise, easy-to-understand way. Avoid massive blocks of text; instead, use bullet points, bold text, and short punchy sentences to make the complete information easy to read.

=== COMPANY INFORMATION ===
${infoText}

=== PRODUCT CATALOGUE ===
${catalogText}
        `);
      } catch (err) {
        console.error("Failed to load knowledge base:", err);
      }
    };
    loadKnowledgeBase();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const submitQuestion = async (text: string) => {
    if (!text.trim()) return;

    trackEvent('chatbot_query', { query: text });

    const newMsg: Message = { sender: 'user', text, timestamp: new Date() };
    const updatedMessages = [...messages, newMsg];

    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      // Format chat history for OpenRouter
      const apiMessages = [
        { role: 'system', content: systemContext || "You are an assistant for DKG Metal Craft." },
        ...updatedMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))
      ];

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.href,
          'X-Title': 'DKG Metalcraft AI'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: apiMessages,
          temperature: 0.3,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const data = await response.json();

      if (data.error) {
        console.error("OpenRouter Error:", data.error);
        throw new Error(data.error.message || 'API Error');
      }

      let aiResponseText = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that right now.";

      // Programmatically strip thinking block if the model outputs it anyway
      if (aiResponseText.includes("<thinking>")) {
        aiResponseText = aiResponseText.split("</thinking>")[1] || aiResponseText.replace(/<thinking>[\s\S]*?<\/thinking>/g, '');
      }
      if (aiResponseText.includes("thinking process:")) {
        // Find the index of the thinking process and look for typical transitions
        const parts = aiResponseText.split(/thinking process:|here's a thinking process:/i);
        if (parts.length > 1) {
          // Take the final part or clean it
          aiResponseText = parts[parts.length - 1].trim();
        }
      }
      // Remove any leftover header text about thinking
      aiResponseText = aiResponseText.replace(/^Here's a thinking process:[\s\S]*?(?=\n\n|\n[A-Z]|$)/i, '').trim();

      setMessages(prev => [...prev, { sender: 'bot', text: aiResponseText, timestamp: new Date() }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'bot', text: "⚠️ Network Error: Unable to connect to AI core. Please call us at +91-9899592920 for immediate assistance.", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    submitQuestion(inputValue);
  };

  return (
    <div className="chatbot-container gap-4">

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919899592920"
        target="_blank"
        rel="noopener noreferrer"
        className="p-3.5 rounded-full bg-[#25D366]/10 backdrop-blur-md text-[#25D366] shadow-[0_0_15px_rgba(37,211,102,0.2)] hover:shadow-[0_0_25px_rgba(37,211,102,0.6)] hover:-translate-y-1 transition-all duration-300 border border-[#25D366]/50 flex items-center justify-center group relative"
        aria-label="WhatsApp Us"
      >
        <span className="absolute right-full mr-4 bg-[var(--bg-panel)] border border-[var(--color-border)] text-[var(--text-white)] font-heading text-xs px-3 py-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none tracking-wider">
          WHATSAPP US
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:animate-bounce">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </a>

      {/* Call Button */}
      <a
        href="tel:+919899592920"
        className="p-3.5 rounded-full bg-[#00A3FF]/10 backdrop-blur-md text-[#00A3FF] shadow-[0_0_15px_rgba(0,163,255,0.2)] hover:shadow-[0_0_25px_rgba(0,163,255,0.6)] hover:-translate-y-1 transition-all duration-300 border border-[#00A3FF]/50 flex items-center justify-center group relative"
        aria-label="Call Us"
      >
        <span className="absolute right-full mr-4 bg-[var(--bg-panel)] border border-[var(--color-border)] text-[var(--text-white)] font-heading text-xs px-3 py-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none tracking-wider">
          CALL NOW
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      </a>

      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-full bg-[var(--bg-panel)] backdrop-blur-md text-[var(--text-white)] shadow-[0_0_25px_var(--color-orange-glow)] hover:scale-105 transition-all duration-300 border border-[var(--color-orange)] cursor-pointer flex items-center gap-3 group"
          aria-label="Open support chat"
        >
          <MessageSquare className="w-6 h-6 text-[var(--color-orange)] group-hover:animate-pulse" />
          <span className="font-heading text-xs tracking-widest font-bold hidden sm:inline">FORGE ASSISTANT</span>
        </button>
      )}

      {/* Main Terminal Chat Interface */}
      {isOpen && (
        <div className="chatbot-terminal">

          {/* Terminal Header */}
          <div className="bg-gradient-to-r from-[var(--bg-panel)] to-[var(--bg-dark)] border-b border-[var(--color-border)] p-4 flex justify-between items-center relative shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-orange)] animate-ping absolute opacity-75"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-orange)] relative"></div>
              </div>
              <div>
                <span className="font-heading text-xs text-[var(--text-white)] tracking-widest block font-bold leading-none">
                  FORGE ASSISTANT
                </span>
                <span className="text-[8px] text-[var(--text-steel)] tracking-widest block mt-1 uppercase">
                  Powered by AI
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-[var(--text-steel)] hover:text-[var(--text-white)] border-none bg-transparent cursor-pointer p-2 transition-colors"
                aria-label="Close support chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--bg-dark)]/90 backdrop-blur-2xl flex flex-col relative">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] p-3.5 text-xs leading-relaxed shadow-lg backdrop-blur-md transition-all duration-300 animate-slideUpFade ${msg.sender === 'bot'
                  ? 'self-start bg-[var(--bg-panel)]/90 border border-[var(--color-border)] text-[var(--text-white)] rounded-2xl rounded-tl-sm'
                  : 'self-end bg-[var(--color-orange)]/10 border border-[var(--color-orange)]/40 text-[var(--text-white)] rounded-2xl rounded-tr-sm'
                  }`}
              >
                <div
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: msg.text
                      .replace(/### (.*?)\n/g, '<strong class="text-[var(--color-orange)] text-[11px] block mt-2 mb-1">$1</strong>')
                      .replace(/## (.*?)\n/g, '<strong class="text-[var(--color-orange)] text-[11px] block mt-2 mb-1">$1</strong>')
                      .replace(/# (.*?)\n/g, '<strong class="text-[var(--color-orange)] text-[11px] block mt-2 mb-1">$1</strong>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  }}
                />
                <span className="block text-[8px] opacity-50 text-right mt-2">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="self-start bg-[var(--bg-panel)]/90 border border-[var(--color-border)] rounded-2xl rounded-tl-sm p-3.5 text-xs text-[var(--text-steel)] flex items-center gap-2 shadow-lg backdrop-blur-md animate-slideUpFade">
                <div className="w-1.5 h-1.5 bg-[var(--color-orange)] rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-[var(--color-orange)] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-[var(--color-orange)] rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions - Show only if few messages exist to keep UI clean */}
          {messages.length < 5 && (
            <div className="bg-[var(--bg-dark)] px-3 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
              {['What are your manufacturing capabilities?', 'Can you build a custom cooking range?', 'What is your address?', 'What Ovens do you have?'].map(q => (
                <button
                  key={q}
                  onClick={() => submitQuestion(q)}
                  className="whitespace-nowrap px-3 py-1.5 text-[10px] rounded-full border border-[var(--color-orange)] text-[var(--color-orange)] hover:bg-[var(--color-orange-glow)] transition-colors cursor-pointer bg-transparent"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Form Input */}
          <form onSubmit={handleSendMessage} className="bg-[var(--bg-panel)] border-t border-[var(--color-border)] p-3 flex gap-2">
            <input
              type="text"
              placeholder="Ask DKG Assistant..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-[var(--bg-dark)] border border-[var(--color-border)] text-xs text-[var(--text-white)] p-2.5 outline-none focus:border-[var(--color-orange)] transition-colors"
            />
            <button
              type="submit"
              className="p-2.5 bg-[var(--color-orange)] border-none text-[var(--text-white)] cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
