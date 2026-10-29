import React from 'react';
import { X, Car, PlusCircle, ArrowRight } from 'lucide-react';

interface PostChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPostBooking: () => void;
  onSelectPostReturnVehicle: () => void;
}

export const PostChoiceModal: React.FC<PostChoiceModalProps> = ({
  isOpen,
  onClose,
  onSelectPostBooking,
  onSelectPostReturnVehicle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-sm bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-2xl text-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 className="text-base font-black text-[#0a2540]">
            Create a New Post
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              onClose();
              onSelectPostBooking();
            }}
            className="w-full p-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-left transition cursor-pointer flex items-center justify-between shadow-xs group"
          >
            <div>
              <div className="font-black text-sm text-slate-950">
                New Booking Duty
              </div>
              <div className="text-xs text-slate-800 font-bold mt-0.5">
                Broadcast a cab lead & earn upfront commission
              </div>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={() => {
              onClose();
              onSelectPostReturnVehicle();
            }}
            className="w-full p-4 rounded-2xl bg-[#0a2540] hover:bg-slate-800 text-white text-left transition cursor-pointer flex items-center justify-between shadow-xs group"
          >
            <div>
              <div className="font-black text-sm text-amber-400">
                Free Vehicle / Return Cab
              </div>
              <div className="text-xs text-slate-300 font-semibold mt-0.5">
                Post empty returning cab to eliminate fuel loss
              </div>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>
    </div>
  );
};
