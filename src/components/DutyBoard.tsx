import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Car, 
  PlusCircle, 
  LayoutGrid, 
  Table, 
  Sparkles, 
  SlidersHorizontal,
  FileCheck,
  Calculator,
  ShieldAlert
} from 'lucide-react';
import { Duty, UserProfile } from '../types';
import { DutyCard } from './DutyCard';
import { DutyTableView } from './DutyTableView';

interface DutyBoardProps {
  duties: Duty[];
  currentUser: UserProfile;
  selectedCity: string;
  onClaimDuty: (duty: Duty) => void;
  onViewSlip: (duty: Duty) => void;
  onOpenPostDuty: () => void;
  onNegotiate?: (duty: Duty) => void;
  onOpenChat?: (duty: Duty) => void;
}

export const DutyBoard: React.FC<DutyBoardProps> = ({
  duties,
  currentUser,
  selectedCity,
  onClaimDuty,
  onViewSlip,
  onOpenPostDuty,
  onNegotiate,
  onOpenChat
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');
  const [selectedDutyType, setSelectedDutyType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest_fare' | 'lowest_comm'>('recent');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const vehicleCategories = [
    { id: 'all', label: 'All Cabs' },
    { id: 'Hatchback', label: 'Hatchback' },
    { id: 'Sedan', label: 'Sedan (Dzire)' },
    { id: 'SUV (Ertiga', label: 'Ertiga SUV' },
    { id: 'Premium SUV', label: 'Innova Crysta' },
    { id: 'Tempo', label: 'Tempo Traveller' }
  ];

  const filteredDuties = useMemo(() => {
    return duties.filter((d) => {
      // City filter
      if (selectedCity !== 'All Cities') {
        const matchesCity = 
          d.pickupCity.toLowerCase().includes(selectedCity.toLowerCase()) ||
          d.dropCity.toLowerCase().includes(selectedCity.toLowerCase());
        if (!matchesCity) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesQuery = 
          d.pickupCity.toLowerCase().includes(q) ||
          d.dropCity.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q) ||
          d.dutyNumber.toLowerCase().includes(q) ||
          d.vehicleType.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Vehicle
      if (selectedVehicle !== 'all' && !d.vehicleType.includes(selectedVehicle)) {
        return false;
      }

      // Duty type
      if (selectedDutyType !== 'all' && d.dutyType !== selectedDutyType) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'highest_fare') {
        return b.totalCustomerFare - a.totalCustomerFare;
      }
      if (sortBy === 'lowest_comm') {
        return a.commissionAmount - b.commissionAmount;
      }
      return 0;
    });
  }, [duties, selectedCity, searchTerm, selectedVehicle, selectedDutyType, sortBy]);

  return (
    <div className="space-y-5">
      {/* Quick Services Strip (as in video) */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2 shadow-2xs">
          <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <div className="font-black text-slate-900 text-[11px]">B2B Fare Estimator</div>
            <div className="text-[10px] text-slate-500">Standard per KM rates</div>
          </div>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2 shadow-2xs">
          <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-black text-slate-900 text-[11px]">Rules & Escrow</div>
            <div className="text-[10px] text-slate-500">100% Commission safety</div>
          </div>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2 shadow-2xs">
          <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="font-black text-slate-900 text-[11px]">Zero Fraud Network</div>
            <div className="text-[10px] text-slate-500">Aadhaar & DL verified</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Booking ID, city, landmark (e.g. Patiala, Kaithal, Delhi, Mussoorie)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            {/* Duty Type */}
            <select
              value={selectedDutyType}
              onChange={(e) => setSelectedDutyType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="all">All Trip Types</option>
              <option value="One Way">One Way</option>
              <option value="Round Trip">Round Trip</option>
              <option value="Airport Transfer">Airport Transfer</option>
              <option value="Local (8h / 80km)">Local (8h / 80km)</option>
              <option value="Multi-day Tour">Multi-day Tour</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="highest_fare">Highest Total Fare</option>
              <option value="lowest_comm">Lowest Commission</option>
            </select>

            {/* View Mode Switcher (Cards vs Table) */}
            <div className="col-span-2 sm:col-span-1 flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  viewMode === 'cards'
                    ? 'bg-[#0a2540] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Bold Column Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  viewMode === 'table'
                    ? 'bg-[#0a2540] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Wide Multi-Column Table View"
              >
                <Table className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Columns</span>
              </button>
            </div>
          </div>
        </div>

        {/* Vehicle Category Pills */}
        <div className="flex items-center gap-2 mt-3.5 pt-3 border-t border-slate-100 overflow-x-auto no-scrollbar text-xs">
          <span className="text-slate-500 text-[11px] shrink-0 font-black uppercase">
            Vehicles:
          </span>
          {vehicleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedVehicle(cat.id)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-black transition cursor-pointer border ${
                selectedVehicle === cat.id
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-2xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-black text-[#0a2540] tracking-tight">
            Live Duty Exchange Board
          </h2>
          <span className="bg-[#0a2540] text-amber-400 font-black px-2.5 py-0.5 rounded-full text-xs">
            {filteredDuties.length} Available
          </span>
          {selectedCity !== 'All Cities' && (
            <span className="text-xs text-slate-500 font-bold">
              in {selectedCity}
            </span>
          )}
        </div>

        <button
          onClick={onOpenPostDuty}
          className="flex items-center gap-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-xl transition shadow-xs cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>+ Post New Duty</span>
        </button>
      </div>

      {/* Render Duties in Cards or Multi-Column Table */}
      {filteredDuties.length > 0 ? (
        viewMode === 'table' ? (
          <DutyTableView
            duties={filteredDuties}
            currentUser={currentUser}
            onClaim={onClaimDuty}
            onViewSlip={onViewSlip}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDuties.map((duty) => (
              <DutyCard
                key={duty.id}
                duty={duty}
                currentUser={currentUser}
                onClaim={onClaimDuty}
                onViewSlip={onViewSlip}
                onNegotiate={onNegotiate}
                onOpenChat={onOpenChat}
              />
            ))}
          </div>
        )
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-900 mb-1">
            No Duties Match This Filter
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5 font-medium">
            Try switching vehicle categories or broadcast your own duty to receive instant commission from our 4,800+ verified driver network.
          </p>
          <button
            onClick={onOpenPostDuty}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-md transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Post a Duty Now</span>
          </button>
        </div>
      )}
    </div>
  );
};
