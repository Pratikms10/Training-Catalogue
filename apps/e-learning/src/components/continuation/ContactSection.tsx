import { ArrowUpRight, Sparkles, Mail, ShieldCheck, Clock, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface ContactSectionProps {
  onOpenScoper: () => void;
}

export function ContactSection({ onOpenScoper }: ContactSectionProps) {
  return (
    <section id="contact" className="min-h-screen py-16 sm:py-20 lg:py-24 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-[40px] bg-[#faf8f3] text-[#30283f] border border-[#9877bd]/15 p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl min-h-[500px] flex flex-col justify-center w-full"
      >
        {/* Glow Spheres */}
        <div className="absolute -right-24 -top-24 w-[450px] h-[450px] rounded-full bg-[#b8dcff]/35 blur-[110px] pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-[350px] h-[350px] rounded-full bg-[#d4ebff]/40 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.08] text-[#30283f] mb-4 sm:mb-6">
            Not sure which format fits?<br />
            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold">Tell us what people need to understand, decide or do.</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#30283f] leading-relaxed mb-8 max-w-2xl font-black">
            We&apos;ll help you choose the right experience.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/website/#contact"
              className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-4 rounded-full text-base sm:text-lg font-black bg-[#30283f] text-white hover:bg-[#4b3d60] transition-all shadow-xl hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Talk to TechnoEdge</span>
              <ArrowUpRight className="w-5 h-5 text-white" />
            </a>

            <a
              href="mailto:training@technoedgels.com"
              className="text-sm sm:text-base text-[#554b60] hover:text-[#30283f] font-bold underline underline-offset-4 transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4" />
              <span>training@technoedgels.com</span>
            </a>
          </div>

          {/* Quick Trust Highlights */}
          <div className="mt-12 pt-8 border-t border-[#9877bd]/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#554b60]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#147d69]" />
              <span>SCORM 1.2 / 2004 &amp; xAPI Tested</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#9877bd]" />
              <span>Rapid 2-to-4 Week Sprints</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#c5a48c]" />
              <span>LMS &amp; Enterprise Ready</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}




