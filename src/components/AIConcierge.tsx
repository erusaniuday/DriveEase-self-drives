import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  X, 
  User, 
  Bot, 
  Loader2, 
  Sparkles, 
  HelpCircle,
  Clock,
  Compass
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AIConciergeProps {
  isDarkMode: boolean;
}

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export default function AIConcierge({ isDarkMode }: AIConciergeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Namaste! Welcome to DriveEase Self Drive Cars Hyderabad. 🚗✨ I am your AI Concierge. I can suggest cars, clarify fuel policies, or guide you through KYC. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedPrompts = [
    "Suggest a luxury SUV for Hyderabad Airport",
    "What is the Security Deposit fee?",
    "Can I drop off the car at Secunderabad?"
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = { sender: "user", text: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await res.json();
      if (res.ok) {
        const botMsg: Message = {
          sender: "bot",
          text: data.reply,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        const fallbackMsg: Message = {
          sender: "bot",
          text: "I am having trouble parsing fleet availability at this exact microsecond. Please contact our human support lines directly at +91 79976 34891.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white flex items-center justify-center shadow-2xl shadow-rose-500/20 hover:shadow-rose-500/40 cursor-pointer active:scale-95 transition-all relative group"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="absolute right-0 top-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#050505] animate-pulse" />
            <div className="absolute right-16 px-3 py-1.5 rounded-lg bg-gray-950 border border-gray-800 text-[10px] font-bold text-[var(--primary)] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              ASK DRIVEASE AI
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 80, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 80, scale: 0.95, opacity: 0 }}
            className={`w-[90vw] sm:w-[380px] h-[520px] rounded-3xl border shadow-2xl flex flex-col overflow-hidden text-left ${
              isDarkMode 
                ? "bg-gray-950/95 border-gray-800 text-white backdrop-blur-md" 
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            {/* Chat header */}
            <div className="px-4.5 py-3.5 border-b border-gray-800/40 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex justify-between items-center text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm flex items-center gap-1 font-serif">
                    DriveEase AI <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
                  </h4>
                  <span className="text-[10px] font-mono text-white/80 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Online Assistant
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-black/10 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Chat messages body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs border ${
                    msg.sender === "user" 
                      ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] border-[var(--primary)] text-white font-bold" 
                      : "bg-gray-950 border-gray-800 text-[var(--primary)]"
                  }`}>
                    {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`p-3 rounded-2xl text-xs max-w-[75%] leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-medium rounded-tr-none"
                      : isDarkMode
                      ? "bg-gray-900/50 text-gray-300 border border-gray-800/60 rounded-tl-none"
                      : "bg-gray-100 text-gray-800 rounded-tl-none"
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className={`text-[9px] font-mono block mt-1.5 text-right ${msg.sender === "user" ? "text-white/60" : "text-gray-500"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gray-950 border border-gray-800 flex items-center justify-center text-[var(--primary)] shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-gray-900/40 border border-gray-800/40 text-xs text-gray-400 flex items-center gap-1.5 rounded-tl-none font-mono">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--primary)]" /> Analyzing active fleet...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestions list */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-gray-800/40 bg-gray-900/10">
                <p className="text-[10px] uppercase font-bold text-gray-500 mb-2 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-[var(--primary)]" /> Quick Suggestions:
                </p>
                <div className="flex flex-col gap-1.5">
                  {suggestedPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(p)}
                      className="text-left text-[11px] font-semibold text-[var(--primary)] hover:text-[var(--secondary)] transition-colors py-1.5 border-b border-gray-800/10 cursor-pointer"
                    >
                      💡 {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Footer */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="p-3.5 border-t border-gray-800/40 bg-gray-950/45 flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask about Baleno, fuel, Airport delivery..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className={`flex-1 px-3.5 py-2.5 text-xs rounded-xl border outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                  isDarkMode ? "bg-gray-900 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
              <button
                type="submit"
                className="p-2.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
