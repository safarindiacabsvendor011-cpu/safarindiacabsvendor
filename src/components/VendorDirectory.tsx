import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Search, 
  Star,
  Award,
  CheckCircle2
} from 'lucide-react';
import { VERIFIED_VENDORS, CITIES_LIST } from '../data/mockData';
import { UserProfile } from '../types';

export const VendorDirectory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');

  const filtered = VERIFIED_VENDORS.filter((v: UserProfile) => {
    if (selectedCity !== 'All Cities' && v.city !== selectedCity) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.companyName.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleWhatsApp = (vendor: UserProfile) => {
    const text = `Hello ${vendor.name}, I found your agency (${vendor.companyName}) on the Safar India Cabs Vendor B2B Network. Would like to connect for cab duties in ${vendor.city}.`;
    window.open(`https://api.whatsapp.com/send?phone=${vendor.phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full mb-2 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% KYC & Commercial License Verified Operators</span>
            </div>
            <h2 className="text-xl font-black text-[#0a2540] tracking-tight">
              Verified Travel Agents & Cab Fleet Owners
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Connect directly with verified intercity cab operators, transporters, and travel agencies across India
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vendor, city, role..."
                className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white w-48 sm:w-64"
              />
            </div>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {CITIES_LIST.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((vendor: UserProfile) => (
          <div
            key={vendor.id}
            className="bg-white border-2 border-slate-200 hover:border-amber-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0a2540] flex items-center justify-center font-black text-lg text-amber-400 shadow-xs">
                  {vendor.companyName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm sm:text-base">
                    <span>{vendor.companyName}</span>
                    {vendor.isVerified && (
                      <span title="KYC Verified">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    Contact: <strong className="text-slate-800">{vendor.name}</strong> • {vendor.city}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-black">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{vendor.rating}</span>
              </div>
            </div>

            {/* Badges & Membership */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-md border border-amber-300">
                ★ {vendor.membershipPlan} Partner
              </span>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
                {vendor.role}
              </span>
              {vendor.isVerified && (
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified Identity</span>
                </span>
              )}
            </div>

            {/* Performance Stats */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 grid grid-cols-2 gap-2 text-xs mb-4">
              <div>
                <span className="text-slate-500 text-[10px] font-medium block">Trips Completed:</span>
                <span className="font-black text-emerald-700">{vendor.completedDuties} Duties</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] font-medium block">Account Status:</span>
                <span className="font-black text-slate-900 capitalize">{vendor.status || 'Active'}</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-200 text-[11px] text-slate-600">
                <span className="text-slate-500 font-medium">Network Member Since: </span>
                <strong className="text-slate-800 font-semibold">{vendor.joinedDate || 'Jan 2026'}</strong>
              </div>
            </div>

            {/* Contact buttons */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <a
                href={`tel:${vendor.phone}`}
                className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-bold transition"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call ({vendor.phone})</span>
              </a>

              <button
                onClick={() => handleWhatsApp(vendor)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
