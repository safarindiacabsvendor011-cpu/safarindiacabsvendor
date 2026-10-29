import React from 'react';
import { 
  ShieldCheck, 
  User, 
  Crown, 
  Phone, 
  Mail, 
  MapPin, 
  Car, 
  CreditCard, 
  Users, 
  FileText, 
  Sparkles, 
  ChevronRight, 
  Star,
  Award
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  onOpenMembership: () => void;
  onOpenWallet: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onOpenMembership,
  onOpenWallet
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-5">
        <div className="relative">
          <img 
            src="/assets/aistudio/IMG-20261029-WA0001_67f0d119.jpg" 
            alt="Safar India Cabs Logo" 
            className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
          />
          <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow-2xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-black text-[#0a2540]">
              {user.name}
            </h2>
            <span className="bg-emerald-50 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
              ✓ Verified Partner
            </span>
          </div>

          <p className="text-xs text-slate-500 font-bold mt-0.5">
            {user.companyName} • {user.role}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs">
            <div className="flex items-center gap-1 bg-amber-50 text-amber-800 font-black px-2.5 py-0.5 rounded-lg border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{user.rating} (6 Verified Reviews)</span>
            </div>

            <div className="font-mono text-slate-700 font-bold">
              📞 {user.phone}
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Banner (as seen in video) */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-4 text-slate-950 font-black shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-950/20 flex items-center justify-center">
            <Crown className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="text-sm font-black uppercase tracking-wider">
              {user.membershipPlan} Partner Subscription Active
            </div>
            <div className="text-xs font-bold text-slate-900">
              Expires On: <span className="underline">Oct 30, 2026</span> • 0% Platform Fee
            </div>
          </div>
        </div>

        <button
          onClick={onOpenMembership}
          className="bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-xs"
        >
          Manage Plans
        </button>
      </div>

      {/* Account Navigation List */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 text-xs font-black uppercase tracking-wider text-[#0a2540]">
          Account Management
        </div>

        <button 
          onClick={onOpenWallet}
          className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="font-black text-sm text-slate-900">Commission Wallet & Balance</div>
              <div className="text-xs text-slate-500">Available: ₹{(user.walletBalance ?? 0).toLocaleString('en-IN')}</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <div className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="font-black text-sm text-slate-900">Manage Drivers & Fleet</div>
              <div className="text-xs text-slate-500">Assign drivers to claimed booking vouchers</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <div className="font-black text-sm text-slate-900">Manage Vehicles (Sedans, SUVs, Crysta)</div>
              <div className="text-xs text-slate-500">Commercial permits, RC, and fitness records</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="font-black text-sm text-slate-900">KYC & GST Documentation</div>
              <div className="text-xs text-slate-500">Verified badge active on all broadcasted duties</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
};
