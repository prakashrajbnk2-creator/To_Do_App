import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Layout,
  Clock,
  CheckCircle,
  Calendar,
  User,
  Target,
  Sparkles,
  Brain,
  Loader2,
  ChevronDown,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { 
  onAuthStateChanged, 
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { handleFirestoreError, OperationType } from './lib/firestoreErrorHandler';
import { getSmartCategory, breakDownTask, SubTask } from './services/geminiService';
import LoginPage from './components/LoginPage';

interface Todo {
  id: string; // Firebase doc ID
  text: string;
  completed: boolean;
  category?: string;
  subTasks?: SubTask[];
  isExpanded?: boolean;
}

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Task');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isBreakingDown, setIsBreakingDown] = useState<string | null>(null);

  const categories = ['Architecture', 'Design', 'Backend', 'Testing', 'Task', 'Sync'];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen for Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen for Firestore changes
  useEffect(() => {
    if (!user) {
      setTodos([]);
      return;
    }

    const q = query(
      collection(db, 'todos'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks: Todo[] = [];
      snapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() } as Todo);
      });
      setTodos(tasks);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'todos');
    });

    return () => unsubscribe();
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A14] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const completedCount = todos.filter(t => t.completed).length;
  const progress = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;
  
  const addTodo = async () => {
    if (inputValue.trim() && user) {
      try {
        await addDoc(collection(db, 'todos'), {
          text: inputValue,
          completed: false,
          category: selectedCategory,
          userId: user.uid,
          createdAt: serverTimestamp()
        });
        setInputValue('');
        setSelectedCategory('Task');
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'todos');
      }
    }
  };

  const handleSmartCategorize = async () => {
    if (!inputValue.trim()) return;
    setIsAnalyzing(true);
    const category = await getSmartCategory(inputValue);
    setSelectedCategory(category);
    setIsAnalyzing(false);
  };

  const handleBreakDown = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo || todo.subTasks) return;
    
    setIsBreakingDown(id);
    const steps = await breakDownTask(todo.text);
    try {
      await updateDoc(doc(db, 'todos', id), {
        subTasks: steps,
        isExpanded: true
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `todos/${id}`);
    }
    setIsBreakingDown(null);
  };

  const toggleExpand = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    try {
      await updateDoc(doc(db, 'todos', id), {
        isExpanded: !todo.isExpanded
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `todos/${id}`);
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    try {
      await updateDoc(doc(db, 'todos', id), {
        completed: !todo.completed
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `todos/${id}`);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `todos/${id}`);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const getInitials = (name?: string | null) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Sidebar (Desktop Persistent) */}
      <aside className="w-[380px] h-screen bg-[#151525]/40 backdrop-blur-xl border-r border-white/10 p-10 flex flex-col justify-between relative z-10 shrink-0">
        <div className="space-y-12">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/20">
              <CheckCircle2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-3xl font-black tracking-tighter text-white">TASK.IQ</span>
              <p className="text-[10px] text-cyan-400 font-bold tracking-[0.3em] uppercase">Web Dashboard</p>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-12">
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent transition-opacity opacity-0 group-hover:opacity-100" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-6">Overall Progress</p>
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle 
                    cx="96" cy="96" r="82" 
                    stroke="currentColor" strokeWidth="12" 
                    fill="transparent" 
                    className="text-white/5" 
                  />
                  <motion.circle 
                    cx="96" cy="96" r="82" 
                    stroke="currentColor" strokeWidth="12" 
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 82}
                    animate={{ strokeDashoffset: (2 * Math.PI * 82) - (progress / 100) * (2 * Math.PI * 82) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-black tracking-tighter">{progress}%</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Velocity</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <p className="text-3xl font-black text-cyan-400 tracking-tighter">{todos.length - completedCount}</p>
                <p className="text-[10px] uppercase text-white/40 tracking-[0.2em] font-bold mt-1">Pending</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <p className="text-3xl font-black text-purple-400 tracking-tighter">{completedCount}</p>
                <p className="text-[10px] uppercase text-white/40 tracking-[0.2em] font-bold mt-1">Finished</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Block */}
        <div className="space-y-6">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-4 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-white/40 hover:text-red-400"
          >
            <LogOut className="w-4 h-4" />
            Terminate Session
          </button>

          <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-full border border-white/5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center font-black text-lg border-2 border-white/10">
              {getInitials(user?.displayName || user?.email)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold tracking-tight truncate">{user?.displayName || user?.email?.split('@')[0]}</p>
              <p className="text-[10px] text-cyan-400/60 font-mono font-bold leading-none uppercase truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Area */}
      <main className="flex-1 p-16 relative z-10 flex flex-col overflow-y-auto custom-scrollbar bg-slate-950/20">
        <header className="flex justify-between items-end mb-16">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <h1 className="text-7xl font-black tracking-tighter bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent italic">
              Dashboard
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#0A0A14] flex items-center justify-center text-[10px]">
                    <User className="w-4 h-4 opacity-40" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-bold">
                Project Activity Stream
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black tracking-tighter opacity-80">
              {currentTime.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="text-lg text-cyan-400 font-mono font-bold">
              {currentTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
        </header>

        {/* Task Input Section */}
        <div className="mb-16 space-y-6 max-w-4xl">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                placeholder="Commit a new task to the stack..." 
                className="w-full bg-[#0A0A14] border border-white/10 rounded-2xl py-8 px-10 pr-64 text-2xl font-medium focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-white/10"
              />
              <div className="absolute right-6 top-6 flex gap-3">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSmartCategorize}
                  disabled={isAnalyzing || !inputValue.trim()}
                  className="bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/10 transition-all text-cyan-400 disabled:opacity-50"
                  title="AI Categorize"
                >
                  {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addTodo}
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 px-10 py-4 rounded-xl font-black text-sm tracking-widest shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-400/60 transition-all text-black"
                >
                  PUSH TASK
                </motion.button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all shrink-0 ${
                  selectedCategory === cat 
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 ring-2 ring-cyan-500/20' 
                    : 'bg-white/5 border-white/5 text-white/20 hover:border-white/20 hover:text-white/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Task List Section */}
        <div className="flex-1 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]" />
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Current Active Stack</p>
            </div>
            <p className="text-[10px] font-mono text-cyan-400/40">{todos.length} Active Nodes</p>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {todos.map((todo) => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`group relative flex flex-col p-8 rounded-[2rem] border transition-all duration-500 ${
                    todo.completed 
                      ? 'bg-gradient-to-r from-cyan-500/5 to-transparent border-cyan-500/20 opacity-60' 
                      : 'bg-[#1C1C2E]/40 border-white/5 hover:border-cyan-500/40 hover:bg-[#1C1C2E]/60 shadow-xl shadow-black/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-8 shrink-0">
                      <button 
                        onClick={() => toggleTodo(todo.id)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          todo.completed 
                            ? 'bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]' 
                            : 'border-2 border-white/10 hover:border-cyan-400 group-hover:scale-110'
                        }`}
                      >
                        {todo.completed && <CheckCircle className="w-6 h-6 text-black" strokeWidth={3} />}
                        {!todo.completed && (
                          <div className="w-4 h-4 rounded-sm bg-cyan-400 opacity-0 group-hover:opacity-30 transition-all" />
                        )}
                      </button>
                    </div>

                    <span className={`flex-1 text-2xl font-bold tracking-tight transition-all duration-500 mx-8 truncate ${
                      todo.completed ? 'line-through text-white/20' : 'text-white/90'
                    }`}>
                      {todo.text}
                    </span>
                    
                    <div className="flex items-center gap-4 shrink-0">
                      {todo.subTasks && (
                        <button 
                          onClick={() => toggleExpand(todo.id)}
                          className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white/60 transition-all"
                        >
                          {todo.isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </button>
                      )}

                      {!todo.completed && !todo.subTasks && (
                        <button 
                          onClick={() => handleBreakDown(todo.id)}
                          disabled={isBreakingDown === todo.id}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl text-purple-400 text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          {isBreakingDown === todo.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
                          AI Plan
                        </button>
                      )}

                      {todo.completed ? (
                        <span className="px-5 py-2 bg-cyan-500/10 text-cyan-400 text-[10px] rounded-xl font-black uppercase tracking-widest border border-cyan-400/20 shadow-inner">
                          Success
                        </span>
                      ) : (
                        <span className="text-xs font-mono font-bold text-purple-400/60 uppercase tracking-[0.2em] bg-purple-500/5 px-4 py-2 rounded-lg border border-purple-500/10">
                          {todo.category || 'Task'}
                        </span>
                      )}
                      
                      <button 
                        onClick={() => deleteTodo(todo.id)}
                        className="p-3 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-xl transition-all text-white/20 hover:text-red-400 transform hover:rotate-90 duration-300"
                      >
                        <Plus className="w-6 h-6 rotate-45" />
                      </button>
                    </div>
                  </div>

                  {/* AI Subtasks Display */}
                  <AnimatePresence>
                    {todo.isExpanded && todo.subTasks && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                          {todo.subTasks.map((sub, idx) => (
                            <div key={idx} className="flex items-center gap-4 text-white/40 group/sub">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/30 group-hover/sub:bg-cyan-400 group-hover/sub:scale-125 transition-all" />
                              <p className="text-sm font-medium tracking-wide group-hover/sub:text-white/60 transition-colors uppercase italic">{sub.text}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

