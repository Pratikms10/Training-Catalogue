import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MessageCircle, X } from 'lucide-react';

export const FloatingActions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside 
      id="floating-utility-actions" 
      aria-label="Customer Support Widget"
      className="fixed bottom-6 right-6 z-50 select-none print:hidden flex flex-col items-end"
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          /* Open Speech Bubble Card - Electric Blue Pop Card with Vertical Chat & Call Actions */
          <motion.div
            key="support-card"
            id="support-speech-bubble-card"
            initial={{ opacity: 0, x: 25, y: 0 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              y: [0, -8, 0],
              boxShadow: [
                '0 12px 32px rgba(0, 50, 255, 0.40), 0 0 20px rgba(96, 165, 250, 0.35)',
                '0 18px 44px rgba(0, 50, 255, 0.65), 0 0 28px rgba(96, 165, 250, 0.60)',
                '0 12px 32px rgba(0, 50, 255, 0.40), 0 0 20px rgba(96, 165, 250, 0.35)'
              ]
            }}
            exit={{ opacity: 0, x: 20, scale: 0.94 }}
            transition={{ 
              opacity: { duration: 0.35, ease: "easeOut" },
              x: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              y: { 
                duration: 2.6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              },
              boxShadow: {
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2 } }}
            className="relative w-[184px] max-w-[calc(100vw-36px)] bg-gradient-to-br from-[#0052FF] via-[#0039CB] to-[#002699] rounded-2xl border-2 border-[#60A5FA]/70 p-3 backdrop-blur-md transition-transform duration-200"
          >
            {/* Top Bar: Close Button */}
            <div className="flex justify-end mb-2">
              <button
                id="support-widget-close-btn"
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close support bubble"
                title="Minimize"
                className="w-5 h-5 -mr-0.5 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
              </button>
            </div>

            {/* Vertical Stack: Chat & Call Action Buttons */}
            <div className="flex flex-col gap-2">
              {/* WhatsApp Chat Button - Vibrant Green Pop */}
              <a
                id="support-widget-chat-btn"
                href="https://wa.me/919845012345?text=Hi%2C%20I%20would%20like%20to%20inquire%20about%20TechnoEdge%20corporate%20training%20programmes."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with TechnoEdge on WhatsApp"
                title="Chat on WhatsApp (+91 98450 12345)"
                className="flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold shadow-[0_4px_14px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-white shrink-0" aria-hidden="true" />
                <span>Chat</span>
              </a>

              {/* Call Button - Crisp White Pop */}
              <a
                id="support-widget-call-btn"
                href="tel:+918040001234"
                aria-label="Call TechnoEdge Corporate Training Desk"
                title="Call Enterprise Desk (+91 80 4000 1234)"
                className="flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl bg-white hover:bg-blue-50 text-[#0038CC] text-xs font-bold shadow-[0_4px_14px_rgba(0,0,0,0.18)] hover:shadow-[0_6px_18px_rgba(255,255,255,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
              >
                <Phone className="w-4 h-4 fill-[#0038CC] stroke-[#0038CC] shrink-0" aria-hidden="true" />
                <span>Call</span>
              </a>
            </div>

            {/* Speech-tail pointing toward bottom-right in electric blue */}
            <div 
              aria-hidden="true"
              className="absolute -bottom-[6px] right-4 w-3 h-3 bg-[#002699] border-r-2 border-b-2 border-[#60A5FA]/70 rotate-45 pointer-events-none"
            />
          </motion.div>
        ) : (
          /* Minimized Pill-shaped Help Button matching Electric Blue Pop Theme */
          <motion.button
            key="reopen-button"
            id="support-widget-reopen-btn"
            type="button"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              boxShadow: [
                '0 8px 24px rgba(0, 64, 255, 0.45), 0 0 12px rgba(96, 165, 250, 0.35)',
                '0 12px 32px rgba(0, 64, 255, 0.65), 0 0 20px rgba(96, 165, 250, 0.55)',
                '0 8px 24px rgba(0, 64, 255, 0.45), 0 0 12px rgba(96, 165, 250, 0.35)'
              ]
            }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ 
              duration: 0.25, 
              ease: "easeOut",
              boxShadow: { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
            }}
            whileHover={{ y: -2, scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            aria-label="Need Assistance? Click to open support options"
            title="Need Assistance?"
            className="flex items-center justify-center w-11 h-11 bg-gradient-to-r from-[#0052FF] to-[#0038CC] text-white rounded-full border-2 border-[#60A5FA]/70 transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/70"
          >
            <div className="w-6 h-6 rounded-full bg-white text-[#0038CC] flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm">
              <MessageCircle className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </aside>
  );
};
