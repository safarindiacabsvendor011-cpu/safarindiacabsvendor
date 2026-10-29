import React, { useState } from 'react';
import { 
  FileText, 
  Phone, 
  ArrowRight, 
  CheckCircle2
} from 'lucide-react';
import { Duty, UserProfile } from '../types';

interface MyBookingsProps {
  duties: Duty[];
  currentUser: UserProfile;
  onViewSlip: (duty: Duty) => void;
  onMarkCompleted: (dutyId: string) => void;
}

export const MyBookings: React.FC<MyBookingsProps> = ({
  duties,
  currentUser,
  onViewSlip
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'claimed' | 'posted'>('claimed');

  // Claimed duties: Claimed by current user
  const claimedDuties = duties.filter(
    (d) => d.status === 'claimed' && d.claimedBy?.userId === currentUser.id
  );

  // Posted duties: Posted by current user
  const postedDuties = duties.filter(
    (d) => d.posterId === currentUser.id
  );

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#0a2540] tracking-tight">
              My Bookings & Duty Records
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Track duties you claimed as an operator/driver and leads you broadcasted
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setActiveSubTab('claimed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'claimed'
                  ? 'bg-[#0a2540] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Duties Claimed ({claimedDuties.length})
            </button>
            <button
              onClick={() => setActiveSubTab('posted')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'posted'
                  ? 'bg-[#0a2540] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Duties Posted by Me ({postedDuties.length})
            </button>
          </div>
        </div>
      </div>

      {/* Claimed Duties List */}
      {activeSubTab === 'claimed' && (
        <div className="space-y-4">
          {claimedDuties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {claimedDuties.map((duty) => (
                <div
                  key={duty.id}
                  className="bg-white border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-emerald-600 text-white font-black text-[10px] px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">
                    LOCKED & ALLOCATED
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-slate-600">#{duty.dutyNumber}</span>
                    <span className="text-xs bg-[#0a2540]/10 text-[#0a2540] font-bold px-2 py-0.5 rounded">
                      {duty.dutyType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-base font-black text-[#0a2540] mb-3">
                    <span>{duty.pickupCity}</span>
                    <ArrowRight className="w-4 h-4 text-amber-500" />
                    <span>{duty.dropCity}</span>
                  </div>

                  {/* Customer Unlocked Details */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Passenger Name:</span>
                      <span className="font-bold text-slate-900">{duty.passengerName}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Phone Number:</span>
                      <a
                        href={`tel:${duty.passengerPhone}`}
                        className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {duty.passengerPhone}
                      </a>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Collect from Guest:</span>
                      <span className="font-black text-emerald-700 text-sm">₹{duty.balanceToCollect}</span>
                    </div>

                    <div className="text-[11px] text-slate-600 font-medium">
                      📍 {duty.pickupAddress}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onViewSlip(duty)}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition cursor-pointer shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Duty Slip</span>
                    </button>

                    <a
                      href={`tel:${duty.passengerPhone}`}
                      className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-bold transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Call Passenger</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center text-slate-500 text-xs">
              You haven't claimed any duties yet. Go to Duty Board to find and lock available intercity trips!
            </div>
          )}
        </div>
      )}

      {/* Posted Duties List */}
      {activeSubTab === 'posted' && (
        <div className="space-y-4">
          {postedDuties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {postedDuties.map((duty) => (
                <div
                  key={duty.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-slate-600">#{duty.dutyNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      duty.status === 'claimed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {duty.status === 'claimed' ? 'Claimed by Vendor' : 'Live on Board'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-base font-black text-[#0a2540] mb-2">
                    <span>{duty.pickupCity}</span>
                    <ArrowRight className="w-4 h-4 text-amber-500" />
                    <span>{duty.dropCity}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 mb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Customer Fare:</span>
                      <span className="font-bold text-slate-900">₹{duty.totalCustomerFare}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-800 font-bold">Your Commission:</span>
                      <span className="font-black text-amber-700">₹{duty.commissionAmount}</span>
                    </div>
                    {duty.claimedBy && (
                      <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-700">
                        <span className="text-slate-500 font-medium">Assigned to:</span>
                        <strong className="text-emerald-700 font-bold">{duty.claimedBy.companyName} ({duty.claimedBy.userName})</strong>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="text-slate-400">{duty.createdAt}</span>
                    {duty.status === 'claimed' && (
                      <button
                        onClick={() => onViewSlip(duty)}
                        className="text-emerald-700 hover:underline font-bold flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Voucher</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center text-slate-500 text-xs">
              You haven't posted any duties yet. Click "+ Post Duty" to broadcast your first booking!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
