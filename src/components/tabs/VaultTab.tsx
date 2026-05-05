import { useState, FormEvent } from 'react';
import { Trip, Document } from '../../types';
import { FileText, Plus, ExternalLink, Trash2, Hotel, Ticket, File } from 'lucide-react';
import { generateId } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface VaultTabProps {
  trip: Trip;
  onUpdate: (docs: Document[]) => void;
}

export default function VaultTab({ trip, onUpdate }: VaultTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: '', type: 'other' as 'ticket' | 'hotel' | 'other' });

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newDoc.title) return;

    const doc: Document = {
      id: generateId(),
      title: newDoc.title,
      type: newDoc.type,
      url: '#', // Placeholder
    };

    onUpdate([...trip.documents, doc]);
    setNewDoc({ title: '', type: 'other' });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    onUpdate(trip.documents.filter(d => d.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'hotel': return <Hotel size={20} />;
      case 'ticket': return <Ticket size={20} />;
      default: return <File size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-slate-800">
        <h3 className="text-xl font-bold font-display">Document Vault</h3>
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xl"
          >
            <form onSubmit={handleAdd} className="space-y-4">
              <input
                autoFocus
                placeholder="Document name (e.g. Indigo Flight)"
                className="w-full bg-slate-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 font-bold"
                value={newDoc.title}
                onChange={e => setNewDoc({...newDoc, title: e.target.value})}
              />
              <div className="flex gap-2">
                {(['ticket', 'hotel', 'other'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setNewDoc({...newDoc, type})}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
                      newDoc.type === type ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 text-slate-400'
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-brand-500 text-white rounded-2xl font-bold"
              >
                Save Meta
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-3">
        {trip.documents.length === 0 && (
          <div className="py-12 bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-center text-slate-400">
            Vault is empty. Store your tickets here.
          </div>
        )}
        {trip.documents.map(doc => (
          <div
            key={doc.id}
            className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center group"
          >
            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mr-4">
              {getIcon(doc.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-800 text-sm truncate">{doc.title}</h4>
              <p className="text-[10px] text-brand-600 font-black uppercase tracking-wider">{doc.type}</p>
            </div>
            <div className="flex items-center space-x-1">
              <button className="p-2 text-slate-300 hover:text-brand-500">
                <ExternalLink size={18} />
              </button>
              <button
                onClick={() => handleDelete(doc.id)}
                className="p-2 text-slate-300 hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
