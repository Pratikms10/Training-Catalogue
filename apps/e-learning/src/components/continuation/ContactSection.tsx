import { useState } from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { GradualSpacing } from './GradualSpacing';
import { ELearningEnquiryModal } from './ELearningEnquiryModal';
import { CONTACT_EMAIL } from '../../../../../src/data/siteContact';

export function ContactSection() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  return (
    <section id="contact" className="min-h-screen py-16 sm:py-20 lg:py-24 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="closing-hook mb-10 sm:mb-12 select-none" role="heading" aria-level={2}>
        <GradualSpacing text="LET'S CHANGE THE" className="block" />
        <GradualSpacing text="WAY PEOPLE LEARN." className="block" gradient delay={0.35} slowFade />
      </p>
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-[40px] bg-[#faf8f3] text-[#30283f] border border-[#9877bd]/15 p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl min-h-[390px] flex flex-col justify-center w-full"
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
            <button
              type="button"
              onClick={() => setIsEnquiryOpen(true)}
              className="contact-primary-cta inline-flex items-center gap-2.5 px-6 sm:px-8 py-4 rounded-full text-base sm:text-lg font-black transition-all shadow-xl hover:-translate-y-0.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#226FA7]"
            >
              <span>Talk to TechnoEdge</span>
              <ArrowUpRight className="w-5 h-5 text-white" />
            </button>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sm sm:text-base text-[#554b60] hover:text-[#30283f] font-bold underline underline-offset-4 transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4" />
              <span>{CONTACT_EMAIL}</span>
            </a>
          </div>

        </div>
      </motion.div>
      {isEnquiryOpen && <ELearningEnquiryModal onClose={() => setIsEnquiryOpen(false)} />}
    </section>
  );
}




