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
        className="relative rounded-[40px] bg-white border border-gray-200 text-[#0b0b0d] p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl min-h-[500px] flex flex-col justify-center w-full"
      >
        {/* Glow Spheres */}
        <div className="absolute -right-24 -top-24 w-[450px] h-[450px] rounded-full bg-[#7557ff]/5 blur-[120px] pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-[350px] h-[350px] rounded-full bg-[#ff5f9f]/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.08] text-[#0b0b0d] mb-4 sm:mb-6">
            Tell us what you&apos;re cooking.
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#444347] leading-relaxed mb-8 max-w-2xl">
            A dense PPT, 100-page SOP manual, software rollout, compliance headache, leadership
            gap, or completely chaotic idea. Start with what you have.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://technoedgels.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-4 rounded-full text-base sm:text-lg font-black bg-[#0b0b0d] text-white hover:bg-gray-800 transition-all shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Talk to TechnoEdge</span>
              <ArrowUpRight className="w-5 h-5 text-[#dfff5c]" />
            </a>

            <a
              href="mailto:training@technoedgels.com"
              className="text-sm sm:text-base text-[#444347] hover:text-[#0b0b0d] font-bold underline underline-offset-4 transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4" />
              <span>training@technoedgels.com</span>
            </a>
          </div>

          {/* Quick Trust Highlights */}
          <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#7557ff]" />
              <span>SCORM 1.2 / 2004 &amp; xAPI Tested</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#ff5f9f]" />
              <span>Rapid 2-to-4 Week Sprints</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#34d8b2]" />
              <span>LMS &amp; Enterprise Ready</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
