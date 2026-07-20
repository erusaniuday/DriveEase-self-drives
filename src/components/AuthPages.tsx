import React, { useState } from "react";
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ShieldCheck, 
  Loader2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Zap, 
  CheckCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthPagesProps {
  onClose: () => void;
  isDarkMode: boolean;
  onAuthSuccess: (user: any, token: string) => void;
}

export default function AuthPages({ onClose, isDarkMode, onAuthSuccess }: AuthPagesProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [isOtpFlow, setIsOtpFlow] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSentValue, setOtpSentValue] = useState(""); // Simulated OTP

  // Register Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegister 
      ? { name, email, password, phone }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        onAuthSuccess(data.user, data.token);
        onClose();
      } else {
        setErrorMsg(data.error || "Authentication failed.");
      }
    } catch (err) {
      setErrorMsg("Unable to contact verification servers. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setErrorMsg("Please enter a valid 10-digit phone number.");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      // Simulate generating and sending OTP code
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setOtpSentValue(code);
      setOtpSent(true);
      setLoading(false);
      alert(`[DriveEase OTP Secure Notification] Your 4-digit OTP is: ${code}`);
    }, 1200);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== otpSentValue) {
      setErrorMsg("Incorrect OTP code. Please enter the code from the notification.");
      return;
    }

    setLoading(true);
    try {
      // Simulating successful login using admin/regular mockup credential
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "renter@driveease.com", password: "password123" }) // Use mock template account
      });
      const data = await response.json();
      if (response.ok) {
        onAuthSuccess(data.user, data.token);
        onClose();
      } else {
        setErrorMsg("Failed to authenticate OTP session.");
      }
    } catch (err) {
      setErrorMsg("Failed to contact auth servers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`w-full max-w-md rounded-3xl border overflow-hidden p-6 sm:p-8 relative ${
          isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>

        {/* Heading */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] font-mono text-[10px] mb-3 uppercase tracking-wider font-bold">
            <Zap className="w-3 h-3 text-[var(--primary)]" /> Secure Gate
          </div>
          <h3 className="text-xl font-bold tracking-tight font-serif text-[var(--primary)]">
            {isOtpFlow ? "OTP Instant Login" : isRegister ? "Create Renter Profile" : "Renter Secure Login"}
          </h3>
          <p className="text-xs text-gray-400 mt-1">Drive Your Freedom with DriveEase</p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-400 text-left">
            {errorMsg}
          </div>
        )}

        {/* OTP Flow */}
        {isOtpFlow ? (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4 text-left text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-400">Indian Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 text-gray-500 w-4 h-4" />
                    <input
                      type="tel"
                      required
                      placeholder="Enter 10-digit Mobile (e.g. 7997634891)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold border outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                        isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-rose-500/10 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send SMS Verification OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-left text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-400">Enter 4-Digit Verification OTP</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3.5 top-3.5 text-gray-500 w-4 h-4" />
                    <input
                      type="text"
                      maxLength={4}
                      required
                      placeholder="XXXX"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold border outline-none focus:ring-2 focus:ring-[var(--primary)] font-mono tracking-widest text-center ${
                        isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-rose-500/10 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify and Login"}
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setIsOtpFlow(false);
                setOtpSent(false);
                setErrorMsg("");
              }}
              className="w-full py-2.5 border border-gray-800 text-gray-400 rounded-xl text-xs font-bold hover:text-white"
            >
              Back to Email Login
            </button>
          </div>
        ) : (
          /* Email / Password Form */
          <form onSubmit={handleEmailAuth} className="space-y-4 text-left text-xs">
            {isRegister && (
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Uday Erusani"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold border outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                      isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-gray-500 w-4 h-4" />
                <input
                  type="email"
                  required
                  placeholder="renter@driveease.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold border outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                    isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-gray-500 w-4 h-4" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm font-semibold border outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                    isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-400">Contact Mobile</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 text-gray-500 w-4 h-4" />
                  <input
                    type="tel"
                    required
                    placeholder="9493011105"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold border outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                      isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-rose-500/10 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isRegister ? "Create Profile Profile" : "Authenticate Renter"}
            </button>

            {/* Quick Demo Logins */}
            {!isRegister && (
              <div className="mt-4 p-3.5 rounded-2xl bg-gray-900/45 border border-gray-800/60 text-left space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold">Quick Demo Accounts</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("admin@driveease.in");
                      setPassword("AdminPassword123");
                    }}
                    className="flex-1 py-1.5 px-2 bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/20 rounded-lg text-[10px] font-bold text-white transition-colors cursor-pointer text-center"
                  >
                    Demo Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("renter@driveease.com");
                      setPassword("password123");
                    }}
                    className="flex-1 py-1.5 px-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-[10px] font-bold text-gray-300 transition-colors cursor-pointer text-center"
                  >
                    Demo Renter
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* Footer toggles */}
        <div className="mt-6 pt-5 border-t border-gray-800/40 text-center text-xs space-y-3.5 text-gray-400">
          {!isOtpFlow && (
            <button
              onClick={() => {
                setIsOtpFlow(true);
                setErrorMsg("");
              }}
              className="text-[var(--primary)] font-bold hover:underline block mx-auto cursor-pointer"
            >
              ⚡ Click for Passwordless OTP Login
            </button>
          )}

          <div>
            {isRegister ? (
              <p>
                Already have an account?{" "}
                <button onClick={() => setIsRegister(false)} className="text-[var(--primary)] font-bold hover:underline cursor-pointer">
                  Login Securely
                </button>
              </p>
            ) : (
              <p>
                New to DriveEase?{" "}
                <button onClick={() => setIsRegister(true)} className="text-[var(--primary)] font-bold hover:underline cursor-pointer">
                  Register Account
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
