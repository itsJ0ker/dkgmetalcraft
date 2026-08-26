import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

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
      text: "SYSTEM ONLINE: DKG Forge Assistant ready. Ask me about our commercial kitchen equipment, stainless steel grades, or manufacturing capabilities.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Standard Local NLP Responder logic
  const getLocalResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    // 1. Company & Contact Info
    if (q.includes('address') || q.includes('location') || q.includes('where') || q.includes('mundka') || q.includes('delhi')) {
      return "📍 DKG Metalcraft Pvt. Ltd.\nKh. No. 93/24, Ground Floor, Plot No. 24, Village Mundka, New Delhi-110041, India.\nVisitors are welcome during business hours.";
    }
    if (q.includes('phone') || q.includes('contact') || q.includes('call') || q.includes('number')) {
      return "📞 Direct Hotlines:\n+91-9899592920\n+91-9873667806\nLandline: 011-45019426\n✉️ Email: dkgmetalcraft@gmail.com";
    }

    // 2. Cooking Ranges (Indian & Continental)
    if (q.includes('range') || q.includes('cooking') || q.includes('burner') || q.includes('dosa') || q.includes('chapati plate')) {
      return "🔥 COMMERCIAL COOKING RANGES:\nWe manufacture heavy-duty cooking ranges:\n• Single/Two/Three Burner Indian Ranges (e.g., 72\" x 24\" x 34\"+4\")\n• Four Burner Continental Range (36\" x 36\" x 34\"+4\")\n• Dosa Hot Plates & Chapati Plates with Puffer (48\" x 30\" x 34\"+4\")\n\nLooking for Chinese or Bulk Cooking?";
    }

    // 3. Chinese & Bulk Cooking
    if (q.includes('chinese') || q.includes('bulk') || q.includes('brat pan') || q.includes('steamer') || q.includes('idli') || q.includes('dhokla')) {
      return "🍲 CHINESE & BULK COOKING:\n• Chinese Burner Ranges (1 Burner & 2+1 Burner setups)\n• Tilting Type Brat Pan (80 Ltrs Capacity)\n• Tilting Type Bulk Cooker (100 Ltrs Capacity)\n• Idli Steamers & Dhokla Machines";
    }

    // 4. Chapati & Dish Washers
    if (q.includes('chapati machine') || q.includes('dishwasher') || q.includes('glass washer') || q.includes('wash')) {
      return "⚙️ AUTOMATED MACHINES & WASHING:\n• Fully & Semi-Automatic Chapati Machines for high volume.\n• Fully Automatic Glass Washer (Under Counter)\n• Fully Automatic Dishwashers (Hood Type & Rack Type)";
    }

    // 5. Work Tables & Racks
    if (q.includes('table') || q.includes('worktable') || q.includes('rack') || q.includes('dining')) {
      return "🗄️ WORK TABLES & RACKS:\n• Work Tables with 2 Under Shelves (36\" x 34\" x 34\"+4\")\n• Work Tables with Over Head Shelves\n• Dining Tables with Seaters (72\" x 30\" x 30\")\n• Heavy Duty Pot Racks (48\" x 24\" x 72\")\nAll built with premium stainless steel.";
    }

    // 6. Sink Units & Trolleys
    if (q.includes('sink') || q.includes('basin') || q.includes('trolley')) {
      return "🚰 SINK UNITS & TROLLEYS:\n• Single, Two, and Three Sink Units (up to 72\" x 24\" x 34\"+4\")\n• Work Tables integrated with Sinks\n• Heavy-duty Platform Trolleys (36\" x 24\" x 36\")";
    }

    // 7. Refrigeration & Freezers
    if (q.includes('fridge') || q.includes('refrigerat') || q.includes('freezer') || q.includes('cooler') || q.includes('chiller') || q.includes('showcase')) {
      return "❄️ COMMERCIAL REFRIGERATION:\n• Water Coolers (80 Ltr Capacity)\n• Two & Four Door Vertical Refrigerators (e.g., 48\" x 30\" x 84\")\n• Under Counter Refrigeration (with Top Bain Marie/Prep options)\n• Glass Top Chest Freezers & Upright Showcases\n• Back Bar Chillers (3-Door) & Tilla Kulfi Machines";
    }

    // 8. Ovens (Baking & Pizza)
    if (q.includes('oven') || q.includes('bak') || q.includes('pizza') || q.includes('proofer')) {
      return "🍕 OVENS & PROOFERS:\n• Gas Baking Ovens (Available in 1-Deck/1-Tray up to 2-Deck/4-Tray)\n• Electric Stone Pizza Ovens (Single & Double Deck, up to 6.6 Kw)\n• Electric Proofers (13 Tray Capacity)";
    }

    // 9. Fryers, Grillers, Salamanders & Toasters
    if (q.includes('fryer') || q.includes('grill') || q.includes('salamander') || q.includes('toaster') || q.includes('waffle')) {
      return "🍟 FRYERS & GRILLERS:\n• Electric Fryers (Single 6L, Double 8Lx2, Standing 26L)\n• Jumbo Panini Grills & Waffle Bakers (Round/Square)\n• Electric Salamanders (Top/Bottom Heated & Lift models)\n• Commercial Toasters (4-Slice & 6-Slice)";
    }

    // 10. Capabilities / Manufacturing
    if (q.includes('laser') || q.includes('cut') || q.includes('bend') || q.includes('weld') || q.includes('manufactur')) {
      return "🏭 MANUFACTURING CAPABILITIES:\nWe specialize in precision Laser Cutting, Sheet Bending, Pipe Bending, Power Press operations, Sheet Rolling, and high-integrity Spot Welding. We build robust, custom equipment from raw SS sheets.";
    }

    if (q.includes('quote') || q.includes('price') || q.includes('cost')) {
      return "💰 QUOTATIONS:\nTo get an accurate quote for our products (like Ovens, Ranges, or Refrigerators), please provide your required dimensions or specific models to dkgmetalcraft@gmail.com, or call us at +91-9899592920.";
    }

    // Default general answer
    return "👋 Welcome to DKG Metalcraft Assistant!\nI can help you with details from our Product Catalogue, including:\n• Cooking Ranges & Chinese Bulk Cooking\n• Chapati & Dish Washing Machines\n• Work Tables, Sinks & Racks\n• Commercial Refrigeration\n• Baking & Pizza Ovens\n• Fryers, Grillers & Toasters\n\nWhat equipment are you looking for today?";
  };

  const submitQuestion = (text: string) => {
    if (!text.trim()) return;

    const newMsg: Message = { sender: 'user', text, timestamp: new Date() };
    
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setIsTyping(true);

    // Standard Client-Side NLP Responder
    setTimeout(() => {
      const localReply = getLocalResponse(text);
      setMessages(prev => [...prev, { sender: 'bot', text: localReply, timestamp: new Date() }]);
      setIsTyping(false);
    }, 800);
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
                  Standard Offline Mode
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
                className={`max-w-[85%] p-3.5 text-xs leading-relaxed shadow-lg backdrop-blur-md transition-all duration-300 animate-slideUpFade ${
                  msg.sender === 'bot' 
                    ? 'self-start bg-[var(--bg-panel)]/90 border border-[var(--color-border)] text-[var(--text-white)] rounded-2xl rounded-tl-sm' 
                    : 'self-end bg-[var(--color-orange)]/10 border border-[var(--color-orange)]/40 text-[var(--text-white)] rounded-2xl rounded-tr-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
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
              {['What Ovens do you have?', 'Any Pizza Ovens?', 'Commercial Refrigerators?', 'Cooking Ranges?'].map(q => (
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
