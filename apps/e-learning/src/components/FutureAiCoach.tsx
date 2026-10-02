import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AI_COACH_OPTIONS } from '../data/learningData';
import { Sparkles, MessageSquare, Bot, RotateCcw, User, ArrowRight } from 'lucide-react';

export function FutureAiCoach() {
  const [step, setStep] = useState<'prompt' | 'feedback'>('prompt');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const activeOption = selectedIdx !== null ? AI_COACH_OPTIONS[selectedIdx] : null;

  const overallScore = activeOption
    ? Math.round((activeOption.empathy + activeOption.clarity + activeOption.resolution) / 3)
    : 0;

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    setStep('feedback');
  };

  const reset = () => {
    setStep('prompt');
    setSelectedIdx(null);
  };

  return (
    <section id="future" className="min-h-screen py-8 sm:py-12 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Interactive AI Coach Simulator */}
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-[32px] bg-[#0b0c10] text-white p-5 sm:p-7 lg:p-8 shadow-2xl border border-white/10 relative overflow-hidden w-full flex flex-col"
      >
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#0b0b0d]/20 to-transparent blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#444347]/15 to-transparent blur-[120px] pointer-events-none" />

        {/* Header Title */}
        <div className="relative z-10 mb-4 sm:mb-6 max-w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase text-[#ffffff] tracking-wider mb-2.5">
            <Sparkles className="w-3 h-3" />
            <span>INTERACTIVE PRACTICE · TRY IT LIVE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-black text-white tracking-tight leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
            Coach a high-stakes difficult conversation.
          </h2>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 flex-1 items-stretch">
          
          {/* Left Column: The Chat / Scenario Simulation */}
          <div className="lg:col-span-7 flex flex-col relative">
            <div className="flex-1 bg-[#15161c] rounded-2xl border border-white/5 p-4 sm:p-5 lg:p-6 flex flex-col shadow-inner overflow-hidden relative">
              
              {/* Customer Chat Bubble */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 max-w-[92%] mb-4 sm:mb-6"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-[#0b0b0d]/20 flex items-center justify-center border border-[#0b0b0d]/40">
                  <User className="w-4 h-4 text-[#0b0b0d]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#a5a9b4] mb-1 ml-1">Frustrated Customer</div>
                  <div className="bg-[#1e2028] p-3.5 sm:p-4 rounded-2xl rounded-tl-none border border-white/5 text-xs sm:text-sm text-white/90 leading-relaxed shadow-md">
                    &ldquo;I have explained this issue to your team twice already. My shipment is 3 days late, and I am done waiting.&rdquo;
                  </div>
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                {step === 'prompt' ? (
                  /* Step 1: Multiple Choice Prompts */
                  <motion.div
                    key="choices"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }}
                    exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                    className="flex flex-col gap-2.5 sm:gap-3 mt-auto"
                  >
                    <div className="text-[10px] font-black uppercase tracking-wider text-white/50 mb-0.5 ml-1 flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Select your response:
                    </div>
                    {AI_COACH_OPTIONS.map((opt, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.01, backgroundColor: '#ffffff', color: '#0b0b0d' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelect(idx)}
                        className="group text-left p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm font-bold border border-white/10 bg-[#1e2028] text-white/80 transition-colors shadow-sm flex items-center justify-between gap-3"
                      >
                        <span className="leading-relaxed">{opt.text}</span>
                        <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 shrink-0 transition-opacity" />
                      </motion.button>
                    ))}
                  </motion.div>
                ) : (
                  /* Step 2: Selected Response & AI Feedback */
                  <motion.div
                    key="feedback"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col flex-1"
                  >
                    {/* User Selected Bubble */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                      className="flex gap-3 self-end max-w-[92%] mb-4 sm:mb-6 flex-row-reverse"
                    >
                       <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-[#0b0b0d] flex items-center justify-center shadow-lg shadow-[#0b0b0d]/30">
                        <span className="text-[10px] font-black text-white">YOU</span>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-[#a5a9b4] mb-1 mr-1 text-right">Your Response</div>
                        <div className="bg-[#0b0b0d] p-3.5 sm:p-4 rounded-2xl rounded-tr-none text-xs sm:text-sm text-white leading-relaxed shadow-md shadow-[#0b0b0d]/10">
                          {activeOption?.text}
                        </div>
                      </div>
                    </motion.div>

                    {/* AI Coach Feedback Bubble */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, type: 'spring', damping: 25, stiffness: 300 }}
                      className="flex gap-3 max-w-[95%] mt-auto"
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/10">
                        <Bot className="w-4 h-4 text-[#0b0b0d]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] font-bold text-[#ffffff] mb-1 ml-1 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" />
                          AI Coach Feedback
                        </div>
                        <div className="bg-gradient-to-br from-white to-[#ece8df] p-3.5 sm:p-4 rounded-2xl rounded-tl-none text-xs sm:text-sm text-[#0b0b0d] font-semibold leading-relaxed shadow-[0_10px_30px_rgba(255,255,255,0.15)] border border-white/20">
                          {activeOption?.feedback}
                        </div>
                        
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                          onClick={reset}
                          className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-white/50 hover:text-white transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Try Another Response
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Dynamic Telemetry Metrics */}
          <div className="lg:col-span-5 bg-[#121319] p-5 sm:p-6 lg:p-7 rounded-2xl border border-white/5 shadow-2xl flex flex-col justify-center relative overflow-hidden">
            {/* Background grid pattern for metric dash */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
            
            <div className="relative z-10">
              <div className="text-center mb-6 sm:mb-7">
                <h3 className="text-[10px] font-black uppercase text-white/50 tracking-[0.2em] mb-4">Real-Time Competency Score</h3>
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto">
                  {/* Subtle outer ring */}
                  <div className="absolute inset-0 rounded-full border border-white/10" />
                  
                  {/* Score Orb */}
                  <motion.div 
                    animate={{ 
                      scale: step === 'feedback' ? 1.05 : 1,
                      boxShadow: step === 'feedback' ? '0 0 60px rgba(117, 87, 255, 0.4)' : '0 0 0px rgba(117, 87, 255, 0)'
                    }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="absolute inset-2 rounded-full bg-[#181a22] flex flex-col items-center justify-center border-4 border-[#252733]"
                  >
                    <span className={`text-4xl sm:text-5xl font-black transition-colors duration-700 ${step === 'feedback' ? 'text-white' : 'text-white/20'}`}>
                      {step === 'feedback' ? overallScore : '-'}
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#888b94] tracking-wider mt-0.5">
                      Avg Score
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Individual Breakdown Bars */}
              <div className="space-y-4 max-w-sm mx-auto">
                <MetricBar 
                  label="Empathy & Validation" 
                  value={step === 'feedback' ? activeOption?.empathy || 0 : 0} 
                  color="from-[#444347] to-[#0ea5e9]"
                  delay={0.5}
                />
                <MetricBar 
                  label="Clarity & Direction" 
                  value={step === 'feedback' ? activeOption?.clarity || 0 : 0} 
                  color="from-[#ffffff] to-[#444347]"
                  delay={0.6}
                />
                <MetricBar 
                  label="Resolution Ownership" 
                  value={step === 'feedback' ? activeOption?.resolution || 0 : 0} 
                  color="from-[#0b0b0d] to-[#0b0b0d]"
                  delay={0.7}
                />
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}

// Subcomponent for Animated Metric Bars
function MetricBar({ label, value, color, delay }: { label: string, value: number, color: string, delay: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold text-white mb-2">
        <span className="text-white/70">{label}</span>
        <span className="font-mono">{value}%</span>
      </div>
      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
    </div>
  );
}

