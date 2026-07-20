import React, { useState, useEffect } from "react";
import { 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Zap, 
  ShieldCheck, 
  Star, 
  SlidersHorizontal,
  ChevronRight,
  Sun,
  Moon,
  MessageCircle,
  Clock,
  Car
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Custom components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CarListing from "./components/CarListing";
import CarDetails from "./components/CarDetails";
import BookingSystem from "./components/BookingSystem";
import Dashboards from "./components/Dashboards";
import AuthPages from "./components/AuthPages";
import AIConcierge from "./components/AIConcierge";
import SupportHub from "./components/SupportHub";
import { Car as CarType } from "./types";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [theme, setTheme] = useState<string>("crimson");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [searchParams, setSearchParams] = useState<any>(null);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [token, setToken] = useState<string>("");
  const [notifications, setNotifications] = useState<any[]>([]);

  // UI Selection states
  const [selectedCarForDetails, setSelectedCarForDetails] = useState<CarType | null>(null);
  const [selectedCarForBooking, setSelectedCarForBooking] = useState<CarType | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load state from local storage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("driveease_token");
    const savedUser = localStorage.getItem("driveease_user");
    const savedFavorites = localStorage.getItem("driveease_favorites");
    const savedTheme = localStorage.getItem("driveease_theme") || "crimson";

    if (savedToken && savedUser) {
      setToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("driveease_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Fetch notifications
  useEffect(() => {
    if (token) {
      fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setNotifications(data))
        .catch(err => console.error(err));
    } else {
      setNotifications([]);
    }
  }, [currentUser, token]);

  const handleMarkNotificationsRead = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/notifications/read", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Sync favorites
  const handleToggleFavorite = (carId: string) => {
    setFavorites(prev => {
      const updated = prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : [...prev, carId];
      localStorage.setItem("driveease_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const handleAuthSuccess = (user: any, jwtToken: string) => {
    setCurrentUser(user);
    setToken(jwtToken);
    localStorage.setItem("driveease_token", jwtToken);
    localStorage.setItem("driveease_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken("");
    localStorage.removeItem("driveease_token");
    localStorage.removeItem("driveease_user");
    setActiveTab("home");
  };

  const handleRefreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
        localStorage.setItem("driveease_user", JSON.stringify(data));
      }
    } catch (err) {
      console.error("Error refreshing user context:", err);
    }
  };

  const handleBookCarTrigger = (car: CarType) => {
    if (!currentUser) {
      setShowAuthModal(true);
    } else {
      setSelectedCarForBooking(car);
      setSelectedCarForDetails(null);
    }
  };

  const handleBookingSuccess = (booking: any) => {
    handleRefreshUser();
    // After short delay, let's take user to their bookings page inside the dashboard tab
    setTimeout(() => {
      setSelectedCarForBooking(null);
      setActiveTab("dashboard");
    }, 4000);
  };

  // Add review dynamically on server
  const handleAddReview = async (carId: string, rating: number, comment: string) => {
    try {
      const res = await fetch(`/api/cars/${carId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });
      if (res.ok) {
        // Refresh detail view
        const updatedCarRes = await fetch(`/api/cars`);
        const updatedCars = await updatedCarRes.json();
        const found = updatedCars.find((c: CarType) => c.id === carId);
        if (found) {
          setSelectedCarForDetails(found);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`min-h-screen relative flex flex-col justify-between transition-colors duration-300 ${
      isDarkMode ? "bg-[#050505] text-gray-100 font-sans selection:bg-[var(--primary)]/30 selection:text-white" : "bg-gray-50 text-gray-900 font-sans"
    }`}>
      
      {/* Dynamic Background Gradients */}
      {isDarkMode ? (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-[var(--primary)]/5 blur-[140px]" />
          <div className="absolute bottom-1/4 left-0 w-[35rem] h-[35rem] rounded-full bg-[var(--secondary)]/3 blur-[130px]" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-indigo-100/40 blur-[130px]" />
          <div className="absolute bottom-1/4 left-0 w-[35rem] h-[35rem] rounded-full bg-purple-50/30 blur-[120px]" />
        </div>
      )}

      {/* Main Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedCarForBooking(null);
        }}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenAuth={(mode) => setShowAuthModal(true)}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        theme={theme}
        onThemeChange={handleThemeChange}
      />

      {/* Primary body screen manager */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          {selectedCarForBooking ? (
            <motion.div
              key="booking"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <BookingSystem
                car={selectedCarForBooking}
                currentUser={currentUser}
                onBack={() => setSelectedCarForBooking(null)}
                isDarkMode={isDarkMode}
                onBookingSuccess={handleBookingSuccess}
                token={token}
              />
            </motion.div>
          ) : (
            <div className="w-full">
              {/* Home / Hero Screen */}
              {activeTab === "home" && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Hero 
                    setActiveTab={setActiveTab} 
                    isDarkMode={isDarkMode} 
                    onSearchCars={(criteria) => setSearchParams(criteria)}
                  />
                </motion.div>
              )}

              {/* Vehicle Listings Screen */}
              {activeTab === "cars" && (
                <motion.div
                  key="cars"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CarListing
                    isDarkMode={isDarkMode}
                    onBookCar={handleBookCarTrigger}
                    onViewDetails={(car) => setSelectedCarForDetails(car)}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                  />
                </motion.div>
              )}

              {/* How it works, support & FAQs screen */}
              {activeTab === "how-it-works" && (
                <motion.div
                  key="how-it-works"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SupportHub isDarkMode={isDarkMode} setActiveTab={setActiveTab} />
                </motion.div>
              )}

              {/* Dashboard page */}
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Dashboards
                    currentUser={currentUser}
                    token={token}
                    isDarkMode={isDarkMode}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onRentCar={(car) => {
                      if (car) handleBookCarTrigger(car);
                      else setActiveTab("cars");
                    }}
                    onRefreshUser={handleRefreshUser}
                  />
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Dedicated Global Interactive Modals */}

      {/* 1. Quick View Details Modal */}
      <AnimatePresence>
        {selectedCarForDetails && (
          <CarDetails
            car={selectedCarForDetails}
            onClose={() => setSelectedCarForDetails(null)}
            onBookNow={handleBookCarTrigger}
            isDarkMode={isDarkMode}
            onAddReview={handleAddReview}
          />
        )}
      </AnimatePresence>

      {/* 2. Login/Register/OTP Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthPages
            onClose={() => setShowAuthModal(false)}
            isDarkMode={isDarkMode}
            onAuthSuccess={handleAuthSuccess}
          />
        )}
      </AnimatePresence>

      {/* 3. Floating 24/7 AI Concierge Bot */}
      <AIConcierge isDarkMode={isDarkMode} />

      {/* WhatsApp Booking Floating Pill */}
      <div className="fixed bottom-6 left-6 z-40">
        <a
          href="https://wa.me/917997634891?text=Hi%20DriveEase!%20I'm%20interested%20in%20booking%20a%20premium%20self-drive%20car%20in%20Hyderabad."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4.5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-2xl hover:shadow-emerald-500/30 transition-all cursor-pointer select-none"
        >
          <MessageCircle className="w-5 h-5 fill-white" /> WhatsApp Renting
        </a>
      </div>

      {/* High-quality styled footer */}
      <footer className={`border-t py-12 text-left relative z-10 ${
        isDarkMode ? "border-gray-800 bg-[#060a13]" : "border-gray-200 bg-white"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[var(--primary)] text-white rounded-xl">
                <Car className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base uppercase tracking-wider text-white">DriveEase</span>
            </div>
            <p className="text-xs text-gray-400 mt-4 leading-relaxed">
              Hyderabad's premium self-drive luxury car rentals. Drive your absolute freedom. No limits, no hassles.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] font-mono">Platform Hubs</h4>
            <ul className="mt-4 space-y-2 text-xs text-gray-400 font-semibold">
              <li>&bull; Hyderabad Airport (RGIA)</li>
              <li>&bull; Madhapur (Hitech City)</li>
              <li>&bull; Gachibowli</li>
              <li>&bull; Jubilee Hills / Banjara Hills</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] font-mono">Support Contact</h4>
            <ul className="mt-4 space-y-2 text-xs text-gray-400 font-mono">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-500" /> +91 7997634891
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-500" /> +91 9493011105
              </li>
              <li className="flex items-center gap-2 text-xs">
                <Mail className="w-3.5 h-3.5 text-[var(--primary)]" /> erusaniuday@gmail.com
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] font-mono">Emergency Alert</h4>
            <p className="text-xs text-gray-400 mt-4 leading-relaxed">
              Our support team operates 24/7 across Hyderabad for immediate towing, puncture care, and vehicle swap guarantees.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-gray-800/40 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} DriveEase Self Drive Cars Hyderabad. All rights reserved. Registered office: Hyderabad, Telangana.</p>
        </div>
      </footer>
    </div>
  );
}
