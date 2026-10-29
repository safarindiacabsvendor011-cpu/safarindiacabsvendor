import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft
} from 'lucide-react';
import { UserProfile, WalletTransaction } from '../types';
import confetti from 'canvas-confetti';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  transactions: WalletTransaction[];
  onAddFunds: (amount: number) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  transactions,
  onAddFunds
}) => {
  const [topUpAmount, setTopUpAmount] = useState<number>(1000);
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('PhonePe');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleAddMoney = () => {
    if (topUpAmount <= 0) return;
    setIsAdding(true);

    setTimeout(() => {
      onAddFunds(topUpAmount);
      setIsAdding(false);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-800 my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0a2540] p-4 sm:p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                Commission Wallet & Passbook
              </h3>
              <p className="text-xs text-slate-300">
                Secure commission escrow deposits, payments, and payouts
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto no-scrollbar">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-[#0a2540] to-slate-900 text-white p-6 rounded-2xl border border-slate-800 relative overflow-hidden shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Total Available Balance
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                100% Escrow Protected
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight mb-4">
              ₹{(currentUser.walletBalance ?? 0).toLocaleString('en-IN')}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-700/80">
              <div>
                <span className="text-slate-400">Account Holder: </span>
                <span className="font-bold text-white block truncate">{currentUser.name}</span>
              </div>
              <div>
                <span className="text-slate-400">Company: </span>
                <span className="font-bold text-white block truncate">{currentUser.companyName}</span>
              </div>
            </div>
          </div>

          {/* Add Money Section */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
            <label className="block text-xs font-black text-[#0a2540] uppercase tracking-wider mb-2">
              Add Funds to Wallet
            </label>

            {/* Quick chips */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[500, 1000, 2000, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-1.5 rounded-xl text-xs font-black border transition cursor-pointer ${
                    topUpAmount === amt
                      ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  +₹{amt}
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="relative mb-3">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">₹</span>
              <input
                type="number"
                min={100}
                step={100}
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(Number(e.target.value))}
                placeholder="Enter amount"
                className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-2 text-sm font-black text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* UPI App selector */}
            <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
              {['PhonePe', 'Google Pay', 'Paytm UPI'].map((app) => (
                <button
                  key={app}
                  type="button"
                  onClick={() => setSelectedUpiApp(app)}
                  className={`py-2 px-2 rounded-xl border font-bold text-center transition cursor-pointer ${
                    selectedUpiApp === app
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {app}
                </button>
              ))}
            </div>

            <button
              onClick={handleAddMoney}
              disabled={isAdding || topUpAmount <= 0}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer active:scale-95"
            >
              {isAdding ? 'Processing UPI Payment...' : `Add ₹${topUpAmount} via ${selectedUpiApp}`}
            </button>
          </div>

          {/* Passbook / Transaction History */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black text-[#0a2540] uppercase tracking-wider">
                Transaction History
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Recent records</span>
            </div>

            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      tx.type === 'credit'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {tx.type === 'credit' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{tx.title}</div>
                      <div className="text-[10px] text-slate-500">{tx.description}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{tx.timestamp}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`font-black text-sm ${
                      tx.type === 'credit' ? 'text-emerald-700' : 'text-slate-900'
                    }`}>
                      {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                    </div>
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      SUCCESS
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
