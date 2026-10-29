import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Wallet, 
  QrCode, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Duty, UserProfile } from '../types';
import confetti from 'canvas-confetti';

interface ClaimDutyModalProps {
  duty: Duty | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onConfirmClaim: (
    dutyId: string, 
    paymentMethod: 'Wallet' | 'UPI', 
    driverDetails: { driverName?: string; driverPhone?: string; vehicleNumber?: string }
  ) => void;
}

export const ClaimDutyModal: React.FC<ClaimDutyModalProps> = ({
  duty,
  isOpen,
  onClose,
  currentUser,
  onConfirmClaim
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'Wallet' | 'UPI'>('Wallet');
  const [driverName, setDriverName] = useState(currentUser.name);
  const [driverPhone, setDriverPhone] = useState(currentUser.phone);
  const [vehicleNumber, setVehicleNumber] = useState('DL 01 TA 7890');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !duty) return null;

  const commission = duty.commissionAmount;
  const hasSufficientWallet = currentUser.walletBalance >= commission;

  const handlePayAndClaim = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onConfirmClaim(duty.id, paymentMethod, {
        driverName: driverName.trim() || undefined,
        driverPhone: driverPhone.trim() || undefined,
        vehicleNumber: vehicleNumber.trim() || undefined
      });

      setIsProcessing(false);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-800 my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0a2540] p-4 sm:p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                Confirm Commission & Claim Duty
              </h3>
              <p className="text-xs text-slate-300">
                Lock this duty instantly to unlock passenger details and WhatsApp voucher
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

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
          {/* Duty Summary Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200 text-xs">
              <span className="font-mono font-bold text-slate-600">#{duty.dutyNumber}</span>
              <span className="bg-[#0a2540]/10 text-[#0a2540] font-bold px-2 py-0.5 rounded text-[11px]">
                {duty.dutyType} • {duty.vehicleType}
              </span>
            </div>

            <div className="flex items-center gap-2 text-base font-black text-[#0a2540] mb-2">
              <span>{duty.pickupCity}</span>
              <ArrowRight className="w-4 h-4 text-amber-500" />
              <span>{duty.dropCity}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
              <div>
                <span className="text-slate-400">Schedule: </span>
                <span className="font-bold text-slate-900">{duty.pickupDate}, {duty.pickupTime}</span>
              </div>
              <div>
                <span className="text-slate-400">Cash from Guest: </span>
                <span className="font-black text-emerald-700">₹{duty.balanceToCollect}</span>
              </div>
            </div>

            {/* Poster Info */}
            <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <span>
                Lead Owner: <strong className="text-slate-800">{duty.posterCompany} ({duty.posterName})</strong>
              </span>
              <span className="text-amber-600 font-bold">★ {duty.posterRating}</span>
            </div>
          </div>

          {/* Commission Callout */}
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-black text-amber-800">
                Commission Payable
              </div>
              <div className="text-[11px] text-amber-900/80 mt-0.5 font-medium">
                100% Escrow protected. Instant refund if customer cancels.
              </div>
            </div>
            <div className="text-2xl font-black text-amber-700">
              ₹{commission}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-black text-[#0a2540] uppercase tracking-wider mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Wallet Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Wallet')}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer relative ${
                  paymentMethod === 'Wallet'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className={`w-4 h-4 ${paymentMethod === 'Wallet' ? 'text-emerald-700' : 'text-slate-500'}`} />
                  <span className="font-bold text-xs text-slate-900">In-App Wallet</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Balance:{' '}
                  <strong className={hasSufficientWallet ? 'text-emerald-700' : 'text-rose-600'}>
                    ₹{currentUser.walletBalance}
                  </strong>
                </div>
                {!hasSufficientWallet && (
                  <span className="inline-block mt-1 text-[10px] text-rose-600 font-bold">
                    Insufficient Balance
                  </span>
                )}
              </button>

              {/* UPI Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer relative ${
                  paymentMethod === 'UPI'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <QrCode className={`w-4 h-4 ${paymentMethod === 'UPI' ? 'text-emerald-700' : 'text-slate-500'}`} />
                  <span className="font-bold text-xs text-slate-900">Instant UPI QR</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  GPay, PhonePe, Paytm
                </div>
              </button>
            </div>

            {/* UPI QR Display */}
            {paymentMethod === 'UPI' && (
              <div className="mt-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl flex items-center justify-center mb-2 shadow-xs border border-slate-200">
                  <div className="w-full h-full border border-dashed border-slate-400 rounded-lg flex flex-col items-center justify-center text-slate-800">
                    <QrCode className="w-14 h-14 text-slate-800 mb-1" />
                    <span className="text-[9px] font-mono font-bold">Pay: ₹{commission}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-700 font-mono">
                  UPI ID: <span className="font-black text-[#0a2540]">safarindiacabs@icici</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Scan via any UPI app and click Confirm below
                </p>
              </div>
            )}
          </div>

          {/* Assigned Driver & Vehicle */}
          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-black text-[#0a2540] uppercase tracking-wider">
                Driver & Vehicle Allocation (For Duty Slip)
              </label>
              <span className="text-[10px] text-slate-500 font-semibold">
                Printed on Voucher
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-600 font-bold block mb-1">
                  Driver Name
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-600 font-bold block mb-1">
                  Driver Mobile
                </label>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="+91 98765 XXXXX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-600 font-bold block mb-1">
                  Vehicle Plate No.
                </label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="DL 01 TA 1234"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-mono uppercase"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handlePayAndClaim}
              disabled={isProcessing || (paymentMethod === 'Wallet' && !hasSufficientWallet)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/20 transition cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Confirming Payment...'
                  : `Pay ₹${commission} & Lock Duty`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
