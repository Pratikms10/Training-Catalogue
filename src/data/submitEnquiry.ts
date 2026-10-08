export interface EnquirySubmission {
  submissionId: string;
  kind: 'course' | 'organisation' | 'trainer';
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  courseId?: string;
  courseTitle?: string;
  courseCategory?: string;
  learners?: string;
  delivery?: string;
  notes: string;
  preferredChannel?: 'email' | 'whatsapp';
  trainerExpertise?: string;
  trainerExperience?: string;
  profileUrl?: string;
  sourcePage: string;
  ctaId?: string;
}

export async function submitEnquiry(enquiry: EnquirySubmission): Promise<string> {
  let response: Response;
  try {
    response = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiry),
    });
  } catch {
    throw new Error('We could not connect to the enquiry service. Please try again or contact us directly.');
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok || typeof result.reference !== 'string') {
    throw new Error(typeof result.error === 'string' ? result.error : 'Your enquiry could not be saved. Please try again or contact us directly.');
  }
  window.dispatchEvent(new CustomEvent('technoedge:lead-submitted', {
    detail: {
      enquiry_kind: enquiry.kind,
      course_id: enquiry.courseId || undefined,
      course_category: enquiry.courseCategory || undefined,
      preferred_channel: enquiry.preferredChannel || undefined,
      source_path: enquiry.sourcePage,
      cta_id: enquiry.ctaId || undefined,
    },
  }));
  return result.reference;
}
