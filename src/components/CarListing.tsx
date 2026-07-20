import React, { useState, useEffect } from "react";
import { 
  Heart, 
  MapPin, 
  Gauge, 
  Briefcase, 
  Filter, 
  ChevronDown, 
  Grid, 
  SlidersHorizontal, 
  Eye, 
  Compass, 
  Users, 
  Check, 
  Star, 
  Flame, 
  Sparkles, 
  BadgePercent, 
  Wrench, 
  Calendar,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Car, CarType, FuelType, Transmission } from "../types";

interface CarListingProps {
  isDarkMode: boolean;
  onBookCar: (car: Car) => void;
  onViewDetails: (car: Car) => void;
  favorites: string[];
  onToggleFavorite: (carId: string) => void;
  searchParams: any;
  setSearchParams: (params: any) => void;
}

export default function CarListing({
  isDarkMode,
  onBookCar,
  onViewDetails,
  favorites,
  onToggleFavorite,
  searchParams,
  setSearchParams
}: CarListingProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Local filter states
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [compareList, setCompareList] = useState<Car[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Fetch cars with filters from API
  useEffect(() => {
    const fetchFilteredCars = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedTypes.length > 0) queryParams.append("type", selectedTypes.join(","));
        if (selectedFuels.length > 0) queryParams.append("fuel", selectedFuels.join(","));
        if (selectedTransmissions.length > 0) queryParams.append("transmission", selectedTransmissions.join(","));
        if (selectedSeats.length > 0) queryParams.append("seats", selectedSeats.join(","));
        if (maxPrice < 10000) queryParams.append("maxPrice", maxPrice.toString());
        if (searchQuery) queryParams.append("search", searchQuery);
        if (sortBy) queryParams.append("sort", sortBy);
        if (selectedLocation) queryParams.append("location", selectedLocation);
        
        // If there are pickup search params from Hero
        if (searchParams?.pickupLocation) {
          queryParams.append("location", searchParams.pickupLocation);
        }

        const res = await fetch(`/api/cars?${queryParams.toString()}`);
        const data = await res.json();
        setCars(data);
      } catch (err) {
        console.error("Error fetching cars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredCars();
  }, [
    selectedTypes, 
    selectedFuels, 
    selectedTransmissions, 
    selectedSeats, 
    maxPrice, 
    searchQuery, 
    sortBy, 
    selectedLocation,
    searchParams
  ]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleFuel = (fuel: string) => {
    setSelectedFuels(prev => 
      prev.includes(fuel) ? prev.filter(f => f !== fuel) : [...prev, fuel]
    );
  };

  const toggleTransmission = (trans: string) => {
    setSelectedTransmissions(prev => 
      prev.includes(trans) ? prev.filter(t => t !== trans) : [...prev, trans]
    );
  };

  const toggleSeat = (seat: number) => {
    setSelectedSeats(prev => 
      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
    );
  };

  const resetFilters = () => {
    setSelectedTypes([]);
    setSelectedFuels([]);
    setSelectedTransmissions([]);
    setSelectedSeats([]);
    setMaxPrice(10000);
    setSearchQuery("");
    setSelectedLocation("");
    setSortBy("popularity");
    setSearchParams(null); // Clear hero widget search criteria
  };

  const handleToggleCompare = (car: Car) => {
    setCompareList(prev => {
      const exists = prev.find(c => c.id === car.id);
      if (exists) {
        return prev.filter(c => c.id !== car.id);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 cars at a time.");
        return prev;
      }
      return [...prev, car];
    });
  };

  const carTypesList = Object.values(CarType);
  const fuelList = Object.values(FuelType);
  const transmissionList = Object.values(Transmission);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 relative z-10 text-left">
      {/* Compare list widget overlay */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl border p-4 rounded-2xl shadow-2xl z-50 flex items-center justify-between gap-4 glass-panel ${
              isDarkMode ? "bg-gray-950/95 border-gray-800" : "bg-white/95 border-gray-200 text-gray-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[var(--primary)] shrink-0" />
              <div>
                <p className="text-sm font-bold">Compare Cars ({compareList.length}/3)</p>
                <div className="flex gap-2 mt-1.5">
                  {compareList.map(c => (
                    <div key={c.id} className="relative group">
                      <img src={c.image} className="w-12 h-8 rounded object-cover border border-gray-700" alt="" />
                      <button 
                        onClick={() => handleToggleCompare(c)}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCompareOpen(true)}
                className="px-4 py-2 text-xs font-bold bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-lg"
              >
                Compare Now
              </button>
              <button
                onClick={() => setCompareList([])}
                className="p-2 text-xs text-gray-400 hover:text-white"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {isCompareOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-4xl p-6 sm:p-8 rounded-2xl border max-h-[90vh] overflow-y-auto ${
                isDarkMode ? "bg-[#0d121f] border-gray-800 text-white" : "bg-white border-gray-200 text-gray-900"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[var(--primary)]" /> Multi-Car Comparison
                </h3>
                <button onClick={() => setIsCompareOpen(false)} className="p-2 hover:bg-gray-800 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4 text-xs font-mono">
                {/* Headers */}
                <div className="font-bold py-3 uppercase tracking-wider text-gray-500">Spec / Feature</div>
                {compareList.map(c => (
                  <div key={c.id} className="text-center font-bold pb-3 border-b border-gray-800">
                    <img src={c.image} className="w-24 mx-auto rounded object-cover h-14" alt="" />
                    <p className="mt-2 text-sm text-[var(--primary)]">{c.name}</p>
                  </div>
                ))}

                {/* Daily Price */}
                <div className="py-2.5 font-semibold text-gray-400">Daily Tariff</div>
                {compareList.map(c => (
                  <div key={c.id} className="text-center py-2.5 text-emerald-400 font-bold">₹{c.dailyPrice}/day</div>
                ))}

                {/* Fuel Type */}
                <div className="py-2.5 font-semibold text-gray-400">Fuel Engine</div>
                {compareList.map(c => (
                  <div key={c.id} className="text-center py-2.5">{c.fuelType}</div>
                ))}

                {/* Transmission */}
                <div className="py-2.5 font-semibold text-gray-400">Transmission</div>
                {compareList.map(c => (
                  <div key={c.id} className="text-center py-2.5">{c.transmission}</div>
                ))}

                {/* Seats */}
                <div className="py-2.5 font-semibold text-gray-400">Seating Cap</div>
                {compareList.map(c => (
                  <div key={c.id} className="text-center py-2.5">{c.seats} Seater</div>
                ))}

                {/* Mileage */}
                <div className="py-2.5 font-semibold text-gray-400">Efficiency</div>
                {compareList.map(c => (
                  <div key={c.id} className="text-center py-2.5">{c.mileage} {c.fuelType === "Electric" ? "km/charge" : "km/l"}</div>
                ))}

                {/* Specs */}
                <div className="py-2.5 font-semibold text-gray-400">Power output</div>
                {compareList.map(c => (
                  <div key={c.id} className="text-center py-2.5">{c.specifications?.power || "N/A"}</div>
                ))}

                {/* Action buttons */}
                <div className="py-4"></div>
                {compareList.map(c => (
                  <div key={c.id} className="text-center py-4">
                    <button
                      onClick={() => {
                        onBookCar(c);
                        setIsCompareOpen(false);
                      }}
                      className="w-full py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className={`text-2xl sm:text-3xl font-light font-serif tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Renting Self Drive Cars in <span className="italic font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">Hyderabad</span>
          </h2>
          {searchParams?.pickupLocation && (
            <p className="text-xs text-[var(--primary)] mt-1 font-mono">
              ⚡ Showing cars available around: {searchParams.pickupLocation}
            </p>
          )}
        </div>

        {/* Sort and search bar */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search Baleno, Creta, Seltos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl border outline-none focus:ring-2 focus:ring-[var(--primary)] w-52 ${
              isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
            }`}
          />

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`pl-3 pr-8 py-2.5 text-xs font-semibold rounded-xl border appearance-none outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer ${
                isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            >
              <option value="popularity">Sort By: Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating: Top Rated</option>
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>

          <button
            onClick={resetFilters}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all hover:bg-[var(--primary)]/10 ${
              isDarkMode ? "border-gray-800 text-gray-400 hover:text-white" : "border-gray-200 text-gray-500 hover:text-[var(--primary)]"
            }`}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Cars */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filter Panel */}
        <div className={`rounded-3xl border p-5 glass-panel h-fit sticky top-24 ${isDarkMode ? "border-gray-800" : "border-gray-200 bg-white"}`}>
          <div className="flex items-center justify-between pb-4 border-b border-gray-800/40 mb-5">
            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-[var(--primary)]" /> Filter Options
            </span>
          </div>

          {/* Car Type Section */}
          <div className="mb-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 font-mono">Vehicle Class</h4>
            <div className="flex flex-col gap-2">
              {carTypesList.map(type => (
                <label key={type} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold hover:text-[var(--primary)] transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    className="w-4 h-4 rounded border-gray-800 accent-[var(--primary)]"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Fuel Options */}
          <div className="mb-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 font-mono">Fuel</h4>
            <div className="flex flex-col gap-2">
              {fuelList.map(fuel => (
                <label key={fuel} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold hover:text-[var(--primary)] transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedFuels.includes(fuel)}
                    onChange={() => toggleFuel(fuel)}
                    className="w-4 h-4 rounded border-gray-800 accent-[var(--primary)]"
                  />
                  {fuel}
                </label>
              ))}
            </div>
          </div>

          {/* Transmission Options */}
          <div className="mb-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 font-mono">Transmission</h4>
            <div className="flex flex-col gap-2">
              {transmissionList.map(trans => (
                <label key={trans} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold hover:text-[var(--primary)] transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedTransmissions.includes(trans)}
                    onChange={() => toggleTransmission(trans)}
                    className="w-4 h-4 rounded border-gray-800 accent-[var(--primary)]"
                  />
                  {trans}
                </label>
              ))}
            </div>
          </div>

          {/* Seating Capacity */}
          <div className="mb-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 font-mono">Seating capacity</h4>
            <div className="flex flex-col gap-2">
              {[4, 5, 7].map(seat => (
                <label key={seat} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold hover:text-[var(--primary)] transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedSeats.includes(seat)}
                    onChange={() => toggleSeat(seat)}
                    className="w-4 h-4 rounded border-gray-800 accent-[var(--primary)]"
                  />
                  {seat} Seats
                </label>
              ))}
            </div>
          </div>

          {/* Daily Price Cap */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">Max Daily Price</h4>
              <span className="text-xs font-mono font-bold text-[var(--primary)]">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
              <span>₹1K</span>
              <span>₹10K</span>
            </div>
          </div>
        </div>

        {/* Cars Listings Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(idx => (
                <div key={idx} className={`rounded-2xl border p-4 animate-pulse h-96 ${isDarkMode ? "bg-gray-900/40 border-gray-800" : "bg-gray-100 border-gray-200"}`}>
                  <div className="h-44 bg-gray-800 rounded-xl mb-4" />
                  <div className="h-6 bg-gray-800 rounded-md w-3/4 mb-2" />
                  <div className="h-4 bg-gray-800 rounded-md w-1/2 mb-6" />
                  <div className="h-10 bg-gray-800 rounded-xl" />
                </div>
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div className={`p-16 rounded-2xl border text-center flex flex-col items-center justify-center gap-4 ${
              isDarkMode ? "bg-gray-900/20 border-gray-800" : "bg-gray-50 border-gray-200"
            }`}>
              <Compass className="w-12 h-12 text-[var(--primary)] animate-spin" />
              <div>
                <p className="text-lg font-bold">No cars match your criteria</p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  Try widening your budget, searching for a different brand, or clearing checking locations to explore the full Hyderabad fleet.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cars.map((car, idx) => {
                const isFavorite = favorites.includes(car.id);
                const isComparing = compareList.some(c => c.id === car.id);

                return (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (idx % 2) * 0.1 }}
                    className={`rounded-3xl border p-4.5 group hover:-translate-y-1 transition-all duration-300 relative ${
                      isDarkMode 
                        ? "bg-[#050505]/40 border-gray-800 hover:border-[var(--primary)]/20 hover:shadow-2xl hover:shadow-[var(--primary)]/5" 
                        : "bg-white border-gray-200 hover:border-[var(--primary)]/20 shadow-sm"
                    }`}
                  >
                    {/* Badge Accents */}
                    <div className="absolute top-7 left-7 z-20 flex flex-col gap-1.5">
                      <span className="px-2.5 py-1 rounded-md text-[9px] uppercase tracking-widest bg-[var(--primary)]/5 text-[var(--primary)] border border-[var(--primary)]/20 font-mono font-bold">
                        {car.type}
                      </span>
                      {car.rating >= 4.9 && (
                        <span className="px-2.5 py-1 rounded-md text-[9px] uppercase tracking-widest bg-amber-500/10 text-amber-300 border border-amber-500/25 font-mono flex items-center gap-0.5 font-bold">
                          <Flame className="w-3 h-3 text-amber-400" /> Popular
                        </span>
                      )}
                    </div>

                    {/* Favorite Heart Trigger */}
                    <button
                      onClick={() => onToggleFavorite(car.id)}
                      className={`absolute top-7 right-7 z-20 p-2 rounded-lg border transition-all ${
                        isFavorite
                          ? "bg-red-500/10 border-red-500/30 text-red-500"
                          : isDarkMode
                          ? "bg-gray-950/80 border-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-500/5"
                          : "bg-gray-50 border-gray-200 text-gray-500 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`w-4.5 h-4.5 ${isFavorite ? "fill-red-500" : ""}`} />
                    </button>

                    {/* Car Card Image */}
                    <div className="h-44 sm:h-48 overflow-hidden rounded-2xl relative bg-gray-950 flex items-center justify-center mb-5.5">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Vehicle Headers */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{car.brand}</span>
                        <h3 className={`text-base font-bold mt-0.5 group-hover:text-[var(--primary)] transition-colors ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}>
                          {car.name}
                        </h3>
                        <p className="flex items-center gap-1 text-[11px] text-gray-400 mt-1 font-medium">
                          <MapPin className="w-3 h-3 text-red-400" /> {car.location}
                        </p>
                      </div>

                      {/* Stars Rating */}
                      <div className="flex items-center gap-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md text-xs font-mono">
                        <Star className="w-3.5 h-3.5 fill-amber-300" /> {car.rating}
                      </div>
                    </div>

                    {/* Specifications Grid Badges */}
                    <div className="grid grid-cols-4 gap-2 border-y border-gray-800/40 py-3.5 mb-4 text-xs">
                      <div className="flex flex-col items-center justify-center text-center">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-[10px] text-gray-400 mt-1 font-mono">{car.seats} Seater</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center border-l border-gray-800/30">
                        <Gauge className="w-4 h-4 text-gray-400" />
                        <span className="text-[10px] text-gray-400 mt-1 font-mono">{car.transmission}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center border-l border-gray-800/30">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span className="text-[10px] text-gray-400 mt-1 font-mono">{car.fuelType}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center border-l border-gray-800/30">
                        <Flame className="w-4 h-4 text-gray-400" />
                        <span className="text-[10px] text-gray-400 mt-1 font-mono">{car.mileage} kmpl</span>
                      </div>
                    </div>

                    {/* Price and booking layout footer */}
                    <div className="flex items-center justify-between mt-5">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-[var(--primary)] font-serif">₹{car.dailyPrice}</span>
                          <span className="text-[10px] text-gray-400">/day</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400">Or ₹{car.hourlyPrice}/hr</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Compare checkbox icon */}
                        <button
                          onClick={() => handleToggleCompare(car)}
                          className={`p-2.5 rounded-xl border transition-all ${
                            isComparing
                              ? "bg-[var(--primary)]/10 border-[var(--primary)]/30 text-[var(--primary)]"
                              : isDarkMode
                              ? "border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800"
                              : "border-gray-200 text-gray-500 hover:bg-gray-50"
                          }`}
                          title="Compare vehicle specs"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onViewDetails(car)}
                          className={`p-2.5 rounded-xl border transition-all ${
                            isDarkMode
                              ? "border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800"
                              : "border-gray-200 text-gray-500 hover:bg-gray-50"
                          }`}
                          title="Quick view features"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onBookCar(car)}
                          className="px-5 py-2.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-xl text-xs font-bold uppercase tracking-widest active:scale-95 hover:opacity-90 transition-all shadow-lg shadow-rose-500/10 cursor-pointer"
                        >
                          Rent
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
