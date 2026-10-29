import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Phone, 
  MapPin, 
  Car, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Unlock, 
  FileText,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Duty, UserProfile, BookingChatMessage } from '../types';
import confetti from 'canvas-confetti';

interface BookingChatModalProps {
  duty: Duty | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSendCommissionRequest: (dutyId: string, requestedAmount: number, targetVendorName: string) => void;
  onAcceptAndPayCommission: (dutyId: string, commissionAmount: number) => void;
  onViewSlip: (duty: Duty) => void;
}

export const BookingChatModal: React.FC<BookingChatModalProps> = ({
  duty,
  isOpen,
  onClose,
  currentUser,
  onSendCommissionRequest,
  onAcceptAndPayCommission,
  onViewSlip
}) => {
  const [inputText, setInputText] = useState('');
  const [negotiatedAmount, setNegotiatedAmount] = useState<number>(duty?.commissionAmount || 300);
  const [localMessages, setLocalMessages] = useState<BookingChatMessage[]>(duty?.chatMessages || []);

  if (!isOpen || !duty) return null;

  const isPoster = duty.posterId === currentUser.id;
  const isClaimedByMe = duty.status === 'claimed' && duty.claimedBy?.userId === currentUser.id;
  const isClaimed = duty.status === 'claimed';

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: BookingChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderPhone: currentUser.phone,
      senderCompany: currentUser.companyName,
      text: inputText.trim(),
      timestamp: 'Just now',
      isMe: true
    };

    const updated = [...localMessages, newMsg];
    setLocalMessages(updated);
    setInputText('');

    // If poster sends counter offer
    if (isPoster && inputText.toLowerCase().includes('commission')) {
      // simulated
    }
  };

  const handleSendCommissionProposal = () => {
    onSendCommissionRequest(duty.id, negotiatedAmount, currentUser.name);

    const proposalMsg: BookingChatMessage = {
      id: `offer-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderPhone: currentUser.phone,
      senderCompany: currentUser.companyName,
      text: `Official Commission Payment Request of ₹${negotiatedAmount} generated. Pay commission to lock booking and reveal vendor & customer phone numbers.`,
      timestamp: 'Just now',
      isMe: true,
      isCommissionOffer: true,
      offerAmount: negotiatedAmount
    };

    setLocalMessages([...localMessages, proposalMsg]);
  };

  const handlePayCommission = () => {
    onAcceptAndPayCommission(duty.id, negotiatedAmount);
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border-2 border-slate-200 rounded-3xl shadow-2xl text-slate-800 my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0a2540] p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs">
              {duty.dutyNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Booking Discussion & Deal Room
                </h3>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  duty.status === 'claimed'
                    ? 'bg-emerald-500 text-white'
                    : duty.status === 'negotiating'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-white/20 text-slate-200'
                }`}>
                  {duty.status === 'claimed' ? 'LOCKED & ASSIGNED' : 'OPEN FOR DEALS'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Chat with vendor, verify details, request commission & unlock direct contact
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spacious Duty Overview Box (Pinned at top) */}
        <div className="bg-slate-50 p-4 sm:p-5 border-b-2 border-slate-200 shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-base font-black text-[#0a2540]">
                <span>{duty.pickupCity}</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
                <span>{duty.dropCity}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-bold mt-1.5">
                <span>🚘 {duty.vehicleType}</span>
                <span>•</span>
                <span>🗓️ {duty.pickupDate} @ {duty.pickupTime}</span>
                <span>•</span>
                <span>{duty.passengerCount} Pax</span>
              </div>

              <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                📍 <strong>Pickup Landmark:</strong> {duty.pickupAddress} ➔ {duty.dropAddress}
              </div>
            </div>

            {/* Financials Strip */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs self-start md:self-auto">
              <div className="text-center px-2">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Customer Fare</div>
                <div className="text-sm sm:text-base font-black text-[#0a2540]">₹{duty.totalCustomerFare}</div>
              </div>

              <div className="h-8 w-px bg-slate-200"></div>

              <div className="text-center px-2">
                <div className="text-[10px] text-emerald-800 font-bold uppercase">Driver Net Earning</div>
                <div className="text-sm sm:text-base font-black text-emerald-700">₹{duty.driverNetEarning}</div>
              </div>

              <div className="h-8 w-px bg-slate-200"></div>

              <div className="text-center px-2 bg-amber-50 rounded-xl p-1 border border-amber-200">
                <div className="text-[10px] text-amber-800 font-bold uppercase">Commission</div>
                <div className="text-sm sm:text-base font-black text-amber-600">₹{duty.commissionAmount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* UNLOCKED VENDOR DETAILS BANNER (Visible after commission is paid) */}
        {isClaimed ? (
          <div className="bg-emerald-600 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 shadow-md">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Deal Finalized • Commission Paid via Escrow</span>
              </div>
              <div className="text-base sm:text-lg font-black mt-1">
                Direct Contact Unlocked: {duty.posterCompany} ({duty.posterName})
              </div>
              <div className="text-xs text-emerald-100 font-bold flex items-center gap-2 mt-0.5">
                <span>Passenger: {duty.passengerName}</span>
                <span>•</span>
                <span className="font-mono">Passenger Mobile: {duty.passengerPhone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${duty.posterPhone}`}
                className="bg-white text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:bg-slate-100 transition"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Call Vendor ({duty.posterPhone})</span>
              </a>

              <button
                onClick={() => onViewSlip(duty)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Duty Slip</span>
              </button>
            </div>
          </div>
        ) : (
          /* Deal Negotiation / Commission Request Bar */
          <div className="bg-amber-50 border-b border-amber-200 p-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-400 text-slate-950 rounded-xl">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-amber-950">
                  {isPoster ? 'Finalize Deal with an Interested Vendor' : 'Agree on Deal & Pay Commission'}
                </div>
                <div className="text-[11px] text-amber-800 font-medium">
                  Once commission is paid, vendor contact + full customer details unlock immediately.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isPoster ? (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-black text-xs text-amber-700">₹</span>
                    <input
                      type="number"
                      min={100}
                      step={50}
                      value={negotiatedAmount}
                      onChange={(e) => setNegotiatedAmount(Number(e.target.value))}
                      className="w-24 bg-white border border-amber-300 rounded-xl pl-6 pr-2 py-1.5 text-xs font-black text-amber-900 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSendCommissionProposal}
                    className="bg-[#0a2540] hover:bg-slate-800 text-amber-400 font-black px-3.5 py-2 rounded-xl text-xs transition cursor-pointer shadow-xs"
                  >
                    Send Commission Request
                  </button>
                </div>
              ) : (
                <button
                  onClick={handlePayCommission}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black px-5 py-2 rounded-xl text-xs shadow-md transition cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Pay ₹{duty.commissionAmount} Commission & Unlock Number</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-slate-50/50">
          <div className="text-center">
            <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
              End-to-End Encrypted B2B Negotiation
            </span>
          </div>

          {localMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="text-[10px] font-bold text-slate-400 mb-1 px-1">
                {msg.senderName} ({msg.senderCompany}) • {msg.timestamp}
              </div>

              {msg.isCommissionOffer ? (
                /* Special Commission Offer Message Card */
                <div className="max-w-[85%] bg-amber-50 border-2 border-amber-400 p-4 rounded-2xl shadow-xs text-xs space-y-2">
                  <div className="flex items-center gap-2 font-black text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Official Commission Request: ₹{msg.offerAmount}</span>
                  </div>
                  <p className="text-slate-700 font-medium">
                    {msg.text}
                  </p>
                  {!isClaimed && !isPoster && (
                    <button
                      onClick={handlePayCommission}
                      className="mt-2 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black py-2 rounded-xl text-xs shadow-xs transition cursor-pointer"
                    >
                      Accept & Pay ₹{msg.offerAmount} Now (Reveal Contact)
                    </button>
                  )}
                </div>
              ) : (
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs font-semibold shadow-2xs leading-relaxed ${
                    msg.isMe
                      ? 'bg-[#0a2540] text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type message, clarify route timing, or discuss commission..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black disabled:opacity-50 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
