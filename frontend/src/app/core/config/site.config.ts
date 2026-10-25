import { NavItem } from '../models/nav-item';

export interface SocialLink {
  readonly label: string;
  readonly href: string;
  readonly icon: 'facebook' | 'instagram' | 'youtube' | 'whatsapp' | 'other';
}

/**
 * Central site configuration.
 *
 * Contact details, social links and confirmed announcements are intentionally
 * left empty until the school provides them. The UI renders only configured
 * values, so the site never publishes placeholder phone numbers or fake links.
 */
export const SITE = {
  name: 'Scholars Education System',
  shortName: 'Scholars',
  tagline: 'Strong foundations. Confident futures.',
  location: 'Miran Shah, North Waziristan, Khyber Pakhtunkhwa, Pakistan',
  shortLocation: 'Miran Shah, Khyber Pakhtunkhwa',
  academicYear: '2026–27',
  contact: {
    phone: null as string | null,
    email: null as string | null,
    officeHours: null as string | null,
  },
  socialLinks: [] as readonly SocialLink[],
  /** Configurable WhatsApp group invite link for parents and community. */
  whatsappGroupUrl: 'https://chat.whatsapp.com/LldOefPuzIN2blpQXYVu20',
} as const;

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: 'Home', path: '/', exact: true, description: 'Welcome to Scholars' },
  {
    label: 'About',
    path: '/about',
    description: 'Our purpose, values and community',
  },
  {
    label: 'Academics',
    path: '/academics',
    description: 'PG to Class 8 learning pathways',
  },
  {
    label: 'Admissions',
    path: '/admissions',
    description: 'Process, forms and joining information',
  },
  {
    label: 'Resources',
    path: '/resources',
    description: 'Textbooks, syllabus and the digital library',
  },
  {
    label: 'Iqbal Series',
    path: '/iqbal-series',
    description: 'Our dedicated Iqbal reading section',
  },
  {
    label: 'Media',
    path: '/media',
    description: 'School videos and social channels',
  },
  {
    label: 'Contact',
    path: '/contact',
    description: 'Visit or get in touch',
  },
];

export const FOOTER_NAV = {
  school: PRIMARY_NAV.filter((item) => ['/about', '/academics', '/admissions'].includes(item.path)),
  explore: PRIMARY_NAV.filter((item) =>
    ['/resources', '/iqbal-series', '/media', '/contact'].includes(item.path),
  ),
} as const;
