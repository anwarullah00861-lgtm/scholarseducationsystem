import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon, IconName } from '../../../shared/components/app-icon/app-icon';
import { PageHero } from '../../../shared/components/page-hero/page-hero';
import { SectionHeading } from '../../../shared/components/section-heading/section-heading';

interface Stage {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly levels: string;
  readonly description: string;
  readonly focus: readonly string[];
  readonly icon: IconName;
}

@Component({
  selector: 'app-academics',
  imports: [RouterLink, AppIcon, PageHero, SectionHeading],
  templateUrl: './academics.html',
  styleUrl: './academics.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Academics {
  protected readonly stages: readonly Stage[] = [
    {
      id: 'early-years',
      eyebrow: 'Early Years',
      title: 'A confident beginning',
      levels: 'PG · Nursery · Prep',
      description:
        'The earliest years are about security, language and discovery. Children learn routines, listen and speak with confidence, and take their first steps into letters and numbers through guided play and purposeful activity.',
      focus: [
        'Language and listening',
        'Early number sense',
        'Routine and independence',
        'Social confidence',
      ],
      icon: 'sparkles',
    },
    {
      id: 'primary',
      eyebrow: 'Primary',
      title: 'Foundations take shape',
      levels: 'Classes 1 – 5',
      description:
        'Primary school builds fluency and confidence. Students develop stronger reading, writing and mathematical thinking while learning how to work independently, ask good questions and take care of their work.',
      focus: [
        'Reading and writing',
        'Mathematical thinking',
        'Discovery and inquiry',
        'Study habits',
      ],
      icon: 'book-open',
    },
    {
      id: 'middle',
      eyebrow: 'Middle',
      title: 'Ready for the next stage',
      levels: 'Classes 6 – 8',
      description:
        'The middle stage adds depth and responsibility. Students work across broader subject content, organise their learning, respond to feedback and prepare for the demands of secondary education.',
      focus: ['Subject depth', 'Independent study', 'Clear communication', 'Responsibility'],
      icon: 'graduation-cap',
    },
  ];

  protected readonly approach: readonly { title: string; description: string; icon: IconName }[] = [
    {
      title: 'Clear explanations',
      description: 'New ideas are introduced step by step, with examples and guided practice.',
      icon: 'book-open',
    },
    {
      title: 'Useful feedback',
      description: 'Assessment is used to show students what to improve, not only to rank them.',
      icon: 'circle-check',
    },
    {
      title: 'Regular review',
      description: 'Previously learned material is revisited so understanding stays secure.',
      icon: 'clipboard-list',
    },
    {
      title: 'Family communication',
      description: 'Parents receive clear information about progress and how to support learning.',
      icon: 'users',
    },
  ];
}
