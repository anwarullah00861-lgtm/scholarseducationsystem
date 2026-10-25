import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    title: 'Sign in · Scholars Admin',
    loadComponent: () => import('./login/login').then((module) => module.AdminLogin),
  },
  {
    path: '',
    title: 'Dashboard · Scholars Admin',
    loadComponent: () => import('./dashboard/dashboard').then((module) => module.AdminDashboard),
  },
  {
    path: 'admissions',
    title: 'Admissions · Scholars Admin',
    loadComponent: () =>
      import('./admissions/admin-admissions').then((module) => module.AdminAdmissions),
    data: {
      title: 'Admissions',
      description: 'View and manage admission applications submitted through the online portal.',
      phase: 'Phase 3',
      icon: 'user-plus',
      features: [
        'View all applications',
        'Update application status',
        'Secure access to applicant data',
      ],
    },
  },
  {
    path: 'admissions/:id',
    title: 'Application · Scholars Admin',
    loadComponent: () =>
      import('./admissions/application-detail/application-detail').then(
        (module) => module.ApplicationDetail,
      ),
  },
  {
    path: 'students',
    title: 'Students · Scholars Admin',
    loadComponent: () =>
      import('./placeholder/admin-placeholder').then((module) => module.AdminPlaceholder),
    data: {
      title: 'Students',
      description:
        'Student records, class enrolment, profile history and the foundation for school reports.',
      phase: 'Phase 3',
      icon: 'users',
      features: [
        'Student profiles and enrolment records',
        'Class and section assignment',
        'Guardian and contact information',
        'Enrolment statistics by class level',
        'Secure search, filtering and exports',
      ],
    },
  },
  {
    path: 'examinations',
    title: 'Examinations · Scholars Admin',
    loadComponent: () =>
      import('./placeholder/admin-placeholder').then((module) => module.AdminPlaceholder),
    data: {
      title: 'Examinations',
      description:
        'Plan Midterm and Final examinations, record results and publish reports to families.',
      phase: 'Phase 5',
      icon: 'clipboard-list',
      features: [
        'Midterm and Final examination terms',
        'Class and subject result entry',
        'Grade calculation and report cards',
        'Printable and PDF result sheets',
        'Controlled publication to families',
      ],
    },
  },
  {
    path: 'content',
    title: 'Website content · Scholars Admin',
    loadComponent: () =>
      import('./placeholder/admin-placeholder').then((module) => module.AdminPlaceholder),
    data: {
      title: 'Website content',
      description:
        'Manage public pages, announcements, notices and school information without editing code.',
      phase: 'Phase 2',
      icon: 'file-text',
      features: [
        'Editable page content',
        'Announcements and notice scheduling',
        'School profile and contact details',
        'Draft, review and publish workflow',
        'Content audit history',
      ],
    },
  },
  {
    path: 'resources',
    title: 'E-books & resources · Scholars Admin',
    loadComponent: () =>
      import('./placeholder/admin-placeholder').then((module) => module.AdminPlaceholder),
    data: {
      title: 'E-books & resources',
      description:
        'Publish approved textbooks, syllabus and curriculum PDFs for viewing and download.',
      phase: 'Phase 4',
      icon: 'library',
      features: [
        'PDF upload and metadata',
        'Class, subject and term categories',
        'In-browser viewing and downloads',
        'Draft and published states',
        'Storage-safe upload validation',
      ],
    },
  },
  {
    path: 'iqbal-series',
    title: 'Iqbal Series · Scholars Admin',
    loadComponent: () =>
      import('./placeholder/admin-placeholder').then((module) => module.AdminPlaceholder),
    data: {
      title: 'Iqbal Series',
      description:
        'Maintain the Iqbal Series section. Titles remain unpublished until the school confirms them.',
      phase: 'Phase 4',
      icon: 'book-open',
      features: [
        'Confirmed title and edition records',
        'Class-level reading assignments',
        'PDF and cover image attachments',
        'Review before publication',
        'Public visibility controls',
      ],
    },
  },
  {
    path: 'media',
    title: 'Videos & social · Scholars Admin',
    loadComponent: () =>
      import('./placeholder/admin-placeholder').then((module) => module.AdminPlaceholder),
    data: {
      title: 'Videos & social',
      description:
        'Curate school videos and configure the official YouTube, Facebook, WhatsApp and other links.',
      phase: 'Phase 4',
      icon: 'play',
      features: [
        'YouTube and Facebook video records',
        'Featured video selection',
        'Official social link management',
        'Enable or disable links without code',
        'Safe external-link handling',
      ],
    },
  },
  {
    path: 'reports',
    title: 'Reports · Scholars Admin',
    loadComponent: () =>
      import('./placeholder/admin-placeholder').then((module) => module.AdminPlaceholder),
    data: {
      title: 'Reports',
      description:
        'Enrolment statistics, growth charts and school reports generated from live records.',
      phase: 'Phase 5',
      icon: 'chart-column',
      features: [
        'Enrolment trends by class and year',
        'Growth charts with Chart.js',
        'Gender and status breakdowns',
        'Printable school reports',
        'Exportable summaries',
      ],
    },
  },
  {
    path: 'settings',
    title: 'Settings · Scholars Admin',
    loadComponent: () =>
      import('./placeholder/admin-placeholder').then((module) => module.AdminPlaceholder),
    data: {
      title: 'Settings',
      description:
        'School profile, user accounts, roles and the security controls that protect the workspace.',
      phase: 'Phase 2',
      icon: 'settings',
      features: [
        'Role-based access control',
        'User and permission management',
        'School profile and branding',
        'Theme and site preferences',
        'Security and audit settings',
      ],
    },
  },
];
