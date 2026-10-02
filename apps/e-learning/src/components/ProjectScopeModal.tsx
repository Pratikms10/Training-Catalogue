import { useState } from 'react';
import { X, Sparkles, Check, Copy, ArrowRight, Mail } from 'lucide-react';

interface ProjectScopeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectScopeModal({ isOpen, onClose }: ProjectScopeModalProps) {
  const [sourceMaterial, setSourceMaterial] = useState<string>('PowerPoint / Slides');
  const [targetAudience, setTargetAudience] = useState<string>('100 - 500 Learners');
  const [depthLevel, setDepthLevel] = useState<number>(2);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([
    'Interactive SCORM',
    'Scenario-Based',
  ]);
  const [timeline, setTimeline] = useState<string>('3 - 6 Weeks');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const materialsList = [
    'PowerPoint / Slides',
    'Written SOPs / PDFs',
    'Enterprise Software',
    'Policy / Compliance Text',
    'Raw SME Interviews',
    'Completely New Concept',
  ];

  const formatOptions = [
    'Interactive SCORM',
    'Scenario-Based',
    'Microlearning',
    'Software Simulation',
    'Gamification & XP',
    'AI Roleplay Practice',
    'Video Explainer',
    'Multi-Language (9+)',
  ];

  const toggleFormat = (f: string) => {
    if (selectedFormats.includes(f)) {
      setSelectedFormats(selectedFormats.filter((x) => x !== f));
    } else {
      setSelectedFormats([...selectedFormats, f]);
    }
  };

  const scopeSummaryText = `TechnoEdge Learning Studio - Project Scope Blueprint
--------------------------------------------------
• Starting Material: ${sourceMaterial}
• Target Audience: ${targetAudience}
• Interactivity Depth: Level ${depthLevel} (${
    depthLevel === 1
      ? 'Clean & Informative'
      : depthLevel === 2
      ? 'Click & Explore'
      : depthLevel === 3
      ? 'Think & Decide Dilemmas'
      : 'Full Sandbox & Simulation'
  })
• Selected Formats: ${selectedFormats.join(', ') || 'Custom Solution'}
• Target Timeline: ${timeline}
• Compliance: SCORM 1.2 / 2004, xAPI & WCAG Ready.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scopeSummaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#f4f1e9] text-[#0b0b0d] w-full max-w-3xl rounded-[32px] shadow-2xl border border-black/15 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-[#0b0b0d] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0b0b0d] flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 text-[#ffffff]" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black">
                Interactive Project Scoper
              </h3>
              <p className="text-xs text-white/60">
                Select your parameters to formulate an instant architectural blueprint.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Step 1: Starting Material */}
          <div>
            <label className="text-xs font-black uppercase text-[#666] tracking-wider block mb-2">
              1. What raw material do you currently have?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {materialsList.map((mat) => (
                <button
                  key={mat}
                  type="button"
                  onClick={() => setSourceMaterial(mat)}
                  className={`p-3 rounded-xl text-xs font-bold border text-left transition-all cursor-pointer ${
                    sourceMaterial === mat
                      ? 'bg-[#0b0b0d] text-white border-[#0b0b0d] shadow-sm'
                      : 'bg-white hover:bg-white/80 border-black/10 text-[#444]'
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Depth Level */}
          <div>
            <label className="text-xs font-black uppercase text-[#666] tracking-wider block mb-2">
              2. Target Cognitive Depth (L1 to L4):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { lvl: 1, label: 'L1: Awareness' },
                { lvl: 2, label: 'L2: Exploration' },
                { lvl: 3, label: 'L3: Decision Dilemma' },
                { lvl: 4, label: 'L4: Full Simulation' },
              ].map((d) => (
                <button
                  key={d.lvl}
                  type="button"
                  onClick={() => setDepthLevel(d.lvl)}
                  className={`p-3 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                    depthLevel === d.lvl
                      ? 'bg-[#0b0b0d] text-white border-[#0b0b0d] shadow-sm'
                      : 'bg-white hover:bg-white/80 border-black/10 text-[#444]'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Desired Modalities */}
          <div>
            <label className="text-xs font-black uppercase text-[#666] tracking-wider block mb-2">
              3. Desired Learning Modalities (Pick 1 or more):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {formatOptions.map((fmt) => {
                const isSelected = selectedFormats.includes(fmt);
                return (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => toggleFormat(fmt)}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#ffffff] text-[#0b0b0d] border-black shadow-xs font-black'
                        : 'bg-white hover:bg-white/80 border-black/10 text-[#555]'
                    }`}
                  >
                    <span className="truncate">{fmt}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Audience & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase text-[#666] tracking-wider block mb-2">
                4. Learner Population:
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-black/15 font-bold text-xs"
              >
                <option>Under 100 Learners</option>
                <option>100 - 500 Learners</option>
                <option>500 - 2,500 Learners</option>
                <option>2,500 - 10,000+ Global Learners</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-black uppercase text-[#666] tracking-wider block mb-2">
                5. Target Launch Timeline:
              </label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-black/15 font-bold text-xs"
              >
                <option>Rapid Sprint (2 - 3 Weeks)</option>
                <option>Standard Rollout (3 - 6 Weeks)</option>
                <option>Enterprise Transformation (6 - 12 Weeks)</option>
              </select>
            </div>
          </div>

          {/* Live Scope Blueprint Output */}
          <div className="p-4 rounded-2xl bg-[#0b0b0d] text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-[#ffffff] uppercase tracking-wider">
                GENERATED BLUEPRINT SUMMARY
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white font-bold cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#444347]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-[#c9cbd1] whitespace-pre-wrap leading-relaxed">
              {scopeSummaryText}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-white border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-[#666]">
            Questions? Email directly:{' '}
            <a
              href="mailto:training@technoedgels.com"
              className="font-bold text-[#0b0b0d] underline"
            >
              training@technoedgels.com
            </a>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-black/15 font-bold text-xs text-[#555] hover:bg-black/5"
            >
              Close
            </button>
            <a
              href={`mailto:training@technoedgels.com?subject=Project Scope Inquiry&body=${encodeURIComponent(
                scopeSummaryText
              )}`}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0b0b0d] text-white font-extrabold text-xs hover:bg-[#1a1b24] shadow-sm cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#ffffff]" />
              <span>Send Scope to TechnoEdge ↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
