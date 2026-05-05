import { useState, FormEvent } from 'react';
import { Trip, Poll, User } from '../../../types';
import { Plus, CheckSquare, Trash2, PieChart } from 'lucide-react';
import { generateId, cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface PollTabProps {
  trip: Trip;
  onUpdate: (polls: Poll[]) => void;
  currentUser: User;
}

export default function PollTab({ trip, onUpdate, currentUser }: PollTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''] });

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newPoll.question || newPoll.options.some(o => !o)) return;

    const poll: Poll = {
      id: generateId(),
      question: newPoll.question,
      createdBy: currentUser.id,
      options: newPoll.options.map(text => ({ id: generateId(), text, votes: [] })),
    };

    onUpdate([...trip.polls, poll]);
    setNewPoll({ question: '', options: ['', ''] });
    setIsAdding(false);
  };

  const handleVote = (pollId: string, optionId: string) => {
    const nextPolls = trip.polls.map(p => {
      if (p.id !== pollId) return p;
      
      const nextOptions = p.options.map(o => {
        // Remove vote from all options in this poll first (one vote per poll)
        const votes = o.votes.filter(v => v !== currentUser.id);
        // Add if this is the chosen option
        if (o.id === optionId) {
          votes.push(currentUser.id);
        }
        return { ...o, votes };
      });
      
      return { ...p, options: nextOptions };
    });
    onUpdate(nextPolls);
  };

  const handleDelete = (id: string) => {
    onUpdate(trip.polls.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-slate-800">
        <h3 className="text-xl font-bold font-display">Polls & Voting</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="text-brand-600 bg-brand-50 p-2 rounded-xl"
        >
          <Plus size={20} />
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white p-5 rounded-3xl border-2 border-brand-100 shadow-xl"
          >
            <form onSubmit={handleAdd} className="space-y-4">
              <input 
                autoFocus
                placeholder="What's the question?"
                className="w-full bg-slate-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 font-bold"
                value={newPoll.question}
                onChange={e => setNewPoll({...newPoll, question: e.target.value})}
              />
              
              <div className="space-y-2">
                {newPoll.options.map((opt, idx) => (
                  <input 
                    key={idx}
                    placeholder={`Option ${idx + 1}`}
                    className="w-full bg-slate-50 p-3 rounded-xl border-none text-sm focus:ring-2 focus:ring-brand-500"
                    value={opt}
                    onChange={e => {
                      const next = [...newPoll.options];
                      next[idx] = e.target.value;
                      setNewPoll({...newPoll, options: next});
                    }}
                  />
                ))}
                <button 
                  type="button" 
                  onClick={() => setNewPoll({...newPoll, options: [...newPoll.options, '']})}
                  className="text-xs font-bold text-brand-600 ml-1"
                >
                  + Add Option
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-3 text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-lg"
                >
                  Create Poll
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4 pb-12">
        {trip.polls.length === 0 && (
          <div className="py-12 bg-white border border-slate-100 rounded-3xl text-center text-slate-400 flex flex-col items-center">
            <PieChart size={32} className="mb-2 opacity-20" />
            <p>No active polls. Start a vote!</p>
          </div>
        )}
        
        {trip.polls.map(poll => {
          const totalVotes = poll.options.reduce((acc, o) => acc + o.votes.length, 0);
          return (
            <div key={poll.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm group">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-slate-800 leading-tight pr-4">{poll.question}</h4>
                <button onClick={() => handleDelete(poll.id)} className="text-slate-200 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                {poll.options.map(option => {
                  const percentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
                  const hasVoted = option.votes.includes(currentUser.id);
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleVote(poll.id, option.id)}
                      className="w-full relative h-12 rounded-xl group/opt overflow-hidden border border-slate-100"
                    >
                      <div 
                        className={cn(
                          "absolute inset-0 transition-all duration-500",
                          hasVoted ? "bg-brand-500/10" : "bg-slate-50"
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="absolute inset-0 px-4 flex items-center justify-between">
                        <span className={cn(
                          "text-sm font-bold truncate pr-4",
                          hasVoted ? "text-brand-700" : "text-slate-600"
                        )}>
                          {option.text}
                        </span>
                        <span className="text-xs font-black text-slate-400">{option.votes.length}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                {totalVotes} Total Votes
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
