import React, { useState } from "react";
import { 
  Compass, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  ArrowRight,
  Mail,
  PhoneCall,
  Clock,
  Car
} from "lucide-react";
import { motion } from "motion/react";

interface SupportHubProps {
  isDarkMode: boolean;
  setActiveTab: (tab: string) => void;
}

export default function SupportHub({ isDarkMode, setActiveTab }: SupportHubProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const steps = [
    {
      title: "1. Select your Drive",
      desc: "Explore our curated fleet of hatchbacks, family SUVs, and premium luxury sedans. Select your pickup hub.",
      icon: Compass
    },
    {
      title: "2. Verify KYC Online",
      desc: "Upload your valid Indian driving license and Aadhaar or Passport. Verification is fully automated in minutes.",
      icon: ShieldCheck
    },
    {
      title: "3. Drive Your Freedom",
      desc: "Receive the keys at our local hub or get direct delivery at Hyderabad Airport. Cruise through Telangana.",
      icon: Car
    },
    {
      title: "4. Return with Fuel",
      desc: "Park the car back at the chosen hub, complete a clean check-out return, and get your security deposit instantly refunded.",
      icon: Calendar
    }
  ];

  const faqs = [
    {
      q: "What is the security deposit fee and when is it refunded?",
      a: "The refundable security deposit ranges between ₹3,000 to ₹5,000 depending on the vehicle class (7-Seaters/Luxury). Upon completing your trip with zero damages, the deposit is instantly refunded to your bank account or original source of payment within 1-2 hours."
    },
    {
      q: "What documents are required to rent a self-drive car?",
      a: "You must be at least 21 years old and hold a valid, original Indian Driving License (LMC). An Aadhaar Card, Passport, or Voter ID is required for identity and address verification. No international permits are needed for non-resident Indians with verified passports."
    },
    {
      q: "How does the fuel policy work?",
      a: "We operate on a simple 'Full to Full' or 'Like to Like' policy. We provide the car with a full tank, and you must return it with a full tank of fuel. This ensures you only pay for the exact kilometers you drive."
    },
    {
      q: "Are the kilometers included in the rental price limited?",
      a: "Yes, every vehicle comes with an included limit of 150 km per day. If your trip exceeds this daily limit, extra kilometers are charged at ₹12 to ₹18 per kilometer depending on the vehicle type."
    }
  ];

  const blogs = [
    {
      title: "Top 5 Weekend Getaways from Hyderabad under 250 kms",
      desc: "From the majestic Bidar Fort to the serene waters of Singur Dam, escape Hyderabad's rush with our top picks.",
      img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
      date: "July 12, 2026"
    },
    {
      title: "Self-Drive vs Chauffeur Taxis: The Freedom Checklist",
      desc: "Why more corporate travelers are ditching standard taxis for self-drive freedom at Hyderabad Airport.",
      img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
      date: "June 28, 2026"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 relative z-10 text-left space-y-24">
      {/* 1. How It Works */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs text-[var(--primary)] uppercase tracking-widest font-mono font-bold">Simple 4-Step Process</span>
          <h2 className={`text-3xl font-bold font-serif tracking-tight mt-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            How DriveEase Works
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            No complex paperwork. Secure key handovers. Explore Hyderabad on your own terms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-6 rounded-3xl border text-left flex flex-col justify-between h-64 ${
                  isDarkMode ? "bg-gray-950/40 border-gray-800" : "bg-white border-gray-200"
                }`}
              >
                <div className="p-3.5 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 w-fit">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-white">{step.title}</h4>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 2. FAQs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <span className="text-xs text-[var(--primary)] uppercase tracking-widest font-mono font-bold">Frequently Asked</span>
          <h3 className={`text-3xl font-bold font-serif tracking-tight mt-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Got Questions? We Have Answers
          </h3>
          <p className="text-sm text-gray-400 mt-3 leading-relaxed">
            Can't find the answers you're looking for? Check out our 24/7 AI Concierge floating at the bottom right corner of the page, or connect with our human help desk immediately.
          </p>

          <div className="mt-8 p-5 rounded-2xl bg-gray-950 border border-gray-800/40 text-xs flex flex-col gap-3 font-mono">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[var(--primary)]" />
              <span>Direct Hotline: +91 7997634891 / 9493011105</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[var(--primary)]" />
              <span>Support Email: erusaniuday@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen 
                    ? "border-[var(--primary)]/50 bg-gray-950" 
                    : isDarkMode 
                    ? "border-gray-800 hover:border-gray-700 bg-gray-950/20" 
                    : "border-gray-200 bg-white"
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 flex justify-between items-center text-left text-sm font-bold text-white cursor-pointer"
                >
                  <span className={`${isDarkMode ? "text-white hover:text-[var(--primary)]" : "text-gray-900"} transition-colors`}>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[var(--primary)] shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                </button>
                
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-400 leading-relaxed border-t border-gray-800/20">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Blog Section */}
      <div>
        <div className="flex items-baseline justify-between mb-12">
          <div>
            <span className="text-xs text-[var(--primary)] uppercase tracking-widest font-mono font-bold">DriveEase Articles</span>
            <h3 className={`text-3xl font-bold font-serif tracking-tight mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Roadtrip Inspirations & Travel Tips
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog, idx) => (
            <div
              key={idx}
              className={`rounded-3xl border overflow-hidden flex flex-col group ${
                isDarkMode ? "bg-gray-950/20 border-gray-800 hover:border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <div className="h-48 overflow-hidden bg-gray-950 relative">
                <img
                  src={blog.img}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 text-left flex-1 flex flex-col justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-[var(--primary)] uppercase tracking-wider">{blog.date}</span>
                  <h4 className="font-extrabold text-base text-white mt-1 group-hover:text-[var(--primary)] transition-colors font-serif">
                    {blog.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">{blog.desc}</p>
                </div>
                <button 
                  onClick={() => setActiveTab("cars")}
                  className="text-xs font-bold text-[var(--primary)] hover:text-[var(--secondary)] flex items-center gap-1 mt-2.5 cursor-pointer group/btn"
                >
                  Rent a Car now <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
