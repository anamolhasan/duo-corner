export type ProductAttribute = {
  label: string;
  value: string;
};

export type Product = {
  id: number;
  name: string;
  shortName: string;
  basePrice: number;
  originalPrice: string;
  images: string[];
  videoUrl: string;
  badge: string;
  saving: string;
  description: string;
  attributes: ProductAttribute[];
};

export const merchantSpecialNote = "⚠️ বিশেষ নির্দেশনা:  প্রিয় গ্রাহক, আপনি জেনেছেন আমাদের লভ্যাংশের টাকা দিয়ে অসহায় দুঃস্থ মানুষদের খাবারের ব্যবস্থা করা হবে , আপনিও আমাদের সেই মহৎ কাজের সঙ্গী হতে চলেছেন🥀 ❌বিনা প্রয়োজনে ফেইক অর্ডার করে এক টাকারও ক্ষতি করলে সেটা লভ্যাংশ থেকে কমে যাবে এবং সেই দায় আপনার উপরে থাকবে, ✅আপনার বিশ্বস্ততার জন্য সম্পূর্ণ ক্যাশ অন ডেলিভারিতে প্রোডাক্টটি পাঠানো হবে! ধন্যবাদ,";

// এখানে divisionData এক্সপোর্ট করা হলো যা CheckoutForm.tsx এর জন্য দরকার
export const divisionData: Record<string, Record<string, string[]>> = {
  "Dhaka": {
    "Dhaka": ["Dhaka Sadar", "Gulshan", "Banani", "Dhanmondi", "Mirpur", "Uttara", "Savar", "Keraniganj"],
    "Gazipur": ["Gazipur Sadar", "Kaliakair", "Kapasia", "Sreepur", "Kaliganj"],
    "Narayanganj": ["Narayanganj Sadar", "Bandar", "Rupganj", "Sonargaon", "Araihazar"]
  },
  "Habiganj": {
    "Habiganj": ["Habiganj Sadar", "Bahubal", "Chunarughat", "Madhabpur", "Nabiganj", "Ajmiriganj", "Baniachong", "Lakhai", "Shaistaganj"]
  },
  "Sylhet": {
    "Sylhet": ["Sylhet Sadar", "Beanibazar", "Vishwanath", "Companiganj", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintapur", "Kanaighat"],
    "Moulvibazar": ["Moulvibazar Sadar", "Sreemangal", "Kulaura", "Kamalganj"]
  },
  "Chittagong": {
    "Chittagong": ["Chittagong Sadar", "Pahartali", "Kotwali", "Chandgaon", "Double Mooring", "Hathazari", "Sitakunda"],
    "Cox's Bazar": ["Cox's Bazar Sadar", "Chakaria", "Teknaf", "Ramu"]
  },
  "Barishal": {
    "Barishal": ["Barishal Sadar", "Bakerganj", "Babuganj", "Wazirpur", "Mehendiganj", "Muladi", "Hizla"],
    "Bhola": ["Bhola Sadar", "Char Fasson", "Burhanuddin"]
  },
  "Rajshahi": {
    "Rajshahi": ["Rajshahi Sadar", "Boalia", "Motihar", "Shah Makhdum", "Paba", "Tanore"],
    "Bogura": ["Bogura Sadar", "Sherpur", "Shibganj", "Gabtali"]
  },
  "Khulna": {
    "Khulna": ["Khulna Sadar", "Sonadanga", "Khalishpur", "Daulatpur", "Khan Jahan Ali"],
    "Jashore": ["Jashore Sadar", "Abhaynagar", "Bagherpara"]
  }
};

// পুরনো কোডের ব্যাকওয়ার্ড কম্প্যাটিবিলিটির জন্য bangladeshData ও রাখা হলো
export const bangladeshData: { [key: string]: string[] } = {
  "Dhaka": ["Dhaka Sadar", "Gulshan", "Banani", "Dhanmondi", "Mirpur", "Uttara", "Savar", "Keraniganj"],
  "Habiganj": ["Habiganj Sadar", "Bahubal", "Chunarughat", "Madhabpur", "Nabiganj", "Ajmiriganj", "Baniachong", "Lakhai", "Shaistaganj"],
  "Sylhet": ["Sylhet Sadar", "Beanibazar", "Vishwanath", "Companiganj", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintapur", "Kanaighat"],
  "Chittagong": ["Chittagong Sadar", "Pahartali", "Kotwali", "Chandgaon", "Double Mooring", "Hathazari", "Sitakunda"],
  "Barishal": ["Barishal Sadar", "Bakerganj", "Babuganj", "Wazirpur", "Mehendiganj", "Muladi", "Hizla"],
  "Rajshahi": ["Rajshahi Sadar", "Boalia", "Motihar", "Shah Makhdum", "Paba", "Tanore"],
  "Khulna": ["Khulna Sadar", "Sonadanga", "Khalishpur", "Daulatpur", "Khan Jahan Ali"],
};

// অত্যন্ত শক্তিশালী ইমেজ পার্সার যা গুগল শিটের ৪টি কলাম বা স্টริง থেকে সবকটি ছবি লুফে নেবে
export const parseImages = (input: any): string[] => {
  if (Array.isArray(input)) {
    return input.map(img => {
      let clean = String(img).trim();
      return clean.startsWith('/') ? clean : '/' + clean;
    });
  }
  if (typeof input === 'string' && input.trim() !== '') {
    return input.split(',').map(img => {
      let clean = img.trim();
      return clean ? (clean.startsWith('/') ? clean : '/' + clean) : '';
    }).filter(Boolean);
  }
  return ["/parl.jpg", "/parl1.jpg", "/parl2.jpg", "/parl3.jpg"];
};

export const products: Product[] = [
  {
    id: 1,
    name: "Love parl Necklace with gift box",
    shortName: "Love parl Necklace",
    basePrice: 799,
    originalPrice: "৳999",
    images: parseImages("parl.jpg, parl1.jpg, parl2.jpg, parl3.jpg"),
    videoUrl: "/video.mp4",
    badge: "🔥 Hot",
    saving: "Save ৳200",
    description: "সুন্দর Premium Gift Box Presentation সহ চমৎকার নেকলেস সেট।",
    attributes: [
      { label: "Product Type", value: "Pearl Gift Box / Pearl Necklace" },
      { label: "Design", value: "Heart-Shaped Pendant" }
    ]
  }
];

export const taka = (amount: number) => `৳ ${amount}`;
export const whatsappLink = "https://wa.me/8801777156691";
export const whatsappChatLink = "https://wa.me/8801777156691?text=Hi%20Duo%20Corner";