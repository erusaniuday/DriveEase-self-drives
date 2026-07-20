import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Path for persisted JSON DB
const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "db.json");

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Seed Data
const initialCars = [
  {
    id: "car-baleno",
    name: "Maruti Baleno Alpha",
    brand: "Maruti Suzuki",
    type: "Hatchback",
    image: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=1000",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    mileage: 19,
    dailyPrice: 1800,
    hourlyPrice: 120,
    rating: 4.8,
    availability: true,
    location: "Hyderabad Airport (RGIA)",
    specifications: {
      engine: "1.2L DualJet",
      power: "89 bhp",
      luggage: "318 Litres"
    },
    features: ["Apple CarPlay / Android Auto", "360-degree Camera", "Automatic Climate Control", "LED Projector Headlamps", "Keyless Entry"],
    insuranceDetails: "Comprehensive insurance with ₹5,000 maximum liability in case of accidental damage.",
    includedKilometers: 150,
    extraKmCharges: 12,
    fuelPolicy: "Full to Full - Return with a full tank of petrol.",
    cancellationPolicy: "Free cancellation up to 24 hours before pickup. 50% refund within 24 hours.",
    maintenanceStatus: "Good"
  },
  {
    id: "car-creta",
    name: "Hyundai Creta SX(O)",
    brand: "Hyundai",
    type: "SUV",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000",
    fuelType: "Diesel",
    transmission: "Automatic",
    seats: 5,
    mileage: 17,
    dailyPrice: 2800,
    hourlyPrice: 180,
    rating: 4.9,
    availability: true,
    location: "Madhapur (Hitech City)",
    specifications: {
      engine: "1.5L CRDi",
      power: "113 bhp",
      luggage: "433 Litres"
    },
    features: ["Panoramic Sunroof", "Ventilated Seats", "Bose Premium Sound System", "Cruise Control", "Ambient Lighting"],
    insuranceDetails: "Zero-depreciation bumper-to-bumper premium insurance covering theft and collision.",
    includedKilometers: 180,
    extraKmCharges: 15,
    fuelPolicy: "Full to Full - Return with a full tank of diesel.",
    cancellationPolicy: "Free cancellation up to 12 hours before pickup.",
    maintenanceStatus: "Good"
  },
  {
    id: "car-seltos",
    name: "Kia Seltos GTX+",
    brand: "Kia",
    type: "SUV",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1000",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    mileage: 16,
    dailyPrice: 2700,
    hourlyPrice: 175,
    rating: 4.85,
    availability: true,
    location: "Gachibowli",
    specifications: {
      engine: "1.4L Turbo GDI",
      power: "138 bhp",
      luggage: "433 Litres"
    },
    features: ["Heads Up Display", "ADAS Safety Features", "Wireless Phone Charger", "Red Accent Leather Seats", "Air Purifier"],
    insuranceDetails: "Standard comprehensive insurance included with basic damage liability limit of ₹7,500.",
    includedKilometers: 180,
    extraKmCharges: 15,
    fuelPolicy: "Full to Full - Return with full petrol tank.",
    cancellationPolicy: "Free cancellation up to 24 hours prior to booking slot.",
    maintenanceStatus: "Good"
  },
  {
    id: "car-xuv700",
    name: "Mahindra XUV700 AX7 L",
    brand: "Mahindra",
    type: "Premium SUV",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000",
    fuelType: "Diesel",
    transmission: "Automatic",
    seats: 7,
    mileage: 14,
    dailyPrice: 3800,
    hourlyPrice: 240,
    rating: 4.95,
    availability: true,
    location: "Secunderabad",
    specifications: {
      engine: "2.2L mHawk Turbo",
      power: "182 bhp",
      luggage: "60-240 Litres (Expandable)"
    },
    features: ["Dual-screen Infotainment", "Level 2 ADAS", "Smart Door Handles", "Sony 12-Speaker Audio", "AWD Drive Modes"],
    insuranceDetails: "Luxury zero-depreciation insurance included with full roadside assistance support.",
    includedKilometers: 200,
    extraKmCharges: 18,
    fuelPolicy: "Full to Full - Return with full diesel tank.",
    cancellationPolicy: "Free cancellation up to 24 hours prior; ₹1,000 cancellation fee thereafter.",
    maintenanceStatus: "Good"
  },
  {
    id: "car-nexon",
    name: "Tata Nexon EV Max",
    brand: "Tata",
    type: "Electric",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1000",
    fuelType: "Electric",
    transmission: "Automatic",
    seats: 5,
    mileage: 437, // km per charge
    dailyPrice: 2500,
    hourlyPrice: 160,
    rating: 4.78,
    availability: true,
    location: "Banjara Hills",
    specifications: {
      engine: "40.5 kWh battery",
      power: "141 bhp",
      luggage: "350 Litres"
    },
    features: ["Multi-mode Regenerative Braking", "Fast Charging Support", "Harman Premium Speakers", "Ventilated Leather Seats", "ZConnect Telematics"],
    insuranceDetails: "Electric vehicle green premium cover. Low deductible. Cover includes battery protection.",
    includedKilometers: 250,
    extraKmCharges: 10,
    fuelPolicy: "Return with at least 20% charge. No charging cost is passed to the renter if returned above 20%.",
    cancellationPolicy: "Free cancellation up to 12 hours before schedule start.",
    maintenanceStatus: "Good"
  },
  {
    id: "car-i20",
    name: "Hyundai i20 Asta(O)",
    brand: "Hyundai",
    type: "Hatchback",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1000",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 5,
    mileage: 20,
    dailyPrice: 1600,
    hourlyPrice: 100,
    rating: 4.75,
    availability: true,
    location: "Jubilee Hills",
    specifications: {
      engine: "1.2L Kappa",
      power: "82 bhp",
      luggage: "311 Litres"
    },
    features: ["Bose Sound System", "Ambient Lights", "Wireless Charger", "Smart Keyless Entry", "Electric Sunroof"],
    insuranceDetails: "Standard policy with accident liability capped at ₹5,000.",
    includedKilometers: 150,
    extraKmCharges: 12,
    fuelPolicy: "Full to Full petrol.",
    cancellationPolicy: "Free cancellation 24 hours prior to booking start time.",
    maintenanceStatus: "Good"
  },
  {
    id: "car-thar",
    name: "Mahindra Thar LX Hard Top",
    brand: "Mahindra",
    type: "Luxury",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000", // Using a solid SUV photo
    fuelType: "Diesel",
    transmission: "Manual",
    seats: 4,
    mileage: 12,
    dailyPrice: 3200,
    hourlyPrice: 200,
    rating: 4.92,
    availability: true,
    location: "Kukatpally",
    specifications: {
      engine: "2.2L mHawk CRDe",
      power: "130 bhp",
      luggage: "150 Litres"
    },
    features: ["4x4 Low & High Range Shift", "Touchscreen Infotainment", "All-Terrain Tyres", "Adventure Statistics Console", "Roll-cage and ESP"],
    insuranceDetails: "Adventure premium off-roading waiver policy included with ₹8,000 liability ceiling.",
    includedKilometers: 150,
    extraKmCharges: 16,
    fuelPolicy: "Full to Full diesel.",
    cancellationPolicy: "Free cancellation up to 24 hours. No refunds for late cancellation.",
    maintenanceStatus: "Good"
  },
  {
    id: "car-innova",
    name: "Toyota Innova Crysta ZX",
    brand: "Toyota",
    type: "Premium SUV",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1000",
    fuelType: "Diesel",
    transmission: "Automatic",
    seats: 7,
    mileage: 13,
    dailyPrice: 3900,
    hourlyPrice: 250,
    rating: 4.97,
    availability: true,
    location: "Secunderabad Station",
    specifications: {
      engine: "2.4L GD-FTV Diesel",
      power: "148 bhp",
      luggage: "300-750 Litres"
    },
    features: ["Luxury Captain Seats", "Automatic Rear AC Control", "7 SRS Airbags", "Eco & Power Drive Modes", "Premium Wood Finish Dashboard"],
    insuranceDetails: "Zero-depreciation standard policy covering up to 100% of damage repairs with standard processing fee.",
    includedKilometers: 200,
    extraKmCharges: 20,
    fuelPolicy: "Full to Full diesel.",
    cancellationPolicy: "Cancel up to 24 hours prior for full refund.",
    maintenanceStatus: "Good"
  },
  {
    id: "car-cclass",
    name: "Mercedes-Benz C-Class",
    brand: "Mercedes-Benz",
    type: "Luxury",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000", // Using elegant premium black car
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    mileage: 12,
    dailyPrice: 8500,
    hourlyPrice: 550,
    rating: 4.99,
    availability: true,
    location: "Banjara Hills",
    specifications: {
      engine: "2.0L Turbocharged I4",
      power: "255 bhp",
      luggage: "455 Litres"
    },
    features: ["Burmester Surround Sound", "Panoramic Sunroof", "Active Parking Assist", "Heated Steering & Seats", "Dynamic Select Modes"],
    insuranceDetails: "VIP zero-deductible full coverage luxury insurance included.",
    includedKilometers: 150,
    extraKmCharges: 35,
    fuelPolicy: "Full to Full super petrol.",
    cancellationPolicy: "Free cancellation up to 48 hours. 10% fee within 48 hours.",
    maintenanceStatus: "Good"
  }
];

const initialCoupons = [
  { id: "c-first", code: "DRIVEEASE", discountPercent: 15, description: "Get 15% Off on your first ride with us!", minBookingValue: 1500, expiryDate: "2026-12-31", active: true, type: "Standard" },
  { id: "c-weekend", code: "WEEKEND20", discountPercent: 20, description: "Enjoy your weekend getaways with 20% off!", minBookingValue: 3000, expiryDate: "2026-09-30", active: true, type: "Weekend" },
  { id: "c-festival", code: "FESTIVE25", discountPercent: 25, description: "Celebrate festive seasons with 25% flat discount!", minBookingValue: 5000, expiryDate: "2026-11-15", active: true, type: "Festival" },
  { id: "c-student", code: "CAMPUS10", discountPercent: 10, description: "Special 10% off with no minimum amount for students!", minBookingValue: 0, expiryDate: "2026-12-31", active: true, type: "Student" }
];

const initialBlogs = [
  {
    id: "blog-1",
    title: "Unveiling Hyderabad: Best Weekend Road Trips",
    category: "Road Trips",
    excerpt: "Looking for an escape from the city? Here are the top 5 gorgeous road trips around Hyderabad within 200 km for the ultimate driving getaway.",
    content: `Hyderabad is beautifully situated, offering an array of historic forts, tranquil lakes, and dense forests within a day's drive. If you are renting a self-drive car, these are the top destinations you must visit:\n\n1. **Ananthagiri Hills (80 km from Hyd)**: Perfect for nature lovers, this dense forest region has ancient temples and beautiful scenic viewpoints. The winding roads are a pleasure to drive on, especially in an SUV like the Mahindra XUV700.\n\n2. **Kondapochamma Sagar Reservoir (55 km from Hyd)**: Famous for its pristine blue water backdrops and wide dikes, it is a fabulous drive. Sunrise drives are particularly popular among weekenders.\n\n3. **Bidar Fort (140 km from Hyd)**: Travel back in time by driving down to the magnificent Bidar Fort in Karnataka. The route is extremely smooth and ideal for a steady cruise.\n\n4. **Nagarjuna Sagar Dam (150 km from Hyd)**: One of the largest dams in India, the drive through small villages and green fields is incredibly scenic. Highly recommended for a family trip in a Toyota Innova.\n\nPack your bags, fire up your DriveEase self-drive car, and hit the highway!`,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
    author: "Uday Erusani",
    readTime: "5 mins read",
    createdAt: "2026-07-10",
    likes: 42
  },
  {
    id: "blog-2",
    title: "The Ultimate Guide to Navigating Hyderabad Traffic",
    category: "Driving Tips",
    excerpt: "Steering a car through the vibrant city lanes of Hyderabad can be challenging. Here are some professional local guidelines to keep you driving smoothly.",
    content: `Whether you are taking a premium hatchback through Jubilee Hills or driving an SUV down Madhapur, Hyderabad traffic has its unique rhythm. Here are pro-tips to ensure your self-drive experience is stress-free:\n\n* **Use the Outer Ring Road (ORR)**: Connecting all major corners of the city, the ORR is a world-class 8-lane expressway with a speed limit of 120 km/h. If you are going from RGIA airport to Gachibowli or Kukatpally, always prefer the ORR to bypass local bottlenecks.\n* **Avoid Peak IT Hours**: The stretch between Gachibowli, Hitech City, and Kondapur sees heavy traffic between 9 AM to 11 AM and 6 PM to 8:30 PM. Plan your cross-city commutes accordingly.\n* **Learn to park right**: Commercial areas like Gachibowli and Banjara Hills have strict towing zones. Always use authorized mall parking or dedicated multi-level parking plazas to secure your rented vehicle.\n* **Equipped with 360-degree Cameras**: If you are rental-shopping, choose cars like the Baleno Alpha or Seltos GTX+ which feature high-resolution 360 cameras. They are extremely helpful when parking in tight lanes in old city areas.`,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
    author: "Rohan Sharma",
    readTime: "4 mins read",
    createdAt: "2026-07-14",
    likes: 29
  },
  {
    id: "blog-3",
    title: "Hatchback vs. SUV: What's Ideal for Your Self-Drive?",
    category: "Car Reviews",
    excerpt: "Stuck between a compact sporty hatchback and a brawny premium SUV? Let's break down which self-drive car suits your Hyderabad travel plans best.",
    content: `Choosing the right self-drive car is all about matching your vehicle with your destination, duration, and group size.\n\n**When to choose a Hatchback (e.g. Maruti Baleno, i20):**\n- **Solo or Couples**: Perfect for cozy, quick commutes.\n- **City Explorations**: Navigating narrow old city areas like Charminar or shopping in Koti is a breeze thanks to compact dimensions.\n- **Budget Friendly**: Highly efficient on fuel and lower rental tariffs.\n\n**When to choose an SUV (e.g. Mahindra Thar, Hyundai Creta, XUV700):**\n- **Long Journeys & Highway cruising**: Offers better stability, commanding high-view seating, and superior pothole filtering.\n- **Group / Family Travels**: Spacious 5 to 7-seat cabins with ample luggage capacity.\n- **Unmatched Road Presence**: Perfect for making an entrance at luxury corporate events in Hyderabad.\n\nAt DriveEase, we offer both so you are never limited! Check out our fleet today.`,
    image: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=800",
    author: "Kiran Kumar",
    readTime: "6 mins read",
    createdAt: "2026-07-16",
    likes: 56
  }
];

const initialReviews = [
  { id: "rev-1", userId: "u-test", userName: "Sai Vardhan", userAvatar: "", carId: "car-creta", rating: 5, comment: "Car was in pristine condition. Received the car with a full fuel tank. Drop off and pick up were extremely convenient and handled digitally.", createdAt: "2026-07-12" },
  { id: "rev-2", userId: "u-test", userName: "Aishwarya R.", userAvatar: "", carId: "car-creta", rating: 4, comment: "Excellent experience renting the Creta for our family trip to Warangal. Very clean and excellent sound system. Minor delay during pickup but support was proactive.", createdAt: "2026-07-15" },
  { id: "rev-3", userId: "u-admin", userName: "Vikram Sen", userAvatar: "", carId: "car-baleno", rating: 5, comment: "Amazing fuel economy and very easy to park in crowded areas. 10/10 recommendation!", createdAt: "2026-07-08" },
  { id: "rev-4", userId: "u-test", userName: "Nihal G.", userAvatar: "", carId: "car-xuv700", rating: 5, comment: "XUV700 was an absolute rocket! Zero mechanical issues, pristine leather interiors, and perfect ADAS. Our drive on ORR was marvelous.", createdAt: "2026-07-17" }
];

const initialTickets = [
  {
    id: "t-1",
    userId: "u-test",
    userName: "Sai Vardhan",
    subject: "KYC Verification Status",
    category: "KYC",
    message: "I uploaded my driving license. How long does the verification take? I have a booking upcoming tomorrow morning.",
    status: "open",
    replies: [
      { sender: "user", message: "I uploaded my driving license. How long does the verification take? I have a booking upcoming tomorrow morning.", timestamp: "2026-07-17T10:00:00Z" },
      { sender: "admin", message: "Hello Sai! Our team has verified your uploaded driving license. Your KYC is now marked as VERIFIED. You are good to drive! Enjoy your ride.", timestamp: "2026-07-17T11:30:00Z" }
    ],
    createdAt: "2026-07-17T10:00:00Z"
  }
];

const initialNotifications = [
  { id: "n-1", userId: "u-test", title: "KYC Approved", message: "Your driving license verification was successful! You are ready to book cars.", read: false, createdAt: "2026-07-17T11:30:00Z" },
  { id: "n-2", userId: "u-test", title: "Welcome to DriveEase!", message: "Enjoy the freedom of self-drive. Explore luxury SUVs and sleek hatchbacks in Hyderabad.", read: true, createdAt: "2026-07-16T09:00:00Z" }
];

const initialUsers = [
  {
    id: "u-admin",
    email: "admin@driveease.in",
    password: "AdminPassword123", // Pre-seeded
    name: "Admin DriveEase",
    phone: "9493011105",
    role: "admin",
    kycVerified: true,
    kycStatus: "verified",
    balance: 100000,
    rewardPoints: 5000,
    referralCode: "EASEADMIN",
    referralEarnings: 0,
    profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "u-test",
    email: "uy12779@gmail.com", // Matches the user's logged in email
    password: "Password123",
    name: "Uday Erusani",
    phone: "7997634891",
    role: "user",
    kycVerified: true,
    kycStatus: "verified",
    licenseNumber: "TS0920250043912",
    licenseImage: "license_uploaded_preview.png",
    balance: 5500,
    rewardPoints: 450,
    referralCode: "UDAY300",
    referredBy: "EASEADMIN",
    referralEarnings: 600,
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
  }
];

const initialBookings = [
  {
    id: "b-1",
    userId: "u-test",
    carId: "car-creta",
    carName: "Hyundai Creta SX(O)",
    carImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000",
    pickupLocation: "Madhapur (Hitech City)",
    dropLocation: "Madhapur (Hitech City)",
    pickupDate: "2026-07-20",
    dropDate: "2026-07-22",
    pickupTime: "10:00",
    dropTime: "18:00",
    couponCode: "DRIVEEASE",
    insuranceType: "standard",
    driverDetails: {
      name: "Uday Erusani",
      licenseNumber: "TS0920250043912",
      age: 24
    },
    charges: {
      basePrice: 5600,
      securityDeposit: 3000,
      tax: 1008, // 18% GST
      discount: 840, // 15% discount
      totalAmount: 8768
    },
    status: "upcoming",
    paymentStatus: "paid",
    paymentMethod: "UPI",
    createdAt: "2026-07-17T12:00:00Z"
  },
  {
    id: "b-2",
    userId: "u-test",
    carId: "car-baleno",
    carName: "Maruti Baleno Alpha",
    carImage: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=1000",
    pickupLocation: "Hyderabad Airport (RGIA)",
    dropLocation: "Hyderabad Airport (RGIA)",
    pickupDate: "2026-06-15",
    dropDate: "2026-06-16",
    pickupTime: "09:00",
    dropTime: "21:00",
    insuranceType: "basic",
    driverDetails: {
      name: "Uday Erusani",
      licenseNumber: "TS0920250043912",
      age: 24
    },
    charges: {
      basePrice: 1800,
      securityDeposit: 2000,
      tax: 324,
      discount: 0,
      totalAmount: 4124
    },
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    createdAt: "2026-06-14T14:30:00Z"
  }
];

// Load Database
function loadDb() {
  if (!fs.existsSync(DB_PATH)) {
    const defaultData = {
      cars: initialCars,
      users: initialUsers,
      bookings: initialBookings,
      coupons: initialCoupons,
      blogs: initialBlogs,
      reviews: initialReviews,
      tickets: initialTickets,
      notifications: initialNotifications
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), "utf8");
    return defaultData;
  }
  try {
    const content = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading database file, returning default data:", err);
    return {
      cars: initialCars,
      users: initialUsers,
      bookings: initialBookings,
      coupons: initialCoupons,
      blogs: initialBlogs,
      reviews: initialReviews,
      tickets: initialTickets,
      notifications: initialNotifications
    };
  }
}

// Save Database
function saveDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving database file:", err);
  }
}

// Auth Helper
function getUserIdFromToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  // Simple Mock JWT decoder: token has format user_id:role:email encoded in base64
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length >= 3) {
      return parts[0];
    }
  } catch (e) {
    return null;
  }
  return null;
}

// Generate token
function generateToken(user: any): string {
  const payload = `${user.id}:${user.role}:${user.email}`;
  return Buffer.from(payload).toString("base64");
}

// Initial DB load
let db = loadDb();

// Setup Express API endpoints
// Auth API
app.post("/api/auth/register", (req, res) => {
  const { name, email, phone, password, referredBy } = req.body;
  db = loadDb();

  const existing = db.users.find((u: any) => u.email === email);
  if (existing) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const referralCode = `DE-${name.replace(/\s+/g, "").substring(0, 4).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;
  const newUser = {
    id: `u-${Date.now()}`,
    name,
    email,
    password, // Stored as simple string for demonstration
    phone,
    role: "user",
    kycVerified: false,
    kycStatus: "unverified",
    balance: 0,
    rewardPoints: 100,
    referralCode,
    referredBy: referredBy || undefined,
    referralEarnings: 0,
    profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
  };

  // If referred by someone, add reward points
  if (referredBy) {
    const referrer = db.users.find((u: any) => u.referralCode === referredBy);
    if (referrer) {
      referrer.balance += 300; // Rs.300 bonus for referral
      referrer.referralEarnings += 300;
      newUser.balance += 150; // Rs.150 for sign up
      db.notifications.push({
        id: `n-${Date.now()}`,
        userId: referrer.id,
        title: "Referral Bonus Credited!",
        message: `Your referral code was used by ${name}. ₹300 credited to your wallet!`,
        read: false,
        createdAt: new Date().toISOString()
      });
    }
  }

  db.users.push(newUser);
  saveDb(db);

  const token = generateToken(newUser);
  res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role, kycStatus: newUser.kycStatus, kycVerified: newUser.kycVerified, balance: newUser.balance, rewardPoints: newUser.rewardPoints, referralCode: newUser.referralCode } });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  db = loadDb();

  const user = db.users.find((u: any) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = generateToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, kycStatus: user.kycStatus, kycVerified: user.kycVerified, balance: user.balance, rewardPoints: user.rewardPoints, referralCode: user.referralCode, licenseNumber: user.licenseNumber, profileImage: user.profileImage } });
});

app.post("/api/auth/google-login", (req, res) => {
  const { name, email, profileImage } = req.body;
  db = loadDb();

  let user = db.users.find((u: any) => u.email === email);
  if (!user) {
    const referralCode = `DE-${name.replace(/\s+/g, "").substring(0, 4).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;
    user = {
      id: `u-${Date.now()}`,
      name,
      email,
      password: `google-oauth-${Date.now()}`,
      phone: "",
      role: "user",
      kycVerified: false,
      kycStatus: "unverified",
      balance: 0,
      rewardPoints: 100,
      referralCode,
      referralEarnings: 0,
      profileImage: profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    };
    db.users.push(user);
    saveDb(db);
  }

  const token = generateToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, kycStatus: user.kycStatus, kycVerified: user.kycVerified, balance: user.balance, rewardPoints: user.rewardPoints, referralCode: user.referralCode, licenseNumber: user.licenseNumber, profileImage: user.profileImage } });
});

app.get("/api/auth/me", (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  db = loadDb();
  const user = db.users.find((u: any) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, kycStatus: user.kycStatus, kycVerified: user.kycVerified, licenseNumber: user.licenseNumber, licenseImage: user.licenseImage, balance: user.balance, rewardPoints: user.rewardPoints, referralCode: user.referralCode, referralEarnings: user.referralEarnings, profileImage: user.profileImage } });
});

app.post("/api/auth/kyc", (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { licenseNumber } = req.body;
  db = loadDb();
  const user = db.users.find((u: any) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.licenseNumber = licenseNumber;
  user.licenseImage = "uploaded_license_preview.png";
  user.kycStatus = "pending";
  // Auto-verify after 3 seconds for demonstration / mockup experience
  setTimeout(() => {
    const updatedDb = loadDb();
    const delayedUser = updatedDb.users.find((u: any) => u.id === userId);
    if (delayedUser && delayedUser.kycStatus === "pending") {
      delayedUser.kycStatus = "verified";
      delayedUser.kycVerified = true;
      delayedUser.rewardPoints += 150; // Welcome points
      updatedDb.notifications.push({
        id: `n-${Date.now()}`,
        userId: userId,
        title: "KYC Approved instantly!",
        message: "Congratulations! Your driving license has been approved. You have received 150 loyalty points. Start booking!",
        read: false,
        createdAt: new Date().toISOString()
      });
      saveDb(updatedDb);
    }
  }, 4000);

  saveDb(db);
  res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role, kycStatus: user.kycStatus, kycVerified: user.kycVerified, licenseNumber: user.licenseNumber } });
});

app.post("/api/auth/wallet", (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

  db = loadDb();
  const user = db.users.find((u: any) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.balance += Number(amount);
  db.notifications.push({
    id: `n-${Date.now()}`,
    userId: userId,
    title: "Wallet Refilled",
    message: `₹${amount} added successfully to your DriveEase wallet!`,
    read: false,
    createdAt: new Date().toISOString()
  });

  saveDb(db);
  res.json({ success: true, balance: user.balance });
});

// Cars API
app.get("/api/cars", (req, res) => {
  db = loadDb();
  let filteredCars = [...db.cars];

  const { type, fuel, transmission, seats, location, search, minPrice, maxPrice, sort } = req.query;

  if (type) {
    const types = (type as string).split(",");
    filteredCars = filteredCars.filter(c => types.includes(c.type));
  }
  if (fuel) {
    const fuels = (fuel as string).split(",");
    filteredCars = filteredCars.filter(c => fuels.includes(c.fuelType));
  }
  if (transmission) {
    const trans = (transmission as string).split(",");
    filteredCars = filteredCars.filter(c => trans.includes(c.transmission));
  }
  if (seats) {
    const seatCounts = (seats as string).split(",").map(Number);
    filteredCars = filteredCars.filter(c => seatCounts.includes(c.seats));
  }
  if (location) {
    filteredCars = filteredCars.filter(c => c.location.toLowerCase().includes((location as string).toLowerCase()));
  }
  if (search) {
    const query = (search as string).toLowerCase();
    filteredCars = filteredCars.filter(c => c.name.toLowerCase().includes(query) || c.brand.toLowerCase().includes(query));
  }
  if (minPrice) {
    filteredCars = filteredCars.filter(c => c.dailyPrice >= Number(minPrice));
  }
  if (maxPrice) {
    filteredCars = filteredCars.filter(c => c.dailyPrice <= Number(maxPrice));
  }

  // Sorting
  if (sort === "price-low") {
    filteredCars.sort((a, b) => a.dailyPrice - b.dailyPrice);
  } else if (sort === "price-high") {
    filteredCars.sort((a, b) => b.dailyPrice - a.dailyPrice);
  } else if (sort === "rating") {
    filteredCars.sort((a, b) => b.rating - a.rating);
  } else if (sort === "popularity") {
    filteredCars.sort((a, b) => b.rating - a.rating); // mockup popularity as rating
  }

  res.json(filteredCars);
});

app.get("/api/cars/:id", (req, res) => {
  db = loadDb();
  const car = db.cars.find((c: any) => c.id === req.params.id);
  if (!car) return res.status(404).json({ error: "Car not found" });

  const reviews = db.reviews.filter((r: any) => r.carId === req.params.id);
  res.json({ ...car, reviews });
});

// Bookings API
app.post("/api/bookings", (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { carId, pickupLocation, dropLocation, pickupDate, dropDate, pickupTime, dropTime, couponCode, insuranceType, driverDetails, charges } = req.body;
  db = loadDb();

  const car = db.cars.find((c: any) => c.id === carId);
  if (!car) return res.status(404).json({ error: "Car not found" });

  const bookingId = `b-${Date.now()}`;
  const newBooking = {
    id: bookingId,
    userId,
    carId,
    carName: car.name,
    carImage: car.image,
    pickupLocation,
    dropLocation,
    pickupDate,
    dropDate,
    pickupTime,
    dropTime,
    couponCode,
    insuranceType,
    driverDetails,
    charges,
    status: "upcoming",
    paymentStatus: "paid",
    paymentMethod: "UPI/Card (Simulated)",
    createdAt: new Date().toISOString()
  };

  db.bookings.push(newBooking);

  // Award reward points
  const user = db.users.find((u: any) => u.id === userId);
  if (user) {
    user.rewardPoints += Math.floor(charges.totalAmount / 20); // 5% points back
  }

  // Create notifications
  db.notifications.push({
    id: `n-${Date.now()}`,
    userId,
    title: "Booking Confirmed! 🎉",
    message: `Your booking for ${car.name} from ${pickupDate} to ${dropDate} has been confirmed. Security code: ${Math.floor(1000 + Math.random() * 9000)}`,
    read: false,
    createdAt: new Date().toISOString()
  });

  saveDb(db);
  res.status(201).json(newBooking);
});

app.get("/api/bookings/me", (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  db = loadDb();
  const userBookings = db.bookings.filter((b: any) => b.userId === userId);
  res.json(userBookings);
});

app.post("/api/bookings/:id/cancel", (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  db = loadDb();
  const booking = db.bookings.find((b: any) => b.id === req.params.id && (b.userId === userId || userId === "u-admin"));
  if (!booking) return res.status(404).json({ error: "Booking not found" });

  booking.status = "cancelled";
  booking.paymentStatus = "refunded";

  // Refund to wallet
  const user = db.users.find((u: any) => u.id === booking.userId);
  if (user) {
    const refundAmount = booking.charges.totalAmount;
    user.balance += refundAmount;
    db.notifications.push({
      id: `n-${Date.now()}`,
      userId: user.id,
      title: "Booking Refund Credited",
      message: `₹${refundAmount} has been refunded to your wallet for the cancellation of your booking ${booking.id}.`,
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  saveDb(db);
  res.json({ success: true, booking });
});

// Admin Booking Operations
app.post("/api/admin/bookings/:id/status", (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  // Verify Admin
  db = loadDb();
  const adminUser = db.users.find((u: any) => u.id === userId && u.role === "admin");
  if (!adminUser) return res.status(403).json({ error: "Access Denied" });

  const { status } = req.body;
  const booking = db.bookings.find((b: any) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });

  booking.status = status;
  if (status === "completed") {
    booking.paymentStatus = "paid";
  }

  db.notifications.push({
    id: `n-${Date.now()}`,
    userId: booking.userId,
    title: `Booking Status Update: ${status.toUpperCase()}`,
    message: `Your booking ${booking.id} for ${booking.carName} has been marked as ${status}.`,
    read: false,
    createdAt: new Date().toISOString()
  });

  saveDb(db);
  res.json({ success: true, booking });
});

// Coupon APIs
app.get("/api/coupons", (req, res) => {
  db = loadDb();
  res.json(db.coupons);
});

app.post("/api/coupons/validate", (req, res) => {
  const { code, amount } = req.body;
  db = loadDb();

  const coupon = db.coupons.find((c: any) => c.code.toUpperCase() === code.toUpperCase() && c.active);
  if (!coupon) return res.status(404).json({ error: "Invalid or expired coupon code" });

  if (amount < coupon.minBookingValue) {
    return res.status(400).json({ error: `Coupon requires minimum booking value of ₹${coupon.minBookingValue}` });
  }

  res.json({ discountPercent: coupon.discountPercent, code: coupon.code, description: coupon.description });
});

// Support Tickets APIs
app.get("/api/tickets", (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  db = loadDb();
  const user = db.users.find((u: any) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.role === "admin") {
    res.json(db.tickets);
  } else {
    res.json(db.tickets.filter((t: any) => t.userId === userId));
  }
});

app.post("/api/tickets", (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { subject, category, message } = req.body;
  db = loadDb();
  const user = db.users.find((u: any) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const newTicket = {
    id: `t-${Date.now()}`,
    userId,
    userName: user.name,
    subject,
    category,
    message,
    status: "open",
    replies: [
      { sender: "user", message, timestamp: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString()
  };

  db.tickets.push(newTicket);
  saveDb(db);
  res.status(201).json(newTicket);
});

app.post("/api/tickets/:id/reply", (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { message } = req.body;
  db = loadDb();

  const user = db.users.find((u: any) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const ticket = db.tickets.find((t: any) => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });

  const replySender = user.role === "admin" ? "admin" : "user";
  ticket.replies.push({
    sender: replySender,
    message,
    timestamp: new Date().toISOString()
  });

  if (replySender === "admin") {
    ticket.status = "resolved"; // mark as resolved or answered when admin replies
    db.notifications.push({
      id: `n-${Date.now()}`,
      userId: ticket.userId,
      title: "Support Ticket Resolved",
      message: `The support team replied to your ticket: "${ticket.subject}". Check your dashboard.`,
      read: false,
      createdAt: new Date().toISOString()
    });
  } else {
    ticket.status = "open"; // reopen
  }

  saveDb(db);
  res.json(ticket);
});

// Notifications API
app.get("/api/notifications", (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  db = loadDb();
  const userNotifs = db.notifications.filter((n: any) => n.userId === userId);
  res.json(userNotifs);
});

app.put("/api/notifications/mark-read", (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  db = loadDb();
  db.notifications.forEach((n: any) => {
    if (n.userId === userId) {
      n.read = true;
    }
  });

  saveDb(db);
  res.json({ success: true });
});

// Reviews API
app.post("/api/reviews", (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { carId, rating, comment } = req.body;
  db = loadDb();

  const user = db.users.find((u: any) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const newReview = {
    id: `rev-${Date.now()}`,
    userId,
    userName: user.name,
    userAvatar: user.profileImage,
    carId,
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString().split("T")[0]
  };

  db.reviews.push(newReview);

  // Recalculate car rating
  const carReviews = db.reviews.filter((r: any) => r.carId === carId);
  const avgRating = carReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / carReviews.length;
  const car = db.cars.find((c: any) => c.id === carId);
  if (car) {
    car.rating = Number(avgRating.toFixed(2));
  }

  saveDb(db);
  res.status(201).json(newReview);
});

// Blogs API
app.get("/api/blogs", (req, res) => {
  db = loadDb();
  res.json(db.blogs);
});

app.get("/api/blogs/:id", (req, res) => {
  db = loadDb();
  const blog = db.blogs.find((b: any) => b.id === req.params.id);
  if (!blog) return res.status(404).json({ error: "Blog not found" });
  res.json(blog);
});

app.post("/api/blogs/:id/like", (req, res) => {
  db = loadDb();
  const blog = db.blogs.find((b: any) => b.id === req.params.id);
  if (!blog) return res.status(404).json({ error: "Blog not found" });

  blog.likes += 1;
  saveDb(db);
  res.json({ success: true, likes: blog.likes });
});

// Admin Panel Analytics Statistics
app.get("/api/dashboard/stats", (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  db = loadDb();
  const user = db.users.find((u: any) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.role === "admin") {
    // Generate admin analytics
    const totalUsers = db.users.filter((u: any) => u.role === "user").length;
    const totalCars = db.cars.length;
    const totalBookingsCount = db.bookings.length;

    // Filter payments
    const completedBookings = db.bookings.filter((b: any) => b.status === "completed" || b.status === "upcoming" || b.status === "ongoing");
    const totalRevenue = completedBookings.reduce((sum: number, b: any) => sum + (b.charges?.totalAmount || 0), 0);

    // Fleet status
    const availableCars = db.cars.filter((c: any) => c.availability).length;
    const busyCars = totalCars - availableCars;

    // Revenue by month mock
    const monthlyRevenue = [
      { name: "Feb", revenue: Math.floor(totalRevenue * 0.15) },
      { name: "Mar", revenue: Math.floor(totalRevenue * 0.20) },
      { name: "Apr", revenue: Math.floor(totalRevenue * 0.18) },
      { name: "May", revenue: Math.floor(totalRevenue * 0.22) },
      { name: "Jun", revenue: Math.floor(totalRevenue * 0.12) },
      { name: "Jul", revenue: Math.floor(totalRevenue * 0.13) }
    ];

    res.json({
      totalUsers,
      totalCars,
      totalBookingsCount,
      totalRevenue,
      availableCars,
      busyCars,
      monthlyRevenue,
      pendingKYCs: db.users.filter((u: any) => u.kycStatus === "pending").length,
      supportTicketsOpen: db.tickets.filter((t: any) => t.status === "open").length
    });
  } else {
    // Generate User specific stats
    const userBookings = db.bookings.filter((b: any) => b.userId === userId);
    const completedCount = userBookings.filter((b: any) => b.status === "completed").length;
    const activeCount = userBookings.filter((b: any) => b.status === "upcoming" || b.status === "ongoing").length;
    const totalSpent = userBookings.filter((b: any) => b.paymentStatus === "paid").reduce((sum: number, b: any) => sum + (b.charges?.totalAmount || 0), 0);

    res.json({
      completedCount,
      activeCount,
      totalSpent,
      rewardPoints: user.rewardPoints,
      balance: user.balance,
      kycStatus: user.kycStatus
    });
  }
});

// Admin Car Management
app.post("/api/admin/cars", (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  db = loadDb();
  const adminUser = db.users.find((u: any) => u.id === userId && u.role === "admin");
  if (!adminUser) return res.status(403).json({ error: "Access Denied" });

  const carData = req.body;
  const newCar = {
    id: `car-${Date.now()}`,
    ...carData,
    rating: 5.0,
    availability: true
  };

  db.cars.push(newCar);
  saveDb(db);
  res.status(201).json(newCar);
});

app.put("/api/admin/cars/:id", (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  db = loadDb();
  const adminUser = db.users.find((u: any) => u.id === userId && u.role === "admin");
  if (!adminUser) return res.status(403).json({ error: "Access Denied" });

  const car = db.cars.find((c: any) => c.id === req.params.id);
  if (!car) return res.status(404).json({ error: "Car not found" });

  Object.assign(car, req.body);
  saveDb(db);
  res.json(car);
});

app.delete("/api/admin/cars/:id", (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  db = loadDb();
  const adminUser = db.users.find((u: any) => u.id === userId && u.role === "admin");
  if (!adminUser) return res.status(403).json({ error: "Access Denied" });

  db.cars = db.cars.filter((c: any) => c.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// Admin KYC and User Management Operations
app.get("/api/admin/users", (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  db = loadDb();
  const adminUser = db.users.find((u: any) => u.id === userId && u.role === "admin");
  if (!adminUser) return res.status(403).json({ error: "Access Denied" });

  res.json(db.users.map((u: any) => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, kycStatus: u.kycStatus, balance: u.balance, rewardPoints: u.rewardPoints })));
});

app.post("/api/admin/users/:id/kyc", (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  db = loadDb();
  const adminUser = db.users.find((u: any) => u.id === userId && u.role === "admin");
  if (!adminUser) return res.status(403).json({ error: "Access Denied" });

  const { status } = req.body; // 'verified' or 'unverified'
  const targetUser = db.users.find((u: any) => u.id === req.params.id);
  if (!targetUser) return res.status(404).json({ error: "User not found" });

  targetUser.kycStatus = status;
  targetUser.kycVerified = status === "verified";

  db.notifications.push({
    id: `n-${Date.now()}`,
    userId: targetUser.id,
    title: status === "verified" ? "KYC Verified! ✅" : "KYC Rejected ❌",
    message: status === "verified"
      ? "Your driving license has been approved by the admin. Happy motoring!"
      : "Your driving license upload was rejected. Please upload a clear copy of your license in profile management.",
    read: false,
    createdAt: new Date().toISOString()
  });

  saveDb(db);
  res.json({ success: true });
});

// AI Chatbot Agent API using Google GenAI SDK
app.post("/api/chat", async (req, res) => {
  const { message, chatHistory } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Clean fallback assistant response if API key is not configured
    return res.json({
      text: "Hello! I am the DriveEase Self Drive Cars Concierge. It looks like the Gemini API is starting up or needs setup. However, I can let you know that our top available premium cars in Hyderabad include the sleek *Hyundai Creta SX(O)* (SUV), the heavy-duty *Mahindra XUV700 AX7 L* (7-Seater), and the ultra-luxury *Mercedes-Benz C-Class* at Banjara Hills! How can I help you today?"
    });
  }

  try {
    db = loadDb();
    // Gather system context
    const carListText = db.cars.map((c: any) =>
      `- ${c.name} (${c.type}): Daily price ₹${c.dailyPrice}, Location: ${c.location}, Transmission: ${c.transmission}, Seats: ${c.seats}, Mileage: ${c.mileage}kmpl.`
    ).join("\n");

    const systemInstruction = `You are "DriveEase AI Assistant", the classy, professional, and knowledgeable digital concierge for DriveEase Self Drive Cars in Hyderabad, Telangana.
Your primary contact details:
- Email: erusaniuday@gmail.com
- Main Offices: Banjara Hills, Gachibowli, & RGIA Airport, Hyderabad.
- Support Numbers: 7997634891 / 9493011105.
- WhatsApp booking is fully available.

Current Fleet details in our database:
${carListText}

Policy and Guidelines:
- Driver Age: Must be at least 21 years old.
- License: Original Valid Indian Driver's License required. Driving license must be uploaded in the profile section for KYC validation.
- Refund policy: Cancel up to 24 hours prior for a full refund. Less than 24 hours incurs standard processing fee (typically 50%).
- Fuel Policy: "Full-to-Full". Renter receives the car with a full tank and must return it full.
- Security Deposit: Ranges from ₹2,000 to ₹5,000 depending on vehicle. Returned instantly upon successful check-out return.

Respond to the customer's queries about car recommendations, booking pricing, support details, and rules. Keep your response highly polished, engaging, professional, and classy. Highlight car choices in bold. Always suggest using the "Book Now" buttons to lock in low rates.`;

    // Initialize the new Google GenAI Client
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });

    // We can use chat object or generateContent with custom message arrays
    const formattedHistory = chatHistory ? chatHistory.map((ch: any) => ({
      role: ch.sender === "user" ? "user" : "model",
      parts: [{ text: ch.message }]
    })) : [];

    // Append user message
    formattedHistory.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedHistory,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    const replyText = response.text || "I am here to guide you with DriveEase. What kind of self-drive car are you looking to rent?";
    res.json({ text: replyText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to fetch response from AI Assistant." });
  }
});

// Setup Vite Dev server or Serve static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite HMR middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DriveEase Server running at http://localhost:${PORT}`);
  });
}

startServer();
