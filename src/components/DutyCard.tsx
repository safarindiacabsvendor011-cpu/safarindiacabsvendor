import React from 'react';
import { 
  Clock, 
  Car, 
  Users, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Phone, 
  FileText, 
  Share2, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Tag,
  Check,
  TrendingUp,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { Duty, UserProfile } from '../types';

interface DutyCardProps {
  duty: Duty;
  currentUser: UserProfile;
  onClaim: (duty: Duty) => void;
  onViewSlip: (duty: Duty) => void;
  onNegotiate?: (duty: Duty) => void;
  onOpenChat?: (duty: Duty) => void;
}

export const DutyCard: React.FC<DutyCardProps> = ({
  duty,
  currentUser,
  onClaim,
  onViewSlip,
  onNegotiate,
  onOpenChat
}) => {
  const isClaimedByMe = duty.status === 'claimed' && duty.claimedBy?.userId === currentUser.id;
  const isClaimedByOther = duty.status === 'claimed' && duty.claimedBy?.userId !== currentUser.id;
  const isPostedByMe = duty.posterId === currentUser.id;

  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `*🚗 SAFAR INDIA CABS VENDOR - DUTY BROADCAST*\n\n` +
      `📋 *Booking ID:* #${duty.dutyNumber}\n` +
      `📍 *Route:* ${duty.pickupCity} ➔ ${duty.dropCity}\n` +
      `📅 *Schedule:* ${duty.pickupDate} at ${duty.pickupTime}\n` +
      `🚘 *Vehicle:* ${duty.vehicleType}\n` +
      `🏷️ *Duty Type:* ${duty.dutyType}\n` +
      `💰 *Total Customer Fare:* ₹${duty.totalCustomerFare}\n` +
      `💵 *Driver Net Earning:* ₹${duty.driverNetEarning}\n` +
      `🪙 *Commission Demand:* ₹${duty.commissionAmount}\n` +
      `🛡️ *Tolls & Taxes:* ${duty.isTollTaxesIncluded ? 'Included in fare' : 'Extra by customer'}\n` +
      (duty.extraRequirements && duty.extraRequirements.length > 0 ? `✨ *Requirements:* ${duty.extraRequirements.join(', ')}\n` : '') +
      `\n👉 *Claim Duty Instantly on Safar India Cabs Platform:* \n` +
      `${window.location.origin}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className={`rounded-2xl border-2 transition duration-200 overflow-hidden shadow-xs hover:shadow-md ${
      isClaimedByMe
        ? 'bg-emerald-50/50 border-emerald-400'
        : isClaimedByOther
        ? 'bg-slate-100/80 border-slate-200 opacity-75'
        : 'bg-white border-slate-200 hover:border-amber-400'
    }`}>
      {/* Top Header Strip */}
      <div className="bg-slate-100/90 px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono font-black text-slate-900 bg-white border border-slate-300 px-2.5 py-0.5 rounded-lg text-xs shadow-2xs">
            #{duty.dutyNumber}
          </span>

          <span className={`font-bold px-2 py-0.5 rounded text-[11px] border ${
            duty.status === 'claimed'
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : duty.status === 'negotiating'
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : 'bg-slate-100 text-slate-700 border-slate-300'
          }`}>
            {duty.status === 'claimed' ? 'Assigned' : duty.status === 'negotiating' ? 'In Negotiation' : 'Available'}
          </span>

          <span className="font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
            {duty.dutyType}
          </span>

          {duty.urgencyTag && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 ${
              duty.urgencyTag === 'Urgent'
                ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                : duty.urgencyTag === 'Advance Paid'
                ? 'bg-teal-100 text-teal-800 border border-teal-300'
                : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
            }`}>
              <Sparkles className="w-2.5 h-2.5" />
              {duty.urgencyTag}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200 font-bold px-2 py-0.5 rounded text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secured Escrow</span>
          </div>

          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold transition cursor-pointer p-1 rounded hover:bg-emerald-50"
            title="Share Duty"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Share</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {/* Route Banner - Bold & Eye-catching */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="text-lg sm:text-xl font-black text-[#0a2540] tracking-tight">
                {duty.pickupCity}
              </div>
              <div className="flex items-center px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full font-bold text-xs gap-1 border border-amber-300">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <div className="text-lg sm:text-xl font-black text-[#0a2540] tracking-tight">
                {duty.dropCity}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{duty.pickupDate} @ {duty.pickupTime}</span>
            </div>
          </div>
        </div>

        {/* Vehicle & Requirements Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#0a2540] text-amber-400 rounded-lg">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <div className="font-black text-slate-900 text-sm">
                {duty.vehicleType}
              </div>
              <div className="text-[11px] text-slate-500 font-semibold">
                Capacity: {duty.passengerCount} Pax • {duty.luggageCount} Luggage Bags
              </div>
            </div>
          </div>

          {/* Extra Requirements Badges */}
          <div className="flex flex-wrap gap-1.5">
            {duty.extraRequirements && duty.extraRequirements.map((req) => (
              <span 
                key={req}
                className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs"
              >
                ✓ {req}
              </span>
            ))}
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
              duty.isTollTaxesIncluded
                ? 'bg-teal-50 text-teal-800 border-teal-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {duty.isTollTaxesIncluded ? 'Toll/Tax Included' : 'Toll Extra by Guest'}
            </span>
          </div>
        </div>

        {/* BOLD DISTINCT FINANCIAL COLUMNS (Separate Column Blocks) */}
        {(() => {
          const totalFare = duty.totalCustomerFare || 0;
          const commission = duty.commissionAmount || 0;
          const driverEarning = duty.driverNetEarning ?? Math.max(0, totalFare - commission);
          const advance = duty.advanceReceived || 0;
          const balance = duty.balanceToCollect ?? Math.max(0, totalFare - advance);

          return (
            <>
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-4">
                {/* Column 1: Total Customer Amount */}
                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border-2 border-slate-200 text-center">
                  <div className="text-[10px] uppercase font-black text-slate-500 tracking-wider">
                    Total Amount
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-[#0a2540] mt-0.5 tracking-tight">
                    ₹{totalFare.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                    Advance: ₹{advance.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Column 2: Driver's Net Earning */}
                <div className="bg-emerald-50/80 p-3 sm:p-3.5 rounded-2xl border-2 border-emerald-400 text-center">
                  <div className="text-[10px] uppercase font-black text-emerald-800 tracking-wider flex items-center justify-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-700" />
                    <span>Driver Earning</span>
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-emerald-700 mt-0.5 tracking-tight">
                    ₹{driverEarning.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-emerald-800 font-bold mt-0.5">
                    Net Income (Clean)
                  </div>
                </div>

                {/* Column 3: Commission */}
                <div className="bg-amber-50/90 p-3 sm:p-3.5 rounded-2xl border-2 border-amber-400 text-center">
                  <div className="text-[10px] uppercase font-black text-amber-800 tracking-wider">
                    Commission
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-amber-600 mt-0.5 tracking-tight">
                    ₹{commission.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-amber-800 font-bold mt-0.5">
                    Pay to Lead Owner
                  </div>
                </div>
              </div>

              {/* Cash to collect note */}
              <div className="bg-slate-100/80 px-3.5 py-2 rounded-xl mb-4 flex items-center justify-between text-xs border border-slate-200">
                <span className="text-slate-600 font-bold">
                  Cash to Collect from Guest upon trip completion:
                </span>
                <span className="font-black text-slate-900 text-sm">
                  ₹{balance.toLocaleString('en-IN')}
                </span>
              </div>
            </>
          );
        })()}

        {/* Lock / Unlock Status Area */}
        {isClaimedByMe ? (
          <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 text-emerald-900 text-xs font-black mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Duty Confirmed & Locked for You</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Passenger Name:</span>
                <span className="font-black text-slate-950">{duty.passengerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Passenger Phone:</span>
                <a 
                  href={`tel:${duty.passengerPhone}`}
                  className="font-mono font-black text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {duty.passengerPhone}
                </a>
              </div>
              <div className="pt-1.5 text-[11px] text-slate-700 border-t border-emerald-200">
                <span className="text-slate-500 font-bold">Exact Pickup Landmark: </span>
                {duty.pickupAddress}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-dashed border-slate-300 mb-4 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="text-[11px]">
                <span className="font-bold text-slate-700 block">Customer Phone & Address Protected</span>
                <span>Unlocks instantly upon commission authorization</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-md">
              🔒 Blurred
            </span>
          </div>
        )}

        {/* Poster Profile & Actions Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0a2540] flex items-center justify-center font-black text-xs text-amber-400">
              {duty.posterName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                <span>{duty.posterCompany}</span>
                {duty.isPosterVerified && (
                  <span title="Verified Partner">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {duty.posterCity} • ★ {duty.posterRating}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Direct Chat / Discuss button on every box */}
            {onOpenChat && (
              <button
                onClick={() => onOpenChat(duty)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border-2 border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-white text-slate-800 font-black text-xs transition cursor-pointer shadow-2xs"
                title="Chat with posting vendor to discuss details & commission"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                <span>Chat & Discuss</span>
                {duty.chatMessages && duty.chatMessages.length > 0 && (
                  <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                    {duty.chatMessages.length}
                  </span>
                )}
              </button>
            )}

            {isClaimedByMe ? (
              <button
                onClick={() => onViewSlip(duty)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-2.5 rounded-xl text-xs shadow-xs transition cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>View Duty Slip</span>
              </button>
            ) : isClaimedByOther ? (
              <div className="px-3 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-black text-center">
                Duty Assigned
              </div>
            ) : isPostedByMe ? (
              <button
                onClick={() => onOpenChat?.(duty)}
                className="px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-300 hover:bg-amber-100 text-amber-950 text-xs font-black text-center transition cursor-pointer"
              >
                Your Post (Open Deal Room)
              </button>
            ) : (
              <button
                onClick={() => onClaim(duty)}
                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-4 sm:px-5 py-2.5 rounded-xl text-xs shadow-md shadow-amber-500/20 transition cursor-pointer active:scale-95"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Pay ₹{duty.commissionAmount} & Claim</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
