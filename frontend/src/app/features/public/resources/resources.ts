import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon, IconName } from '../../../shared/components/app-icon/app-icon';
import { PageHero } from '../../../shared/components/page-hero/page-hero';
import { SectionHeading } from '../../../shared/components/section-heading/section-heading';

interface ResourceCategory {
  readonly title: string;
  readonly description: string;
  readonly icon: IconName;
  readonly examples: readonly string[];
}

@Component({
  selector: 'app-resources',
  imports: [RouterLink, AppIcon, PageHero, SectionHeading],
  templateUrl: './resources.html',
  styleUrl: './resources.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Resources {
  protected readonly categories: readonly ResourceCategory[] = [
    {
      title: 'Textbooks',
      description:
        'Class-wise textbook lists and digital copies, organised so families can find the right resource quickly.',
      icon: 'book-open',
      examples: ['Class-wise folders', 'View in browser', 'PDF download'],
    },
    {
      title: 'Syllabus & curriculum',
      description:
        'The school’s syllabus and curriculum guidance, published as clear, printable reference documents.',
      icon: 'clipboard-list',
      examples: ['Stage overviews', 'Term-wise guidance', 'Printable PDFs'],
    },
    {
      title: 'Iqbal Series',
      description:
        'The school’s dedicated Iqbal reading collection, with titles added only after confirmation.',
      icon: 'bookmark',
      examples: ['Confirmed titles', 'Reading resources', 'Teacher guidance'],
    },
  ];

  protected readonly steps = [
    {
      title: 'Authorised staff publish',
      description:
        'Administrators upload approved PDFs and assign them to a category, class level and term.',
    },
    {
      title: 'Families browse',
      description:
        'Resources are organised by category and class, with clear titles, descriptions and file details.',
    },
    {
      title: 'View or download',
      description:
        'PDFs can be opened in the browser or downloaded for offline use, subject to the school’s access settings.',
    },
  ];
}
