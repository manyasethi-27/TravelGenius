import { useState, useEffect } from 'react';
import { Trip } from './types';
import Dashboard from './components/dashboard/Dashboard';
import TripView from './components/trip/TripView';
import AuthScreen from './components/auth/AuthScreen';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { user, loading } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetch('/api/trips', { credentials: 'include' })
        .then(res => res.json())
        .then(setTrips);
      
      // Handle join parameter
      const params = new URLSearchParams(window.location.search);
      const joinCode = params.get('join');
      if (joinCode) {
        joinTrip(joinCode.toUpperCase());
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [user]);

  const activeTrip = trips.find(t => t.id === activeTripId);

  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));
    fetch(`/api/trips/${updatedTrip.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTrip),
      credentials: 'include',
    });
  };

  const createTrip = async (tripData: { name: string; destination: string; startDate: string; endDate: string; coverImage: string }) => {
    const res = await fetch('/api/trips/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData),
      credentials: 'include',
    });
    const trip = await res.json();
    setTrips(prev => [...prev, trip]);
    setActiveTripId(trip.id);
  };

  const joinTrip = async (code: string) => {
    const res = await fetch('/api/trips/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ joinCode: code }),
      credentials: 'include',
    });
    if (res.ok) {
      const trip = await res.json();
      setTrips(prev => {
        if (prev.some(t => t.id === trip.id)) return prev;
        return [...prev, trip];
      });
      return true;
    }
    return false;
  };

  const deleteTrip = async (id: string) => {
    try {
      const res = await fetch(`/api/trips/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setTrips(prev => prev.filter(t => t.id !== id));
        if (activeTripId === id) setActiveTripId(null);
        return true;
      }
      const data = await res.json();
      alert(data.message || 'Failed to delete trip');
      return false;
    } catch (err) {
      console.error(err);
      alert('Network error while deleting trip');
      return false;
    }
  };

  if (loading) return null;

  if (!user) return <AuthScreen />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <div className="w-full min-h-screen relative flex flex-col">
        <AnimatePresence mode="wait">
          {!activeTripId ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1"
            >
              <Dashboard 
                trips={trips} 
                onSelectTrip={setActiveTripId} 
                onCreateTrip={createTrip} 
                onJoinTrip={joinTrip}
                onDeleteTrip={deleteTrip}
                currentUser={user}
              />
            </motion.div>
          ) : (
            <motion.div
              key="trip-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1"
            >
              <TripView 
                trip={activeTrip!} 
                currentUser={user}
                onBack={() => setActiveTripId(null)}
                onUpdate={handleUpdateTrip}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
