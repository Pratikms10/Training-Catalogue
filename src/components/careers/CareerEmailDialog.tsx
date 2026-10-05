import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Check, Copy, Mail, X } from 'lucide-react';
import { CAREERS_EMAIL } from '../../data/siteContact';

interface CareerEmailDialogProps {
  roleTitle?: string;
  onClose: () => void;
}

export const CareerEmailDialog: React.FC<CareerEmailDialogProps> = ({ roleTitle, onClose }) => {
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const mailLinkRef = useRef<HTMLAnchorElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const subject = roleTitle ? `Application for ${roleTitle}` : 'Open application for TechnoEdge';
  const mailto = `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(subject)}`;

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    mailLinkRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current();
      if (event.key !== 'Tab') return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]') || []);
      if (focusable.length === 0) return;
      if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault();
        focusable[focusable.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
        event.preventDefault();
        focusable[0].focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CAREERS_EMAIL);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#081736]/70 p-4 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="flex min-h-full items-center justify-center">
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="career-email-title" className="w-full max-w-lg rounded-3xl border border-[#d4e1f6] bg-white p-6 text-[#122244] shadow-[0_32px_90px_rgba(4,22,50,.28)] sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf3ff] text-[#0000ff]"><Mail size={24} aria-hidden="true" /></div>
            <button type="button" onClick={onClose} aria-label="Close application details" className="rounded-full p-2 text-[#5a6881] hover:bg-[#eef4ff] hover:text-[#122244]"><X size={20} /></button>
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[.16em] text-[#0000ff]">Careers at TechnoEdge</p>
          <h2 id="career-email-title" className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">{roleTitle ? `Apply for ${roleTitle}` : 'Send an open application'}</h2>
          <p className="mt-3 text-sm leading-6 text-[#5a6881]">Email your CV or portfolio to our HR team. Your email app will open with the subject filled in; attach your files before sending.</p>
          <div className="mt-6 rounded-2xl border border-[#d4e1f6] bg-[#f7faff] p-4">
            <span className="block text-xs font-semibold uppercase tracking-wider text-[#5a6881]">Send to</span>
            <a ref={mailLinkRef} href={mailto} className="mt-1 block break-all text-lg font-bold text-[#0000ff] underline underline-offset-4">{CAREERS_EMAIL}</a>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={mailto} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0000ff] px-5 py-3 text-sm font-bold text-white hover:bg-[#003bb5]">Open email app <ArrowUpRight size={17} aria-hidden="true" /></a>
            <button type="button" onClick={copyEmail} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#b8c9e6] px-5 py-3 text-sm font-bold text-[#122244] hover:bg-[#f3f7ff]">{copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}{copied ? 'Copied' : 'Copy address'}</button>
          </div>
          <p className="mt-4 text-xs leading-5 text-[#5a6881]">This opens your own email application. The website does not upload or store your CV.</p>
        </div>
      </div>
    </div>,
    document.body,
  );
};
