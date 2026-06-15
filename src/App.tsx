/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Snowflake, 
  Sparkles, 
  Cpu, 
  Wind, 
  Sliders, 
  Terminal, 
  RotateCcw, 
  Clock,
  Activity,
  ChevronRight,
  ShieldCheck,
  Power
} from "lucide-react";

interface Particle {
  id: string;
  x: number;
  size: number;
  duration: number;
  drift: number;
  color?: string;
  spin?: number;
}

interface AuditLog {
  id: string;
  time: string;
  text: string;
  type: 'system' | 'snowflakes' | 'balloons';
}

export default function App() {
  const [activeEffect, setActiveEffect] = useState<'none' | 'snowflakes' | 'balloons'>('none');
  const [timeLeft, setTimeLeft] = useState<number>(0); // remaining milliseconds
  const [particles, setParticles] = useState<Particle[]>([]);
  const [density, setDensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [wind, setWind] = useState<'calm' | 'soft' | 'active'>('soft');
  const [localTime, setLocalTime] = useState<string>("");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [logs, setLogs] = useState<AuditLog[]>([
    { id: '1', time: new Date().toLocaleTimeString(), text: "Administrative simulation platform initialized. Ready for command.", type: 'system' }
  ]);

  // Reference hooks for tracking background loops safely as required
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Clock updates
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Clean up all running background loops on component unmount
  useEffect(() => {
    return () => {
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  // Soft sound chime synthesis to give a professional formal sensory response
  const playChime = (type: 'snow' | 'balloon') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'snow') {
        // High crystalline chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else {
        // Soft rising balloon bubble sound
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.quadraticRampToValueAtTime(440, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch (e) {
      // Audio context error or blocked by autoplay permissions (silently handled)
    }
  };

  // Particle Batch spawner
  const spawnBatch = (type: 'snowflakes' | 'balloons') => {
    const count = density === 'low' ? 1 : density === 'medium' ? 2 : 4;
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      const id = Math.random().toString(36).substring(2, 9);
      
      // Horizontal start percentage (retains margin bounds)
      const x = Math.random() * 90 + 5;
      
      // Standardized medium size bounds
      const size = type === 'snowflakes' 
        ? Math.random() * 16 + 48   // 48px - 64px (twice the original 24px - 32px)
        : Math.random() * 12 + 48; // 48px - 60px
        
      // Flight duration bounds (ensures screen clearance before/around timeline completion)
      const duration = type === 'snowflakes'
        ? Math.random() * 1.2 + 2.8 // 2.8 to 4.0 seconds
        : Math.random() * 1.2 + 3.0; // 3.0 to 4.2 seconds
        
      // Wind dynamics computation
      const maxDrift = wind === 'calm' ? 3 : wind === 'soft' ? 12 : 24;
      const drift = (Math.random() * 2 - 1) * maxDrift;
      
      // Rotational physics for flakes
      const spin = type === 'snowflakes'
        ? (Math.random() * 2 - 1) * 360 * (wind === 'active' ? 1.8 : 1)
        : undefined;
        
      // Professional corporate-safe balloon colors
      const colors = [
        '#d946ef', // refined orchid rose
        '#2563eb', // executive sapphire blue
        '#0d9488', // professional team teal
        '#f59e0b', // copper gold
        '#4f46e5', // classic indigo-blue
        '#16a34a', // forest jade
        '#ea580c', // rust bronze
      ];
      
      const color = type === 'balloons'
        ? colors[Math.floor(Math.random() * colors.length)]
        : undefined;

      newParticles.push({
        id,
        x,
        size,
        duration,
        drift,
        color,
        spin
      });

      // Automated self-cleaning timer to ensure leak-free rendering
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== id));
      }, duration * 1000);
    }

    setParticles(prev => [...prev, ...newParticles]);
  };

  // Main Action Trigger function
  const triggerEffect = (type: 'snowflakes' | 'balloons') => {
    // 1. Terminate ongoing loops first
    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    // 2. Refresh particle canvas
    setParticles([]);

    // 3. Set timing and states
    setActiveEffect(type);
    setTimeLeft(5000); // exactly 5000 milliseconds (5 seconds)

    // 4. Audiovisual feedback
    playChime(type === 'snowflakes' ? 'snow' : 'balloon');

    // 5. Append corporate audit log
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [
      {
        id: Math.random().toString(),
        time: timestamp,
        text: `Command executed: Atmospheric effect [${type.toUpperCase()}] initialized at ${density.toUpperCase()} density with ${wind.toUpperCase()} wind sway. Lifespan: 5.0 seconds.`,
        type: type
      },
      ...prev
    ]);

    // 6. Spawn initial batch immediately
    spawnBatch(type);

    // 7. Establish dynamic polling spawner
    const intervalDelta = density === 'low' ? 320 : density === 'medium' ? 160 : 80;
    spawnIntervalRef.current = setInterval(() => {
      spawnBatch(type);
    }, intervalDelta);

    // 8. Establish high-resolution Countdown Timer (50ms ticks for buttery progress transitions)
    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 50) {
          if (spawnIntervalRef.current) {
            clearInterval(spawnIntervalRef.current);
            spawnIntervalRef.current = null;
          }
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          // Set effect state back to idle, allowing remaining particles to clear their lifespans gracefully
          setActiveEffect('none');
          
          setLogs(prevLogs => [
            {
              id: Math.random().toString(),
              time: new Date().toLocaleTimeString(),
              text: `Atmospheric transmitter complete for [${type.toUpperCase()}]. Halting particle production.`,
              type: 'system'
            },
            ...prevLogs
          ]);
          return 0;
        }
        return prev - 50;
      });
    }, 50);
  };

  const clearLogs = () => {
    setLogs([
      { id: Date.now().toString(), time: new Date().toLocaleTimeString(), text: "Logs cleared by climate administrator.", type: 'system' }
    ]);
  };

  const progressPercentage = (timeLeft / 5000) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-12 px-4 relative font-sans overflow-x-hidden" id="app-viewport">
      
      {/* 50+ FIXED CANVAS LAYER FOR PARTICLE RENDERING EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" id="ambient-fx-canvas-wrapper">
        <AnimatePresence>
          {/* RENDER FALLING SNOWFLAKES */}
          {activeEffect === 'snowflakes' && particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute pointer-events-none"
              style={{
                top: -36,
                left: `${p.x}%`,
              }}
              initial={{ y: '-5vh', x: `${p.x}%`, rotate: 0, opacity: 0 }}
              animate={{
                y: '110vh',
                x: `${p.x + p.drift}%`,
                rotate: p.spin || 360,
                opacity: [0, 1, 1, 0.9, 0], // smooth entry and exit decay
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: p.duration,
                ease: "linear",
              }}
            >
              <Snowflake 
                size={p.size} 
                className="text-sky-400/80 filter drop-shadow-[0_2px_4px_rgba(224,242,254,0.6)]" 
                id={`snowflake-${p.id}`}
              />
            </motion.div>
          ))}

          {/* RENDER FLOATING BALLOONS */}
          {activeEffect === 'balloons' && particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute pointer-events-none"
              style={{
                bottom: -160,
                left: `${p.x}%`,
              }}
              initial={{ y: '5vh', x: `${p.x}%`, rotate: 0, opacity: 0 }}
              animate={{
                y: '-115vh',
                x: `${p.x + p.drift}%`,
                rotate: [-14, 14, -14], // continuous natural balloon sway
                opacity: [0, 1, 1, 1, 0.8, 0], // slow decay
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: p.duration,
                ease: "easeOut",
              }}
            >
              {/* High precision SVG custom balloon with knot, strings and ambient shine reflection */}
              <div id={`balloon-${p.id}`} className="transition-transform duration-300">
                <svg width={p.size} height={p.size * 1.62} viewBox="0 0 40 65" fill="none">
                  <defs>
                    <radialGradient id={`gloss-${p.id}`} cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
                      <stop offset="40%" stopColor={p.color} stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
                    </radialGradient>
                  </defs>
                  {/* Balloon main string element */}
                  <path 
                    d="M 20 44 Q 18 53 23 64" 
                    stroke="#94a3b8" 
                    strokeWidth="1.5" 
                    fill="none" 
                    strokeLinecap="round"
                  />
                  {/* Balloon balloon base triangular knot */}
                  <polygon points="17,41 23,41 20,45" fill={p.color} />
                  {/* Balloon body */}
                  <ellipse cx="20" cy="22" rx="16" ry="20" fill={`url(#gloss-${p.id})`} />
                  {/* High elegance highlight glare */}
                  <ellipse 
                    cx="13" 
                    cy="13" 
                    rx="3.5" 
                    ry="6" 
                    fill="#ffffff" 
                    fillOpacity="0.4" 
                    transform="rotate(-20 13 13)" 
                  />
                </svg>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* HEADER BAR AND TOP SECTION */}
      <header className="w-full max-w-5xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4" id="header">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-white p-2 rounded-lg">
            <Cpu className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-wider text-slate-800 uppercase font-sans">Aether Systems</h1>
            <p className="text-xs text-slate-500 font-mono">Formal Dynamics Console v1.4.2</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-mono text-slate-500 bg-white border border-slate-100 rounded-lg px-4 py-2 shadow-xs">
          <div className="flex items-center gap-1.5 border-r border-slate-200 pr-3 mr-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>SYSTEM TIME: {localTime || "--:--:--"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${activeEffect === 'none' ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
            <span className="uppercase text-[10px] tracking-wide font-semibold text-slate-600">
              {activeEffect === 'none' ? "STABLE / STANDBY" : `${activeEffect} Active`}
            </span>
          </div>
        </div>
      </header>

      {/* MAIN SINGLE-VIEW WORKSPACE MODULE */}
      <main className="w-full max-w-5xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-core">
        
        {/* LEFT COLUMN: DYNAMIC CORE CONTROL CARDS (7 COLS) */}
        <section className="lg:col-span-7 flex flex-col gap-6" id="controls-section">
          
          {/* TRIGGER CONTROLLER STATION */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 relative overflow-hidden" id="trigger-console-card">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-600" />
                <h2 className="text-sm font-semibold tracking-wide text-slate-800 uppercase font-sans">Primary Generators</h2>
              </div>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded font-mono">5.0S MANDATE</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Initialize calibrated environment visual streams. Triggering an animation activates high-performance, responsive particle emissions that precisely span five seconds.
            </p>

            {/* DIRECT ACTION BUTTON PAIRINGS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="generator-interactive-deck">
              
              {/* SNOWFLAKES ACTION CONTROL */}
              <button
                id="btn-trigger-snowflakes"
                onClick={() => triggerEffect('snowflakes')}
                disabled={activeEffect !== 'none' && activeEffect !== 'snowflakes'}
                className={`relative overflow-hidden group border rounded-xl p-5 text-left transition-all duration-300 ${
                  activeEffect === 'snowflakes'
                    ? 'border-sky-500 bg-sky-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-sky-400 bg-linear-to-b hover:from-white hover:to-sky-50/10 hover:shadow-xs cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-lg border transition-all ${
                    activeEffect === 'snowflakes'
                      ? 'bg-sky-500 border-sky-400 text-white'
                      : 'bg-slate-50 border-slate-100 text-slate-500 group-hover:text-sky-500 group-hover:border-sky-200'
                  }`}>
                    <Snowflake className="h-5 w-5" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-sky-400 transition-transform group-hover:translate-x-1" />
                </div>
                
                <h3 className="text-sm font-semibold text-slate-800 mt-4 font-sans">Snowflakes</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  Triggers elegant falling snowflake dynamics descending smoothly from top to bottom.
                </p>

                {activeEffect === 'snowflakes' && (
                  <div className="absolute top-0 right-0 h-1.5 w-16 bg-sky-500" />
                )}
              </button>

              {/* BALLOONS ACTION CONTROL */}
              <button
                id="btn-trigger-balloons"
                onClick={() => triggerEffect('balloons')}
                disabled={activeEffect !== 'none' && activeEffect !== 'balloons'}
                className={`relative overflow-hidden group border rounded-xl p-5 text-left transition-all duration-300 ${
                  activeEffect === 'balloons'
                    ? 'border-rose-500 bg-rose-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-rose-400 bg-linear-to-b hover:from-white hover:to-rose-50/10 hover:shadow-xs cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-lg border transition-all ${
                    activeEffect === 'balloons'
                      ? 'bg-rose-500 border-rose-400 text-white'
                      : 'bg-slate-50 border-slate-100 text-slate-500 group-hover:text-rose-500 group-hover:border-rose-200'
                  }`}>
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-rose-400 transition-transform group-hover:translate-x-1" />
                </div>

                <h3 className="text-sm font-semibold text-slate-800 mt-4 font-sans">Balloons</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  Triggers corporate-safe multicolored balloon float ascending gracefully from bottom to top.
                </p>

                {activeEffect === 'balloons' && (
                  <div className="absolute top-0 right-0 h-1.5 w-16 bg-rose-500" />
                )}
              </button>

            </div>

            {/* ABORT SHIELD */}
            {activeEffect !== 'none' && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-amber-600 bg-amber-50/50 rounded-lg p-3">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-ping" />
                  Console transmitter strictly locked while effect cycle completes.
                </span>
                <span className="font-mono font-semibold">{(timeLeft / 1000).toFixed(2)}s left</span>
              </div>
            )}
          </div>

          {/* DYNAMIC PHYSICS SETTINGS BAR */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6" id="atmosphere-settings-card">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Sliders className="h-4 w-4 text-slate-600" />
              <h2 className="text-sm font-semibold tracking-wide text-slate-800 uppercase font-sans">Dynamics Settings</h2>
            </div>

            <div className="space-y-6" id="settings-group">
              
              {/* FLOW DENSITY OPTION */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2 font-mono">EMISSION FLOW DENSITY</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200/50" id="segmented-density">
                  {(['low', 'medium', 'high'] as const).map(option => (
                    <button
                      key={option}
                      onClick={() => setDensity(option)}
                      className={`text-xs py-2 rounded-md font-medium capitalize transition-all cursor-pointer ${
                        density === option
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">
                  Alters spawning rate of particles. Low releases distinct individual icons; High triggers a continuous premium cascade.
                </p>
              </div>

              {/* WIND DRIFT SWAY SCALE */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2 font-mono">ATMOSPHERIC WIND DRIFT</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200/50" id="segmented-wind">
                  {(['calm', 'soft', 'active'] as const).map(option => (
                    <button
                      key={option}
                      onClick={() => setWind(option)}
                      className={`text-xs py-2 rounded-md font-medium capitalize transition-all cursor-pointer ${
                        wind === option
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {option === 'soft' ? 'Soft Sway' : option === 'active' ? 'Active Breeze' : 'Calm'}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">
                  Controls side-to-side drift swaying parameters. Breeze introduces higher spin velocities and lateral acceleration.
                </p>
              </div>

              {/* SOUND DESIGN COGNITIVE RESPONSE */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 font-sans">Cognitive Audio Chimes</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Synthesize subtle frequencies when triggering dynamic atmospheric effects.</p>
                </div>
                <button
                  id="synth-sound-toggle"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    soundEnabled ? 'bg-slate-900' : 'bg-slate-200'
                  }`}
                >
                  <span className="sr-only">Toggle Audio Chimes</span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>
          </div>

        </section>

        {/* RIGHT COLUMN: DIGITAL FEED AND LOGGING (5 COLS) */}
        <section className="lg:col-span-5 flex flex-col gap-6" id="monitoring-section">
          
          {/* STATS MONITORING SCREEN */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 flex flex-col justify-between" id="telemetry-screen">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <Wind className="h-4 w-4 text-emerald-600" />
                <h2 className="text-sm font-semibold tracking-wide text-slate-800 uppercase font-sans">Live Environment Telemetry</h2>
              </div>

              {/* TIMELINE PROGRESS CIRCLE / BAR CARD */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 mb-4" id="timeline-card">
                {activeEffect !== 'none' ? (
                  <div className="space-y-3" id="hud-timeline-active">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-indigo-600 font-semibold uppercase tracking-wider">
                        {activeEffect === 'snowflakes' ? "❄️ BLIZZARD FLOWING" : "🎈 CELEBRATION FLOATING"}
                      </span>
                      <span className="text-slate-500 text-[11px] font-bold">{(timeLeft / 1000).toFixed(2)}s REMAINING</span>
                    </div>

                    {/* Progress Bar styled perfectly */}
                    <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300/30">
                      <div 
                        className={`h-full rounded-full transition-all duration-[45ms] ${
                          activeEffect === 'snowflakes' ? 'bg-sky-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>SEC_0.00 / START</span>
                      <span>SEC_5.00 / END</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-2.5 text-center flex flex-col items-center justify-center gap-2" id="hud-timeline-idle">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Power className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700">Atmosphere Transmitter Static</p>
                    <p className="text-[10px] text-slate-400">Launch an atmospheric generator to view transmission timeline analytics.</p>
                  </div>
                )}
              </div>

              {/* KEY STATS SLOTS */}
              <div className="grid grid-cols-2 gap-3 mb-2" id="numerical-telemetry-grid">
                <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-lg flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Active Particles</span>
                  <span className="text-lg font-bold text-slate-800 font-mono mt-1">{particles.length}</span>
                </div>
                <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-lg flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Gravity Constant</span>
                  <span className="text-lg font-bold text-slate-800 font-mono mt-1">
                    {activeEffect === 'snowflakes' ? "+3.8 m/s²" : activeEffect === 'balloons' ? "-4.5 m/s²" : "0.0 m/s²"}
                  </span>
                </div>
                <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-lg flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Wind Angle</span>
                  <span className="text-lg font-bold text-slate-800 font-mono mt-1">
                    {wind === 'calm' ? "0° / Static" : wind === 'soft' ? "±15° / Gentle" : "±35° / Sway"}
                  </span>
                </div>
                <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-lg flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono font-sans">Shield Diagnostics</span>
                  <span className="text-xs font-bold text-emerald-600 font-mono mt-1.5 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> SECURE
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>DEVICE ACCELERATION: OK</span>
              <span>RENDER ENGINE: TS_ACCEL</span>
            </div>
          </div>

          {/* AUDIT ACTIONS LOG TERM */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 h-64 shadow-lg flex flex-col justify-between" id="terminal-audit-log">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-sky-400" />
                <span className="text-xs font-bold tracking-wide text-slate-300 font-mono uppercase">CON_AUDIT_LOGS</span>
              </div>
              <button 
                id="btn-clear-logs"
                onClick={clearLogs}
                className="text-[10px] font-mono text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 px-2 py-1 rounded border border-slate-700 transition-all cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="h-2.5 w-2.5" /> Clear
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-[11px] leading-relaxed select-text" id="terminal-scroller">
              {logs.map((log) => (
                <div key={log.id} className="border-b border-slate-800/30 pb-1.5">
                  <span className="text-slate-500 mr-2">[{log.time}]</span>
                  <span className={`
                    ${log.type === 'snowflakes' ? 'text-sky-300' : ''}
                    ${log.type === 'balloons' ? 'text-rose-300' : ''}
                    ${log.type === 'system' ? 'text-emerald-400' : ''}
                  `}>
                    {log.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800 text-[9px] text-slate-500 flex items-center justify-between">
              <span>ADMIN: {navigator.userAgent.includes('Mobile') ? 'MOBILE_CLIENT' : 'DESKTOP_CLIENT'}</span>
              <span>LINES: {logs.length}</span>
            </div>
          </div>

        </section>

      </main>

      {/* FOOTER SECTION */}
      <footer className="w-full max-w-5xl mx-auto mt-8 border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 gap-2 font-mono" id="footer">
        <span>Aether Labs Dynamics Engine &copy; 2026. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <span>SECURE PROTOCOL</span>
          <span>&middot;</span>
          <span>ESTABLISHED PORTAL LINK</span>
        </div>
      </footer>

    </div>
  );
}
