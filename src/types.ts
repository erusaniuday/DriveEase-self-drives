/**
 * DriveEase Shared TypeScript Types
 */

export enum CarType {
  HATCHBACK = "Hatchback",
  SEDAN = "Sedan",
  SUV = "SUV",
  LUXURY = "Luxury",
  ELECTRIC = "Electric",
  PREMIUM_SUV = "Premium SUV"
}

export enum FuelType {
  PETROL = "Petrol",
  DIESEL = "Diesel",
  ELECTRIC = "Electric"
}

export enum Transmission {
  AUTOMATIC = "Automatic",
  MANUAL = "Manual"
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  carId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  type: CarType;
  image: string;
  fuelType: FuelType;
  transmission: Transmission;
  seats: number;
  mileage: number; // km/l or km/charge
  dailyPrice: number; // in INR
  hourlyPrice: number; // in INR
  rating: number;
  availability: boolean;
  location: string;
  specifications: {
    engine: string;
    power: string;
    luggage: string;
  };
  features: string[];
  insuranceDetails: string;
  includedKilometers: number;
  extraKmCharges: number; // INR per km
  fuelPolicy: string;
  cancellationPolicy: string;
  maintenanceStatus: "Good" | "Servicing" | "Maintenance Required";
  reviews?: Review[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: "admin" | "user";
  kycVerified: boolean;
  kycStatus: "unverified" | "pending" | "verified";
  licenseNumber?: string;
  licenseImage?: string;
  balance: number; // Wallet balance in INR
  rewardPoints: number;
  referralCode: string;
  referredBy?: string;
  referralEarnings: number;
  profileImage?: string;
}

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  carName?: string; // Cache for UI
  carImage?: string; // Cache for UI
  pickupLocation: string;
  dropLocation: string;
  pickupDate: string;
  dropDate: string;
  pickupTime: string;
  dropTime: string;
  couponCode?: string;
  insuranceType: "basic" | "standard" | "premium";
  driverDetails: {
    name: string;
    licenseNumber: string;
    age: number;
  };
  charges: {
    basePrice: number;
    securityDeposit: number;
    tax: number;
    discount: number;
    totalAmount: number;
  };
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  paymentStatus: "paid" | "pending" | "refunded";
  paymentMethod: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  description: string;
  minBookingValue: number;
  expiryDate: string;
  active: boolean;
  type: "Referral" | "Weekend" | "Festival" | "Student" | "Corporate" | "Standard";
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  category: string;
  message: string;
  status: "open" | "resolved";
  replies: {
    sender: "user" | "admin";
    message: string;
    timestamp: string;
  }[];
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  category: "Travel Guides" | "Road Trips" | "Driving Tips" | "Car Reviews" | "Hyderabad Tourism";
  excerpt: string;
  content: string;
  image: string;
  author: string;
  readTime: string;
  createdAt: string;
  likes: number;
}
