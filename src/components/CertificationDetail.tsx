import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Check,
  ChevronLeft,
  Clock3,
  ExternalLink,
  FileCheck2,
  Globe2,
  RefreshCw,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { BaseProgramme, CertificationObjective } from '../types';
import { RfqModal } from './RfqModal';

interface Props {
  programme: BaseProgramme;
  onBack: () => void;
}

function statusClasses(status?: string) {
  const normalized = status?.toLowerCase() || '';
  if (normalized.includes('retir')) return 'border-red-200 bg-red-50 text-red-700';
  if (normalized.includes('beta') || normalized.includes('coming')) return 'border-amber-200 bg-amber-50 text-amber-800';
  if (normalized.includes('active')) return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  return 'border-blue-200 bg-blue-50 text-[#0000FF]';
}

export const CertificationDetail: React.FC<Props> = ({ programme, onBack }) => {
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const details = programme.details || {};
  const exams = details.exams || [];
  const objectives: CertificationObjective[] = details.certificationObjectives || [];
  const requirements = details.certificationRequirements || [];
  const resources = details.trainingResources || [];
  const lifecycle = details.lifecycle || [];
  const recordLabel = details.credentialType === 'Assessment'
    ? 'assessment'
    : details.credentialType === 'Exam' ? 'exam' : 'credential';

  const objectiveGroups = useMemo(() => {
    const groups = new Map<string, CertificationObjective[]>();
    objectives.forEach((objective) => {
      const group = objective.groupTitle || 'Skills measured';
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group)?.push(objective);
    });
    return [...groups.entries()];
  }, [objectives]);

  const facts = [
    {
      label: 'Credential',
      value: details.credentialClassification || details.credentialType,
      icon: Award,
    },
    {
      label: 'Level',
      value: details.credentialLevel || programme.level,
      icon: BarChart3,
    },
    {
      label: 'Exam duration',
      value: details.examDuration || programme.duration,
      icon: Clock3,
    },
    {
      label: 'Validity / renewal',
      value: details.validityRenewal,
      icon: RefreshCw,
    },
  ].filter((fact) => fact.value);
  const factGridClass = facts.length >= 4
    ? 'lg:grid-cols-4'
    : facts.length === 3
      ? 'lg:grid-cols-3'
      : facts.length === 2
        ? 'lg:grid-cols-2'
        : 'lg:grid-cols-1';

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-[rgba(0,0,255,0.10)] bg-white">
        <div className="mx-auto max-w-[1320px] px-5 py-4 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[rgba(0,0,0,0.66)] transition-colors hover:text-[#0000FF]"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Catalogue
          </button>
        </div>
      </div>

      <section className="relative overflow-hidden border-b border-[rgba(0,0,255,0.10)] bg-[linear-gradient(135deg,#f7fbff_0%,#ffffff_58%,#eef5ff_100%)]">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full border border-[#0000FF]/10" />
        <div className="absolute -right-10 -top-12 h-64 w-64 rounded-full border border-[#2196F3]/15" />
        <div className="relative mx-auto grid max-w-[1320px] gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.45fr_0.55fr] lg:px-12 lg:py-20">
          <div className="max-w-4xl">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0000FF]/15 bg-white px-3 py-1.5 text-xs font-bold text-[#0000FF] shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                {details.provider || 'Certification'} {recordLabel}
              </span>
              <span className="rounded-full border border-[#0000FF]/10 bg-white px-3 py-1.5 font-mono text-xs font-bold text-[rgba(0,0,0,0.64)]">
                {programme.id}
              </span>
              {details.credentialStatus && (
                <span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${statusClasses(details.credentialStatus)}`}>
                  {details.credentialStatus}
                </span>
              )}
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-black sm:text-5xl lg:text-[3.4rem]">
              {programme.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-2">
              {details.examCode && (
                <span className="rounded-lg border border-[#0000FF]/12 bg-white px-3 py-2 font-mono text-xs font-semibold text-[rgba(0,0,0,0.68)]">
                  Exam code: {details.examCode}
                </span>
              )}
              {(details.productTechnologies || []).slice(0, 4).map((technology: string) => (
                <span key={technology} className="rounded-lg bg-[#0000FF]/[0.06] px-3 py-2 text-xs font-semibold text-[#0000FF]">
                  {technology}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsRfqOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0000FF] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(0,0,255,0.22)] transition-transform hover:-translate-y-0.5"
              >
                Get Corporate Training Proposal
                <ArrowRight className="h-4 w-4" />
              </button>
              {details.courseUrl && (
                <a
                  href={details.courseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#0000FF]/15 bg-white px-5 py-3 text-sm font-bold text-[#0000FF] hover:border-[#0000FF]/30"
                >
                  Official provider page
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative flex aspect-square w-full max-w-[300px] items-center justify-center rounded-[2rem] border border-[#0000FF]/12 bg-white shadow-[0_24px_70px_rgba(15,40,120,0.10)]">
              <div className="absolute inset-5 rounded-[1.5rem] border border-dashed border-[#2196F3]/25" />
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-[#0000FF] text-white shadow-[0_18px_44px_rgba(0,0,255,0.28)]">
                <Award className="h-14 w-14" />
              </div>
              <span className="absolute bottom-8 max-w-[80%] truncate text-xs font-bold uppercase tracking-[0.18em] text-[rgba(0,0,0,0.52)]">
                {details.provider}
              </span>
            </div>
          </div>
        </div>
      </section>

      {facts.length > 0 && (
        <section className="relative z-10 mx-auto -mt-5 max-w-[1160px] px-5 sm:px-8">
          <div className={`grid overflow-hidden rounded-2xl border border-[#0000FF]/12 bg-white shadow-[0_14px_40px_rgba(15,40,120,0.08)] sm:grid-cols-2 ${factGridClass}`}>
            {facts.map(({ label, value, icon: Icon }, index) => (
              <div key={label} className={`flex min-h-24 items-center gap-3 px-5 py-5 ${index ? 'border-t border-[#0000FF]/10 sm:border-l sm:border-t-0' : ''}`}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0000FF]/[0.06] text-[#0000FF]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[rgba(0,0,0,0.48)]">{label}</div>
                  <div className="mt-1 text-sm font-bold leading-snug text-black">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <main className="mx-auto max-w-[1160px] space-y-7 px-5 py-12 sm:px-8 sm:py-16">
        {(details.summary || (details.audience && details.audience.length) || (details.productTechnologies && details.productTechnologies.length)) && (
          <section className="rounded-2xl border border-[#0000FF]/12 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0000FF] text-white"><FileCheck2 className="h-5 w-5" /></div>
              <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#0000FF]">{recordLabel} overview</p><h2 className="text-2xl font-bold text-black">About this {recordLabel}</h2></div>
            </div>
            {details.summary && <p className="max-w-4xl text-base leading-7 text-[rgba(0,0,0,0.70)]">{details.summary}</p>}
            {details.audience && details.audience.length > 0 && (
              <div className="mt-7 rounded-xl bg-[#2196F3]/[0.06] p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-black"><Users className="h-4 w-4 text-[#0000FF]" />Who this is for</h3>
                <div className="grid gap-2 md:grid-cols-2">
                  {details.audience.map((item: string) => <div key={item} className="flex items-start gap-2 text-sm leading-6 text-[rgba(0,0,0,0.70)]"><Check className="mt-1 h-4 w-4 shrink-0 text-[#0000FF]" />{item}</div>)}
                </div>
              </div>
            )}
          </section>
        )}

        {exams.length > 0 && (
          <section className="rounded-2xl border border-[#0000FF]/12 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2196F3] text-white"><ShieldCheck className="h-5 w-5" /></div>
              <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#0000FF]">Assessment</p><h2 className="text-2xl font-bold text-black">Exam details</h2></div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {exams.map((exam: any, index: number) => (
                <article key={`${exam.examCode || 'exam'}-${index}`} className="rounded-xl border border-[#0000FF]/10 bg-[#f9fbff] p-5">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-xs font-bold text-[#0000FF]">{exam.examCode || `Assessment ${index + 1}`}</div>
                      {exam.examName && <h3 className="mt-1 text-base font-bold text-black">{exam.examName}</h3>}
                    </div>
                    {(exam.requirementType || exam.status) && <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[rgba(0,0,0,0.58)]">{exam.requirementType || exam.status}</span>}
                  </div>
                  <dl className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm">
                    {[['Duration', exam.duration], ['Format', exam.deliveryFormat], ['Delivery', exam.deliveryProvider], ['Passing score', exam.passingScore], ['Price', exam.price], ['Proctored', exam.proctored]].filter(([, value]) => value).map(([label, value]) => (
                      <div key={label}><dt className="text-[11px] font-bold uppercase tracking-wide text-[rgba(0,0,0,0.42)]">{label}</dt><dd className="mt-0.5 font-semibold leading-snug text-black">{value}</dd></div>
                    ))}
                  </dl>
                  {exam.languages?.length > 0 && <p className="mt-4 flex items-start gap-2 border-t border-[#0000FF]/8 pt-4 text-xs leading-5 text-[rgba(0,0,0,0.64)]"><Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0000FF]" />{exam.languages.join(', ')}</p>}
                  {exam.url && <a href={exam.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#0000FF] hover:underline">View exam details <ExternalLink className="h-3.5 w-3.5" /></a>}
                </article>
              ))}
            </div>
          </section>
        )}

        {objectiveGroups.length > 0 && (
          <section className="rounded-2xl border border-[#0000FF]/12 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0000FF] text-white"><FileCheck2 className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#0000FF]">Exam blueprint</p><h2 className="text-2xl font-bold text-black">Skills measured</h2></div></div>
            <div className="space-y-3">
              {objectiveGroups.map(([group, items], groupIndex) => (
                <details key={`${group}-${groupIndex}`} open={groupIndex === 0} className="group rounded-xl border border-[#0000FF]/10 bg-[#f9fbff]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-bold text-black"><span>{group}</span><span className="rounded-full bg-white px-2.5 py-1 text-xs text-[#0000FF]">{items.length} topics</span></summary>
                  <ul className="space-y-2 border-t border-[#0000FF]/8 bg-white px-5 py-5">
                    {items.map((item, index) => <li key={`${item.objective}-${index}`} className="flex items-start gap-2.5 text-sm leading-6 text-[rgba(0,0,0,0.70)]"><Check className="mt-1 h-4 w-4 shrink-0 text-[#0000FF]" /><span>{item.objective}{item.weight && <span className="ml-2 text-xs font-bold text-[#0000FF]">{item.weight}</span>}</span></li>)}
                  </ul>
                </details>
              ))}
            </div>
          </section>
        )}

        {requirements.length > 0 && (
          <section className="rounded-2xl border border-[#0000FF]/12 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2196F3] text-white"><FileCheck2 className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#0000FF]">Before you certify</p><h2 className="text-2xl font-bold text-black">Requirements and recommended experience</h2></div></div>
            <div className="grid gap-3 md:grid-cols-2">
              {requirements.map((requirement: any, index: number) => <div key={`${requirement.requirement}-${index}`} className="rounded-xl bg-[#2196F3]/[0.06] p-4"><div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#0000FF]">{requirement.type || requirement.qualifier || 'Requirement'}</div><p className="text-sm leading-6 text-[rgba(0,0,0,0.72)]">{requirement.requirement}</p>{requirement.url && <a href={requirement.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#0000FF] hover:underline">Reference <ExternalLink className="h-3 w-3" /></a>}</div>)}
            </div>
          </section>
        )}

        {resources.length > 0 && (
          <section className="rounded-2xl border border-[#0000FF]/12 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0000FF] text-white"><BookOpen className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#0000FF]">Preparation</p><h2 className="text-2xl font-bold text-black">Official learning resources</h2></div></div>
            <div className="grid gap-3 md:grid-cols-2">
              {resources.map((resource: any, index: number) => {
                const content = <><div className="text-[10px] font-bold uppercase tracking-wide text-[#0000FF]">{resource.type || 'Learning resource'}</div><h3 className="mt-1 text-sm font-bold leading-snug text-black">{resource.title}</h3>{(resource.duration || resource.itemCount) && <p className="mt-2 text-xs text-[rgba(0,0,0,0.55)]">{[resource.duration, resource.itemCount].filter(Boolean).join(' · ')}</p>}</>;
                return resource.url ? <a key={`${resource.title}-${index}`} href={resource.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-[#0000FF]/10 bg-[#f9fbff] p-4 transition-colors hover:border-[#0000FF]/30 hover:bg-white">{content}<span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0000FF]">Open resource <ExternalLink className="h-3.5 w-3.5" /></span></a> : <div key={`${resource.title}-${index}`} className="rounded-xl border border-[#0000FF]/10 bg-[#f9fbff] p-4">{content}</div>;
              })}
            </div>
          </section>
        )}

        {(lifecycle.length > 0 || details.validityRenewal || details.credentialStatus) && (
          <section className="rounded-2xl border border-[#0000FF]/12 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2196F3] text-white"><RefreshCw className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#0000FF]">Credential lifecycle</p><h2 className="text-2xl font-bold text-black">Status, validity and renewal</h2></div></div>
            <div className="space-y-3">
              {details.validityRenewal && <div className="rounded-xl bg-[#2196F3]/[0.06] p-4 text-sm leading-6 text-[rgba(0,0,0,0.72)]"><strong className="text-black">Validity:</strong> {details.validityRenewal}</div>}
              {lifecycle.map((item: any, index: number) => <div key={index} className="rounded-xl border border-[#0000FF]/10 p-4"><div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#0000FF]">{item.recordType || item.status || 'Lifecycle information'}</div><p className="text-sm leading-6 text-[rgba(0,0,0,0.70)]">{[item.validityRenewal, item.retirementTransition, item.details, item.action, item.outcome].filter(Boolean).join(' · ')}</p></div>)}
            </div>
          </section>
        )}

        <section className="overflow-hidden rounded-2xl bg-[#0000FF] p-7 text-white shadow-[0_22px_60px_rgba(0,0,255,0.24)] sm:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">Corporate certification enablement</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">Turn this pathway into a team capability plan</h2><p className="mt-3 text-sm leading-6 text-blue-100">We can align the learning path, instructor support, practice environment and delivery schedule to your team’s roles and certification target.</p></div>
            <button type="button" onClick={() => setIsRfqOpen(true)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#0000FF] transition-transform hover:-translate-y-0.5">Build a training proposal <ArrowRight className="h-4 w-4" /></button>
          </div>
        </section>
      </main>

      <RfqModal programme={programme} isOpen={isRfqOpen} onClose={() => setIsRfqOpen(false)} />
    </div>
  );
};
