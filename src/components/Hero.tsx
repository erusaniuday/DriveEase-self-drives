import React, { useState } from "react";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Car, 
  Star, 
  CheckCircle, 
  Zap, 
  ShieldCheck 
} from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  onSearchCars: (criteria: any) => void;
}

export default function Hero({ setActiveTab, isDarkMode, onSearchCars }: HeroProps) {
  const [pickupLoc, setPickupLoc] = useState("Hyderabad Airport (RGIA)");
  const [dropLoc, setDropLoc] = useState("Hyderabad Airport (RGIA)");
  const [pickupDate, setPickupDate] = useState("");
  const [dropDate, setDropDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropTime, setDropTime] = useState("18:00");

  const locations = [
    "Hyderabad Airport (RGIA)",
    "Madhapur (Hitech City)",
    "Gachibowli",
    "Banjara Hills",
    "Jubilee Hills",
    "Kukatpally",
    "Secunderabad Station"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchCars({
      pickupLocation: pickupLoc,
      dropLocation: dropLoc,
      pickupDate,
      dropDate,
      pickupTime,
      dropTime
    });
    setActiveTab("cars");
  };

  const stats = [
    { value: "500+", label: "Happy Customers", icon: Users },
    { value: "100+", label: "Premium Cars", icon: Car },
    { value: "4.9★", label: "Google Rating", icon: Star },
    { value: "24/7", label: "Emergency Support", icon: ShieldCheck }
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(12, 15, 22, 0.45) 50%, rgba(12, 15, 22, 0.95) 100%), url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000')` 
          }}
        />
        {/* Glow effect */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-14 w-full">
        {/* Content Section */}
        <div className="max-w-3xl text-left">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--primary)]/5 border border-[var(--primary)]/30 text-[var(--primary)] font-mono text-xs mb-6 uppercase tracking-[0.2em] font-semibold"
          >
            <Zap className="w-3.5 h-3.5 text-[var(--primary)]" /> Premium Rentals &bull; No Hidden Charges
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.1] text-white font-serif font-light"
          >
            Drive Your Freedom in <br />
            <span className="italic font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
              Pure Luxury.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-sm sm:text-base text-gray-400 max-w-xl leading-relaxed"
          >
            Experience the premium self-drive car rental service in Hyderabad. From executive sedans to rugged SUVs, your journey begins with elegance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-wrap gap-4"
          >
            <button
              onClick={() => setActiveTab("cars")}
              className="px-8 py-4 rounded-xl font-extrabold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-xl shadow-rose-500/10 hover:opacity-90 active:scale-95 transition-all text-xs uppercase tracking-widest cursor-pointer"
            >
              Explore Fleet
            </button>
            <button
              onClick={() => setActiveTab("how-it-works")}
              className="px-8 py-4 rounded-xl font-bold border border-gray-800 bg-gray-900/20 backdrop-blur hover:bg-gray-800/40 text-gray-300 transition-all text-xs uppercase tracking-widest cursor-pointer"
            >
              How It Works
            </button>
          </motion.div>
        </div>

        {/* Floating Search Widget */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className={`w-full rounded-3xl border p-6 sm:p-8 shadow-2xl glass-panel ${
            isDarkMode 
              ? "bg-[#050505]/75 border-gray-800" 
              : "bg-white/80 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] animate-ping" />
            <h3 className={`text-xs font-bold uppercase tracking-[0.25em] ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Schedule Your Freedom Ride
            </h3>
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Pickup Location */}
            <div className="flex flex-col gap-2">
              <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Pickup Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 text-gray-400 w-4.5 h-4.5" />
                <select
                  value={pickupLoc}
                  onChange={(e) => setPickupLoc(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs font-semibold border appearance-none outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                    isDarkMode 
                      ? "bg-gray-950 border-gray-800 text-white" 
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
                >
                  {locations.map((loc, idx) => (
                    <option key={idx} value={loc} className="bg-gray-950 text-white">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dropoff Location */}
            <div className="flex flex-col gap-2">
              <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Dropoff Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 text-gray-400 w-4.5 h-4.5" />
                <select
                  value={dropLoc}
                  onChange={(e) => setDropLoc(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs font-semibold border appearance-none outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                    isDarkMode 
                      ? "bg-gray-950 border-gray-800 text-white" 
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
                >
                  {locations.map((loc, idx) => (
                    <option key={idx} value={loc} className="bg-gray-950 text-white">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pickup & Drop Date inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Pick Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-3 text-gray-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className={`w-full pl-8 pr-2 py-3 rounded-xl text-[10px] font-semibold border outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                      isDarkMode 
                        ? "bg-gray-950 border-gray-800 text-white" 
                        : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Drop Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-3 text-gray-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={dropDate}
                    min={pickupDate || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDropDate(e.target.value)}
                    className={`w-full pl-8 pr-2 py-3 rounded-xl text-[10px] font-semibold border outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                      isDarkMode 
                        ? "bg-gray-950 border-gray-800 text-white" 
                        : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Time selections and Submit */}
            <div className="grid grid-cols-5 gap-2 items-end">
              <div className="col-span-2 flex flex-col gap-2">
                <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Time Slots
                </label>
                <div className="relative">
                  <Clock className="absolute left-2 top-3 text-gray-400 w-3.5 h-3.5 pointer-events-none" />
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className={`w-full pl-6 pr-1 py-3 rounded-xl text-[10px] font-semibold border appearance-none outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                      isDarkMode 
                        ? "bg-gray-950 border-gray-800 text-white" 
                        : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                  >
                    {["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"].map((t) => (
                      <option key={t} value={t} className="bg-gray-950 text-white">{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Find Cars Button */}
              <button
                type="submit"
                className="col-span-3 w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-white bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-rose-500/20 active:scale-95 cursor-pointer"
              >
                <Search className="w-4.5 h-4.5" /> Search Cars
              </button>
            </div>
          </form>

          {/* Quick Info Badges */}
          <div className="mt-6 pt-5 border-t border-gray-800/40 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            <span className="flex items-center gap-1.5 text-gray-400">
              <CheckCircle className="w-4 h-4 text-[var(--primary)]" /> Insured rides
            </span>
            <span className="flex items-center gap-1.5 text-gray-400">
              <CheckCircle className="w-4 h-4 text-[var(--primary)]" /> Zero hidden tariffs
            </span>
            <span className="flex items-center gap-1.5 text-gray-400">
              <CheckCircle className="w-4 h-4 text-[var(--primary)]" /> Free cancellations
            </span>
          </div>
        </motion.div>

        {/* Statistic Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-10 border-t border-gray-800/40">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex items-center gap-4 text-left"
              >
                <div className="p-3 rounded-xl bg-[var(--primary)]/5 text-[var(--primary)] border border-[var(--primary)]/20">
                  <Icon className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono leading-none">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
