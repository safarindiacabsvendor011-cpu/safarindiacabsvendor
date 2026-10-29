import React, { useState } from 'react';
import { 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Car, 
  Phone, 
  Send, 
  User, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { VendorChat, UserProfile } from '../types';

interface ChatsViewProps {
  chats: VendorChat[];
  currentUser: UserProfile;
}

export const ChatsView: React.FC<ChatsViewProps> = ({ chats, currentUser }) => {
  const [activeSubTab, setActiveSubTab] = useState<'Posted' | 'Received'>('Posted');
  const [selectedChat, setSelectedChat] = useState<VendorChat | null>(chats[0] || null);
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Record<string, Array<{ sender: string; text: string; time: string; isMe: boolean }>>>({
    'chat-01': [
      { sender: 'Jagdish Malik', text: 'Hello Safar India Cabs, car is available at Kaithal.', time: '07:45 PM', isMe: false },
      { sender: 'You', text: 'Clean sedan with luggage carrier required. Guest departure at 11 PM.', time: '07:48 PM', isMe: true },
      { sender: 'Jagdish Malik', text: 'Ji car ready hai carrier ke sath. Can you lock for ₹300 commission?', time: '07:52 PM', isMe: false }
    ],
    'chat-02': [
      { sender: 'Joginder Singh', text: 'Innova Crysta ready for Mussoorie to Delhi trip.', time: '08:00 AM', isMe: false },
      { sender: 'You', text: 'Commission locked in escrow. Please reach hotel by 08:30 AM.', time: '08:05 AM', isMe: true },
      { sender: 'Joginder Singh', text: 'Duty assigned successfully. Driver Joginder reached Mussoorie hotel.', time: '08:15 AM', isMe: false }
    ]
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat || !newMessage.trim()) return;

    const currentList = chatMessages[selectedChat.id] || [];
    const updated = [
      ...currentList,
      {
        sender: 'You',
        text: newMessage.trim(),
        time: 'Just now',
        isMe: true
      }
    ];

    setChatMessages({
      ...chatMessages,
      [selectedChat.id]: updated
    });
    setNewMessage('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#0a2540] tracking-tight">
            Vendor Duty Chats & Quotes
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Real-time B2B counter-offers, driver allocations, and duty coordination
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('Posted')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
              activeSubTab === 'Posted'
                ? 'bg-[#0a2540] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Posted Duties ({chats.length})
          </button>
          <button
            onClick={() => setActiveSubTab('Received')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
              activeSubTab === 'Received'
                ? 'bg-[#0a2540] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Received Enquiries (0)
          </button>
        </div>
      </div>

      {/* Main Chat Layout: List & Active Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chats List Column */}
        <div className="lg:col-span-5 space-y-2.5">
          {chats.map((chat) => {
            const isSelected = selectedChat?.id === chat.id;

            return (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50/70 border-amber-400 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono font-black text-slate-800 text-xs">
                    ID: {chat.dutyNumber.replace('SIC-', '')}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    chat.status === 'Assigned'
                      ? 'bg-emerald-100 text-emerald-800'
                      : chat.status === 'Active Negotiation'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {chat.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-black text-[#0a2540] text-sm mb-1.5">
                  <span>{chat.route}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 mb-2 font-medium">
                  <span>🚘 {chat.vehicleType}</span>
                  <span className="font-black text-slate-900">₹{chat.fare}</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="line-clamp-1 italic text-[11px] font-medium">
                    "{chat.lastMessage}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-400 font-bold">{chat.lastMessageTime}</span>
                  {chat.driverOffersCount && (
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 font-black px-2 py-0.5 rounded-full text-[10px]">
                      +{chat.driverOffersCount} driver offers
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Chat Conversation Window */}
        <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-xs flex flex-col h-[520px]">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0a2540] text-amber-400 flex items-center justify-center font-black text-sm">
                    {selectedChat.counterPartyName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-sm">
                      {selectedChat.counterPartyName} ({selectedChat.counterPartyCompany})
                    </div>
                    <div className="text-[11px] text-slate-500 font-bold flex items-center gap-2">
                      <span>{selectedChat.route}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-black">Fare: ₹{selectedChat.fare}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${selectedChat.counterPartyPhone}`}
                  className="flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Call</span>
                </a>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                {(chatMessages[selectedChat.id] || []).map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] font-bold text-slate-400 mb-0.5 px-1">
                      {msg.sender} • {msg.time}
                    </div>
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs font-semibold shadow-2xs leading-relaxed ${
                        msg.isMe
                          ? 'bg-[#0a2540] text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type counter offer or vehicle detail..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black disabled:opacity-50 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
              <div className="font-bold text-slate-700 text-sm">Select a duty enquiry to start chat</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
