import { ArrowUpRight, Linkedin, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { GradualSpacing } from './GradualSpacing';
import { CONTACT_EMAIL, CONTACT_PHONES, whatsappUrl } from '../../../../../src/data/siteContact';

export function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-[#0b0b0d]/10">
      <h2 className="closing-hook mb-12 select-none">
        <GradualSpacing text="LET'S CHANGE THE" className="block" />
        <GradualSpacing text="WAY PEOPLE LEARN." className="block" gradient delay={0.35} slowFade />
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-[#0b0b0d]/10"
      >
        <div className="md:col-span-5 md:col-start-8">
          <h5 className="font-black text-xs uppercase tracking-wider text-[#0b0b0d] mb-3">
            Direct Contacts
          </h5>
          <ul className="space-y-2 text-xs font-bold text-[#68666c]">
            <li>
              <a
                href="/website/"
                className="hover:text-[#0b0b0d] flex items-center gap-1 transition-colors"
              >
                <span>TechnoEdge Home</span>
                <ArrowUpRight className="w-3 h-3 text-[#9877bd]" />
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="hover:text-[#0b0b0d] transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-[#0b0b0d] transition-colors">
                Scope a Custom Build
              </a>
            </li>
          </ul>

          <div className="mt-5 pt-4 border-t border-[#0b0b0d]/10">
            <span className="block text-[11px] font-black uppercase tracking-wider text-[#0b0b0d] mb-2.5">
              Connect With Us
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg bg-white border border-[#0b0b0d]/12 flex items-center justify-center text-[#57565d] hover:text-[#0a66c2] hover:border-[#0a66c2]/40 hover:shadow-xs transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={whatsappUrl(CONTACT_PHONES[0])}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-8 h-8 rounded-lg bg-white border border-[#0b0b0d]/12 flex items-center justify-center text-[#57565d] hover:text-[#25d366] hover:border-[#25d366]/40 hover:shadow-xs transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}



