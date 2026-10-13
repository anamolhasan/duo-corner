'use client';
import { useUser, useClerk, SignIn } from '@clerk/nextjs';

export default function AdminAuth({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  // ১. ক্লার্ক লোড হওয়ার সময়কার লোডিং স্টেট
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 font-bold text-lg animate-pulse">অপেক্ষা করুন...</div>
      </div>
    );
  }

  // ২. যদি লগইন করা না থাকে -> আইডি ও পাসওয়ার্ড দিয়ে লগইন করার ফর্ম দেখাবে
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-black text-gray-800">Duo Corner Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করতে আপনার সঠিক আইডি ও পাসওয়ার্ড দিয়ে সাইন ইন করুন</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <SignIn routing="hash" />
        </div>
      </div>
    );
  }

  // ৩. লগইন করা থাকলে হেডারসহ লগআউট বাটন এবং মূল অ্যাডমিন ড্যাশবোর্ডের কন্টেন্ট দেখাবে
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-black text-gray-800">Duo Corner Admin Dashboard</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              লগইন করা অ্যাডমিন: <span className="font-semibold text-gray-700">{user?.primaryEmailAddress?.emailAddress}</span>
            </p>
          </div>
          <button 
            onClick={() => signOut()}
            className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-xl text-xs font-bold border border-rose-200 transition cursor-pointer"
          >
            লগআউট / Sign Out
          </button>
        </div>
      </div>

      {/* মূল অ্যাডমিন পেজের কন্টেন্ট এখানে রেন্ডার হবে */}
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
}