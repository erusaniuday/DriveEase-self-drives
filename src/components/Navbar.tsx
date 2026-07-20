import React, { useState, useEffect } from "react";
import { 
  Car, 
  User, 
  LogOut, 
  Bell, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  CreditCard, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: any;
  setCurrentUser: (user: any) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  onOpenAuth: (mode: "login" | "register") => void;
  onLogout: () => void;
  notifications: any[];
  onMarkNotificationsRead: () => void;
  theme: string;
  onThemeChange: (theme: string) => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  isDarkMode,
  setIsDarkMode,
  onOpenAuth,
  onLogout,
  notifications,
  onMarkNotificationsRead,
  theme,
  onThemeChange
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "cars", label: "Explore Cars" },
    { id: "pricing", label: "Pricing & Offers" },
    { id: "how-it-works", label: "How It Works" },
    { id: "blogs", label: "Blogs & News" },
    { id: "faqs", label: "FAQs" },
    { id: "contact", label: "Contact Us" }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? isDarkMode
            ? "bg-[#0c0f16]/90 backdrop-blur-md border-b border-gray-800 shadow-lg"
            : "bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg group-hover:scale-105 transition-all">
              <Car className="w-5.5 h-5.5" />
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-bold tracking-tighter uppercase ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] font-serif italic font-extrabold mr-0.5">DRIVE</span>EASE
              </span>
              <span className="text-[8px] tracking-[0.25em] font-light opacity-75 uppercase text-gray-400 -mt-0.5">Self Drive Luxury</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all relative ${
                  activeTab === item.id
                    ? isDarkMode
                      ? "text-[var(--primary)] font-semibold"
                      : "text-[var(--primary)] font-semibold"
                    : isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-800/40"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-[var(--primary)] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Actions & Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Theme Selector */}
            <div className="relative group">
              <button
                className={`p-2.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isDarkMode
                    ? "border-gray-800 bg-gray-900/60 text-gray-300 hover:bg-gray-800"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
                title="Select Visual Palette"
              >
                <span className="w-3 h-3 rounded-full bg-[var(--primary)] shadow-sm shadow-[var(--primary)]/50" />
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Theme</span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-gray-800 bg-gray-950/95 backdrop-blur-md p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-left">
                <p className="text-[9px] font-mono uppercase tracking-widest text-gray-500 p-2 border-b border-gray-800/40 mb-1 font-bold">Luxury Color Palette</p>
                {[
                  { id: "crimson", name: "Electric Crimson", color: "bg-[#e11d48]" },
                  { id: "gold", name: "Royal Gold", color: "bg-[#d4af37]" },
                  { id: "cyan", name: "Nordic Cyan", color: "bg-[#06b6d4]" },
                  { id: "emerald", name: "Emerald Mint", color: "bg-[#10b981]" },
                  { id: "purple", name: "Amethyst", color: "bg-[#8b5cf6]" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onThemeChange(t.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-900 transition-colors cursor-pointer text-left ${
                      theme === t.id ? "text-white bg-gray-900/50" : "text-gray-400"
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${t.color}`} />
                    <span>{t.name}</span>
                    {theme === t.id && (
                      <span className="ml-auto text-[9px] text-[var(--primary)] font-bold uppercase tracking-widest">Active</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-lg border transition-all ${
                isDarkMode
                  ? "border-gray-800 bg-gray-900/60 text-[var(--primary)] hover:bg-gray-800"
                  : "border-gray-200 bg-gray-50 text-[var(--primary)] hover:bg-gray-100"
              }`}
              title="Toggle Dark/Light Mode"
            >
              {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Notification Bell */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotifOpen(!isNotifOpen);
                    if (!isNotifOpen) onMarkNotificationsRead();
                  }}
                  className={`p-2.5 rounded-lg border transition-all relative ${
                    isDarkMode
                      ? "border-gray-800 bg-gray-900/60 text-gray-300 hover:bg-gray-800"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0c0f16]" />
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {isNotifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className={`absolute right-0 mt-3 w-80 rounded-xl shadow-2xl border overflow-hidden z-50 ${
                        isDarkMode
                          ? "bg-[#111622] border-gray-800 text-white"
                          : "bg-white border-gray-200 text-gray-900"
                      }`}
                    >
                      <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? "border-gray-800 bg-gray-900/40" : "border-gray-100 bg-gray-50"}`}>
                        <h4 className="text-sm font-semibold">Notifications</h4>
                        <span className="text-xs font-mono bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-0.5 rounded-full">
                          {unreadCount} Unread
                        </span>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-500 text-xs">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              className={`p-4 border-b text-xs transition-all flex gap-3 ${
                                isDarkMode ? "border-gray-800/50 hover:bg-gray-800/30" : "border-gray-100 hover:bg-gray-50"
                              } ${!n.read ? (isDarkMode ? "bg-[var(--primary)]/5" : "bg-[var(--primary)]/5") : ""}`}
                            >
                              <div className="mt-0.5 text-[var(--primary)]">
                                {n.title.includes("Approved") || n.title.includes("Confirmed") ? (
                                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-[var(--primary)]" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-[13px]">{n.title}</p>
                                <p className={`mt-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{n.message}</p>
                                <span className={`text-[10px] font-mono block mt-1.5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                                  {new Date(n.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* User Session Widget */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                    isDarkMode
                      ? "border-gray-800 bg-gray-900/60 text-white hover:bg-[var(--primary)]/10"
                      : "border-gray-200 bg-gray-50 text-gray-900 hover:bg-[var(--primary)]/5"
                  }`}
                >
                  <img
                    src={currentUser.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-[var(--primary)]"
                  />
                  <div className="text-left">
                    <p className="text-xs font-semibold leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono tracking-wider capitalize leading-tight">
                      {currentUser.role === "admin" ? "Admin Owner" : `Points: ${currentUser.rewardPoints}`}
                    </p>
                  </div>
                </button>
                <button
                  onClick={onLogout}
                  className={`p-2.5 rounded-lg border transition-all hover:text-red-400 ${
                    isDarkMode
                      ? "border-gray-800 bg-gray-900/60 text-gray-400 hover:bg-gray-800"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                  title="Sign Out"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth("login")}
                  className={`px-4.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth("register")}
                  className="px-6 py-2.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-rose-500/10"
                >
                  Book Now
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg border ${
                isDarkMode ? "border-gray-800 text-[var(--primary)]" : "border-gray-200 text-[var(--primary)]"
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg border ${
                isDarkMode ? "border-gray-800 text-white" : "border-gray-200 text-gray-800"
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden border-b overflow-hidden shadow-2xl ${
              isDarkMode ? "bg-[#0d121f] border-gray-800 text-white" : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            <div className="px-4 py-6 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                      : isDarkMode
                      ? "hover:bg-gray-800/40 text-gray-300"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Mobile Theme Selection Row */}
              <div className="pt-4 border-t border-gray-800/40 text-left">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2.5 font-bold">Luxury Theme Palette</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: "crimson", name: "Crimson", color: "bg-[#e11d48]" },
                    { id: "gold", name: "Gold", color: "bg-[#d4af37]" },
                    { id: "cyan", name: "Cyan", color: "bg-[#06b6d4]" },
                    { id: "emerald", name: "Mint", color: "bg-[#10b981]" },
                    { id: "purple", name: "Amethyst", color: "bg-[#8b5cf6]" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onThemeChange(t.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        theme === t.id
                          ? "border-[var(--primary)] bg-[var(--primary)]/10 text-white"
                          : "border-gray-800 bg-gray-900/40 text-gray-400 hover:bg-gray-800"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${t.color}`} />
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 flex flex-col gap-3">
                {currentUser ? (
                  <>
                    <button
                      onClick={() => {
                        setActiveTab("dashboard");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--primary)]/10 text-left transition-all"
                    >
                      <img
                        src={currentUser.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full border border-[var(--primary)]"
                      />
                      <div>
                        <p className="text-xs font-semibold">{currentUser.name}</p>
                        <p className="text-[10px] text-gray-400">Wallet: ₹{currentUser.balance}</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all text-center flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4.5 h-4.5" /> Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        onOpenAuth("login");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full py-3 rounded-xl text-sm font-semibold border transition-all text-center ${
                        isDarkMode ? "border-gray-800 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        onOpenAuth("register");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-3 rounded-xl text-sm font-semibold bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white text-center shadow-lg"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
