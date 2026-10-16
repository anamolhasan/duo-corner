const fs = require('fs');
const path = require('path');

function cleanFolder(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // node_modules, .git বা .next ফোল্ডার বাদ রাখার জন্য
    if (['node_modules', '.git', '.next'].includes(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      cleanFolder(fullPath);
      
      // সাব-ফোল্ডার চেক করার পর যদি সেটি খালি হয়ে যায়, তবে সেটি ডিলিট করে দেব
      const remaining = fs.readdirSync(fullPath);
      if (remaining.length === 0) {
        fs.rmdirSync(fullPath);
        console.log(`🗑️ খালি ফোল্ডার ডিলিট করা হয়েছে: ${fullPath}`);
      }
    } else if (entry.isFile()) {
      const stats = fs.statSync(fullPath);
      // যদি ফাইলের সাইজ ০ বাইট হয় (খালি ফাইল)
      if (stats.size === 0) {
        fs.unlinkSync(fullPath);
        console.log(`📄 খালি ফাইল ডিলিট করা হয়েছে: ${fullPath}`);
      }
    }
  }
}

// পুরো app ফোল্ডার বা প্রজেক্টের ভেতর স্ক্যান করবে
cleanFolder('./app'); 
console.log('✨ প্রজেক্ট পরিষ্কার করার কাজ সম্পন্ন হয়েছে!');