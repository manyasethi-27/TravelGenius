import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trip, User, Activity, Expense, Document, Poll } from '../../types';
import { ChevronLeft, Calendar, DollarSign, Wallet, FileText, CheckSquare, Users, Copy, Check } from 'lucide-react';
import ItineraryTab from './tabs/ItineraryTab';
import ExpenseTab from './tabs/ExpenseTab';
import BalanceTab from './tabs/BalanceTab';
import VaultTab from './tabs/VaultTab';
import PollTab from './tabs/PollTab';
import { cn } from '../../lib/utils';

interface TripViewProps {
  trip: Trip;
  currentUser: User;
  onBack: () => void;
  onUpdate: (trip: Trip) => void;
}

type TabType = 'itinerary' | 'expenses' | 'balance' | 'vault' | 'polls';

export default function TripView({ trip, currentUser, onBack, onUpdate }: TripViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('itinerary');
  const [copied, setCopied] = useState(false);

  const copyInvite = () => {
    navigator.clipboard.writeText(trip.joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateItinerary = (itinerary: Activity[]) => {
    onUpdate({ ...trip, itinerary });
  };

  const updateExpenses = (expenses: Expense[]) => {
    onUpdate({ ...trip, expenses });
  };

  const updateDocuments = (documents: Document[]) => {
    onUpdate({ ...trip, documents });
  };

  const updatePolls = (polls: Poll[]) => {
    onUpdate({ ...trip, polls });
  };

  const tabs = [
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
    { id: 'balance', label: 'Balance', icon: Wallet },
    { id: 'vault', label: 'Vault', icon: FileText },
    { id: 'polls', label: 'Polls', icon: CheckSquare },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-6 flex-shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <button 
            onClick={onBack}
            className="bg-slate-900 h-10 w-10 md:h-12 md:w-12 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="min-w-0">
            <h1 className="font-black text-xl md:text-2xl text-slate-900 truncate tracking-tighter uppercase">{trip.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{trip.destination}</span>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-[10px] text-brand-600 font-black tracking-widest uppercase">{trip.joinCode}</span>
            </div>
          </div>
        </div>

        {/* Desktop Tabs */}
        <nav className="hidden lg:flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 font-black text-[10px] uppercase tracking-widest",
                  isActive ? "bg-white text-brand-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Icon size={16} strokeWidth={isActive ? 3 : 2} />
                {tab.label}
              </button>
            );
          })}
        </nav>
        
        <div className="flex items-center gap-4 ml-auto md:ml-0">
          <div className="flex -space-x-3">
            {trip.members.slice(0, 3).map((member) => (
              <img 
                key={member.id}
                src={member.avatar} 
                alt={member.name}
                className="h-9 w-9 rounded-full ring-4 ring-white border border-slate-100 bg-slate-50 shadow-sm"
              />
            ))}
            {trip.members.length > 3 && (
              <div className="h-9 w-9 rounded-full ring-4 ring-white bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
                +{trip.members.length - 3}
              </div>
            )}
          </div>
          <button 
            onClick={copyInvite}
            className={cn(
              "p-2.5 rounded-xl transition-all flex items-center gap-2",
              copied ? "bg-green-50 text-green-600" : "bg-brand-50 text-brand-600 hover:bg-brand-100"
            )}
          >
            {copied ? <Check size={20} /> : <Users size={20} />}
            <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">{copied ? 'Copied' : 'Invite'}</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto px-8 pt-8 pb-32 md:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full"
          >
            {activeTab === 'itinerary' && (
              <div className="max-w-4xl mx-auto">
                <ItineraryTab 
                  trip={trip} 
                  onUpdate={updateItinerary} 
                />
              </div>
            )}
            {activeTab === 'expenses' && (
              <div className="max-w-5xl mx-auto">
                <ExpenseTab 
                  trip={trip} 
                  onUpdate={updateExpenses} 
                  currentUser={currentUser}
                />
              </div>
            )}
            {activeTab === 'balance' && (
              <div className="max-w-2xl mx-auto">
                <BalanceTab 
                  trip={trip} 
                  currentUser={currentUser}
                />
              </div>
            )}
            {activeTab === 'vault' && (
              <div className="max-w-4xl mx-auto">
                <VaultTab 
                  trip={trip} 
                  onUpdate={updateDocuments}
                />
              </div>
            )}
            {activeTab === 'polls' && (
              <div className="max-w-3xl mx-auto">
                <PollTab 
                  trip={trip} 
                  onUpdate={updatePolls}
                  currentUser={currentUser}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Nav (Only visible on small screens) */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 bg-slate-900 rounded-[2.5rem] py-4 px-2 z-40 shadow-2xl flex justify-around items-center border border-white/10 backdrop-blur-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "flex flex-col items-center gap-1 group transition-all duration-300",
                isActive ? "scale-110" : "opacity-50 hover:opacity-100"
              )}
            >
              <div className={cn(
                "p-2.5 rounded-2xl transition-all duration-300 font-black",
                isActive ? "bg-white text-brand-600 shadow-xl" : "text-white"
              )}>
                <Icon size={24} strokeWidth={isActive ? 3 : 2} />
              </div>
              {isActive && (
                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white animate-in zoom-in-50">
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
