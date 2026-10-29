import React, { useState } from 'react';
import { 
  Car, 
  MapPin, 
  Clock, 
  Phone, 
  PlusCircle, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Search,
  MessageSquare
} from 'lucide-react';
import { ReturnCab, UserProfile } from '../types';

interface KhaliGadiBoardProps {
  returnCabs: ReturnCab[];
  currentUser: UserProfile;
  onOpenPostReturnCab: () => void;
}

export const KhaliGadiBoard: React.FC<KhaliGadiBoardProps> = ({
  returnCabs,
  currentUser,
  onOpenPostReturnCab
}) => {
  const [searchCity, setSearchCity] = useState('');

  const filtered = returnCabs.filter((cab) => {
    if (!searchCity.trim()) return true;
    const q = searchCity.toLowerCase();
    return (
      cab.fromCity.toLowerCase().includes(q) ||
      cab.toCity.toLowerCase().includes(q) ||
      cab.vehicleType.toLowerCase().includes(q) ||
      cab.driverName.toLowerCase().includes(q)
    );
  });

  const handleBookCabWhatsApp = (cab: ReturnCab) => {
    const text = 
      `*🚗 Safar India Cabs - Return Cab Inquiry*\n\n` +
      `Hello ${cab.driverName},\n` +
      `I saw your return vehicle on the Safar India Cabs Vendor App:\n` +
      `• *Route:* ${cab.fromCity} ➔ ${cab.toCity}\n` +
      `• *Car Model:* ${cab.vehicleType} (${cab.vehicleNumber})\n` +
      `• *Schedule:* ${cab.departureDate} at ${cab.departureTime}\n` +
      `• *Offered Rate:* ₹${cab.discountedFare}\n\n` +
      `Is this cab available for my passenger?`;
    window.open(`https://api.whatsapp.com/send?phone=${cab.driverPhone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Return Cab Hero Banner */}
      <div className="relative bg-[#0a2540] rounded-3xl p-6 sm:p-8 text-white shadow-md overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none hidden md:block">
          <img 
            src="/assets/aistudio/IMG-20261029-WA0000_12601531.jpg" 
            alt="Safar India Cabs Fleet" 
            className="w-full h-full object-cover object-left"
          />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Empty Return Cab Exchange</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Never Return Empty: Book Return Trips at B2B Rates
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Eliminate dead mileage fuel losses. If your vehicle is returning empty from another city, broadcast it here or book returning cabs at 40% discounted B2B rates.
          </p>

          <div className="mt-5">
            <button
              onClick={onOpenPostReturnCab}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>+ Post Your Empty Cab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Search by city (e.g. Jaipur, Pune, Delhi, Haridwar)..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
          />
        </div>

        <div className="text-xs text-slate-600 font-medium">
          Available Return Cabs:{' '}
          <strong className="text-[#0a2540] font-black text-sm">{filtered.length}</strong>
        </div>
      </div>

      {/* Cabs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((cab) => (
          <div
            key={cab.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 transition shadow-xs hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2 text-base font-black text-[#0a2540]">
                  <span>{cab.fromCity}</span>
                  <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{cab.toCity}</span>
                </div>
                <div className="text-xs font-bold text-slate-600 mt-0.5">
                  {cab.vehicleType}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                  Discounted Fare
                </div>
                <div className="text-xl font-black text-amber-600">
                  ₹{cab.discountedFare}
                </div>
              </div>
            </div>

            {/* Cab & Time tags */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-slate-500 text-[10px] flex items-center gap-1 mb-0.5 font-medium">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>Departure Time</span>
                </div>
                <div className="font-bold text-slate-900">
                  {cab.departureDate}, {cab.departureTime}
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-slate-500 text-[10px] flex items-center gap-1 mb-0.5 font-medium">
                  <Car className="w-3 h-3 text-indigo-600" />
                  <span>Vehicle Number</span>
                </div>
                <div className="font-mono font-bold text-slate-900 uppercase">
                  {cab.vehicleNumber}
                </div>
              </div>
            </div>

            {/* Driver Contact & Action */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-[#0a2540]">
                  {cab.driverName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    <span>{cab.driverName}</span>
                    {cab.isVerified && (
                      <span title="Verified Cab">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {cab.companyName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${cab.driverPhone}`}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                  title="Call Driver"
                >
                  <Phone className="w-4 h-4 text-emerald-700" />
                </a>

                <button
                  onClick={() => handleBookCabWhatsApp(cab)}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition cursor-pointer shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
