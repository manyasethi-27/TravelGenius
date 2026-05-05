import { Trip, User } from '../../types';
import { Plus, MapPin, Calendar, LogOut, Link, Trash2, Copy, Check } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardProps {
  trips: Trip[];
  onSelectTrip: (id: string) => void;
  onCreateTrip: (data: any) => void;
  onJoinTrip: (code: string) => Promise<boolean>;
  onDeleteTrip: (id: string) => Promise<boolean>;
  currentUser: User;
}

export default function Dashboard({ trips, onSelectTrip, onCreateTrip, onJoinTrip, onDeleteTrip, currentUser }: DashboardProps) {
  const { logout } = useAuth();
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Trip Creation Form State
  const [newTrip, setNewTrip] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80'
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyInvite = (e: React.MouseEvent, code: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleJoin = async () => {
    if (!joinCode) return;
    const success = await onJoinTrip(joinCode.toUpperCase());
    if (success) {
      setJoinCode('');
      setIsJoining(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this adventure? This action cannot be undone.')) {
      await onDeleteTrip(id);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrip.name || !newTrip.destination) return;
    onCreateTrip(newTrip);
    setIsCreating(false);
    setNewTrip({
      name: '',
      destination: '',
      startDate: '',
      endDate: '',
      coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Create Trip Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>

              <h2 className="text-3xl font-black font-display text-slate-900 mb-8 uppercase tracking-tight">Create New Trip</h2>

              <form onSubmit={handleCreate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Trip Name</label>
                    <input
                      required
                      placeholder="Summer in Greece"
                      className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-brand-500 outline-none font-bold"
                      value={newTrip.name}
                      onChange={e => setNewTrip(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Location</label>
                    <input
                      required
                      placeholder="Santorini, Greece"
                      className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-brand-500 outline-none font-bold"
                      value={newTrip.destination}
                      onChange={e => setNewTrip(prev => ({ ...prev, destination: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Start Date</label>
                    <input
                      type="date"
                      required
                      className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-brand-500 outline-none font-bold"
                      value={newTrip.startDate}
                      onChange={e => setNewTrip(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">End Date</label>
                    <input
                      type="date"
                      required
                      className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-brand-500 outline-none font-bold"
                      value={newTrip.endDate}
                      onChange={e => setNewTrip(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-brand-100 hover:bg-brand-700 transition-all uppercase tracking-[0.2em] text-xs"
                >
                  Confirm Adventure
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm font-sans">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-2 rounded-xl">
              <MapPin className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black font-display text-slate-900 tracking-tighter uppercase italic">WanderSplit</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 ml-8">
            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600">Explore</button>
            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors">Trends</button>
            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors">Resources</button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <h2 className="text-sm font-black font-display text-slate-900 leading-none">{currentUser.name}</h2>
            <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">PRO Traveler</p>
          </div>
          <img src={currentUser.avatar} className="w-10 h-10 rounded-xl border border-slate-100 shadow-sm" />
          <div className="w-px h-8 bg-slate-100 mx-2" />
          <button
            onClick={logout}
            className="w-10 h-10 text-slate-400 hover:text-rose-500 transition-colors flex items-center justify-center bg-slate-50 rounded-xl"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 pt-12 pb-24">
        {/* Full Screen Nature Hero Section */}
        <div className="relative overflow-hidden mb-20 rounded-[4rem] bg-slate-900 min-h-[500px] flex items-center shadow-2xl">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80"
              alt="Nature Background"
              className="w-full h-full object-cover opacity-60 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
          </div>

          <div className="relative z-10 w-full px-8 md:px-20 py-20 text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-8xl font-black font-display tracking-tighter mb-8 leading-[0.9]">
                ESCAPE <br />
                <span className="text-brand-400 outline-8">TOGETHER.</span>
              </h2>
              <p className="text-slate-200 text-lg md:text-2xl font-medium mb-12 max-w-xl leading-relaxed">
                The world is waiting. Plan your collective escape, track every cent,
                and focus on the adventure, not the bills.
              </p>
              <div className="flex flex-wrap gap-6">
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-10 py-5 bg-white text-slate-900 rounded-3xl font-black text-xs uppercase tracking-[0.25em] shadow-2xl hover:bg-brand-500 hover:text-white transition-all hover:scale-105 active:scale-95"
                >
                  Create Trip
                </button>
                <button
                  onClick={() => setIsJoining(true)}
                  className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-3xl font-black text-xs uppercase tracking-[0.25em] hover:bg-white/20 transition-all"
                >
                  Join Code
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 border-b border-slate-200 pb-12">
          <div>
            <h2 className="text-4xl font-black font-display text-slate-900 tracking-tight uppercase">My Adventures</h2>
            <p className="text-slate-400 font-medium mt-2 text-lg">Managing {trips.length} active journeys across the globe.</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white p-2 rounded-2xl border border-slate-200 flex gap-1">
              <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Active</button>
              <button className="px-4 py-2 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors">Past</button>
            </div>
          </div>
        </div>

        {isJoining && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-16"
          >
            <div className="bg-white p-12 rounded-[3.5rem] border border-brand-100 shadow-2xl shadow-brand-50/50 max-w-2xl mx-auto text-center">
              <label className="text-[11px] font-black uppercase text-brand-600 tracking-[0.3em] mb-6 block">Unlock Private Access</label>
              <div className="flex gap-4">
                <input
                  placeholder="CODE (E.G. XJ39K)"
                  autoFocus
                  className="flex-1 bg-slate-50 p-6 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 font-black tracking-[0.5em] text-brand-600 text-center uppercase text-xl outline-none"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value)}
                />
                <button
                  onClick={handleJoin}
                  className="bg-brand-600 text-white px-12 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-100 hover:bg-brand-700 transition-all"
                >
                  Enter
                </button>
              </div>
              <button onClick={() => setIsJoining(false)} className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Cancel</button>
            </div>
          </motion.div>
        )}

        {trips.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[4rem] border border-dashed border-slate-200">
            <div className="bg-slate-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <MapPin className="text-brand-300" size={64} />
            </div>
            <h3 className="text-3xl font-black font-display text-slate-400 tracking-tight uppercase">No trips found</h3>
            <p className="text-slate-300 font-medium mt-2">Start your legacy journey today.</p>
            <button
              onClick={() => setIsCreating(true)}
              className="mt-10 px-8 py-4 bg-brand-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-100"
            >
              Initialize First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {trips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => onSelectTrip(trip.id)}
                className="group relative overflow-hidden rounded-[3rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 cursor-pointer"
              >
                <div className="h-64 w-full overflow-hidden relative">
                  <img
                    src={trip.coverImage}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  <div className="absolute top-6 right-6 flex items-center gap-2 z-50">
                      <button
                        onClick={(e) => copyInvite(e, trip.joinCode, trip.id)}
                        className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-[10px] font-black tracking-widest text-brand-600 uppercase border border-white/50 hover:bg-brand-50 transition-colors"
                        title="Copy Join Code"
                      >
                        {copiedId === trip.id ? <Check size={14} /> : <Copy size={14} />}
                        {trip.joinCode}
                      </button>
                    {trip.adminId === currentUser.id && (
                      <button
                        onClick={(e) => handleDelete(e, trip.id)}
                        className="bg-rose-500/90 backdrop-blur-md p-2 rounded-2xl shadow-xl text-white hover:bg-rose-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="font-black text-2xl font-display tracking-tight uppercase leading-none drop-shadow-lg">{trip.name}</h3>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center text-slate-400 text-xs font-black tracking-[0.1em] uppercase">
                      <MapPin size={16} className="mr-2 text-brand-500" strokeWidth={3} />
                      {trip.destination}
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                    <div className="flex items-center text-[10px] text-slate-500 font-black uppercase tracking-widest">
                      <Calendar size={16} className="mr-3 text-slate-400" />
                      {formatDate(trip.startDate)}
                    </div>

                    <div className="flex -space-x-3">
                      {trip.members.slice(0, 3).map((member) => (
                        <img
                          key={member.id}
                          src={member.avatar}
                          alt={member.name}
                          className="h-10 w-10 rounded-full ring-4 ring-white border border-slate-100 bg-white shadow-sm"
                        />
                      ))}
                      {trip.members.length > 3 && (
                        <div className="h-10 w-10 rounded-full ring-4 ring-white bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400">
                          +{trip.members.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
