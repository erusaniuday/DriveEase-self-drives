import React, { useState } from "react";
import { 
  X, 
  Star, 
  MapPin, 
  ShieldAlert, 
  HelpCircle, 
  ChevronRight, 
  Check, 
  PhoneCall, 
  Heart,
  MessageSquare,
  Wrench,
  Fuel,
  TrendingUp,
  RotateCw
} from "lucide-react";
import { motion } from "motion/react";
import { Car } from "../types";

interface CarDetailsProps {
  car: Car;
  onClose: () => void;
  onBookNow: (car: Car) => void;
  isDarkMode: boolean;
  onAddReview: (carId: string, rating: number, comment: string) => void;
}

export default function CarDetails({
  car,
  onClose,
  onBookNow,
  isDarkMode,
  onAddReview
}: CarDetailsProps) {
  const [activeTab, setActiveTab] = useState<"features" | "specs" | "policies" | "reviews">("features");
  const [spinAngle, setSpinAngle] = useState(0);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");

  const handleSpin = () => {
    setSpinAngle(prev => prev + 45);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    onAddReview(car.id, userRating, userComment);
    setUserComment("");
    alert("Thank you! Your review was successfully submitted and helps others make informed driving decisions.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`w-full max-w-5xl rounded-3xl border overflow-hidden max-h-[92vh] flex flex-col ${
          isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4.5 border-b border-gray-800/40 shrink-0">
          <div>
            <span className="text-[10px] text-[var(--primary)] font-mono uppercase tracking-widest font-bold">{car.brand}</span>
            <h3 className="text-xl font-bold font-serif">{car.name}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Visual Carousel & 360 Spin */}
          <div className="flex flex-col gap-6">
            <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-950 flex items-center justify-center border border-gray-800/40">
              {/* Virtual 360 spinner display */}
              <motion.img
                src={car.image}
                alt={car.name}
                animate={{ rotate: spinAngle }}
                transition={{ type: "spring", stiffness: 100 }}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Controls Overlay */}
              <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                <button
                  onClick={handleSpin}
                  className="px-3.5 py-2 bg-black/75 hover:bg-black/90 backdrop-blur rounded-lg border border-gray-800 text-xs font-semibold flex items-center gap-1.5 text-white cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 animate-spin" /> Spin 360°
                </button>
              </div>

              <div className="absolute top-4 left-4 z-20 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 font-mono text-[9px] uppercase tracking-wider py-1 px-2.5 rounded-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Available
              </div>
            </div>

            {/* Emergency SOS widget & Maintenance */}
            <div className="p-4 rounded-xl border border-red-500/10 bg-red-500/5 flex items-start gap-4">
              <div className="p-3 rounded-lg bg-red-500/15 text-red-400 border border-red-500/25 shrink-0">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-red-300 uppercase tracking-wide">EmergencySOS Support (24/7)</p>
                <p className="text-gray-400 mt-1 leading-normal">
                  Stuck with a puncture, accident, or lock-out? DriveEase offers direct 24/7 towing and mechanical aid in Hyderabad:
                </p>
                <p className="mt-2 text-white font-mono font-bold flex items-center gap-1">
                  <PhoneCall className="w-4 h-4 text-[var(--primary)]" /> +91 79976 34891 / 94930 11105
                </p>
              </div>
            </div>

            {/* Quick specifications breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 border border-gray-800/40 bg-gray-900/30 text-center rounded-xl">
                <p className="text-[10px] uppercase font-mono text-gray-500">Engine Type</p>
                <p className="text-sm font-bold text-white mt-1">{car.specifications?.engine || "1.5L Engine"}</p>
              </div>
              <div className="p-3 border border-gray-800/40 bg-gray-900/30 text-center rounded-xl">
                <p className="text-[10px] uppercase font-mono text-gray-500">Peak Power</p>
                <p className="text-sm font-bold text-white mt-1">{car.specifications?.power || "115 bhp"}</p>
              </div>
              <div className="p-3 border border-gray-800/40 bg-gray-900/30 text-center rounded-xl">
                <p className="text-[10px] uppercase font-mono text-gray-500">Luggage Space</p>
                <p className="text-sm font-bold text-white mt-1">{car.specifications?.luggage || "400 Litres"}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Information Tabs & Policies */}
          <div className="flex flex-col gap-6 text-left">
            {/* Tabs Bar */}
            <div className="flex border-b border-gray-800/40 gap-1 overflow-x-auto">
              {(["features", "specs", "policies", "reviews"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4.5 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all shrink-0 capitalize ${
                    activeTab === tab
                      ? "border-[var(--primary)] text-[var(--primary)]"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content wrappers */}
            <div className="flex-1 min-h-[220px]">
              {/* Tab: Features */}
              {activeTab === "features" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {car.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-800/40 bg-gray-900/10">
                      <div className="w-5 h-5 rounded bg-[var(--primary)]/5 text-[var(--primary)] flex items-center justify-center shrink-0 border border-[var(--primary)]/10">
                        <Check className="w-3.5 h-3.5 text-[var(--primary)]" />
                      </div>
                      <span className="font-semibold text-gray-300">{feat}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab: Specifications Details */}
              {activeTab === "specs" && (
                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-gray-800/20">
                    <span className="text-gray-400 font-medium">Included Kilometers Limit</span>
                    <span className="font-bold text-white">{car.includedKilometers} km included</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-800/20">
                    <span className="text-gray-400 font-medium">Extra Kilometer Charges</span>
                    <span className="font-bold text-[var(--primary)]">₹{car.extraKmCharges} / km thereafter</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-800/20">
                    <span className="text-gray-400 font-medium">Daily Rental Cost</span>
                    <span className="font-bold text-[var(--primary)]">₹{car.dailyPrice} / day</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-800/20">
                    <span className="text-gray-400 font-medium">Hourly Overtime Tariff</span>
                    <span className="font-bold text-[var(--primary)]">₹{car.hourlyPrice} / hour</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-800/20">
                    <span className="text-gray-400 font-medium">Operational Hub</span>
                    <span className="font-semibold text-white">{car.location}</span>
                  </div>
                </div>
              )}

              {/* Tab: Policies */}
              {activeTab === "policies" && (
                <div className="flex flex-col gap-4.5 text-xs text-left leading-relaxed">
                  <div>
                    <h5 className="font-bold text-[var(--primary)] flex items-center gap-1 uppercase tracking-wider">
                      <Fuel className="w-4 h-4 text-[var(--primary)]" /> Fuel Policy
                    </h5>
                    <p className="text-gray-400 mt-1">{car.fuelPolicy}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-[var(--primary)] flex items-center gap-1 uppercase tracking-wider">
                      <ShieldAlert className="w-4 h-4 text-[var(--primary)]" /> Insurance & Liability
                    </h5>
                    <p className="text-gray-400 mt-1">{car.insuranceDetails}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-[var(--primary)] flex items-center gap-1 uppercase tracking-wider">
                      <X className="w-4 h-4 text-[var(--primary)]" /> Cancellation Policy
                    </h5>
                    <p className="text-gray-400 mt-1">{car.cancellationPolicy}</p>
                  </div>
                </div>
              )}

              {/* Tab: Reviews */}
              {activeTab === "reviews" && (
                <div className="flex flex-col gap-6">
                  {/* Reviews scroll wrapper */}
                  <div className="flex flex-col gap-4 max-h-[180px] overflow-y-auto pr-1">
                    {(!car.reviews || car.reviews.length === 0) ? (
                      <p className="text-xs text-gray-500 text-center py-4">No client reviews yet. Be the first to rent and leave feedback!</p>
                    ) : (
                      car.reviews.map((rev: any) => (
                        <div key={rev.id} className="p-3 border border-gray-800/30 rounded-xl bg-gray-900/10 text-left">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-bold text-xs text-[var(--primary)]">{rev.userName}</span>
                            <div className="flex items-center gap-0.5 text-[10px] font-mono text-amber-300">
                              <Star className="w-3 h-3 fill-amber-300" /> {rev.rating}
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 leading-normal italic">"{rev.comment}"</p>
                          <span className="text-[9px] font-mono text-gray-600 block mt-1">{rev.createdAt}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Review form */}
                  <form onSubmit={handleSubmitReview} className="border-t border-gray-800/40 pt-4 flex flex-col gap-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-300">Submit Your Review</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">Rating:</span>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setUserRating(star)}
                            className="p-1 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star className={`w-4 h-4 ${userRating >= star ? "text-[var(--primary)] fill-[var(--primary)]" : "text-gray-600"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Write constructive comment here..."
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        className={`flex-1 px-3 py-2 text-xs rounded-xl border outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                          isDarkMode ? "bg-gray-900/80 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                        }`}
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Check-out Booking Action Bar */}
            <div className="mt-auto border-t border-gray-800/40 pt-5 flex items-center justify-between shrink-0">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total Price starts at</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-[var(--primary)] font-serif">₹{car.dailyPrice}</span>
                  <span className="text-xs text-gray-500">/day</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onBookNow(car)}
                  className="px-8 py-3.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-extrabold rounded-xl text-xs uppercase tracking-widest active:scale-95 hover:opacity-90 transition-all shadow-xl shadow-rose-500/10 cursor-pointer"
                >
                  Book Rented Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
