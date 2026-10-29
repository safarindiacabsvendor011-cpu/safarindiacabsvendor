import React from 'react';
import { 
  ArrowRight, 
  Car, 
  Clock, 
  ShieldCheck, 
  Unlock, 
  FileText, 
  Phone,
  Sparkles
} from 'lucide-react';
import { Duty, UserProfile } from '../types';

interface DutyTableViewProps {
  duties: Duty[];
  currentUser: UserProfile;
  onClaim: (duty: Duty) => void;
  onViewSlip: (duty: Duty) => void;
}

export const DutyTableView: React.FC<DutyTableViewProps> = ({
  duties,
  currentUser,
  onClaim,
  onViewSlip
}) => {
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#0a2540] text-white uppercase text-[11px] font-black tracking-wider border-b border-slate-200">
              <th className="py-3.5 px-4">Booking ID</th>
              <th className="py-3.5 px-4">Route & Schedule</th>
              <th className="py-3.5 px-4">Vehicle & Specs</th>
              <th className="py-3.5 px-4 text-center">Total Fare</th>
              <th className="py-3.5 px-4 text-center bg-[#071c33] text-emerald-400">Driver Earning</th>
              <th className="py-3.5 px-4 text-center text-amber-400">Commission</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium">
            {duties.map((duty) => {
              const isClaimedByMe = duty.status === 'claimed' && duty.claimedBy?.userId === currentUser.id;
              const isClaimedByOther = duty.status === 'claimed' && duty.claimedBy?.userId !== currentUser.id;
              const isPostedByMe = duty.posterId === currentUser.id;

              return (
                <tr 
                  key={duty.id}
                  className={`hover:bg-slate-50/80 transition ${
                    isClaimedByMe ? 'bg-emerald-50/40' : ''
                  }`}
                >
                  {/* Column 1: ID & Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="font-mono font-black text-slate-900 text-xs">
                      #{duty.dutyNumber}
                    </div>
                    <div className="mt-1">
                      <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px] border border-slate-200">
                        {duty.dutyType}
                      </span>
                    </div>
                    {duty.urgencyTag && (
                      <span className="text-[9px] font-black text-rose-700 mt-1 block">
                        ● {duty.urgencyTag}
                      </span>
                    )}
                  </td>

                  {/* Column 2: Route & Schedule */}
                  <td className="py-4 px-4 min-w-[220px]">
                    <div className="flex items-center gap-1.5 text-sm font-black text-[#0a2540]">
                      <span>{duty.pickupCity}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{duty.dropCity}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 font-bold">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>{duty.pickupDate} @ {duty.pickupTime}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {duty.pickupAddress}
                    </div>
                  </td>

                  {/* Column 3: Vehicle & Specs */}
                  <td className="py-4 px-4 min-w-[180px]">
                    <div className="font-black text-slate-900 text-xs">
                      {duty.vehicleType}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-semibold">
                      {duty.passengerCount} Pax • {duty.luggageCount} Bags
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {duty.extraRequirements && duty.extraRequirements.slice(0, 2).map((req) => (
                        <span key={req} className="bg-slate-100 text-slate-600 text-[9px] font-bold px-1.5 py-0.2 rounded border border-slate-200">
                          {req}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Column 4: Total Customer Fare */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <div className="text-base font-black text-[#0a2540]">
                      ₹{duty.totalCustomerFare}
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold">
                      Adv: ₹{duty.advanceReceived}
                    </div>
                  </td>

                  {/* Column 5: Driver Net Earning */}
                  <td className="py-4 px-4 text-center bg-emerald-50/50 whitespace-nowrap border-x border-emerald-100">
                    <div className="text-base font-black text-emerald-700">
                      ₹{duty.driverNetEarning}
                    </div>
                    <div className="text-[10px] text-emerald-800 font-bold">
                      Net Income
                    </div>
                  </td>

                  {/* Column 6: Commission */}
                  <td className="py-4 px-4 text-center whitespace-nowrap bg-amber-50/40">
                    <div className="text-base font-black text-amber-600">
                      ₹{duty.commissionAmount}
                    </div>
                    <div className="text-[10px] text-amber-800 font-bold">
                      Pay Agent
                    </div>
                  </td>

                  {/* Column 7: Action */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    {isClaimedByMe ? (
                      <button
                        onClick={() => onViewSlip(duty)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-3 py-1.5 rounded-xl text-xs transition cursor-pointer shadow-2xs"
                      >
                        Duty Slip
                      </button>
                    ) : isClaimedByOther ? (
                      <span className="text-slate-400 font-bold text-xs">
                        Assigned
                      </span>
                    ) : isPostedByMe ? (
                      <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg font-bold text-xs">
                        Your Post
                      </span>
                    ) : (
                      <button
                        onClick={() => onClaim(duty)}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-xs transition cursor-pointer active:scale-95"
                      >
                        Claim (₹{duty.commissionAmount})
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
