import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../../core/config/site.config';
import { AppIcon, IconName } from '../../../shared/components/app-icon/app-icon';
import { PageHero } from '../../../shared/components/page-hero/page-hero';
import { SectionHeading } from '../../../shared/components/section-heading/section-heading';

interface Step {
  readonly title: string;
  readonly description: string;
}

interface FAQ {
  readonly question: string;
  readonly answer: string;
}

@Component({
  selector: 'app-admissions',
  imports: [RouterLink, AppIcon, PageHero, SectionHeading],
  templateUrl: './admissions.html',
  styleUrl: './admissions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Admissions {
  protected readonly site = SITE;

  protected readonly steps: readonly Step[] = [
    {
      title: 'Choose a form template',
      description: 'Select the admission form template that matches your application type.',
    },
    {
      title: 'Complete the application form',
      description: 'Fill in all required details about the student and parent/guardian.',
    },
    {
      title: 'Upload documents',
      description: 'Upload the passport-size photo and optional supporting documents.',
    },
    {
      title: 'Review and submit',
      description: 'Review your application and submit it for school review.',
    },
  ];

  protected readonly faqs: readonly FAQ[] = [
    {
      question: 'Which classes does the school support?',
      answer: 'Scholars Education System covers PG, Nursery, Prep and Classes 1 through 8.',
    },
    {
      question: 'What documents are required?',
      answer:
        "A passport-size photo is required. You may also upload your father's CNIC copy, domicile, and School Leaving Certificate if available.",
    },
    {
      question: 'How can I check my application status?',
      answer:
        'The admissions office will review your application and contact you with the next steps.',
    },
    {
      question: 'Can I apply for multiple children?',
      answer: 'Yes, please submit a separate application for each child.',
    },
  ];
}
