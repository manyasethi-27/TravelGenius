import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Map } from 'lucide-react';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ name, email, password });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row h-screen">
      
      {/* Left Section */}
      <div className="hidden md:flex flex-1 bg-brand-600 relative overflow-hidden items-center justify-center p-12 lg:p-24">
        
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-80 h-80 bg-white rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2" />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 max-w-xl text-white"
        >
          <div className="bg-white/10 backdrop-blur-md w-24 h-24 rounded-3xl flex items-center justify-center mb-10 border border-white/20 shadow-2xl">
            <Map className="text-white" size={48} strokeWidth={2.5} />
          </div>

          <h1 className="text-6xl lg:text-8xl font-black font-display tracking-tighter mb-8 leading-none">
            WANDER<br />
            <span className="text-brand-300">SPLIT</span>
          </h1>

          <p className="text-xl lg:text-2xl font-medium text-brand-100 leading-relaxed mb-12">
            The modern way to plan trips and split costs with friends.
            Real-time itinerary syncing and automated debt settlement.
          </p>

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10">
              <h3 className="text-sm font-black uppercase tracking-widest text-brand-300 mb-2">Plan Together</h3>
              <p className="text-xs text-brand-100 font-medium">
                Collaborative itineraries that everyone can edit on the fly.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10">
              <h3 className="text-sm font-black uppercase tracking-widest text-brand-300 mb-2">Split Smoothly</h3>
              <p className="text-xs text-brand-100 font-medium">
                Automatic balance calculation and optimized settlement routes.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Section */}
      <div className="flex-1 bg-white flex flex-col justify-center p-8 md:p-16 lg:p-24 overflow-y-auto">
        
        <div className="md:hidden flex items-center gap-3 mb-12">
          <div className="bg-brand-600 p-2 rounded-xl">
            <Map className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-black font-display text-slate-900 tracking-tighter">
            WanderSplit
          </h1>
        </div>

        <div className="max-w-md w-full mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-black font-display text-slate-900 tracking-tight leading-tight mb-4 uppercase">
              {isLogin ? "Welcome Back" : "Start the Journey"}
            </h2>

            <p className="text-slate-400 font-medium">
              {isLogin
                ? "Enter your credentials to access your trips."
                : "Create an account to start planning your next big adventure."}
            </p>
          </motion.div>

          <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-10 border border-slate-100">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                isLogin ? 'bg-white shadow-md text-brand-600' : 'text-slate-400'
              }`}
            >
              <LogIn size={16} /> Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                !isLogin ? 'bg-white shadow-md text-brand-600' : 'text-slate-400'
              }`}
            >
              <UserPlus size={16} /> Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-rose-50 text-rose-500 p-5 rounded-2xl text-xs font-bold"
              >
                {error}
              </motion.div>
            )}

            {!isLogin && (
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-4 border rounded-xl"
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-4 border rounded-xl"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-4 border rounded-xl"
            />

            <button className="w-full bg-black text-white py-4 rounded-xl">
              {isLogin ? 'Login' : 'Register'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}