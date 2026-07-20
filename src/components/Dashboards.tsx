import React, { useState, useEffect } from "react";
import { 
  User, 
  Car, 
  Calendar, 
  Wallet, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Ticket, 
  MessageSquare, 
  Award, 
  Share2, 
  TrendingUp, 
  Database,
  Users,
  Eye,
  SlidersHorizontal,
  FolderSync,
  Heart,
  ChevronDown,
  Wrench,
  Wand,
  Upload,
  Edit
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Car as CarType, Booking, SupportTicket, Coupon } from "../types";

interface DashboardsProps {
  currentUser: any;
  token: string;
  isDarkMode: boolean;
  favorites: string[];
  onToggleFavorite: (carId: string) => void;
  onRentCar: (car: any) => void;
  onRefreshUser: () => void;
}

export default function Dashboards({
  currentUser,
  token,
  isDarkMode,
  favorites,
  onToggleFavorite,
  onRentCar,
  onRefreshUser
}: DashboardsProps) {
  const isAdmin = currentUser?.role === "admin";
  const [activeSubTab, setActiveSubTab] = useState(isAdmin ? "analytics" : "profile");

  // State arrays
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [adminStats, setAdminStats] = useState<any | null>(null);
  const [userStats, setUserStats] = useState<any | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allCars, setAllCars] = useState<CarType[]>([]);

  // Form states
  const [walletAmount, setWalletAmount] = useState("");
  const [licenseInput, setLicenseInput] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("KYC Support");
  const [ticketMsg, setTicketMsg] = useState("");
  const [ticketReply, setTicketReply] = useState<{[key: string]: string}>({});

  // Add Car State (Admin)
  const [newCar, setNewCar] = useState({
    name: "",
    brand: "",
    type: "SUV",
    image: "",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: "5",
    mileage: "16",
    dailyPrice: "2500",
    hourlyPrice: "180",
    location: "Madhapur (Hitech City)",
    engine: "1.5L Engine",
    power: "115 bhp",
    luggage: "400 Litres",
    features: "Apple CarPlay, Sunroof, Ventilated Seats"
  });

  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert("Image size must be less than 15MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCar(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert("Image size must be less than 15MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCar(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [editingCar, setEditingCar] = useState<any | null>(null);
  const [isEditDragging, setIsEditDragging] = useState(false);

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert("Image size must be less than 15MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingCar((prev: any) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditingCar = (car: any) => {
    setEditingCar({
      id: car.id,
      name: car.name,
      brand: car.brand,
      type: car.type,
      image: car.image,
      fuelType: car.fuelType,
      transmission: car.transmission,
      seats: car.seats.toString(),
      mileage: car.mileage.toString(),
      dailyPrice: car.dailyPrice.toString(),
      hourlyPrice: car.hourlyPrice.toString(),
      location: car.location,
      engine: car.specifications?.engine || "",
      power: car.specifications?.power || "",
      luggage: car.specifications?.luggage || "",
      features: Array.isArray(car.features) ? car.features.join(", ") : car.features,
      maintenanceStatus: car.maintenanceStatus || "Good"
    });
  };

  const [loading, setLoading] = useState(false);

  // Fetch data depending on role
  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // User specific bookings & tickets
      const bookRes = await fetch("/api/bookings/me", { headers });
      if (bookRes.ok) setBookings(await bookRes.json());

      const tickRes = await fetch("/api/tickets", { headers });
      if (tickRes.ok) setTickets(await tickRes.json());

      const statsRes = await fetch("/api/dashboard/stats", { headers });
      if (statsRes.ok) {
        if (isAdmin) setAdminStats(await statsRes.json());
        else setUserStats(await statsRes.json());
      }

      if (isAdmin) {
        // Admin loads extra details
        const usersRes = await fetch("/api/admin/users", { headers });
        if (usersRes.ok) setAllUsers(await usersRes.json());

        const carsRes = await fetch("/api/cars");
        if (carsRes.ok) setAllCars(await carsRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchData();
  }, [currentUser, activeSubTab]);

  const handleRefillWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAmount || Number(walletAmount) <= 0) return;
    try {
      const res = await fetch("/api/auth/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: Number(walletAmount) })
      });
      if (res.ok) {
        alert(`₹${walletAmount} added to your DriveEase wallet successfully!`);
        setWalletAmount("");
        onRefreshUser();
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitKYC = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseInput.trim()) return;
    try {
      const res = await fetch("/api/auth/kyc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ licenseNumber: licenseInput })
      });
      if (res.ok) {
        alert("Driving License submitted for automated KYC validation. Please check back in a few seconds!");
        setLicenseInput("");
        onRefreshUser();
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking? This will credit a 100% refund instantly to your wallet.")) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Booking cancelled and amount fully refunded to your wallet!");
        onRefreshUser();
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMsg.trim()) return;
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ subject: ticketSubject, category: ticketCategory, message: ticketMsg })
      });
      if (res.ok) {
        alert("Support ticket created. Our team usually replies within 1 hour!");
        setTicketSubject("");
        setTicketMsg("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTicketReply = async (ticketId: string) => {
    const msg = ticketReply[ticketId];
    if (!msg || !msg.trim()) return;
    try {
      const res = await fetch(`/api/tickets/${ticketId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: msg })
      });
      if (res.ok) {
        alert("Reply submitted!");
        setTicketReply(prev => ({ ...prev, [ticketId]: "" }));
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin: Verify/Reject User KYC
  const handleAdminVerifyKYC = async (userId: string, status: "verified" | "unverified") => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/kyc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        alert(`User KYC marked as ${status.toUpperCase()}!`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin: Update Booking Status
  const handleAdminBookingStatus = async (bookingId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        alert(`Booking status changed to ${status.toUpperCase()}!`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin: Add New Car
  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newCar.name,
          brand: newCar.brand,
          type: newCar.type,
          image: newCar.image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000",
          fuelType: newCar.fuelType,
          transmission: newCar.transmission,
          seats: Number(newCar.seats),
          mileage: Number(newCar.mileage),
          dailyPrice: Number(newCar.dailyPrice),
          hourlyPrice: Number(newCar.hourlyPrice),
          location: newCar.location,
          specifications: {
            engine: newCar.engine,
            power: newCar.power,
            luggage: newCar.luggage
          },
          features: newCar.features.split(",").map(f => f.trim()),
          insuranceDetails: "Comprehensive bumper-to-bumper premium insurance covering standard collision damage.",
          includedKilometers: 150,
          extraKmCharges: 15,
          fuelPolicy: "Full to Full",
          cancellationPolicy: "Free cancel up to 24 hours prior."
        })
      });

      if (res.ok) {
        alert("New car registered successfully in the DriveEase database!");
        setNewCar({
          name: "",
          brand: "",
          type: "SUV",
          image: "",
          fuelType: "Petrol",
          transmission: "Automatic",
          seats: "5",
          mileage: "16",
          dailyPrice: "2500",
          hourlyPrice: "180",
          location: "Madhapur (Hitech City)",
          engine: "1.5L Engine",
          power: "115 bhp",
          luggage: "400 Litres",
          features: "Apple CarPlay, Sunroof, Ventilated Seats"
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin: Delete Car
  const handleDeleteCar = async (carId: string) => {
    if (!confirm("Are you sure you want to delete this car?")) return;
    try {
      const res = await fetch(`/api/admin/cars/${carId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Car deleted successfully.");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin: Update/Edit Car Info
  const handleUpdateCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;
    try {
      const res = await fetch(`/api/admin/cars/${editingCar.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editingCar.name,
          brand: editingCar.brand,
          type: editingCar.type,
          image: editingCar.image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000",
          fuelType: editingCar.fuelType,
          transmission: editingCar.transmission,
          seats: Number(editingCar.seats),
          mileage: Number(editingCar.mileage),
          dailyPrice: Number(editingCar.dailyPrice),
          hourlyPrice: Number(editingCar.hourlyPrice),
          location: editingCar.location,
          specifications: {
            engine: editingCar.engine,
            power: editingCar.power,
            luggage: editingCar.luggage
          },
          features: editingCar.features.split(",").map((f: string) => f.trim()).filter(Boolean),
          maintenanceStatus: editingCar.maintenanceStatus
        })
      });

      if (res.ok) {
        alert("Car information updated successfully!");
        setEditingCar(null);
        fetchData();
      } else {
        const errData = await res.json();
        alert(`Failed to update car: ${errData.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while updating car details.");
    }
  };

  const userTabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "bookings", label: "My Bookings", icon: Calendar },
    { id: "wishlist", label: "My Wishlist", icon: Heart },
    { id: "tickets", label: "Support Tickets", icon: Ticket }
  ];

  const adminTabs = [
    { id: "analytics", label: "Fleet Stats", icon: TrendingUp },
    { id: "kyc", label: "KYC Verifications", icon: CheckCircle },
    { id: "cars", label: "Manage Cars", icon: Car },
    { id: "all-bookings", label: "Manage Bookings", icon: Calendar },
    { id: "tickets", label: "Customer Support", icon: Ticket }
  ];

  const activeTabs = isAdmin ? adminTabs : userTabs;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 relative z-10 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div>
          <div className={`rounded-3xl border p-5 glass-panel text-left ${isDarkMode ? "border-gray-800" : "border-gray-200 bg-white"}`}>
            <div className="flex items-center gap-3.5 pb-5 border-b border-gray-800/40 mb-5">
              <img
                src={currentUser?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"}
                className="w-12 h-12 rounded-full border-2 border-[var(--primary)] object-cover"
                alt=""
              />
              <div>
                <p className="font-extrabold text-sm">{currentUser?.name}</p>
                <p className="text-[11px] font-mono text-[var(--primary)] capitalize font-bold">{currentUser?.role} Dashboard</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1.5">
              {activeTabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-left cursor-pointer ${
                      activeSubTab === tab.id
                        ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg shadow-rose-500/15"
                        : isDarkMode
                        ? "text-gray-400 hover:text-white hover:bg-gray-800/40"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" /> {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Dynamic Detail Content Panel */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20">
              <FolderSync className="w-10 h-10 text-[var(--primary)] animate-spin" />
              <p className="text-xs text-gray-400 mt-2">Loading data sheets...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* ================= USER TAB: PROFILE ================= */}
              {!isAdmin && activeSubTab === "profile" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Account detail block */}
                  <div className={`md:col-span-2 p-6 rounded-2xl border ${isDarkMode ? "bg-gray-900/40 border-gray-800" : "bg-white border-gray-200"}`}>
                    <h3 className="text-base font-bold uppercase tracking-widest text-[var(--primary)] mb-6 font-mono">Account Profile Details</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 text-xs text-left">
                      <div>
                        <span className="text-gray-500 block uppercase tracking-wider font-bold">Email address</span>
                        <span className="font-semibold text-white block mt-1">{currentUser?.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block uppercase tracking-wider font-bold">Contact Phone</span>
                        <span className="font-semibold text-white block mt-1">{currentUser?.phone || "+91 (Unlinked)"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block uppercase tracking-wider font-bold">Driving KYC Approval</span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold mt-1 uppercase ${
                          currentUser?.kycStatus === "verified"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                            : currentUser?.kycStatus === "pending"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                            : "bg-red-500/10 text-red-400 border border-red-500/25"
                        }`}>
                          {currentUser?.kycStatus}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block uppercase tracking-wider font-bold">Loyalty Points Balance</span>
                        <span className="font-bold text-yellow-500 block mt-1">{currentUser?.rewardPoints} points</span>
                      </div>
                    </div>

                    {/* Submit License Form */}
                    {currentUser?.kycStatus !== "verified" && (
                      <form onSubmit={handleSubmitKYC} className="mt-8 pt-6 border-t border-gray-800/40 text-left">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] font-mono mb-4">Complete Driving License KYC Verification</h4>
                        <div className="flex gap-2 text-xs">
                          <input
                            type="text"
                            required
                            placeholder="Enter Indian License number (e.g. TS09202XXXXXXXX)"
                            value={licenseInput}
                            onChange={(e) => setLicenseInput(e.target.value)}
                            className={`flex-1 px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                              isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                            }`}
                          />
                          <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-extrabold rounded-xl cursor-pointer"
                          >
                            Upload DL
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Wallet block */}
                  <div className={`p-6 rounded-3xl border flex flex-col justify-between ${isDarkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"}`}>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 font-mono">My Wallet Balance</h3>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-[var(--primary)] font-serif">₹{currentUser?.balance || 0}</span>
                        <span className="text-xs text-gray-500">INR</span>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-normal mt-2">
                        Refill your wallet to experience instant checkout bookings and direct cancellations.
                      </p>
                    </div>

                    <form onSubmit={handleRefillWallet} className="mt-6 space-y-3">
                      <input
                        type="number"
                        placeholder="Amount (e.g. 2000)"
                        value={walletAmount}
                        onChange={(e) => setWalletAmount(e.target.value)}
                        className={`w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border outline-none ${
                          isDarkMode ? "bg-gray-950 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                        }`}
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer"
                      >
                        Refill Wallet
                      </button>
                    </form>
                  </div>

                  {/* Referral block */}
                  <div className={`md:col-span-3 p-6 rounded-2xl border ${isDarkMode ? "bg-indigo-950/20 border-indigo-500/10" : "bg-gray-50 border-gray-200"}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
                      <div>
                        <h4 className="font-extrabold text-base flex items-center gap-1.5 text-white">
                          <Award className="w-5 h-5 text-yellow-400" /> Share the Freedom! Referral Program
                        </h4>
                        <p className="text-xs text-gray-400 mt-1 max-w-xl">
                          Invite your friends to DriveEase. When they register using your code, they receive ₹150 instantly, and you get ₹300 directly into your wallet upon their first ride completion!
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-gray-950 border border-gray-800 p-2 px-3.5 rounded-xl text-center">
                          <span className="text-[9px] text-gray-500 block uppercase font-mono">My Promo Code</span>
                          <span className="text-sm font-extrabold text-indigo-400 font-mono tracking-wider">{currentUser?.referralCode || "EASEFIRST"}</span>
                        </div>
                        <div className="bg-gray-950 border border-gray-800 p-2 px-3.5 rounded-xl text-center">
                          <span className="text-[9px] text-gray-500 block uppercase font-mono">Total Earned</span>
                          <span className="text-sm font-extrabold text-emerald-400 font-mono">₹{currentUser?.referralEarnings || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= USER TAB: BOOKINGS ================= */}
              {!isAdmin && activeSubTab === "bookings" && (
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <div className={`p-16 rounded-2xl border text-center ${isDarkMode ? "bg-gray-900/10 border-gray-800" : "bg-gray-50 border-gray-200"}`}>
                      <Calendar className="w-10 h-10 mx-auto text-gray-600 mb-3" />
                      <p className="font-bold text-gray-400">No self-drive trips found</p>
                      <button
                        onClick={() => onRentCar(null)}
                        className="mt-3 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                      >
                        Explore Fleet Cars
                      </button>
                    </div>
                  ) : (
                    bookings.map((book) => (
                      <div
                        key={book.id}
                        className={`p-5 rounded-2xl border grid grid-cols-1 md:grid-cols-4 gap-4 items-center ${
                          isDarkMode ? "bg-gray-900/40 border-gray-800" : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex gap-4.5 items-center md:col-span-2 text-left">
                          <img src={book.carImage} className="w-20 h-14 rounded-lg object-cover border border-gray-800 shrink-0" alt="" />
                          <div>
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 uppercase">
                              {book.status}
                            </span>
                            <h4 className="font-bold text-sm text-white mt-1.5">{book.carName}</h4>
                            <p className="text-[10px] text-gray-400 mt-1">{book.pickupLocation} &rarr; {book.dropLocation}</p>
                          </div>
                        </div>

                        <div className="text-left font-mono text-xs">
                          <p className="text-gray-500">SCHEDULE</p>
                          <p className="text-white font-bold mt-0.5">{book.pickupDate} ({book.pickupTime})</p>
                          <p className="text-gray-400">to {book.dropDate}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-2 text-left md:text-right font-mono">
                          <div>
                            <p className="text-[10px] text-gray-500">PAID TARIFF</p>
                            <p className="text-base font-bold text-emerald-400">₹{book.charges?.totalAmount}</p>
                          </div>

                          {book.status === "upcoming" && (
                            <button
                              onClick={() => handleCancelBooking(book.id)}
                              className="px-3.5 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] uppercase font-bold tracking-wider"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ================= USER TAB: WISHLIST ================= */}
              {!isAdmin && activeSubTab === "wishlist" && (
                <div>
                  {favorites.length === 0 ? (
                    <div className="p-16 text-center border border-gray-800 rounded-2xl">
                      <Heart className="w-10 h-10 mx-auto text-gray-600 mb-3" />
                      <p className="font-bold text-gray-400">Your wishlist is empty</p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 mb-4">You have favorited {favorites.length} cars. Click rent to quickly start checking out!</p>
                  )}
                </div>
              )}

              {/* ================= ADMIN TAB: FLEET STATS ================= */}
              {isAdmin && activeSubTab === "analytics" && adminStats && (
                <div className="space-y-6">
                  {/* Stats counters row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {[
                      { label: "Active Users", value: adminStats.totalUsers, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                      { label: "Total Vehicles", value: adminStats.totalCars, color: "text-blue-400", bg: "bg-blue-500/10" },
                      { label: "Bookings Handled", value: adminStats.totalBookingsCount, color: "text-yellow-400", bg: "bg-yellow-500/10" },
                      { label: "Gross Revenue", value: `₹${adminStats.totalRevenue}`, color: "text-emerald-400", bg: "bg-emerald-500/10" }
                    ].map((counter, i) => (
                      <div key={i} className={`p-4.5 rounded-2xl border text-left ${isDarkMode ? "bg-gray-900/40 border-gray-800" : "bg-white border-gray-200"}`}>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-mono">{counter.label}</span>
                        <span className={`text-2xl font-extrabold block mt-2 font-mono ${counter.color}`}>{counter.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Revenue Growth chart overlay using pure SVGs */}
                  <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-[#0d121f] border-gray-800" : "bg-white border-gray-200"}`}>
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">Gross revenue Trajectory (Mocked Monthly trend)</h4>
                      <span className="text-xs text-emerald-400 font-bold font-mono">+18.5% Growth</span>
                    </div>

                    <div className="h-64 relative flex items-end justify-between px-4 pt-4 border-b border-l border-gray-800/40">
                      {adminStats.monthlyRevenue?.map((month: any, i: number) => {
                        const maxHeight = 160;
                        const heightValue = (month.revenue / (adminStats.totalRevenue || 1)) * maxHeight * 4; // amplified for display
                        return (
                          <div key={i} className="flex flex-col items-center gap-2 group relative">
                            {/* Hover info tooltip */}
                            <div className="absolute bottom-full mb-2 bg-indigo-600 text-white px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                              ₹{month.revenue}
                            </div>
                            {/* Chart Bar */}
                            <div
                              style={{ height: `${Math.max(20, Math.min(heightValue, maxHeight))}px` }}
                              className="w-10 sm:w-14 rounded-t-lg bg-gradient-to-t from-indigo-600 to-purple-500 hover:brightness-110 transition-all shadow-lg"
                            />
                            <span className="text-[10px] font-mono text-gray-500">{month.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= ADMIN TAB: KYC VERIFICATIONS ================= */}
              {isAdmin && activeSubTab === "kyc" && (
                <div className="space-y-4">
                  {allUsers.filter(u => u.kycStatus === "pending").length === 0 ? (
                    <div className="p-12 text-center border border-gray-800 rounded-2xl text-xs text-gray-500">
                      No pending driving license KYC uploads at this moment. Everything is clear!
                    </div>
                  ) : (
                    allUsers.filter(u => u.kycStatus === "pending").map((user) => (
                      <div
                        key={user.id}
                        className="p-5 rounded-2xl border border-gray-800 bg-gray-900/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left text-xs"
                      >
                        <div className="space-y-1">
                          <p className="font-bold text-white text-sm">{user.name}</p>
                          <p className="text-gray-400">Email: {user.email}</p>
                          <p className="text-gray-400">Phone: {user.phone}</p>
                          <p className="text-indigo-400 font-mono text-[10px]">License: TS092025001392 (Mocked Uploaded File)</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAdminVerifyKYC(user.id, "verified")}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                          >
                            Verify KYC
                          </button>
                          <button
                            onClick={() => handleAdminVerifyKYC(user.id, "unverified")}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg font-bold"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ================= ADMIN TAB: MANAGE CARS ================= */}
              {isAdmin && activeSubTab === "cars" && (
                <div className="space-y-6">
                  {/* Add Car form collapsible */}
                  <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-gray-900/40 border-gray-800" : "bg-white border-gray-200"}`}>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-6 font-mono">Register New Fleet Car</h3>
                    
                    <form onSubmit={handleAddCar} className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 text-xs">
                      <div className="flex flex-col gap-1">
                        <label className="text-gray-400">Car Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Maruti Brezza VXI"
                          value={newCar.name}
                          onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
                          className="px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-gray-400">Brand</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Maruti Suzuki"
                          value={newCar.brand}
                          onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
                          className="px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-gray-400">Category</label>
                        <select
                          value={newCar.type}
                          onChange={(e) => setNewCar({ ...newCar, type: e.target.value })}
                          className="px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                        >
                          <option value="Hatchback">Hatchback</option>
                          <option value="Sedan">Sedan</option>
                          <option value="SUV">SUV</option>
                          <option value="Premium SUV">Premium SUV</option>
                          <option value="Luxury">Luxury</option>
                          <option value="Electric">Electric</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-gray-400">Daily Price (₹)</label>
                        <input
                          type="number"
                          required
                          value={newCar.dailyPrice}
                          onChange={(e) => setNewCar({ ...newCar, dailyPrice: e.target.value })}
                          className="px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-gray-400">Hourly Overtime Price (₹)</label>
                        <input
                          type="number"
                          required
                          value={newCar.hourlyPrice}
                          onChange={(e) => setNewCar({ ...newCar, hourlyPrice: e.target.value })}
                          className="px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-gray-400">Fuel Type</label>
                        <select
                          value={newCar.fuelType}
                          onChange={(e) => setNewCar({ ...newCar, fuelType: e.target.value })}
                          className="px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                        >
                          <option value="Petrol">Petrol</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Electric">Electric</option>
                        </select>
                      </div>

                      <div className="sm:col-span-3 flex flex-col gap-1.5 mt-2">
                        <label className="text-gray-400 font-medium text-[11px] uppercase tracking-wider font-mono">Car Photo / Image Upload</label>
                        
                        {newCar.image ? (
                          <div className="relative rounded-2xl border border-gray-800 bg-gray-950 p-3.5 flex items-center gap-4 text-left">
                            <img 
                              src={newCar.image} 
                              alt="Car Preview" 
                              className="w-24 h-16 rounded-xl object-cover border border-gray-800"
                            />
                            <div className="flex-1">
                              <p className="font-bold text-white text-xs">Car Photo Loaded</p>
                              <p className="text-[10px] text-gray-500 font-mono truncate max-w-[200px] sm:max-w-md">
                                {newCar.image.startsWith("data:") ? "Directly Uploaded Image (Base64)" : newCar.image}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setNewCar(prev => ({ ...prev, image: "" }))}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all cursor-pointer"
                              title="Remove Image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                              onClick={() => document.getElementById("car-image-file-input")?.click()}
                              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                                isDragging 
                                  ? "border-[var(--primary)] bg-[var(--primary)]/5" 
                                  : "border-gray-800 hover:border-gray-700 bg-gray-950/40"
                              }`}
                            >
                              <input
                                type="file"
                                id="car-image-file-input"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              <Upload className="w-6 h-6 text-gray-500" />
                              <div className="text-center">
                                <p className="text-white font-bold">Upload an Image File</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">Drag and drop here, or click to choose a file</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="h-px bg-gray-800/60 flex-1"></div>
                              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest font-bold">or</span>
                              <div className="h-px bg-gray-800/60 flex-1"></div>
                            </div>

                            <input
                              type="text"
                              placeholder="Or paste an image URL (Unsplash, etc.)"
                              value={newCar.image}
                              onChange={(e) => setNewCar({ ...newCar, image: e.target.value })}
                              className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white text-xs outline-none focus:border-gray-700 transition-all font-mono"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-gray-400">Seats</label>
                        <input
                          type="number"
                          required
                          value={newCar.seats}
                          onChange={(e) => setNewCar({ ...newCar, seats: e.target.value })}
                          className="px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-gray-400">Seeding Location</label>
                        <input
                          type="text"
                          required
                          value={newCar.location}
                          onChange={(e) => setNewCar({ ...newCar, location: e.target.value })}
                          className="px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                        />
                      </div>

                      <div className="sm:col-span-3 flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl uppercase"
                        >
                          Add Car to Fleet
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Registered Cars Listing table */}
                  <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-gray-900/40 border-gray-800" : "bg-white border-gray-200"}`}>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 font-mono">Current Platform fleet</h3>
                    
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {allCars.map(car => (
                        <div key={car.id} className="p-3 border border-gray-800/40 rounded-xl bg-gray-950 flex items-center justify-between text-xs">
                          <div className="flex gap-3 items-center">
                            <img src={car.image} className="w-12 h-9 rounded object-cover" alt="" />
                            <div className="text-left">
                              <p className="font-bold text-white">{car.name}</p>
                              <p className="text-[10px] text-gray-500">{car.type} &bull; ₹{car.dailyPrice}/day</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => startEditingCar(car)}
                              className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Edit Car Details"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCar(car.id)}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Delete Car"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= ADMIN TAB: BOOKINGS MANAGEMENT ================= */}
              {isAdmin && activeSubTab === "all-bookings" && (
                <div className="space-y-4">
                  {bookings.map((book) => (
                    <div
                      key={book.id}
                      className="p-5 rounded-2xl border border-gray-800 bg-gray-900/20 text-xs text-left grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
                    >
                      <div className="flex gap-3 items-center md:col-span-2">
                        <img src={book.carImage} className="w-16 h-11 rounded object-cover border border-gray-800 shrink-0" alt="" />
                        <div>
                          <p className="font-bold text-white text-sm">{book.carName}</p>
                          <p className="text-gray-400">Renter: <span className="text-indigo-400 font-bold">{book.driverDetails?.name}</span></p>
                          <span className="px-2 py-0.5 rounded text-[9px] uppercase font-mono font-bold bg-indigo-500/10 text-indigo-400 block mt-1 w-fit">
                            {book.status}
                          </span>
                        </div>
                      </div>

                      <div className="font-mono">
                        <p className="text-gray-500">SCHEDULE</p>
                        <p className="text-white font-bold">{book.pickupDate} ({book.pickupTime})</p>
                        <p className="text-gray-400">to {book.dropDate}</p>
                      </div>

                      <div className="flex flex-col gap-2 items-end">
                        <div className="relative">
                          <select
                            value={book.status}
                            onChange={(e) => handleAdminBookingStatus(book.id, e.target.value)}
                            className="pl-2 pr-6 py-1.5 bg-gray-950 border border-gray-800 text-white rounded outline-none"
                          >
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ================= COMMON TAB: SUPPORT TICKETS ================= */}
              {activeSubTab === "tickets" && (
                <div className="space-y-6">
                  {/* Create ticket form (for normal users) */}
                  {!isAdmin && (
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-gray-900/40 border-gray-800" : "bg-white border-gray-200"}`}>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-5 font-mono">Create Support Assistance Ticket</h3>
                      
                      <form onSubmit={handleCreateTicket} className="space-y-4 text-xs text-left">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-gray-400">Ticket Subject</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. KYC Approval delay"
                              value={ticketSubject}
                              onChange={(e) => setTicketSubject(e.target.value)}
                              className="px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-gray-400">Category</label>
                            <select
                              value={ticketCategory}
                              onChange={(e) => setTicketCategory(e.target.value)}
                              className="px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white"
                            >
                              <option value="KYC Support">KYC Support</option>
                              <option value="Refund Help">Refund Help</option>
                              <option value="Vehicle Issue">Vehicle Issue</option>
                              <option value="Security Deposit">Security Deposit</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-gray-400">Elaborate Message</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Provide any Booking Order ID or specific details..."
                            value={ticketMsg}
                            onChange={(e) => setTicketMsg(e.target.value)}
                            className="px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl uppercase tracking-wider"
                          >
                            Submit Ticket
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* List of active support tickets */}
                  <div className="space-y-4 text-left text-xs">
                    {tickets.length === 0 ? (
                      <div className="p-10 text-center text-gray-500 border border-gray-800 rounded-2xl">
                        No active help tickets filed.
                      </div>
                    ) : (
                      tickets.map((t) => (
                        <div
                          key={t.id}
                          className={`p-5 rounded-2xl border ${
                            isDarkMode ? "bg-gray-900/30 border-gray-800" : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                                t.status === "open" ? "bg-red-500/10 text-red-400 border border-red-500/25" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                              }`}>
                                {t.status}
                              </span>
                              <h4 className="font-bold text-sm text-white mt-1.5">{t.subject}</h4>
                              <p className="text-[10px] text-gray-500 mt-0.5">Category: {t.category} &bull; Order ID: {t.id}</p>
                            </div>
                            <span className="text-[10px] text-gray-600 font-mono">{new Date(t.createdAt).toLocaleString()}</span>
                          </div>

                          {/* Conversational replies */}
                          <div className="space-y-3 pl-3 border-l-2 border-indigo-500/30 mb-5">
                            {t.replies.map((rep, rIdx) => (
                              <div key={rIdx} className="space-y-1">
                                <span className={`font-bold text-[10px] uppercase ${rep.sender === "admin" ? "text-indigo-400" : "text-yellow-500"}`}>
                                  {rep.sender === "admin" ? "Support Agent" : "You (Renter)"}
                                </span>
                                <p className="text-gray-300 italic">"{rep.message}"</p>
                              </div>
                            ))}
                          </div>

                          {/* Reply submission input */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Write a follow-up reply..."
                              value={ticketReply[t.id] || ""}
                              onChange={(e) => setTicketReply({ ...ticketReply, [t.id]: e.target.value })}
                              className="flex-1 px-3.5 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white"
                            />
                            <button
                              onClick={() => handleTicketReply(t.id)}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Car Modal */}
      <AnimatePresence>
        {editingCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className={`w-full max-w-4xl rounded-3xl border shadow-2xl p-6 sm:p-8 relative ${
                isDarkMode ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-gray-200 text-gray-900"
              }`}
            >
              <button
                type="button"
                onClick={() => setEditingCar(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-gray-800/10 hover:bg-gray-800/20 text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6 text-left">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                  <Edit className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Edit Vehicle Specifications</h3>
                  <p className="text-xs text-gray-400 font-mono uppercase tracking-widest mt-0.5">ID: {editingCar.id}</p>
                </div>
              </div>

              <form onSubmit={handleUpdateCar} className="space-y-6 text-xs text-left">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Name and Brand */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-400 font-semibold font-mono uppercase tracking-wider text-[10px]">Car Name</label>
                    <input
                      type="text"
                      required
                      value={editingCar.name}
                      onChange={(e) => setEditingCar({ ...editingCar, name: e.target.value })}
                      className="px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-400 font-semibold font-mono uppercase tracking-wider text-[10px]">Brand</label>
                    <input
                      type="text"
                      required
                      value={editingCar.brand}
                      onChange={(e) => setEditingCar({ ...editingCar, brand: e.target.value })}
                      className="px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-400 font-semibold font-mono uppercase tracking-wider text-[10px]">Category</label>
                    <select
                      value={editingCar.type}
                      onChange={(e) => setEditingCar({ ...editingCar, type: e.target.value })}
                      className="px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="Hatchback">Hatchback</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Premium SUV">Premium SUV</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>

                  {/* Fuel, Transmission, Seats */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-400 font-semibold font-mono uppercase tracking-wider text-[10px]">Fuel Type</label>
                    <select
                      value={editingCar.fuelType}
                      onChange={(e) => setEditingCar({ ...editingCar, fuelType: e.target.value })}
                      className="px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-400 font-semibold font-mono uppercase tracking-wider text-[10px]">Transmission</label>
                    <select
                      value={editingCar.transmission}
                      onChange={(e) => setEditingCar({ ...editingCar, transmission: e.target.value })}
                      className="px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-400 font-semibold font-mono uppercase tracking-wider text-[10px]">Seats</label>
                    <input
                      type="number"
                      required
                      value={editingCar.seats}
                      onChange={(e) => setEditingCar({ ...editingCar, seats: e.target.value })}
                      className="px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>

                  {/* Price fields & mileage */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-400 font-semibold font-mono uppercase tracking-wider text-[10px]">Daily Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={editingCar.dailyPrice}
                      onChange={(e) => setEditingCar({ ...editingCar, dailyPrice: e.target.value })}
                      className="px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-400 font-semibold font-mono uppercase tracking-wider text-[10px]">Hourly Overtime (₹)</label>
                    <input
                      type="number"
                      required
                      value={editingCar.hourlyPrice}
                      onChange={(e) => setEditingCar({ ...editingCar, hourlyPrice: e.target.value })}
                      className="px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-400 font-semibold font-mono uppercase tracking-wider text-[10px]">Mileage (km/l or km/charge)</label>
                    <input
                      type="number"
                      required
                      value={editingCar.mileage}
                      onChange={(e) => setEditingCar({ ...editingCar, mileage: e.target.value })}
                      className="px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>

                  {/* Location & Maintenance status */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-400 font-semibold font-mono uppercase tracking-wider text-[10px]">Platform Location</label>
                    <input
                      type="text"
                      required
                      value={editingCar.location}
                      onChange={(e) => setEditingCar({ ...editingCar, location: e.target.value })}
                      className="px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-gray-400 font-semibold font-mono uppercase tracking-wider text-[10px]">Maintenance Status</label>
                    <select
                      value={editingCar.maintenanceStatus}
                      onChange={(e) => setEditingCar({ ...editingCar, maintenanceStatus: e.target.value })}
                      className="px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="Good">Good (Ready for booking)</option>
                      <option value="Servicing">Servicing (Currently unavailable)</option>
                      <option value="Maintenance Required">Maintenance Required (Needs attention)</option>
                    </select>
                  </div>
                </div>

                {/* specifications */}
                <div className="p-4 rounded-2xl bg-gray-950/50 border border-gray-800/60 space-y-4">
                  <h4 className="font-bold text-indigo-400 uppercase tracking-wider text-[10px] font-mono">Technical Specifications</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-gray-500 font-semibold font-mono uppercase tracking-wider text-[10px]">Engine</label>
                      <input
                        type="text"
                        placeholder="e.g. 1.5L DualJet"
                        value={editingCar.engine}
                        onChange={(e) => setEditingCar({ ...editingCar, engine: e.target.value })}
                        className="px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-gray-500 font-semibold font-mono uppercase tracking-wider text-[10px]">Max Power</label>
                      <input
                        type="text"
                        placeholder="e.g. 103 bhp"
                        value={editingCar.power}
                        onChange={(e) => setEditingCar({ ...editingCar, power: e.target.value })}
                        className="px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-gray-500 font-semibold font-mono uppercase tracking-wider text-[10px]">Luggage Space</label>
                      <input
                        type="text"
                        placeholder="e.g. 328 Litres"
                        value={editingCar.luggage}
                        onChange={(e) => setEditingCar({ ...editingCar, luggage: e.target.value })}
                        className="px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Features (comma-separated string) */}
                <div className="flex flex-col gap-1">
                  <label className="text-gray-400 font-semibold font-mono uppercase tracking-wider text-[10px]">Features (Comma-separated)</label>
                  <input
                    type="text"
                    value={editingCar.features}
                    onChange={(e) => setEditingCar({ ...editingCar, features: e.target.value })}
                    className="px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white outline-none focus:border-indigo-500 transition-all font-mono"
                    placeholder="Apple CarPlay, Automatic Climate Control, Ventilated Seats"
                  />
                </div>

                {/* Photo / Image Upload section */}
                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-gray-400 font-semibold font-mono uppercase tracking-wider text-[10px]">Vehicle Photo / Direct Image Upload</label>
                  
                  {editingCar.image ? (
                    <div className="relative rounded-2xl border border-gray-800 bg-gray-950 p-3.5 flex items-center gap-4 text-left">
                      <img 
                        src={editingCar.image} 
                        alt="Car Preview" 
                        className="w-24 h-16 rounded-xl object-cover border border-gray-800"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-white text-xs">Car Photo Loaded</p>
                        <p className="text-[10px] text-gray-500 font-mono truncate max-w-[200px] sm:max-w-md">
                          {editingCar.image.startsWith("data:") ? "Directly Uploaded Image (Base64)" : editingCar.image}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingCar(prev => ({ ...prev, image: "" }))}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all cursor-pointer"
                        title="Remove Image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsEditDragging(true); }}
                        onDragLeave={() => setIsEditDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsEditDragging(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            if (file.size > 15 * 1024 * 1024) {
                              alert("Image size must be less than 15MB");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditingCar(prev => ({ ...prev, image: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        onClick={() => document.getElementById("edit-car-image-file-input")?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                          isEditDragging 
                            ? "border-[var(--primary)] bg-[var(--primary)]/5" 
                            : "border-gray-800 hover:border-gray-700 bg-gray-950/40"
                        }`}
                      >
                        <input
                          type="file"
                          id="edit-car-image-file-input"
                          accept="image/*"
                          onChange={handleEditFileChange}
                          className="hidden"
                        />
                        <Upload className="w-6 h-6 text-gray-500" />
                        <div className="text-center">
                          <p className="text-white font-bold">Upload a New Car Photo</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">Drag and drop here, or click to choose a file</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="h-px bg-gray-800/60 flex-1"></div>
                        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest font-bold">or</span>
                        <div className="h-px bg-gray-800/60 flex-1"></div>
                      </div>

                      <input
                        type="text"
                        placeholder="Or paste an image URL"
                        value={editingCar.image}
                        onChange={(e) => setEditingCar({ ...editingCar, image: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs outline-none focus:border-indigo-500 transition-all font-mono"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setEditingCar(null)}
                    className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-bold rounded-xl uppercase transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
