import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard, 
  CheckCircle, 
  X, 
  Gift, 
  Loader2, 
  Download, 
  Percent, 
  ShieldCheck, 
  Wallet,
  PhoneCall
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Car } from "../types";

interface BookingSystemProps {
  car: Car;
  currentUser: any;
  onBack: () => void;
  isDarkMode: boolean;
  onBookingSuccess: (bookingData: any) => void;
  token: string;
}

export default function BookingSystem({
  car,
  currentUser,
  onBack,
  isDarkMode,
  onBookingSuccess,
  token
}: BookingSystemProps) {
  const [pickupLoc, setPickupLoc] = useState(car.location);
  const [dropLoc, setDropLoc] = useState(car.location);
  const [pickupDate, setPickupDate] = useState("");
  const [dropDate, setDropDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropTime, setDropTime] = useState("18:00");

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponSuccess, setCouponSuccess] = useState("");
  const [couponError, setCouponError] = useState("");

  const [driverName, setDriverName] = useState(currentUser?.name || "");
  const [licenseNumber, setLicenseNumber] = useState(currentUser?.licenseNumber || "");
  const [driverAge, setDriverAge] = useState("24");

  const [insuranceType, setInsuranceType] = useState<"basic" | "standard" | "premium">("standard");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [submitting, setSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<any | null>(null);

  const locations = [
    "Hyderabad Airport (RGIA)",
    "Madhapur (Hitech City)",
    "Gachibowli",
    "Banjara Hills",
    "Jubilee Hills",
    "Kukatpally",
    "Secunderabad Station"
  ];

  // Calculate rental duration
  const getRentDays = () => {
    if (!pickupDate || !dropDate) return 1;
    const s = new Date(pickupDate);
    const e = new Date(dropDate);
    const diff = e.getTime() - s.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days <= 0 ? 1 : days;
  };

  const daysCount = getRentDays();
  const basePrice = car.dailyPrice * daysCount;
  const securityDeposit = car.seats === 7 || car.type === "Luxury" ? 5000 : 3000;
  
  // Insurance costs
  const insurancePrice = insuranceType === "basic" ? 0 : insuranceType === "standard" ? 350 * daysCount : 700 * daysCount;
  const subtotal = basePrice + insurancePrice;
  const discountAmount = Math.floor(subtotal * (discountPercent / 100));
  const tax = Math.floor((subtotal - discountAmount) * 0.18); // 18% GST
  const totalAmount = subtotal - discountAmount + tax + securityDeposit;

  const handleValidateCoupon = async () => {
    setCouponError("");
    setCouponSuccess("");
    if (!couponCode.trim()) return;

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, amount: basePrice })
      });
      const data = await res.json();
      if (res.ok) {
        setDiscountPercent(data.discountPercent);
        setCouponSuccess(`Coupon approved! flat ${data.discountPercent}% OFF`);
      } else {
        setCouponError(data.error || "Invalid coupon code");
        setDiscountPercent(0);
      }
    } catch (err) {
      setCouponError("Failed to validate coupon");
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login first to confirm your self-drive booking.");
      return;
    }
    if (!pickupDate || !dropDate) {
      alert("Please select both pickup and drop off dates.");
      return;
    }
    if (!licenseNumber) {
      alert("Please provide a valid Indian Driving License number.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        carId: car.id,
        pickupLocation: pickupLoc,
        dropLocation: dropLoc,
        pickupDate,
        dropDate,
        pickupTime,
        dropTime,
        couponCode: couponCode || undefined,
        insuranceType,
        driverDetails: {
          name: driverName,
          licenseNumber,
          age: Number(driverAge)
        },
        charges: {
          basePrice,
          securityDeposit,
          tax,
          discount: discountAmount,
          totalAmount
        }
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const confirmed = await res.json();
        setBookingConfirmed(confirmed);
        onBookingSuccess(confirmed);
      } else {
        const err = await res.json();
        alert(err.error || "Booking failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Booking system encountered an error. Check server logs.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  // Render receipt ticket when booking is completed successfully
  if (bookingConfirmed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-28 relative z-10 text-left">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`rounded-3xl border p-6 sm:p-10 shadow-2xl relative overflow-hidden ${
            isDarkMode ? "bg-gray-900/90 border-gray-800 text-white" : "bg-white border-gray-200 text-gray-900"
          }`}
        >
          {/* Confetti element */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500 animate-pulse" />

          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 flex items-center justify-center mb-4">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Booking Confirmed!</h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1.5 max-w-sm">
              Your luxury self-drive ride is locked in. Our team has dispatched the invoice and security instructions to you.
            </p>
          </div>

          {/* Ticket layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-gray-800/40 py-8 mb-8 text-xs font-medium">
            <div className="space-y-4">
              <h4 className="text-indigo-400 font-bold uppercase tracking-wider text-[11px] font-mono">Trip Schedules</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 font-normal">PICKUP HUB</p>
                  <p className="text-[13px] font-bold mt-1 text-white">{bookingConfirmed.pickupLocation}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-normal">DROP HUB</p>
                  <p className="text-[13px] font-bold mt-1 text-white">{bookingConfirmed.dropLocation}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-normal">PICK DATE</p>
                  <p className="text-[13px] font-bold mt-1 text-white">{bookingConfirmed.pickupDate} ({bookingConfirmed.pickupTime})</p>
                </div>
                <div>
                  <p className="text-gray-400 font-normal">DROP DATE</p>
                  <p className="text-[13px] font-bold mt-1 text-white">{bookingConfirmed.dropDate} ({bookingConfirmed.dropTime})</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800/30">
                <h4 className="text-indigo-400 font-bold uppercase tracking-wider text-[11px] font-mono mb-2">Driver Registered</h4>
                <p className="text-gray-300">Name: <span className="text-white font-bold">{bookingConfirmed.driverDetails.name}</span></p>
                <p className="text-gray-300 mt-1">Driving License: <span className="text-white font-bold font-mono">{bookingConfirmed.driverDetails.licenseNumber}</span></p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gray-950 border border-gray-800/40 space-y-3 font-mono">
              <h4 className="text-indigo-400 font-bold uppercase tracking-wider text-[11px] mb-2 font-sans">Payment Receipt</h4>
              <div className="flex justify-between">
                <span className="text-gray-400">Base Fare ({daysCount} days)</span>
                <span>₹{bookingConfirmed.charges.basePrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Taxes (18% GST)</span>
                <span>₹{bookingConfirmed.charges.tax}</span>
              </div>
              {bookingConfirmed.charges.discount > 0 && (
                <div className="flex justify-between text-indigo-400">
                  <span>Coupon Discount</span>
                  <span>-₹{bookingConfirmed.charges.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-yellow-500 pb-2 border-b border-gray-800/50">
                <span>Security Deposit (Refundable)</span>
                <span>₹{bookingConfirmed.charges.securityDeposit}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-emerald-400 pt-1.5">
                <span>Total Charge Paid</span>
                <span>₹{bookingConfirmed.charges.totalAmount}</span>
              </div>
              <p className="text-[9px] text-gray-500 font-sans mt-3 text-center leading-normal">
                *The security deposit of ₹{bookingConfirmed.charges.securityDeposit} is instantly credited back to your original source upon clean check-out return.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-left">
              <p className="text-xs text-gray-400">Order ID: <span className="text-white font-mono font-bold">{bookingConfirmed.id}</span></p>
              <p className="text-[10px] text-gray-500 mt-0.5">Date: {new Date(bookingConfirmed.createdAt).toLocaleString()}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrintInvoice}
                className="px-5 py-3 border border-gray-800 bg-gray-900/40 text-gray-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[var(--primary)]" /> Download PDF
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-rose-500/10 cursor-pointer"
              >
                Go Back Home
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-28 relative z-10 text-left">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Go Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Check-out Booking Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmitBooking} className="space-y-6">
            {/* Trip details card */}
            <div className={`p-6 sm:p-8 rounded-2xl border ${isDarkMode ? "bg-gray-900/40 border-gray-800" : "bg-white border-gray-200"}`}>
              <h3 className="text-base font-bold uppercase tracking-widest text-[var(--primary)] mb-6 font-mono">1. Pickup & Return Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                {/* Pickup Location */}
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-gray-400 uppercase tracking-wider">Pickup Location Hub</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 text-gray-400 w-4 h-4" />
                    <select
                      value={pickupLoc}
                      onChange={(e) => setPickupLoc(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold border appearance-none outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                        isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                    >
                      {locations.map((l, i) => (
                        <option key={i} value={l} className="bg-gray-950 text-white">{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Drop Location */}
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-gray-400 uppercase tracking-wider">Return Location Hub</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 text-gray-400 w-4 h-4" />
                    <select
                      value={dropLoc}
                      onChange={(e) => setDropLoc(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold border appearance-none outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                        isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                    >
                      {locations.map((l, i) => (
                        <option key={i} value={l} className="bg-gray-950 text-white">{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pickup Date */}
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-gray-400 uppercase tracking-wider">Pickup Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-400 w-4 h-4 pointer-events-none" />
                    <input
                      type="date"
                      required
                      value={pickupDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold border outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                        isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                    />
                  </div>
                </div>

                {/* Drop Date */}
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-gray-400 uppercase tracking-wider">Return Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-400 w-4 h-4 pointer-events-none" />
                    <input
                      type="date"
                      required
                      value={dropDate}
                      min={pickupDate || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setDropDate(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold border outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                        isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Driver KYC registration details card */}
            <div className={`p-6 sm:p-8 rounded-2xl border ${isDarkMode ? "bg-gray-900/40 border-gray-800" : "bg-white border-gray-200"}`}>
              <h3 className="text-base font-bold uppercase tracking-wider text-rose-400 mb-6 font-mono">2. Driver KYC Profile</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
                {/* Full name */}
                <div className="sm:col-span-1 flex flex-col gap-2">
                  <label className="font-bold text-gray-400 uppercase tracking-wider">Renter Full Name</label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-semibold border outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                      isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                  />
                </div>

                {/* Driving License */}
                <div className="sm:col-span-1 flex flex-col gap-2">
                  <label className="font-bold text-gray-400 uppercase tracking-wider">Indian License No (KYC)</label>
                  <input
                    type="text"
                    required
                    placeholder="TS09202XXXXXXXX"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-semibold border outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                      isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                  />
                </div>

                {/* Driver Age */}
                <div className="sm:col-span-1 flex flex-col gap-2">
                  <label className="font-bold text-gray-400 uppercase tracking-wider">Driver Age (Must be &ge;21)</label>
                  <input
                    type="number"
                    required
                    min="21"
                    max="80"
                    value={driverAge}
                    onChange={(e) => setDriverAge(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-semibold border outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                      isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Insurance details */}
            <div className={`p-6 sm:p-8 rounded-2xl border ${isDarkMode ? "bg-gray-900/40 border-gray-800" : "bg-white border-gray-200"}`}>
              <h3 className="text-base font-bold uppercase tracking-wider text-rose-400 mb-6 font-mono">3. Damage Collision Insurance</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Basic */}
                <label className={`p-4 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all text-left ${
                  insuranceType === "basic" 
                    ? "border-[var(--primary)] bg-[var(--primary)]/5 text-white" 
                    : "border-gray-800 text-gray-400 hover:bg-gray-900/20"
                }`}>
                  <input
                    type="radio"
                    name="insurance"
                    checked={insuranceType === "basic"}
                    onChange={() => setInsuranceType("basic")}
                    className="sr-only"
                  />
                  <span className="font-bold text-sm text-white">Basic Policy</span>
                  <span className="text-[10px]">Zero extra cost. Accident liability capped up to ₹10,000.</span>
                  <span className="font-bold text-emerald-400 mt-2">₹0 / Free</span>
                </label>

                {/* Standard */}
                <label className={`p-4 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all text-left ${
                  insuranceType === "standard" 
                    ? "border-[var(--primary)] bg-[var(--primary)]/5 text-white" 
                    : "border-gray-800 text-gray-400 hover:bg-gray-900/20"
                }`}>
                  <input
                    type="radio"
                    name="insurance"
                    checked={insuranceType === "standard"}
                    onChange={() => setInsuranceType("standard")}
                    className="sr-only"
                  />
                  <span className="font-bold text-sm text-white flex items-center gap-1">
                    Standard <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  </span>
                  <span className="text-[10px]">Accident liability capped up to ₹2,500. Roadside towing support included.</span>
                  <span className="font-bold text-emerald-400 mt-2">₹350 / day</span>
                </label>

                {/* Premium */}
                <label className={`p-4 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all text-left ${
                  insuranceType === "premium" 
                    ? "border-[var(--primary)] bg-[var(--primary)]/5 text-white" 
                    : "border-gray-800 text-gray-400 hover:bg-gray-900/20"
                }`}>
                  <input
                    type="radio"
                    name="insurance"
                    checked={insuranceType === "premium"}
                    onChange={() => setInsuranceType("premium")}
                    className="sr-only"
                  />
                  <span className="font-bold text-sm text-white flex items-center gap-1">
                    Premium VIP <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  </span>
                  <span className="text-[10px]">100% Cashless Zero-Deductible waiver. covers windshield, tyres, body scratch.</span>
                  <span className="font-bold text-emerald-400 mt-2">₹700 / day</span>
                </label>
              </div>
            </div>

            {/* Payment selections card */}
            <div className={`p-6 sm:p-8 rounded-2xl border ${isDarkMode ? "bg-gray-900/40 border-gray-800" : "bg-white border-gray-200"}`}>
              <h3 className="text-base font-bold uppercase tracking-wider text-rose-400 mb-6 font-mono">4. Secure Checkout Gate</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {["UPI", "Credit Card", "Net Banking", "Wallet"].map((method) => (
                  <label
                    key={method}
                    className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all text-sm font-semibold ${
                      paymentMethod === method
                        ? "border-[var(--primary)] bg-[var(--primary)]/10 text-white"
                        : "border-gray-800 text-gray-400 hover:bg-gray-900/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="sr-only"
                    />
                    {method === "Wallet" ? <Wallet className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                    {method}
                  </label>
                ))}
              </div>

              {paymentMethod === "Wallet" && currentUser && (
                <div className="mt-4 p-3.5 rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/15 text-xs flex justify-between items-center text-left">
                  <div>
                    <span className="text-gray-400 block">Your Current Wallet Balance</span>
                    <span className="text-sm font-bold text-white font-mono">₹{currentUser.balance}</span>
                  </div>
                  {currentUser.balance < totalAmount ? (
                    <span className="text-[10px] text-red-400 font-bold uppercase">Insufficient balance</span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">Balance sufficient</span>
                  )}
                </div>
              )}
            </div>

            {/* Final Booking Button */}
            <button
              type="submit"
              disabled={submitting || (paymentMethod === "Wallet" && currentUser && currentUser.balance < totalAmount)}
              className="w-full py-4.5 rounded-2xl font-extrabold text-xs uppercase tracking-widest text-white bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-rose-500/15 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Transacting Secure Gateway...
                </>
              ) : (
                `PAY AND CONFIRM BOOKING (₹${totalAmount})`
              )}
            </button>
          </form>
        </div>

        {/* Checkout Summary Block */}
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border sticky top-24 ${isDarkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"}`}>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 font-mono">Selected Vehicle</h4>
            
            <div className="flex gap-4 pb-4 border-b border-gray-800/40">
              <img src={car.image} className="w-24 h-16 rounded-lg object-cover border border-gray-800" alt={car.name} />
              <div className="text-left">
                <span className="text-[9px] uppercase font-mono text-[var(--primary)] font-bold">{car.brand}</span>
                <p className="font-bold text-white leading-tight text-sm">{car.name}</p>
                <span className="text-[10px] text-gray-400 font-mono mt-1 block">Daily Rate: ₹{car.dailyPrice}</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="py-5 border-b border-gray-800/40 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block font-mono">Promo Coupon Code</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Gift className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Try: DRIVEEASE"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className={`w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border outline-none ${
                      isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleValidateCoupon}
                  className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl text-xs font-extrabold cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponSuccess && <p className="text-[11px] text-rose-400 font-semibold mt-2">{couponSuccess}</p>}
              {couponError && <p className="text-[11px] text-red-400 font-semibold mt-2">{couponError}</p>}
            </div>

            {/* Fare Breakdown Sheet */}
            <div className="py-5 space-y-3 font-mono text-xs text-left">
              <div className="flex justify-between">
                <span className="text-gray-400">Daily Charge ({daysCount} days)</span>
                <span className="text-white">₹{basePrice}</span>
              </div>
              {insurancePrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Collision Insurance</span>
                  <span className="text-white">₹{insurancePrice}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-[var(--primary)] font-semibold">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3 h-3" /> Coupon Applied
                  </span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between pb-3 border-b border-gray-800/40">
                <span className="text-gray-400">Taxes (18% GST)</span>
                <span className="text-white">₹{tax}</span>
              </div>
              <div className="flex justify-between text-yellow-500 py-1.5 font-bold">
                <span>Security Deposit (Refundable)</span>
                <span>₹{securityDeposit}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[var(--primary)] pt-3 border-t border-gray-800/40">
                <span className="font-sans">Payable amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            {/* Help Callout */}
            <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-800/40 text-[11px] text-left leading-normal text-gray-400">
              <p className="font-bold text-gray-300">Hyderabad Local Booking Help:</p>
              <p className="mt-1">For customized corporate itineraries or wedding self-drive fleets, call:</p>
              <span className="text-[var(--primary)] font-bold block mt-1">+91 79976 34891</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
