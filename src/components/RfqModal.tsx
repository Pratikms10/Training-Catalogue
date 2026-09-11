import React, { useState } from 'react';
import { BaseProgramme } from '../types';
import { X, CheckCircle2, Building2, Mail, User, Phone, Users2, Calendar, FileText, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RfqModalProps {
  programme?: BaseProgramme | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RfqModal: React.FC<RfqModalProps> = ({ programme, isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    learners: '10–25 Participants',
    preferredDelivery: programme?.details?.delivery || 'Instructor-Led Classroom / Virtual',
    trackInterest: programme ? programme.category : 'Multi-Track Enterprise Cohort',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  const isSpecificProgramme = Boolean(programme && programme.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[rgba(0,0,255,0.14)] overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="px-6 sm:px-8 pt-6 pb-4 bg-[rgba(33,150,243,0.06)] border-b border-[rgba(0,0,255,0.12)] flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[rgba(33,150,243,0.10)] text-[#000000] text-xs font-bold border border-[rgba(0,0,255,0.12)] mb-2 font-mono">
                {isSpecificProgramme ? `${programme?.id} · ${programme?.duration || 'Corporate Training'}` : 'Enterprise Corporate Consultation'}
              </div>
              <h2 className="text-xl font-bold text-[#000000]">
                {isSpecificProgramme ? 'Request for Quotation' : 'Corporate Training Enquiry'}
              </h2>
              <p className="text-xs sm:text-sm text-[rgba(0,0,0,0.70)] mt-0.5">
                {isSpecificProgramme ? programme?.title : 'Discuss custom cohorts, curriculum tailoring, or multi-programme enterprise licensing.'}
              </p>
            </div>
            <button
              onClick={handleResetAndClose}
              className="p-1.5 rounded-lg text-[rgba(0,0,0,0.58)] hover:text-[#000000] hover:bg-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            /* Submission Confirmation */
            <div className="p-8 sm:p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-[rgba(33,150,243,0.10)] text-[#0000FF] mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-9 h-9 text-[#0000FF]" />
              </div>
              <h3 className="text-2xl font-bold text-[#000000] mb-2">Quotation Request Received</h3>
              <p className="text-sm text-[rgba(0,0,0,0.70)] max-w-md mx-auto mb-6">
                Thank you, <strong className="text-[#000000]">{formData.name || 'Corporate Partner'}</strong>. Your commercial enquiry {isSpecificProgramme ? <>for <strong className="text-[#000000]">{programme?.id}</strong></> : 'for enterprise corporate training'} has been logged. Our solutions advisor will reach out within 24 business hours.
              </p>

              <div className="bg-[rgba(33,150,243,0.06)] border border-[rgba(0,0,255,0.10)] rounded-xl p-4 max-w-md mx-auto text-left text-xs text-[rgba(0,0,0,0.72)] space-y-1.5 mb-6">
                <div className="flex justify-between">
                  <span className="text-[rgba(0,0,0,0.58)] font-medium">Reference Code:</span>
                  <span className="font-mono font-bold text-[#0000FF]">RFQ-2026-{Math.floor(1000 + Math.random() * 9000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[rgba(0,0,0,0.58)] font-medium">Programme / Track:</span>
                  <span className="font-medium text-[#000000]">{isSpecificProgramme ? `${programme?.id} (${programme?.level})` : formData.trackInterest}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[rgba(0,0,0,0.58)] font-medium">Target Learners:</span>
                  <span className="font-medium text-[#000000]">{formData.learners}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="bg-[#0000FF] hover:opacity-90 active:opacity-100 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-opacity cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          ) : (
            /* RFQ Form */
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#000000] mb-1.5">
                    Contact Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[rgba(0,0,0,0.40)] absolute left-3 top-3" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[rgba(0,0,255,0.14)] focus:outline-none focus:ring-2 focus:ring-[#0000FF] focus:border-transparent bg-white text-[#000000]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#000000] mb-1.5">
                    Corporate Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[rgba(0,0,0,0.40)] absolute left-3 top-3" />
                    <input
                      required
                      type="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[rgba(0,0,255,0.14)] focus:outline-none focus:ring-2 focus:ring-[#0000FF] focus:border-transparent bg-white text-[#000000]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#000000] mb-1.5">
                    Company / Organisation *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[rgba(0,0,0,0.40)] absolute left-3 top-3" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Acme Global Technologies"
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[rgba(0,0,255,0.14)] focus:outline-none focus:ring-2 focus:ring-[#0000FF] focus:border-transparent bg-white text-[#000000]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#000000] mb-1.5">
                    Contact Phone / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[rgba(0,0,0,0.40)] absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[rgba(0,0,255,0.14)] focus:outline-none focus:ring-2 focus:ring-[#0000FF] focus:border-transparent bg-white text-[#000000]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#000000] mb-1.5">
                    Expected Learners
                  </label>
                  <div className="relative">
                    <Users2 className="w-4 h-4 text-[rgba(0,0,0,0.40)] absolute left-3 top-3" />
                    <select
                      value={formData.learners}
                      onChange={e => setFormData({ ...formData, learners: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[rgba(0,0,255,0.14)] focus:outline-none focus:ring-2 focus:ring-[#0000FF] focus:border-transparent bg-white text-[#000000]"
                    >
                      <option>1–10 Participants</option>
                      <option>10–25 Participants</option>
                      <option>25–50 Participants</option>
                      <option>50+ Enterprise Cohort</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#000000] mb-1.5">
                    Preferred Delivery Format
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[rgba(0,0,0,0.40)] absolute left-3 top-3" />
                    <select
                      value={formData.preferredDelivery}
                      onChange={e => setFormData({ ...formData, preferredDelivery: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[rgba(0,0,255,0.14)] focus:outline-none focus:ring-2 focus:ring-[#0000FF] focus:border-transparent bg-white text-[#000000]"
                    >
                      <option>Instructor-Led Virtual</option>
                      <option>On-Premises / Corporate Classroom</option>
                      <option>Blended Learning Model</option>
                      <option>Self-Paced with Masterclass</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#000000] mb-1.5">
                  Specific Learning Objectives / Dates
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-[rgba(0,0,0,0.40)] absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    placeholder="Provide any specific customisation requests or target training dates..."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[rgba(0,0,255,0.14)] focus:outline-none focus:ring-2 focus:ring-[#0000FF] focus:border-transparent bg-white text-[#000000]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-[rgba(0,0,0,0.70)] hover:text-[#000000] hover:bg-[rgba(33,150,243,0.06)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0000FF] hover:opacity-90 active:opacity-100 text-white font-semibold text-sm px-6 py-2.5 rounded-lg inline-flex items-center gap-2 shadow-xs transition-all hover:shadow-[0_4px_12px_rgba(0,0,255,0.2)]"
                >
                  Submit Quotation Request
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
