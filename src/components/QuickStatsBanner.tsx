import React from 'react';
import { ShieldCheck, IndianRupee, Users, Award } from 'lucide-react';

interface QuickStatsBannerProps {
  totalDutiesCount: number;
}

export const QuickStatsBanner: React.FC<QuickStatsBannerProps> = ({ totalDutiesCount }) => {
  return (
    <div className="bg-slate-100/80 border-b border-slate-200 text-slate-700 py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-extrabold text-[#0a2540]">{totalDutiesCount}</span>
            <span className="text-slate-600 font-medium">Live Active Duties</span>
          </div>

          <div className="flex items-center gap-2 shrink-0 border-l border-slate-300 pl-4">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-extrabold text-[#0a2540]">₹14,80,000+</span>
            <span className="text-slate-600 font-medium">Daily B2B Volume</span>
          </div>

          <div className="flex items-center gap-2 shrink-0 border-l border-slate-300 pl-4">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-extrabold text-[#0a2540]">4,850+</span>
            <span className="text-slate-600 font-medium">Verified Cab Partners</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-emerald-800 font-bold shrink-0 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Guaranteed Commission Refund on Passenger Cancellation</span>
        </div>
      </div>
    </div>
  );
};
