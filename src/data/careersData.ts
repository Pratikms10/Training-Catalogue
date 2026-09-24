export interface CareerPrinciple {
  number: string;
  title: string;
  description: string;
  variant: 'light' | 'blue' | 'soft';
}

export interface CareerJob {
  id: number;
  slug: string;
  title: string;
  department: string;
  type: string;
  location?: string;
}

export interface CareerPhoto {
  id: string;
  src: string;
  alt: string;
  position: string;
}

export const careerPrinciples: CareerPrinciple[] = [
  {
    number: '01',
    title: 'Learn',
    description: 'Grow your skills through real projects, continuous learning, and practical exposure.',
    variant: 'light',
  },
  {
    number: '02',
    title: 'Build',
    description: 'Contribute to meaningful projects, solve real challenges, and turn ideas into practical solutions.',
    variant: 'blue',
  },
  {
    number: '03',
    title: 'Grow',
    description: 'Take on new responsibilities, expand your capabilities, and build a career with continuous opportunities to progress.',
    variant: 'soft',
  },
];

export const careerJobs: CareerJob[] = [
  {
    id: 1,
    slug: 'designer',
    title: 'Designer',
    department: 'Design',
    type: 'Full-time',
    location: 'Pune',
  },
  {
    id: 2,
    slug: 'ai-solutions-intern',
    title: 'AI Solutions Intern',
    department: 'AI Solutions',
    type: 'Internship',
  },
  {
    id: 3,
    slug: 'content-creator',
    title: 'Content Creator',
    department: 'Content',
    type: 'Full-time',
  },
  {
    id: 4,
    slug: 'sales-intern',
    title: 'Sales Intern',
    department: 'Sales',
    type: 'Internship',
  },
];

export const careerPhotos: CareerPhoto[] = [
  {
    id: 'rooftop-gathering',
    src: '/media/careers/team-rooftop-gathering.jpg',
    alt: 'The TechnoEdge team gathered together after a group activity',
    position: 'center 48%',
  },
  {
    id: 'office-celebration',
    src: '/media/careers/team-office-celebration.jpg',
    alt: 'TechnoEdge colleagues celebrating together in the office',
    position: 'center 42%',
  },
  {
    id: 'festive-portrait',
    src: '/media/careers/team-festive-portrait.jpg',
    alt: 'TechnoEdge colleagues in traditional attire during a workplace celebration',
    position: 'center 38%',
  },
  {
    id: 'community-event',
    src: '/media/careers/team-community-event.jpg',
    alt: 'TechnoEdge colleagues together at a community event',
    position: 'center center',
  },
  {
    id: 'rooftop-colleagues',
    src: '/media/careers/team-rooftop-colleagues.jpg',
    alt: 'A group of TechnoEdge colleagues spending time together outdoors',
    position: 'center 38%',
  },
  {
    id: 'festive-women',
    src: '/media/careers/team-festive-women.jpg',
    alt: 'TechnoEdge team members celebrating in traditional attire',
    position: 'center 42%',
  },
  {
    id: 'festive-group',
    src: '/media/careers/team-festive-group.jpg',
    alt: 'The TechnoEdge team posing together during a festive celebration',
    position: 'center 36%',
  },
  {
    id: 'festive-candid',
    src: '/media/careers/team-festive-candid.jpg',
    alt: 'TechnoEdge colleagues sharing a candid moment at the office',
    position: 'center 38%',
  },
  {
    id: 'celebration-selfie',
    src: '/media/careers/team-celebration-selfie.jpg',
    alt: 'TechnoEdge colleagues taking a group selfie during a celebration',
    position: 'center 38%',
  },
  {
    id: 'celebration-women',
    src: '/media/careers/team-celebration-women.jpg',
    alt: 'TechnoEdge team members together at a celebration',
    position: 'center 34%',
  },
  {
    id: 'outdoor-gathering',
    src: '/media/careers/team-outdoor-gathering.jpg',
    alt: 'A large TechnoEdge team gathering outdoors',
    position: 'center center',
  },
  {
    id: 'annual-day',
    src: '/media/careers/team-annual-day.jpg',
    alt: 'TechnoEdge colleagues attending an annual day presentation',
    position: 'center center',
  },
  {
    id: 'pune-office-view',
    src: '/media/careers/pune-office-view.jpg',
    alt: 'A city view from the TechnoEdge office in Pune',
    position: 'center center',
  },
];
