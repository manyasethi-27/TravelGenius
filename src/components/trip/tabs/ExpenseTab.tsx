import { useState, FormEvent } from 'react';
import { Trip, Expense, User } from '../../../types';
import { Plus, IndianRupee, Trash2, Users, DollarSign } from 'lucide-react';
import { generateId, cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ExpenseTabProps {
  trip: Trip;
  onUpdate: (expenses: Expense[]) => void;
  currentUser: User;
}

export default function ExpenseTab({ trip, onUpdate, currentUser }: ExpenseTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    paidBy: currentUser.id,
    splitType: 'equal' as 'equal' | 'unequal',
    splitBetween: trip.members.map(m => m.id),
    amounts: {} as Record<string, string>
  });

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const amount = Number(newExpense.amount);
    if (!newExpense.title || isNaN(amount) || amount <= 0) return;
    if (newExpense.splitBetween.length === 0) return;

    let finalAmounts: Record<string, number> | undefined = undefined;
    
    if (newExpense.splitType === 'unequal') {
      finalAmounts = {};
      let sum = 0;
      newExpense.splitBetween.forEach(id => {
        const val = Number(newExpense.amounts[id]) || 0;
        finalAmounts![id] = val;
        sum += val;
      });
      
      // Allow small floating point difference
      if (Math.abs(sum - amount) > 0.01) {
        alert("The split amounts don't sum up to the total expense amount!");
        return;
      }
    }

    const expense: Expense = {
      id: generateId(),
      title: newExpense.title,
      amount: amount,
      paidBy: newExpense.paidBy,
      splitBetween: newExpense.splitBetween,
      date: new Date().toISOString(),
      type: newExpense.splitType,
      amounts: finalAmounts
    };

    onUpdate([...trip.expenses, expense]);
    setNewExpense({
      title: '',
      amount: '',
      paidBy: currentUser.id,
      splitType: 'equal',
      splitBetween: trip.members.map(m => m.id),
      amounts: {}
    });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    onUpdate(trip.expenses.filter(e => e.id !== id));
  };

  const totalSpent = trip.expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const totalSplitRemaining = () => {
    const total = Number(newExpense.amount) || 0;
    const currentSum: number = (Object.values(newExpense.amounts) as string[]).reduce((acc: number, curr: string) => acc + (Number(curr) || 0), 0);
    return (total - currentSum).toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Summary Stat */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex justify-between items-center shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-3xl -mr-16 -mt-16 rounded-full" />
        <div className="relative z-10">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Trip Circulation</p>
          <div className="flex items-baseline text-4xl font-display font-black tracking-tight">
            <span className="text-xl mr-1 font-sans text-brand-400">₹</span>
            {totalSpent.toLocaleString()}
          </div>
        </div>
        <div className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
          <IndianRupee size={32} className="text-brand-400" />
        </div>
      </div>

      <div className="flex justify-between items-center px-2">
        <h3 className="text-xl font-black font-display text-slate-900 uppercase tracking-tight">Expenses</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 text-white bg-brand-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all active:scale-95"
        >
          <Plus size={16} strokeWidth={3} />
          <span>New Entry</span>
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-2xl relative z-20"
          >
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Detail</label>
                <input 
                  autoFocus
                  required
                  placeholder="E.g. Dinner at Sky Bar"
                  className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-brand-500 outline-none font-bold text-slate-800"
                  value={newExpense.title}
                  onChange={e => setNewExpense({...newExpense, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Total Amount</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</div>
                    <input 
                      type="number"
                      required
                      placeholder="0.00"
                      className="w-full bg-slate-50 p-5 pl-10 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-brand-500 outline-none font-display text-2xl font-black text-slate-900"
                      value={newExpense.amount}
                      onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Paid By</label>
                  <select 
                    className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-brand-500 outline-none font-bold text-slate-700"
                    value={newExpense.paidBy}
                    onChange={e => setNewExpense({...newExpense, paidBy: e.target.value})}
                  >
                    {trip.members.map(member => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Settle Distribution</label>
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => setNewExpense({...newExpense, splitType: 'equal'})}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                        newExpense.splitType === 'equal' ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      )}
                    >
                      Equal
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setNewExpense({...newExpense, splitType: 'unequal'})}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                        newExpense.splitType === 'unequal' ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      )}
                    >
                      Custom
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 transition-all">
                  {trip.members.map(member => {
                    const isSelected = newExpense.splitBetween.includes(member.id);
                    return (
                      <div key={member.id} className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const next = isSelected 
                              ? newExpense.splitBetween.filter(id => id !== member.id)
                              : [...newExpense.splitBetween, member.id];
                            setNewExpense({...newExpense, splitBetween: next});
                          }}
                          className={cn(
                            "px-4 py-3 rounded-xl text-xs font-bold border transition-all flex items-center gap-2",
                            isSelected 
                              ? "bg-white border-brand-500 text-brand-700 shadow-md ring-1 ring-brand-500" 
                              : "bg-slate-50 border-slate-100 text-slate-400"
                          )}
                        >
                          <img src={member.avatar} className="w-5 h-5 rounded-full" />
                          {member.name}
                        </button>
                        
                        {newExpense.splitType === 'unequal' && isSelected && (
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">₹</span>
                            <input 
                              type="number"
                              placeholder="0"
                              className="w-[100px] bg-slate-50 p-2 pl-6 rounded-lg border border-slate-200 focus:ring-1 focus:ring-brand-500 outline-none text-xs font-bold"
                              value={newExpense.amounts[member.id] || ''}
                              onChange={e => setNewExpense({
                                ...newExpense, 
                                amounts: { ...newExpense.amounts, [member.id]: e.target.value }
                              })}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {newExpense.splitType === 'unequal' && (
                  <div className={cn(
                    "p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center transition-all",
                    Number(totalSplitRemaining()) === 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  )}>
                    {Number(totalSplitRemaining()) === 0 
                      ? "Distribution complete" 
                      : `Remaining to distribute: ₹${totalSplitRemaining()}`
                    }
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all hover:bg-black"
                >
                  Validate & Record
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4 pb-24">
        {trip.expenses.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-black font-display text-slate-400 uppercase tracking-tight">No Transactions</h3>
            <p className="text-slate-300 text-sm mt-1">Ready to track your first shared cost?</p>
          </div>
        )}
        
        {[...trip.expenses].reverse().map((expense) => {
          const payer = trip.members.find(m => m.id === expense.paidBy);
          return (
            <motion.div 
              layout
              key={expense.id}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 flex items-center group hover:border-brand-200 transition-all"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
                <IndianRupee size={24} />
              </div>
              
              <div className="ml-6 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-lg text-slate-900 truncate uppercase tracking-tight">{expense.title}</h4>
                  {expense.type === 'unequal' && (
                    <span className="bg-slate-100 text-slate-500 text-[8px] font-black px-2 py-0.5 rounded-full tracking-widest">CUSTOM</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <img src={payer?.avatar} className="w-4 h-4 rounded-full" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Paid by <span className="text-slate-600">{payer?.name || 'Explorer'}</span>
                  </p>
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {expense.splitBetween.length} People Split
                  </p>
                </div>
              </div>
              
              <div className="text-right flex items-center gap-6">
                <div>
                  <div className="font-display font-black text-2xl text-slate-900">
                    <span className="text-sm mr-0.5 font-sans">₹</span>
                    {expense.amount.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(expense.date).toLocaleDateString()}</div>
                </div>
                <button 
                  onClick={() => handleDelete(expense.id)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-200 hover:bg-rose-50 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
