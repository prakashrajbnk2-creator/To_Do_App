import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Mail, 
  Lock, 
  Github, 
  Chrome, 
  ArrowRight,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider 
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password login is not enabled in your Firebase Console. Please use Google Login below or enable it in Authentication > Sign-in method.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex items-center justify-center relative overflow-hidden p-6">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-[10%] w-[400px] h-[400px] bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/20 ring-1 ring-white/10">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 italic">TASK.IQ</h1>
          <p className="text-white/40 font-medium tracking-widest uppercase text-[10px]">Cognitive Workspace Integration</p>
        </div>

        <div className="bg-[#151525]/40 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 shadow-3xl shadow-black/50">
          <div className="flex bg-[#0A0A14] p-1 rounded-xl mb-8 border border-white/5">
            <button 
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!isRegister ? 'bg-white/10 text-white' : 'text-white/20'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isRegister ? 'bg-white/10 text-white' : 'text-white/20'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-[10px] font-bold uppercase tracking-widest">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block ml-4">Identifier</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@enterprise.com"
                  className="w-full bg-[#0A0A14] border border-white/5 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-white/10 text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block">Secret Key</label>
                {!isRegister && <button type="button" className="text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-colors">Recover</button>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0A0A14] border border-white/5 rounded-2xl py-4 pl-14 pr-14 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-white/10 text-sm font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button 
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 py-4 rounded-2xl font-black text-sm tracking-[0.2em] uppercase text-black shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegister ? 'Register Account' : 'Initialize Session')}
              {!isLoading && <ArrowRight className="w-4 h-4" strokeWidth={3} />}
            </motion.button>
          </form>

          <div className="mt-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-[1px] bg-white/5" />
              <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">Recommended Access</span>
              <div className="flex-1 h-[1px] bg-white/5" />
            </div>

            <div className="space-y-4">
              <button 
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl transition-all text-xs font-black uppercase tracking-widest shadow-xl hover:shadow-cyan-500/10"
              >
                <Chrome className="w-5 h-5 text-cyan-400" />
                Auth with Google
                <ArrowRight className="w-4 h-4 ml-auto text-white/20" />
              </button>
              
              <button 
                onClick={signInWithGithub}
                className="w-full flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl transition-all text-xs font-black uppercase tracking-widest opacity-50 cursor-not-allowed"
                disabled
              >
                <Github className="w-5 h-5" />
                Auth with GitHub
                <span className="text-[8px] ml-auto text-white/20">Config Required</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-[10px] font-medium text-white/20 uppercase tracking-[0.3em]">
          {isRegister ? 'Already have an account?' : "Don't have access?"} 
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-cyan-400/60 hover:text-cyan-400 font-black transition-colors ml-2"
          >
            {isRegister ? 'Sign In' : 'Request invite'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
