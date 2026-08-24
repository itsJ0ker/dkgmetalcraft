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
    
    if (q.includes('address') || q.includes('location') || q.includes('where') || q.includes('place') || q.includes('mundka') || q.includes('delhi')) {
      return "DKG Metal Craft factory is located at: Kh. No. 93/24, Ground Floor, Plot No. 24, Village Mundka, New Delhi-110041, India. Visitors are welcome during business hours.";
    }
    
    if (q.includes('phone') || q.includes('contact') || q.includes('mobile') || q.includes('call') || q.includes('number') || q.includes('tel')) {
      return "You can call us directly on our hotlines: +91-9899592920, +91-9873667806, or landline: 011 45019426. Email inquiries can be directed to dkgmetalcraft@gmail.com.";
    }

    if (q.includes('email') || q.includes('mail') || q.includes('write')) {
      return "Please send your design blueprints or RFQs to our email: dkgmetalcraft@gmail.com. Our design team will respond within 24 hours.";
    }

    if (q.includes('laser') || q.includes('cut')) {
      return "Laser Cutting is one of our primary capabilities. We offer precision laser cutting with tolerances of ±0.1mm, ensuring clean edges and repeatable geometry for custom components and sheet metal structures.";
    }

    if (q.includes('bend') || q.includes('fold') || q.includes('press')) {
      return "We have advanced sheet metal bending, pipe bending, and rolling machinery. This allows us to form complex structures, kitchen frames, panels, and custom rounded contours for displays.";
    }

    if (q.includes('weld') || q.includes('join') || q.includes('assemble')) {
      return "Our welders specialize in high-integrity TIG, MIG, and spot welding. For commercial culinary products, we use sanitary food-grade grinding to ensure there are no crevices, preserving kitchen hygiene.";
    }

    if (q.includes('table') || q.includes('worktable') || q.includes('bench')) {
      return "We manufacture customized Stainless Steel Work Tables, prep tables, and landing tables in SS 304 or SS 202. Options include custom lengths, single/double under-shelves, backsplashes, and drawer systems.";
    }

    if (q.includes('sink') || q.includes('wash') || q.includes('basin')) {
      return "Our product line includes single, double, and triple-bowl sink units and wash stations, built to commercial kitchen dimensions with sound-dampening insulation and drainboards.";
    }

    if (q.includes('bain marie') || q.includes('warmer') || q.includes('hot counter')) {
      return "We build hot food Bain Maries and heating counters. They feature digital thermostats, high-insulation panel walls, and multiple gastronorm (GN) container configurations.";
    }

    if (q.includes('counter') || q.includes('display') || q.includes('sweet')) {
      return "DKG manufactures Hot Food Display Counters, Sweet Display Counters, and Service Counters. We can integrate customized curves, LED lighting, heated display racks, or sliding glass panels.";
    }

    if (q.includes('rack') || q.includes('trolley') || q.includes('shel') || q.includes('cabinet')) {
      return "We fabricate storage racks, wall-mounted storage cabinets, heavy-duty shelving units, kitchen trolleys, and dish landing systems. All built using premium gauge steel for load capacity.";
    }

    if (q.includes('steel') || q.includes('material') || q.includes('grade') || q.includes('ss')) {
      return "We work with high-quality stainless steel: SS 304 (recommended for corrosion resistance in kitchens/hygiene areas), SS 202 (durable utility grade for dry storage), and SS 430 (ideal for high-heat cooking zones).";
    }

    if (q.includes('quote') || q.includes('price') || q.includes('cost') || q.includes('inquiry')) {
      return "To receive an accurate commercial quote, please submit your custom dimensions (Length x Width x Height in mm) using our interactive project builder in the 'CONTACT' tab, or email blueprints to dkgmetalcraft@gmail.com.";
    }

    // Default general answer
    return "DKG Metal Craft Private Limited specializes in custom sheet metal bending, precision laser cutting, and commercial kitchen fabrication (tables, cabinets, sinks, counters). Let me know which product or capability you would like to discuss, or ask for our contact information.";
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
    <div className="chatbot-container">
      
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
              {['Where are you located?', 'What steel grades do you use?', 'Do you offer laser cutting?', 'How do I get a quote?'].map(q => (
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
