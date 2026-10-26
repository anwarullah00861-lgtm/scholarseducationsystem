import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../../core/config/site.config';
import { AppIcon, IconName } from '../../../shared/components/app-icon/app-icon';
import { PageHero } from '../../../shared/components/page-hero/page-hero';
import { SectionHeading } from '../../../shared/components/section-heading/section-heading';

interface Commitment {
  readonly title: string;
  readonly description: string;
  readonly icon: IconName;
}

@Component({
  selector: 'app-about',
  imports: [RouterLink, AppIcon, PageHero, SectionHeading],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  protected readonly site = SITE;

  protected readonly commitments: readonly Commitment[] = [
    {
      title: 'Purposeful teaching',
      description:
        'Lessons are planned around what students need to know, understand and be able to do next.',
      icon: 'book-open',
    },
    {
      title: 'A calm, orderly environment',
      description:
        'Clear routines and consistent expectations help children feel secure enough to participate.',
      icon: 'school',
    },
    {
      title: 'Honest communication',
      description:
        'Families should know how their child is progressing and what support will help.',
      icon: 'message-circle',
    },
    {
      title: 'Responsibility to others',
      description: 'Respect, service and self-discipline are part of the school’s wider purpose.',
      icon: 'shield-check',
    },
  ];

  protected readonly facts = [
    { label: 'Location', value: 'Miran Shah, Khyber Pakhtunkhwa' },
    { label: `${SITE.registration.authority} Reg. No.`, value: SITE.registration.number },
    { label: 'Managing Director', value: SITE.leadership.managingDirector },
    { label: 'Principal', value: SITE.leadership.principal },
    { label: 'Students', value: `${SITE.facts.studentStrength} enrolled` },
    { label: 'Teaching staff', value: `${SITE.facts.teachingStaff} teachers` },
    { label: 'Non-teaching staff', value: `${SITE.facts.nonTeachingStaff} staff` },
    { label: 'Campus', value: `${SITE.facts.floor} · ${SITE.facts.totalRooms} rooms` },
    { label: 'Enrolment', value: SITE.facts.genderPolicy },
    { label: 'Class levels', value: 'PG to Class 8' },
    { label: 'Assessment', value: 'Midterm and Final examinations' },
    { label: 'Academic year', value: SITE.academicYear },
  ];
}
