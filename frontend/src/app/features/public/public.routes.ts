import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    title: 'Scholars Education System · Miran Shah',
    loadComponent: () => import('./home/home').then((module) => module.Home),
  },
  {
    path: 'about',
    title: 'About · Scholars Education System',
    loadComponent: () => import('./about/about').then((module) => module.About),
  },
  {
    path: 'academics',
    title: 'Academics · Scholars Education System',
    loadComponent: () => import('./academics/academics').then((module) => module.Academics),
  },
  {
    path: 'admissions',
    title: 'Admissions · Scholars Education System',
    loadComponent: () => import('./admissions/admissions').then((module) => module.Admissions),
  },
  {
    path: 'admissions/apply',
    title: 'Apply for Admission · Scholars Education System',
    loadComponent: () => import('./apply/admission-form').then((module) => module.AdmissionForm),
  },
  {
    path: 'admissions/apply/success',
    title: 'Application Received · Scholars Education System',
    loadComponent: () =>
      import('./apply/application-submitted/application-submitted').then(
        (module) => module.ApplicationSubmitted,
      ),
  },
  {
    path: 'resources',
    title: 'Resource library · Scholars Education System',
    loadComponent: () => import('./resources/resources').then((module) => module.Resources),
  },
  {
    path: 'iqbal-series',
    title: 'Iqbal Series · Scholars Education System',
    loadComponent: () => import('./iqbal-series/iqbal-series').then((module) => module.IqbalSeries),
  },
  {
    path: 'media',
    title: 'Media · Scholars Education System',
    loadComponent: () => import('./media/media').then((module) => module.Media),
  },
  {
    path: 'contact',
    title: 'Contact · Scholars Education System',
    loadComponent: () => import('./contact/contact').then((module) => module.Contact),
  },
];
