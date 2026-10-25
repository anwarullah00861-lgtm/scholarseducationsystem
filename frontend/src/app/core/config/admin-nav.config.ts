import { AdminNavGroup } from '../models/nav-item';

export const ADMIN_NAV: readonly AdminNavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        label: 'Dashboard',
        path: '/admin',
        exact: true,
        icon: 'layout-dashboard',
        description: 'Workspace overview',
      },
    ],
  },
  {
    label: 'Operations',
    items: [
      {
        label: 'Admissions',
        path: '/admin/admissions',
        icon: 'user-plus',
        description: 'Applications and form templates',
      },
      {
        label: 'Students',
        path: '/admin/students',
        icon: 'users',
        description: 'Student records and enrolment',
      },
      {
        label: 'Examinations',
        path: '/admin/examinations',
        icon: 'clipboard-list',
        description: 'Midterm and Final examinations',
      },
    ],
  },
  {
    label: 'Website content',
    items: [
      {
        label: 'Website content',
        path: '/admin/content',
        icon: 'file-text',
        description: 'Pages, announcements and notices',
      },
      {
        label: 'E-books & resources',
        path: '/admin/resources',
        icon: 'library',
        description: 'Textbooks, syllabus and curriculum PDFs',
      },
      {
        label: 'Iqbal Series',
        path: '/admin/iqbal-series',
        icon: 'book-open',
        description: 'Confirmed titles and reading resources',
      },
      {
        label: 'Videos & social',
        path: '/admin/media',
        icon: 'play',
        description: 'Video library and social links',
      },
    ],
  },
  {
    label: 'Insights',
    items: [
      {
        label: 'Reports',
        path: '/admin/reports',
        icon: 'chart-column',
        description: 'Enrolment statistics, growth and school reports',
      },
    ],
  },
  {
    label: 'System',
    items: [
      {
        label: 'Settings',
        path: '/admin/settings',
        icon: 'settings',
        description: 'School profile, users and permissions',
      },
    ],
  },
];
