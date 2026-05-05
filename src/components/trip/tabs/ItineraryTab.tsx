import { useState, FormEvent } from 'react';
import { Trip, Activity } from '../../../types';
import { Plus, Clock, MoreVertical, Trash2 } from 'lucide-react';
import { generateId, cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ItineraryTabProps {
  trip: Trip;
  onUpdate: (itinerary: Activity[]) => void;
}

export default function ItineraryTab({ trip, onUpdate }: ItineraryTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newActivity, setNewActivity] = useState({ title: '', time: '', notes: '', day: 1 });

  const activitiesByDay = trip.itinerary.reduce((acc, activity) => {
    if (!acc[activity.day]) acc[activity.day] = [];
    acc[activity.day].push(activity);
    return acc;
  }, {} as Record<number, Activity[]>);

  // Sorting activities by time (basic string sort for demo)
  Object.keys(activitiesByDay).forEach(day => {
    activitiesByDay[Number(day)].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  });

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newActivity.title) return;
    
    const activity: Activity = {
      ...newActivity,
      id: generateId(),
    };
    
    onUpdate([...trip.itinerary, activity]);
    setNewActivity({ title: '', time: '', notes: '', day: 1 });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    onUpdate(trip.itinerary.filter(a => a.id !== id));
  };

  const daysCount = Math.max(
    1,
    Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1,
    ...trip.itinerary.map(a => a.day)
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold font-display text-slate-800">Timeline</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-1 text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-brand-100 transition-colors"
        >
          <Plus size={16} />
          <span>Add Activity</span>
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border-2 border-brand-100 rounded-2xl p-4 shadow-lg mb-6"
          >
            <form onSubmit={handleAdd} className="space-y-3">
              <input 
                autoFocus
                placeholder="Activity title (e.g. Visit Taj Mahal)"
                className="w-full bg-slate-50 p-3 rounded-xl border-none focus:ring-2 focus:ring-brand-500 font-medium"
                value={newActivity.title}
                onChange={e => setNewActivity({...newActivity, title: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="time"
                  className="bg-slate-50 p-3 rounded-xl border-none focus:ring-2 focus:ring-brand-500"
                  value={newActivity.time}
                  onChange={e => setNewActivity({...newActivity, time: e.target.value})}
                />
                <select 
                  className="bg-slate-50 p-3 rounded-xl border-none focus:ring-2 focus:ring-brand-500"
                  value={newActivity.day}
                  onChange={e => setNewActivity({...newActivity, day: Number(e.target.value)})}
                >
                  {Array.from({ length: daysCount }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Day {i + 1}</option>
                  ))}
                </select>
              </div>
              <textarea 
                placeholder="Notes..."
                className="w-full bg-slate-50 p-3 rounded-xl border-none focus:ring-2 focus:ring-brand-500 text-sm"
                value={newActivity.notes}
                onChange={e => setNewActivity({...newActivity, notes: e.target.value})}
              />
              <div className="flex space-x-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-brand-500 text-white rounded-xl font-bold text-sm shadow-md"
                >
                  Add to Plan
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-10 pb-12">
        {Array.from({ length: daysCount }, (_, i) => {
          const day = i + 1;
          const activities = activitiesByDay[day] || [];
          return (
            <div key={day} className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-brand-50 text-brand-600 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest">
                  Day {day}
                </div>
                <div className="h-2 w-2 rounded-full bg-slate-200" />
                <span className="text-xs text-slate-400 font-bold tracking-tight">Timeline</span>
              </div>

              {activities.length === 0 ? (
                <div className="text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
                  <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Quiet Day</p>
                  <p className="text-[10px] text-slate-400 mt-1">Add activities to fill the silence.</p>
                </div>
              ) : (
                <div className="space-y-6 border-l-2 border-brand-50 ml-3 pl-6 relative">
                  {activities.map((activity) => (
                    <div key={activity.id} className="relative group">
                      {/* Dot */}
                      <div className="absolute -left-[1.85rem] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-brand-500 shadow-sm z-10" />
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            {activity.time || 'Anytime'}
                          </div>
                          <h4 className="font-bold text-slate-800 tracking-tight leading-snug">
                            {activity.title}
                          </h4>
                          {activity.notes && (
                            <p className="text-slate-500 text-xs mt-2 font-medium">
                              {activity.notes}
                            </p>
                          )}
                        </div>
                        <button 
                          onClick={() => handleDelete(activity.id)}
                          className="p-1.5 text-slate-200 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
