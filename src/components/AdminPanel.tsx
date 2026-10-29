import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Car, 
  User, 
  Phone, 
  DollarSign, 
  ArrowRight, 
  Building2, 
  Users, 
  FileText, 
  TrendingUp, 
  RotateCcw, 
  Lock, 
  Unlock, 
  SlidersHorizontal,
  Check,
  X,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Duty, UserProfile, WalletTransaction } from '../types';

interface AdminPanelProps {
  duties: Duty[];
  vendors: UserProfile[];
  transactions: WalletTransaction[];
  onUpdateDutyStatus: (dutyId: string, status: Duty['status']) => void;
  onRefundCommission: (dutyId: string, commissionAmount: number) => void;
  onToggleVendorKyc: (vendorId: string) => void;
  onToggleVendorStatus: (vendorId: string) => void;
  onAdjustVendorWallet: (vendorId: string, deltaAmount: number, reason: string) => void;
  onViewSlip: (duty: Duty) => void;
  onSwitchToVendorView: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  duties,
  vendors,
  transactions,
  onUpdateDutyStatus,
  onRefundCommission,
  onToggleVendorKyc,
  onToggleVendorStatus,
  onAdjustVendorWallet,
  onViewSlip,
  onSwitchToVendorView
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'bookings' | 'commissions' | 'vendors'>('bookings');
  const [searchBookingId, setSearchBookingId] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Wallet adjustment modal state
  const [selectedVendorForWallet, setSelectedVendorForWallet] = useState<UserProfile | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(500);
  const [adjustAction, setAdjustAction] = useState<'add' | 'deduct'>('add');
  const [adjustReason, setAdjustReason] = useState<string>('Performance Bonus / Refund');

  // KPI calculations
  const totalBookings = duties.length;
  const activeBookings = duties.filter(d => d.status === 'available' || d.status === 'negotiating').length;
  const assignedBookings = duties.filter(d => d.status === 'claimed').length;
  const completedBookings = duties.filter(d => d.status === 'completed').length;
  
  const totalEscrowVolume = duties.reduce((acc, d) => acc + (d.commissionAmount || 0), 0);
  const activeEscrowAmount = duties
    .filter(d => d.status === 'claimed')
    .reduce((acc, d) => acc + (d.commissionAmount || 0), 0);

  // Direct search by booking ID (e.g. SIC2601)
  const auditedDuty = searchBookingId.trim()
    ? duties.find(d => 
        d.dutyNumber.toLowerCase() === searchBookingId.trim().toLowerCase() ||
        d.dutyNumber.toLowerCase().includes(searchBookingId.trim().toLowerCase())
      )
    : null;

  // Filtered duties table
  const filteredDuties = duties.filter(d => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    return true;
  });

  const handleWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendorForWallet || adjustAmount <= 0) return;
    const delta = adjustAction === 'add' ? adjustAmount : -adjustAmount;
    onAdjustVendorWallet(selectedVendorForWallet.id, delta, adjustReason);
    setSelectedVendorForWallet(null);
  };

  return (
    <div className="space-y-6">
      {/* Super Admin Top Header */}
      <div className="bg-[#0a2540] text-white p-6 rounded-3xl shadow-lg border-2 border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Super Admin Control Panel
              </h1>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Owner Access
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Monitor all bookings by SIC number, audit escrow commission flows, and manage verified vendors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSwitchToVendorView}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer border border-white/20"
          >
            <span>Back to Vendor Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 shadow-xs">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
            Total Bookings Posted
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0a2540] mt-1">
            {totalBookings}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold mt-1">
            <span className="text-amber-600 font-black">{activeBookings} Open</span>
            <span>•</span>
            <span className="text-emerald-600 font-black">{assignedBookings} Locked</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 shadow-xs">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
            Active Escrow Commission
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
            ₹{activeEscrowAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 font-bold mt-1">
            Held safely in escrow pool
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 shadow-xs">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
            Total Commission Volume
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
            ₹{totalEscrowVolume.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 font-bold mt-1">
            Across all {totalBookings} bookings
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 shadow-xs">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
            Registered Vendors
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-700 mt-1">
            {vendors.length}
          </div>
          <div className="text-[11px] text-slate-500 font-bold mt-1">
            100% Aadhaar / DL Checked
          </div>
        </div>
      </div>

      {/* QUICK AUDIT TOOL: Search any booking by sequential number (SIC2601) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0a2540] flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-500" />
              <span>Instant Booking Number Audit</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Enter any sequential booking ID (e.g. <strong>SIC2601</strong>, <strong>SIC2602</strong>) to inspect all secret details, poster, buyer, and escrow commission
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchBookingId}
              onChange={(e) => setSearchBookingId(e.target.value.toUpperCase())}
              placeholder="Enter Booking ID (e.g. SIC2601)..."
              className="w-full bg-slate-50 border-2 border-amber-400/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm font-black text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
            {searchBookingId && (
              <button
                onClick={() => setSearchBookingId('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Audited Booking Card Display */}
        {searchBookingId.trim() ? (
          auditedDuty ? (
            <div className="mt-5 bg-slate-50 rounded-2xl p-5 border-2 border-amber-300">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm bg-[#0a2540] text-amber-400 px-3 py-1 rounded-xl shadow-xs">
                    #{auditedDuty.dutyNumber}
                  </span>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg uppercase ${
                    auditedDuty.status === 'claimed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : auditedDuty.status === 'negotiating'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}>
                    Status: {auditedDuty.status}
                  </span>
                  <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                    {auditedDuty.dutyType}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewSlip(auditedDuty)}
                    className="flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs shadow-2xs transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    <span>View Duty Slip</span>
                  </button>

                  {auditedDuty.status === 'claimed' && (
                    <button
                      onClick={() => onRefundCommission(auditedDuty.id, auditedDuty.commissionAmount)}
                      className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Refund Commission (₹{auditedDuty.commissionAmount})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Route & Schedule */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 mb-4">
                <div className="flex items-center gap-3 text-base font-black text-[#0a2540]">
                  <span>{auditedDuty.pickupCity}</span>
                  <ArrowRight className="w-4 h-4 text-amber-500" />
                  <span>{auditedDuty.dropCity}</span>
                  <span className="text-xs text-slate-500 font-bold ml-auto">
                    🗓️ {auditedDuty.pickupDate} at {auditedDuty.pickupTime}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-xs text-slate-600">
                  <div>
                    <span className="font-bold text-slate-500">Pickup Address: </span>
                    <span className="font-semibold text-slate-900">{auditedDuty.pickupAddress}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500">Drop Address: </span>
                    <span className="font-semibold text-slate-900">{auditedDuty.dropAddress}</span>
                  </div>
                </div>
              </div>

              {/* Multi-Column Details Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {/* Poster Box */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div className="text-[10px] uppercase font-black text-slate-400">Posting Travel Agent</div>
                  <div className="font-black text-slate-900 text-sm">{auditedDuty.posterCompany}</div>
                  <div className="text-slate-600">{auditedDuty.posterName} • {auditedDuty.posterCity}</div>
                  <div className="font-mono font-bold text-slate-800 flex items-center gap-1 pt-1">
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>{auditedDuty.posterPhone}</span>
                  </div>
                </div>

                {/* Assigned Driver / Buyer Box */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div className="text-[10px] uppercase font-black text-slate-400">Assigned Driver / Buyer</div>
                  {auditedDuty.claimedBy ? (
                    <>
                      <div className="font-black text-emerald-700 text-sm">{auditedDuty.claimedBy.companyName}</div>
                      <div className="text-slate-600">{auditedDuty.claimedBy.userName} ({auditedDuty.claimedBy.driverName || 'Driver'})</div>
                      <div className="font-mono font-bold text-slate-800 flex items-center gap-1 pt-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{auditedDuty.claimedBy.userPhone}</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-500">
                        Cab No: {auditedDuty.claimedBy.vehicleNumber || 'Unassigned'}
                      </div>
                    </>
                  ) : (
                    <div className="text-slate-400 font-bold py-2">
                      Not yet claimed. Currently open on duty exchange board.
                    </div>
                  )}
                </div>

                {/* Secret Customer Details (Admin viewable) */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div className="text-[10px] uppercase font-black text-slate-400">Customer Details (Private)</div>
                  <div className="font-black text-slate-900 text-sm">{auditedDuty.passengerName}</div>
                  <div className="font-mono font-bold text-indigo-700 flex items-center gap-1 pt-1">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{auditedDuty.passengerPhone}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold">
                    Passengers: {auditedDuty.passengerCount} Pax • {auditedDuty.luggageCount} Luggage Bags
                  </div>
                </div>
              </div>

              {/* Financial Audit */}
              <div className="grid grid-cols-4 gap-2 bg-white p-3 rounded-xl border border-slate-200 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Customer Fare</div>
                  <div className="font-black text-slate-900 text-base">₹{auditedDuty.totalCustomerFare}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Advance Paid</div>
                  <div className="font-black text-slate-900 text-base">₹{auditedDuty.advanceReceived}</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-1">
                  <div className="text-[10px] text-amber-800 font-bold uppercase">Commission</div>
                  <div className="font-black text-amber-700 text-base">₹{auditedDuty.commissionAmount}</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-1">
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">Driver Net</div>
                  <div className="font-black text-emerald-700 text-base">₹{auditedDuty.driverNetEarning}</div>
                </div>
              </div>

              {auditedDuty.specialInstructions && (
                <div className="mt-3 text-xs bg-white p-3 rounded-xl border border-slate-200 text-slate-700">
                  <span className="font-bold text-slate-500">Special Instructions / Remarks: </span>
                  <span>{auditedDuty.specialInstructions}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>No booking found with ID "#{searchBookingId}". Please verify the number (e.g. SIC2601, SIC2602).</span>
            </div>
          )
        ) : null}
      </div>

      {/* Main Admin Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveAdminTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'bookings'
              ? 'bg-[#0a2540] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span>All Bookings ({duties.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('commissions')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'commissions'
              ? 'bg-[#0a2540] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span>Commissions & Escrow Pool</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('vendors')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'vendors'
              ? 'bg-[#0a2540] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span>Vendors & KYC Manager ({vendors.length})</span>
        </button>
      </div>

      {/* TAB 1: ALL BOOKINGS TABLE */}
      {activeAdminTab === 'bookings' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-black text-[#0a2540]">
              Master Bookings Directory
            </h3>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {(['all', 'available', 'negotiating', 'claimed', 'completed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#0a2540] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'all' ? 'All' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Booking ID</th>
                  <th className="py-3 px-3">Route</th>
                  <th className="py-3 px-3">Vehicle</th>
                  <th className="py-3 px-3 text-right">Fare</th>
                  <th className="py-3 px-3 text-right">Commission</th>
                  <th className="py-3 px-3">Posted By</th>
                  <th className="py-3 px-3">Assigned To</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredDuties.map((duty) => (
                  <tr key={duty.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-mono font-black text-slate-950">
                      #{duty.dutyNumber}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {duty.pickupCity} ➔ {duty.dropCity}
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-[11px]">
                      {duty.vehicleType.split('(')[0]}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-slate-900">
                      ₹{duty.totalCustomerFare}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-amber-600">
                      ₹{duty.commissionAmount}
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-semibold">
                      {duty.posterCompany}
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {duty.claimedBy ? (
                        <span className="font-bold text-emerald-700">{duty.claimedBy.companyName}</span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        duty.status === 'claimed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : duty.status === 'negotiating'
                          ? 'bg-amber-100 text-amber-800'
                          : duty.status === 'completed'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {duty.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSearchBookingId(duty.dutyNumber)}
                          className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                          title="Audit Booking"
                        >
                          <Search className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onViewSlip(duty)}
                          className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded cursor-pointer"
                          title="View Duty Voucher"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: COMMISSIONS & ESCROW POOL */}
      {activeAdminTab === 'commissions' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-black text-[#0a2540]">
              Commission Escrow Transactions Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Every commission transaction is secured in Safar India Cabs escrow until passenger pickup is confirmed.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <div key={tx.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    tx.type === 'credit' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-sm">
                      {tx.title}
                    </div>
                    <div className="text-slate-500 text-[11px] font-medium">
                      {tx.description} • Method: {tx.method || 'UPI/Escrow'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <div className={`text-base font-black ${
                      tx.type === 'credit' ? 'text-emerald-700' : 'text-slate-900'
                    }`}>
                      {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold">{tx.timestamp}</div>
                  </div>

                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                    Escrow Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: VENDORS & KYC MANAGER */}
      {activeAdminTab === 'vendors' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-[#0a2540]">
                All Registered Vendors & Cab Operators
              </h3>
              <p className="text-xs text-slate-500">
                Manage vendor KYC badges, toggle active/suspended status, and adjust wallet balances.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Agency / Operator</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Rating / Duties</th>
                  <th className="py-3 px-3 text-right">Wallet Balance</th>
                  <th className="py-3 px-3 text-center">KYC Status</th>
                  <th className="py-3 px-3 text-center">Account Status</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3">
                      <div className="font-black text-slate-950 text-sm">{v.companyName}</div>
                      <div className="text-slate-500 text-[11px]">{v.name} • {v.city}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      {v.phone}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-bold">
                      {v.role}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">★ {v.rating}</div>
                      <div className="text-[10px] text-slate-500">{v.completedDuties} trips</div>
                    </td>
                    <td className="py-3 px-3 text-right font-black text-emerald-700 text-sm">
                      ₹{(v.walletBalance ?? 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onToggleVendorKyc(v.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer transition ${
                          v.isVerified
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                        title="Click to toggle KYC"
                      >
                        {v.isVerified ? '✓ Verified' : 'Pending'}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onToggleVendorStatus(v.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer transition ${
                          v.status !== 'suspended'
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {v.status !== 'suspended' ? 'Active' : 'Suspended'}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedVendorForWallet(v);
                          setAdjustAmount(500);
                        }}
                        className="bg-[#0a2540] hover:bg-slate-800 text-amber-400 font-bold px-2.5 py-1 rounded-lg text-[11px] transition cursor-pointer"
                      >
                        Adjust Wallet
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Wallet Balance Dialog */}
      {selectedVendorForWallet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 max-w-md w-full shadow-2xl text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black text-[#0a2540]">
                Adjust Vendor Wallet Balance
              </h3>
              <button
                onClick={() => setSelectedVendorForWallet(null)}
                className="text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWalletSubmit} className="space-y-4 pt-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-500">Target Vendor:</div>
                <div className="font-black text-slate-900 text-sm mt-0.5">{selectedVendorForWallet.companyName}</div>
                <div className="text-slate-600">Current Balance: ₹{(selectedVendorForWallet.walletBalance ?? 0).toLocaleString('en-IN')}</div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Action
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustAction('add')}
                    className={`py-2 rounded-xl text-xs font-black transition cursor-pointer border ${
                      adjustAction === 'add'
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    + Credit Funds
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustAction('deduct')}
                    className={`py-2 rounded-xl text-xs font-black transition cursor-pointer border ${
                      adjustAction === 'deduct'
                        ? 'bg-rose-600 text-white border-rose-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    - Deduct Funds
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  min={50}
                  step={50}
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Reason / Reference Note
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Commission refund or promotional credit"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedVendorForWallet(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2 rounded-xl text-xs transition cursor-pointer shadow-xs"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
