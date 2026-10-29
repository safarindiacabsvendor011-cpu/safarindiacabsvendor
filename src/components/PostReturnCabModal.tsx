import React, { useState } from 'react';
import { 
  X, 
  Car, 
  Sparkles
} from 'lucide-react';
import { ReturnCab, UserProfile, VehicleType } from '../types';
import { CITIES_LIST } from '../data/mockData';
import confetti from 'canvas-confetti';

interface PostReturnCabModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onAddReturnCab: (cab: ReturnCab) => void;
}

export const PostReturnCabModal: React.FC<PostReturnCabModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAddReturnCab
}) => {
  const [fromCity, setFromCity] = useState('Jaipur');
  const [toCity, setToCity] = useState('Delhi NCR');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Sedan (Dzire/Etios/Aura)');
  const [vehicleNumber, setVehicleNumber] = useState('RJ 14 TA 9090');
  const [departureDate, setDepartureDate] = useState('Today');
  const [departureTime, setDepartureTime] = useState('06:00 PM');
  const [discountedFare, setDiscountedFare] = useState(2000);
  const [driverName, setDriverName] = useState(currentUser.name);
  const [driverPhone, setDriverPhone] = useState(currentUser.phone);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCab: ReturnCab = {
      id: `ret-${Date.now()}`,
      driverName: driverName.trim() || currentUser.name,
      driverPhone: driverPhone.trim() || currentUser.phone,
      companyName: currentUser.companyName,
      vehicleType,
      vehicleNumber: vehicleNumber.trim() || 'DL 01 TA 0001',
      fromCity,
      toCity,
      departureDate,
      departureTime,
      discountedFare,
      emptySeatsOrFull: 'Full Cab Returning Empty',
      isVerified: currentUser.isVerified,
      postedAt: 'Just now'
    };

    onAddReturnCab(newCab);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-800 my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0a2540] p-4 sm:p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                Post Empty Return Cab
              </h3>
              <p className="text-xs text-slate-300">
                Pick up return journey passengers and save fuel expenses
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-600 font-bold block mb-1">
                From City *
              </label>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              >
                {CITIES_LIST.filter(c => c !== 'All Cities').map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-600 font-bold block mb-1">
                To Destination *
              </label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              >
                {CITIES_LIST.filter(c => c !== 'All Cities').map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-600 font-bold block mb-1">
                Vehicle Category
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              >
                <option value="Sedan (Dzire/Etios/Aura)">Sedan (Dzire/Etios)</option>
                <option value="SUV (Ertiga/Carens/Triber)">SUV (Ertiga)</option>
                <option value="Premium SUV (Innova Crysta/Hycross)">Innova Crysta</option>
                <option value="Hatchback (WagonR/Tiago)">Hatchback (WagonR)</option>
                <option value="Tempo Traveller (12/17/26 Seater)">Tempo Traveller</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-600 font-bold block mb-1">
                Vehicle Number
              </label>
              <input
                type="text"
                required
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="DL 01 TA 1234"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="text-[10px] text-slate-600 font-bold block mb-1">
                Date
              </label>
              <input
                type="text"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-600 font-bold block mb-1">
                Departure Time
              </label>
              <input
                type="text"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-amber-700 font-black block mb-1">
                Discount Fare (₹)
              </label>
              <input
                type="number"
                min={500}
                step={50}
                value={discountedFare}
                onChange={(e) => setDiscountedFare(Number(e.target.value))}
                className="w-full bg-amber-50 border border-amber-300 rounded-xl px-2.5 py-2 text-xs font-black text-amber-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
            <div>
              <label className="text-[11px] text-slate-600 font-bold block mb-1">
                Driver Name
              </label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-600 font-bold block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish Return Cab</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
