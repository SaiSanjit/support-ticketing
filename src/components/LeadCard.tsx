import React from 'react';
import { MapPin, User } from 'lucide-react';

interface LeadCardProps {
  id?: string;
  title?: string;
  status?: string;
  location?: string;
  assignee?: string;
  statusType?: 'lost' | 'won' | 'pending';
}

export function LeadCard({
  id = '2-26-00006',
  title = 'Mobile Test',
  status = 'Lost',
  location = 'Dubai, United ...',
  assignee = 'Madhan Kumar...',
  statusType = 'lost'
}: LeadCardProps) {
  return (
    <div className="relative w-[460px] bg-white rounded-[32px] p-6 pb-7 shadow-sm border border-[#e2e8f0]/60 overflow-hidden font-['Outfit',sans-serif]">
      
      {/* Background Watermark Overlap Pattern */}
      <div className="absolute right-0 bottom-0 pointer-events-none">
        <svg width="140" height="140" viewBox="0 0 120 120" fill="none" opacity="0.04" className="transform translate-x-8 translate-y-8">
           <rect x="50" y="10" width="45" height="75" rx="14" transform="rotate(25 75 50)" stroke="#1e3a8a" strokeWidth="6"/>
           <rect x="15" y="30" width="45" height="75" rx="14" transform="rotate(10 45 70)" stroke="#1e3a8a" strokeWidth="6"/>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col h-full gap-5">
        
        {/* Top Header Row */}
        <div className="flex items-start justify-between">
          <div className="px-5 py-[6px] mt-1 bg-[#eef2f6] rounded-[24px]">
            <span className="text-[#1a365d] text-[15px] font-bold tracking-wide">{id}</span>
          </div>
        </div>

        {/* Absolute Top Right Overlapping Badge */}
        <div className="absolute top-0 right-0 bg-[#fce7e8] px-8 py-[10px] rounded-bl-[28px] border-b border-l border-[#fca5a5]/30 shadow-sm z-20">
           <span className="text-[#ef4444] text-[17px] font-bold tracking-wide">{status}</span>
        </div>

        {/* Title */}
        <h3 className="text-[26px] font-bold text-[#1a5682] leading-tight mt-1 mb-[2px]">
          {title}
        </h3>

        {/* Line Divider */}
        <div className="w-[105%] -ml-2 h-[1px] bg-gradient-to-r from-transparent via-[#e2e8f0] to-[#e2e8f0] opacity-80" />

        {/* Footer Info */}
        <div className="flex items-center gap-7 mt-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f0f4f8] flex items-center justify-center border-2 border-white shadow-sm">
               <MapPin size={16} className="text-[#1a5682]" strokeWidth={2} />
            </div>
            <span className="text-[#0f172a] text-[16px] font-semibold">{location}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f0f4f8] flex items-center justify-center border-2 border-white shadow-sm">
               <User size={16} className="text-[#1a5682]" strokeWidth={2} />
            </div>
            <span className="text-[#0f172a] text-[16px] font-semibold">{assignee}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
