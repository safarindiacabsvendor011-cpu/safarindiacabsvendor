import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Car, 
  Sparkles, 
  ShieldCheck,
  AlertCircle,
  Check
} from 'lucide-react';
import { Duty, UserProfile, VehicleType, DutyType, ExtraRequirement } from '../types';
import { CITIES_LIST, getNextBookingNumber } from '../data/mockData';
import confetti from 'canvas-confetti';

interface PostDutyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  existingDuties: Duty[];
  onAddDuty: (newDuty: Duty) => void;
}

export const PostDutyModal: React.FC<PostDutyModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  existingDuties,
  onAddDuty
}) => {
  const [pickupCity, setPickupCity] = useState('Delhi NCR');
  const [dropCity, setDropCity] = useState('Jaipur');
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');
  
  const [pickupDate, setPickupDate] = useState('Today');
  const [pickupTime, setPickupTime] = useState('08:00 PM');
  
  const [dutyType, setDutyType] = useState<DutyType>('One Way');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Sedan (Dzire/Etios/Aura)');
  
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [passengerCount, setPassengerCount] = useState(3);
  const [luggageCount, setLuggageCount] = useState(2);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [totalCustomerFare, setTotalCustomerFare] = useState<number>(3500);
  const [advanceReceived, setAdvanceReceived] = useState<number>(500);
  const [isTollTaxesIncluded, setIsTollTaxesIncluded] = useState(true);
  const [commissionAmount, setCommissionAmount] = useState<number>(400);

  // New features seen in reference video
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [isSecureBooking, setIsSecureBooking] = useState(true);
  const [isHideProfile, setIsHideProfile] = useState(false);

  const [selectedExtraRequirements, setSelectedExtraRequirements] = useState<ExtraRequirement[]>([
    'With Luggage Carrier',
    'AC Throughout Trip'
  ]);

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const balanceToCollect = Math.max(0, totalCustomerFare - advanceReceived);
  const driverNetEarning = Math.max(0, totalCustomerFare - commissionAmount);

  const availableRequirements: ExtraRequirement[] = [
    'With Luggage Carrier',
    'All Inclusive (Toll & State Tax)',
    'AC Throughout Trip',
    'Airport Parking Included',
    'Non-Smoker Driver',
    'Commercial Diesel Cab',
    'Strictly On Time'
  ];

  const toggleRequirement = (req: ExtraRequirement) => {
    if (selectedExtraRequirements.includes(req)) {
      setSelectedExtraRequirements(selectedExtraRequirements.filter(r => r !== req));
    } else {
      setSelectedExtraRequirements([...selectedExtraRequirements, req]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupCity || !dropCity) {
      setError('Please select both pickup and drop cities');
      return;
    }

    if (!passengerName.trim() || !passengerPhone.trim()) {
      setError('Please provide customer name and phone number');
      return;
    }

    if (totalCustomerFare <= 0 || commissionAmount < 0) {
      setError('Please enter a valid fare and commission amount');
      return;
    }

    const nextBookingNum = getNextBookingNumber(existingDuties);
    const newDuty: Duty = {
      id: `duty-${Date.now()}`,
      dutyNumber: nextBookingNum,
      title: `${pickupCity} to ${dropCity} (${dutyType})`,
      dutyType,
      vehicleType,
      pickupCity,
      pickupAddress: pickupAddress.trim() || `${pickupCity} Central`,
      dropCity,
      dropAddress: dropAddress.trim() || `${dropCity} Central`,
      pickupDate,
      pickupTime,
      passengerName: passengerName.trim(),
      passengerPhone: passengerPhone.trim(),
      passengerCount,
      luggageCount,
      specialInstructions: specialInstructions.trim() || undefined,
      extraRequirements: selectedExtraRequirements,
      totalCustomerFare,
      advanceReceived,
      balanceToCollect,
      isTollTaxesIncluded,
      commissionAmount,
      driverNetEarning,
      isNegotiable,
      posterId: currentUser.id,
      posterName: isHideProfile ? 'Verified Agent' : currentUser.name,
      posterCompany: isHideProfile ? 'Fleet Operator' : currentUser.companyName,
      posterPhone: currentUser.phone,
      posterCity: currentUser.city,
      posterRating: currentUser.rating,
      isPosterVerified: currentUser.isVerified,
      status: 'available',
      createdAt: 'Just now',
      urgencyTag: advanceReceived > 0 ? 'Advance Paid' : 'Instant'
    };

    onAddDuty(newDuty);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border-2 border-slate-200 rounded-3xl shadow-2xl text-slate-800 my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#0a2540] p-4 sm:p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                Post a Booking (New Duty)
              </h3>
              <p className="text-xs text-slate-300">
                Broadcast duty, secure your commission in advance, and allocate driver
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

        {error && (
          <div className="mx-5 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
          {/* Trip Type Segment */}
          <div>
            <label className="block text-xs font-black text-[#0a2540] uppercase tracking-wider mb-2">
              Trip Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['One Way', 'Round Trip', 'Airport Transfer'] as DutyType[]).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setDutyType(type)}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer border ${
                    dutyType === type
                      ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Route & Type */}
          <div className="pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 font-bold mb-1 block">
                  Select Pickup Location *
                </label>
                <select
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                >
                  {CITIES_LIST.filter(c => c !== 'All Cities').map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-bold mb-1 block">
                  Select Drop Destination *
                </label>
                <select
                  value={dropCity}
                  onChange={(e) => setDropCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                >
                  {CITIES_LIST.filter(c => c !== 'All Cities').map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-bold mb-1 block">
                  Pickup Landmark / Exact Address
                </label>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="e.g. Urban Estate / T3 Airport / Sector 18"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-bold mb-1 block">
                  Drop Address / Destination Landmark
                </label>
                <input
                  type="text"
                  value={dropAddress}
                  onChange={(e) => setDropAddress(e.target.value)}
                  placeholder="e.g. Station / Hotel Grand / Mall Road"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-bold mb-1 block">
                  Select Vehicle Category *
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                >
                  <option value="Hatchback (WagonR/Tiago)">Hatchback (WagonR / Tiago)</option>
                  <option value="Sedan (Dzire/Etios/Aura)">Sedan (Dzire / Etios / Aura)</option>
                  <option value="SUV (Ertiga/Carens/Triber)">SUV (Ertiga / Carens)</option>
                  <option value="Premium SUV (Innova Crysta/Hycross)">Innova Crysta / Hycross</option>
                  <option value="Tempo Traveller (12/17/26 Seater)">Tempo Traveller (12/17/26)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-600 font-bold mb-1 block">
                    Pick Up Date
                  </label>
                  <input
                    type="text"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    placeholder="Today"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-bold mb-1 block">
                    Pick Up Time
                  </label>
                  <input
                    type="text"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    placeholder="10:00 PM"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Fares, Driver Earning & Commission in Columns */}
          <div className="pt-3 border-t border-slate-200">
            <label className="block text-xs font-black text-[#0a2540] uppercase tracking-wider mb-2">
              Financial Breakdown (Multi-Column)
            </label>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Total Fare */}
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
                    Total Booking Amount (₹)
                  </label>
                  <input
                    type="number"
                    min={500}
                    step={50}
                    value={totalCustomerFare}
                    onChange={(e) => setTotalCustomerFare(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-base font-black text-[#0a2540] focus:outline-none focus:border-amber-500"
                  />
                  <div className="flex items-center gap-1.5 mt-2">
                    <input
                      type="checkbox"
                      id="neg"
                      checked={isNegotiable}
                      onChange={(e) => setIsNegotiable(e.target.checked)}
                      className="rounded text-amber-500"
                    />
                    <label htmlFor="neg" className="text-[10px] text-slate-600 font-bold cursor-pointer">
                      Amount is negotiable
                    </label>
                  </div>
                </div>

                {/* Driver Net Earning */}
                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-300">
                  <div className="text-[10px] text-emerald-800 font-black uppercase mb-1">
                    Driver's Clean Earning (₹)
                  </div>
                  <div className="text-xl font-black text-emerald-700 py-1">
                    ₹{driverNetEarning}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium">
                    (Total Fare minus Commission)
                  </div>
                </div>

                {/* Enter Commission */}
                <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-300">
                  <label className="text-[10px] text-amber-900 font-black uppercase block mb-1">
                    Your Commission (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={commissionAmount}
                    onChange={(e) => setCommissionAmount(Number(e.target.value))}
                    className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-base font-black text-amber-700 focus:outline-none focus:border-amber-500"
                  />
                  <div className="text-[10px] text-amber-800 font-medium mt-1">
                    Paid directly to you upon claim
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Extra Requirements (As seen in video) */}
          <div className="pt-3 border-t border-slate-200">
            <label className="block text-xs font-black text-[#0a2540] uppercase tracking-wider mb-2">
              Extra Requirements
            </label>
            <div className="flex flex-wrap gap-2">
              {availableRequirements.map((req) => {
                const isSelected = selectedExtraRequirements.includes(req);

                return (
                  <button
                    type="button"
                    key={req}
                    onClick={() => toggleRequirement(req)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#0a2540] text-amber-400 border-slate-900 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{req}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Security & Privacy Toggles (As seen in video) */}
          <div className="pt-3 border-t border-slate-200 space-y-2.5">
            {/* Secure this booking toggle */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-[#0a2540] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Secure this booking (Advance Commission Escrow)</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Receiver pays commission in advance to protect against cancellations and payment fraud.
                </div>
              </div>
              <input
                type="checkbox"
                checked={isSecureBooking}
                onChange={(e) => setIsSecureBooking(e.target.checked)}
                className="w-5 h-5 accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Hide my profile toggle */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">
                  Hide my profile details until assigned
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Your agency name and phone will remain hidden and will be visible only to the confirmed claiming driver.
                </div>
              </div>
              <input
                type="checkbox"
                checked={isHideProfile}
                onChange={(e) => setIsHideProfile(e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Section 5: Customer Details */}
          <div className="pt-3 border-t border-slate-200">
            <label className="block text-xs font-black text-[#0a2540] uppercase tracking-wider mb-2">
              Customer Contact (Encrypted until assignment)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 font-bold mb-1 block">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="e.g. Harpreet Singh"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-bold mb-1 block">
                  Customer Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  placeholder="+91 98XXX XXXXX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] text-slate-600 font-bold mb-1 block">
                  Other Details, Remarks & Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Flight timing, passenger has elderly member, luggage carrier needed, strict timing..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Broadcast Booking (Earn ₹{commissionAmount})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
