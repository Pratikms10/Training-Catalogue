import { ArrowUpRight, Instagram, Linkedin, Twitter, Facebook, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { MaskedLinesText } from './ScrollRevealText';
import { CONTACT_EMAIL, CONTACT_PHONES, whatsappUrl } from '../../../../src/data/siteContact';

export function Footer() {
  const hookLines = [
    {
      text: "LET'S MAKE",
      className: 'text-[#0b0b0d]',
    },
    {
      text: 'LEARNING CHANGE',
      className: 'text-[#0b0b0d]',
    },
    {
      text: 'WHAT PEOPLE DO.',
      className:
        'bg-gradient-to-r from-[#0b0b0d] via-[#0b0b0d] to-[#0b0b0d] bg-clip-text text-transparent',
      isGradient: true,
    },
  ];

  return (
    <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-[#0b0b0d]/10">
      <MaskedLinesText
        lines={hookLines}
        className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-[-0.03em] leading-[0.98] mb-12 select-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-[#0b0b0d]/10"
      >
        <div className="md:col-span-7">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#0b0b0d] flex items-center justify-center text-white font-black text-xs shadow-[inset_0_0_0_5px_#0b0b0d]">
              TE
            </div>
            <h4 className="font-extrabold text-base text-[#0b0b0d]">
              TechnoEdge E-Learning Studio
            </h4>
          </div>
          <p className="text-sm text-[#68666c] leading-relaxed max-w-md">
            A bespoke digital learning studio for global organizations that need employees to
            understand, practice, remember, and perform.
          </p>
          <div className="mt-4 text-xs text-[#888]">
            © {new Date().getFullYear()} TechnoEdge Learning Services. All rights reserved.
          </div>
        </div>

        <div className="md:col-span-5">
          <h5 className="font-black text-xs uppercase tracking-wider text-[#0b0b0d] mb-3">
            Direct Contacts
          </h5>
          <ul className="space-y-2 text-xs font-bold text-[#68666c]">
            <li>
              <a
                href="https://technoedgels.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0b0b0d] flex items-center gap-1 transition-colors"
              >
                <span>Main TechnoEdge Site</span>
                <ArrowUpRight className="w-3 h-3 text-[#0b0b0d]" />
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
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-white border border-[#0b0b0d]/12 flex items-center justify-center text-[#57565d] hover:text-[#e1306c] hover:border-[#e1306c]/40 hover:shadow-xs transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
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
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 rounded-lg bg-white border border-[#0b0b0d]/12 flex items-center justify-center text-[#57565d] hover:text-[#1da1f2] hover:border-[#1da1f2]/40 hover:shadow-xs transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg bg-white border border-[#0b0b0d]/12 flex items-center justify-center text-[#57565d] hover:text-[#1877f2] hover:border-[#1877f2]/40 hover:shadow-xs transition-all"
              >
                <Facebook className="w-4 h-4" />
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
