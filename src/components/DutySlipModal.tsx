import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  Check, 
  Phone, 
  MapPin, 
  Car, 
  ShieldCheck, 
  QrCode 
} from 'lucide-react';
import { Duty, UserProfile } from '../types';

interface DutySlipModalProps {
  duty: Duty | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const DutySlipModal: React.FC<DutySlipModalProps> = ({
  duty,
  isOpen,
  onClose,
  currentUser
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !duty) return null;

  const driverName = duty.claimedBy?.driverName || currentUser.name;
  const driverPhone = duty.claimedBy?.driverPhone || currentUser.phone;
  const vehicleNumber = duty.claimedBy?.vehicleNumber || 'DL 01 TA 7890';

  const fullWhatsAppMessage = 
    `*📋 SAFAR INDIA CABS - OFFICIAL DUTY SLIP*\n` +
    `--------------------------------------\n` +
    `*Voucher No:* #${duty.dutyNumber}\n` +
    `*Duty Type:* ${duty.dutyType} (${duty.vehicleType})\n\n` +
    `*📍 PICKUP DETAILS:*\n` +
    `• City: ${duty.pickupCity}\n` +
    `• Landmark: ${duty.pickupAddress}\n` +
    `• Schedule: ${duty.pickupDate} at ${duty.pickupTime}\n\n` +
    `*📍 DROP DESTINATION:*\n` +
    `• Destination City: ${duty.dropCity}\n` +
    `• Drop Location: ${duty.dropAddress}\n\n` +
    `*👤 PASSENGER DETAILS:*\n` +
    `• Guest Name: ${duty.passengerName}\n` +
    `• Phone: ${duty.passengerPhone}\n` +
    `• Capacity: ${duty.passengerCount} Persons | ${duty.luggageCount} Luggage Bags\n\n` +
    `*🚗 ASSIGNED DRIVER & VEHICLE:*\n` +
    `• Driver: ${driverName} (${driverPhone})\n` +
    `• Vehicle Plate No: ${vehicleNumber}\n` +
    `• Model: ${duty.vehicleType}\n\n` +
    `*💰 BILLING & CASH COLLECTION:*\n` +
    `• Total Agreed Fare: ₹${duty.totalCustomerFare}\n` +
    `• Advance Received: ₹${duty.advanceReceived}\n` +
    `• *BALANCE TO COLLECT FROM GUEST: ₹${duty.balanceToCollect}*\n` +
    `• Toll & Taxes: ${duty.isTollTaxesIncluded ? 'Included in fare (Driver pays)' : 'Extra to be paid directly by passenger'}\n` +
    (duty.specialInstructions ? `\n*⚠️ Instructions:* ${duty.specialInstructions}\n` : '') +
    `--------------------------------------\n` +
    `*Safar India Cabs Vendor B2B Network*\n` +
    `Customer Support / Helpdesk: +91 98765 43210`;

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fullWhatsAppMessage)}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullWhatsAppMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-800 my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#0a2540] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-black text-white">
              Official Duty Slip & Booking Voucher
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 transition cursor-pointer"
              title="Print Voucher"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Paper */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto no-scrollbar">
          <div className="bg-white text-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
            {/* Voucher Header with Real Logo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b-2 border-slate-900 gap-3">
              <div className="flex items-center gap-3">
                <img 
                  src="/assets/aistudio/IMG-20261029-WA0001_67f0d119.jpg" 
                  alt="Safar India Cabs Logo" 
                  className="h-14 w-14 rounded-xl object-cover border border-slate-200 shadow-2xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tight text-[#0a2540]">
                      Safar<span className="text-amber-500">India</span>Cabs
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
                      B2B VERIFIED
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">
                    A1 CAB SERVICES • N. INDIA • Intercity Cab Network
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">VOUCHER NUMBER</div>
                <div className="text-lg font-black font-mono text-[#0a2540]">#{duty.dutyNumber}</div>
                <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mt-0.5 inline-block border border-emerald-200">
                  STATUS: CONFIRMED & ALLOCATED
                </div>
              </div>
            </div>

            {/* Pickup & Drop Route */}
            <div className="my-4 bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-black uppercase text-amber-700 flex items-center gap-1 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>PICKUP LOCATION & TIME</span>
                  </div>
                  <div className="font-black text-slate-900 text-sm">
                    {duty.pickupCity}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5 font-medium">
                    {duty.pickupAddress}
                  </div>
                  <div className="text-xs font-bold text-[#0a2540] mt-1.5">
                    🗓️ {duty.pickupDate} at {duty.pickupTime}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>DROP DESTINATION</span>
                  </div>
                  <div className="font-black text-slate-900 text-sm">
                    {duty.dropCity}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5 font-medium">
                    {duty.dropAddress}
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-1.5">
                    🚘 Duty: {duty.dutyType} ({duty.vehicleType})
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger & Cab Allocation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              {/* Passenger Info */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                  PASSENGER INFORMATION
                </div>
                <div className="text-sm font-black text-slate-900">{duty.passengerName}</div>
                <div className="text-xs font-mono font-bold text-emerald-700 mt-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {duty.passengerPhone}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  {duty.passengerCount} Passengers • {duty.luggageCount} Luggage Bags
                </div>
              </div>

              {/* Driver & Cab Info */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                  ASSIGNED DRIVER & VEHICLE
                </div>
                <div className="text-sm font-black text-slate-900">{driverName}</div>
                <div className="text-xs font-mono font-bold text-slate-700 mt-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {driverPhone}
                </div>
                <div className="text-xs font-bold text-[#0a2540] mt-1 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-amber-500" />
                  <span>{vehicleNumber} ({duty.vehicleType})</span>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="my-4 border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 text-[11px] font-black text-slate-700 uppercase tracking-wider">
                BILLING & SETTLEMENT SLIP
              </div>
              <div className="p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Total Customer Agreed Fare:</span>
                  <span className="font-bold text-slate-900">₹{duty.totalCustomerFare}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Advance Received by Posting Agent:</span>
                  <span className="font-bold text-teal-700">₹{duty.advanceReceived}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-black text-sm pt-2.5 border-t border-slate-200">
                  <span className="text-emerald-800">CASH TO COLLECT FROM GUEST:</span>
                  <span className="text-emerald-800 text-base">₹{duty.balanceToCollect}</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1 font-medium">
                  * Toll, State Tax & Parking:{' '}
                  <strong className="text-slate-800">
                    {duty.isTollTaxesIncluded ? 'Included in fare (Driver pays)' : 'Extra (Customer pays separately directly)'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Footer Seal */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 border border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">Safar India Cabs Vendor Network</div>
                  <div>100% Verified Escrow Voucher</div>
                </div>
              </div>

              <div className="text-right text-[10px]">
                <div>Posting Agent: <strong>{duty.posterCompany}</strong></div>
                <div>Claimed By: <strong>{duty.claimedBy?.companyName || currentUser.companyName}</strong></div>
              </div>
            </div>
          </div>

          {/* Action Buttons for Sharing */}
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleCopy}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy WhatsApp Message'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Voucher on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
