import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';
import { submitEnquiry } from '../../../../../src/data/submitEnquiry';
import { CONTACT_EMAIL } from '../../../../../src/data/siteContact';

interface ELearningEnquiryModalProps {
  onClose: () => void;
}

const fieldClass = 'mt-1.5 w-full rounded-xl border border-[#c7d8e8] bg-white px-3.5 py-3 text-sm text-[#14243e] outline-none transition-colors focus:border-[#226fa7] focus:ring-2 focus:ring-[#226fa7]/20';
const labelClass = 'block text-sm font-semibold text-[#14243e]';

export function ELearningEnquiryModal({ onClose }: ELearningEnquiryModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [learners, setLearners] = useState('Not sure yet');
  const [format, setFormat] = useState('Not sure yet');
  const [learningLevel, setLearningLevel] = useState('Not sure yet');
  const [goal, setGoal] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const nameInput = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const submissionId = useRef<string | null>(null);
  const closeRef = useRef(onClose);
  const submittingRef = useRef(submitting);
  closeRef.current = onClose;
  submittingRef.current = submitting;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    nameInput.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !submittingRef.current) closeRef.current();
      if (event.key !== 'Tab') return;
      const focusable = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]') || []);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    submissionId.current ??= crypto.randomUUID();
    try {
      const savedReference = await submitEnquiry({
        submissionId: submissionId.current,
        kind: 'organisation',
        name,
        email,
        company,
        phone,
        service: 'E-Learning Solution',
        learners,
        delivery: format,
        notes: `Learning goal: ${goal.trim()}\nPreferred e-learning level: ${learningLevel}`,
        sourcePage: window.location.pathname,
        ctaId: 'elearning_contact_enquiry',
      });
      setReference(savedReference);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Your enquiry could not be saved. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#0b1d39]/70 p-4 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => { if (event.target === event.currentTarget && !submitting) onClose(); }}
    >
      <div className="flex min-h-full items-center justify-center">
        <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="elearning-enquiry-title" className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-[#c7d8e8] bg-[#f8fbff] text-[#14243e] shadow-[0_32px_90px_rgba(4,22,50,.28)]">
          <div className="flex items-start justify-between gap-5 border-b border-[#dce8f3] bg-white px-6 py-5 sm:px-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[.17em] text-[#226fa7]">E-Learning enquiry</span>
              <h3 id="elearning-enquiry-title" className="mt-1 text-2xl font-bold leading-tight sm:text-3xl">Let’s build learning that works.</h3>
              <p className="mt-2 text-sm text-[#55677e]">Tell us about your learners and the outcome you need.</p>
            </div>
            <button type="button" aria-label="Close enquiry form" onClick={onClose} disabled={submitting} className="shrink-0 rounded-full p-2 text-[#55677e] hover:bg-[#eef5fb] hover:text-[#14243e] disabled:opacity-50"><X size={20} /></button>
          </div>

          {reference ? (
            <div className="px-6 py-12 text-center sm:px-8">
              <CheckCircle2 className="mx-auto h-12 w-12 text-[#226fa7]" aria-hidden="true" />
              <h4 className="mt-4 text-2xl font-bold">Enquiry saved</h4>
              <p className="mt-2 text-sm text-[#55677e]">Thanks, {name}. Our team has your E-Learning request.</p>
              <p className="mt-5 rounded-xl bg-[#eaf4fc] px-4 py-3 text-sm">Your reference: <strong className="font-mono text-[#123f6b]">{reference}</strong></p>
              <button type="button" onClick={onClose} className="mt-7 rounded-full bg-[#123f6b] px-7 py-3 text-sm font-bold text-white hover:bg-[#0a2e50]">Done</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-h-[calc(100vh-180px)] space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>Your name <span aria-hidden="true">*</span><input ref={nameInput} required maxLength={160} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} /></label>
                <label className={labelClass}>Work email <span aria-hidden="true">*</span><input required type="email" maxLength={254} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={fieldClass} /></label>
                <label className={labelClass}>Organisation <span aria-hidden="true">*</span><input required maxLength={200} autoComplete="organization" value={company} onChange={(event) => setCompany(event.target.value)} className={fieldClass} /></label>
                <label className={labelClass}>Phone / WhatsApp <span className="font-normal text-[#697a8e]">(optional)</span><input type="tel" maxLength={40} autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className={fieldClass} /></label>
                <label className={labelClass}>Approximate audience<select value={learners} onChange={(event) => setLearners(event.target.value)} className={fieldClass}><option>Not sure yet</option><option>Under 50 learners</option><option>50–250 learners</option><option>250–1,000 learners</option><option>1,000+ learners</option></select></label>
                <label className={labelClass}>Experience you have in mind<select value={format} onChange={(event) => setFormat(event.target.value)} className={fieldClass}><option>Not sure yet</option><option>Interactive e-learning</option><option>Scenario or simulation</option><option>Microlearning</option><option>Video-led learning</option><option>Blended learning</option></select></label>
              </div>
              <label className={labelClass}>Preferred e-learning level<select value={learningLevel} onChange={(event) => setLearningLevel(event.target.value)} className={fieldClass}><option>Not sure yet</option><option>Level 1</option><option>Level 2</option><option>Level 3</option><option>Gamified</option></select></label>
              <label className={labelClass}>What should people be able to understand, decide, or do? <span aria-hidden="true">*</span><textarea required rows={4} maxLength={3500} value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="Tell us about the audience, challenge, or outcome." className={fieldClass} /></label>
              {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error} You can also email <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#dce8f3] pt-5">
                <p className="text-xs text-[#697a8e]">We’ll use these details to respond to your enquiry.</p>
                <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-[#123f6b] px-6 py-3 text-sm font-bold text-white hover:bg-[#0a2e50] disabled:cursor-wait disabled:opacity-60">{submitting ? 'Saving enquiry…' : 'Send enquiry'}<ArrowRight size={17} aria-hidden="true" /></button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
