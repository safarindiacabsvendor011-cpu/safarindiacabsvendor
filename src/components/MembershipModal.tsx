import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Crown, 
  ShieldCheck
} from 'lucide-react';
import { UserProfile, MembershipPlan } from '../types';
import { MEMBERSHIP_PLANS } from '../data/mockData';
import confetti from 'canvas-confetti';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpgradePlan: (planName: 'Free' | 'Silver' | 'Gold' | 'Diamond') => void;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpgradePlan
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-gold');

  if (!isOpen) return null;

  const handleUpgrade = (plan: MembershipPlan) => {
    const planNameMapping: Record<string, 'Free' | 'Silver' | 'Gold' | 'Diamond'> = {
      'plan-free': 'Free',
      'plan-silver': 'Silver',
      'plan-gold': 'Gold',
      'plan-diamond': 'Diamond'
    };
    onUpgradePlan(planNameMapping[plan.id] || 'Gold');
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-800 my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0a2540] p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">
                  Safar India Cabs Partner Plans
                </h3>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  B2B Memberships
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Choose the best tier for your fleet to unlock 0% platform fee and priority duty broadcast
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

        {/* Plans Grid */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {MEMBERSHIP_PLANS.map((plan) => {
              const isCurrent = currentUser.membershipPlan.toLowerCase() === plan.name.split(' ')[0].toLowerCase();
              const isSelected = selectedPlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative rounded-2xl p-4 border transition cursor-pointer flex flex-col justify-between ${
                    plan.popular
                      ? 'bg-gradient-to-b from-amber-50/50 to-white border-amber-400 shadow-md shadow-amber-500/10'
                      : isSelected
                      ? 'bg-slate-50 border-[#0a2540] ring-1 ring-[#0a2540]'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      MOST POPULAR
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-xs font-black text-slate-900">
                        {plan.name}
                      </span>
                      {isCurrent && (
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <div className="mb-3">
                      <div className="text-2xl font-black text-[#0a2540]">
                        ₹{plan.price}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {plan.duration}
                      </div>
                    </div>

                    <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md mb-3 border border-emerald-200">
                      Platform Fee: {plan.platformFee}
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 mb-4 text-xs">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-slate-600 text-[11px] font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpgrade(plan);
                    }}
                    disabled={isCurrent}
                    className={`w-full py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                      isCurrent
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-[#0a2540] hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isCurrent ? 'Current Plan' : `Select ${plan.name.split(' ')[0]}`}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Membership Benefits Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                All partner plans include 100% Commission Escrow & Fraud Guarantee protection.
              </span>
            </div>
            <div className="font-mono text-[#0a2540] font-bold shrink-0">
              Helpline: +91 98765 43210
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
