import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../../core/config/site.config';
import { AppIcon, IconName } from '../../../shared/components/app-icon/app-icon';
import { Logo } from '../../../shared/components/logo/logo';
import { SectionHeading } from '../../../shared/components/section-heading/section-heading';

interface Pathway {
  readonly label: string;
  readonly detail: string;
  readonly path: string;
}

interface Programme {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly icon: IconName;
  readonly path: string;
}

interface Value {
  readonly title: string;
  readonly description: string;
  readonly icon: IconName;
}

interface Feature {
  readonly title: string;
  readonly description: string;
  readonly icon: IconName;
  readonly path: string;
  readonly linkLabel: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, AppIcon, Logo, SectionHeading],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly pathways: readonly Pathway[] = [
    { label: 'Early Years', detail: 'PG · Nursery · Prep', path: '/academics' },
    { label: 'Primary', detail: 'Classes 1 – 5', path: '/academics' },
    { label: 'Middle', detail: 'Classes 6 – 8', path: '/academics' },
    { label: 'Assessment', detail: 'Midterm & Final', path: '/academics' },
  ];

  protected readonly programmes: readonly Programme[] = [
    {
      eyebrow: 'Early Years',
      title: 'PG, Nursery & Prep',
      description:
        'A warm, structured beginning where children build language, number sense, routine and the confidence to take part.',
      icon: 'sparkles',
      path: '/academics',
    },
    {
      eyebrow: 'Primary',
      title: 'Classes 1 – 5',
      description:
        'Strong literacy and numeracy foundations, paired with curiosity, good study habits and growing independence.',
      icon: 'book-open',
      path: '/academics',
    },
    {
      eyebrow: 'Middle',
      title: 'Classes 6 – 8',
      description:
        'Deeper subject learning, thoughtful assessment and the responsibility students need for the next stage of school.',
      icon: 'graduation-cap',
      path: '/academics',
    },
  ];

  protected readonly values: readonly Value[] = [
    {
      title: 'Foundations that last',
      description:
        'Literacy, numeracy and curiosity are built step by step, with clear expectations at every level.',
      icon: 'book-open',
    },
    {
      title: 'Character in practice',
      description:
        'Respect, responsibility and service are part of school life, not an afterthought.',
      icon: 'shield-check',
    },
    {
      title: 'Families as partners',
      description:
        'Clear communication between school and home helps every learner feel supported.',
      icon: 'users',
    },
    {
      title: 'Ready for what comes next',
      description: 'Study habits, independence and confidence that carry students beyond Class 8.',
      icon: 'arrow-up-right',
    },
  ];

  protected readonly features: readonly Feature[] = [
    {
      title: 'The Iqbal Series',
      description:
        'A dedicated reading section inspired by Allama Iqbal. Confirmed titles will be published after school approval.',
      icon: 'bookmark',
      path: '/iqbal-series',
      linkLabel: 'Explore the series',
    },
    {
      title: 'Digital resource library',
      description:
        'Textbooks, syllabus and curriculum resources, organised for viewing and download in one place.',
      icon: 'library',
      path: '/resources',
      linkLabel: 'Preview the library',
    },
    {
      title: 'School videos & media',
      description:
        'A managed video gallery for school life, events and updates, alongside the school’s social channels.',
      icon: 'play',
      path: '/media',
      linkLabel: 'Visit media',
    },
  ];

  protected readonly promise = [
    'A clear learning pathway from PG to Class 8',
    'Midterm and Final examinations each academic year',
    'A dedicated Iqbal Series reading section',
    'A digital library for textbooks, syllabus and curriculum',
  ];

  protected readonly site = SITE;
}
