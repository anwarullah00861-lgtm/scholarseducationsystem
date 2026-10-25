import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon, IconName } from '../../../shared/components/app-icon/app-icon';
import { PageHero } from '../../../shared/components/page-hero/page-hero';
import { SectionHeading } from '../../../shared/components/section-heading/section-heading';

interface SeriesArea {
  readonly title: string;
  readonly description: string;
  readonly icon: IconName;
}

interface CurriculumEntry {
  readonly subject: string;
  readonly classes: string;
  readonly status: 'confirmed' | 'planned';
  readonly source?: string;
}

@Component({
  selector: 'app-iqbal-series',
  imports: [RouterLink, AppIcon, PageHero, SectionHeading],
  templateUrl: './iqbal-series.html',
  styleUrl: './iqbal-series.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IqbalSeries {
  protected readonly areas: readonly SeriesArea[] = [
    {
      title: 'Selected readers',
      description:
        'Confirmed Iqbal texts and readers will be organised for classroom and home reading, with clear edition details.',
      icon: 'bookmark',
    },
    {
      title: 'Teacher guidance',
      description:
        'Supporting notes will help teachers connect the reading to language, character and thoughtful discussion.',
      icon: 'book-open',
    },
    {
      title: 'Family reading',
      description:
        'Selected material will be available to view or download so families can read and discuss it together.',
      icon: 'users',
    },
  ];

  /** Afaq Iqbal Series curriculum findings.
   *
   * Confirmed entries are based on publicly listed products from Afaq Publishers
   * (afaq.edu.pk) and verified book listings. Planned entries reflect the
   * school's intended adoption, not yet confirmed by the school office.
   * No copyrighted textbook content or PDFs are reproduced here.
   */
  protected readonly curriculum: readonly CurriculumEntry[] = [
    {
      subject: 'English',
      classes: 'Pre-Nursery, Nursery, KG, Classes 1–8',
      status: 'confirmed',
      source: 'afaq.edu.pk – Iqbal Primary English Series',
    },
    {
      subject: 'Urdu',
      classes: 'Classes 1–8',
      status: 'confirmed',
      source: 'afaq.edu.pk – Iqbal Series Urdu',
    },
    {
      subject: 'Mathematics',
      classes: 'Nursery, KG, Classes 1–8',
      status: 'confirmed',
      source: 'afaq.edu.pk – AFAQ Primary Mathematics Iqbal Series',
    },
    {
      subject: 'Science',
      classes: 'Classes 5–8',
      status: 'confirmed',
      source: 'afaq.edu.pk – Iqbal Series Science',
    },
    {
      subject: 'Social Studies / Mutalia Pakistan',
      classes: 'Classes 5–8',
      status: 'confirmed',
      source: 'afaq.edu.pk – Iqbal Series Social Studies',
    },
    {
      subject: 'Art & Drawing',
      classes: 'Pre-Nursery',
      status: 'confirmed',
      source: 'afaq.edu.pk – Iqbal Series Art & Drawing',
    },
    {
      subject: 'PG level textbooks',
      classes: 'PG (Play Group)',
      status: 'planned',
    },
  ];

  protected readonly afaqSource = 'https://afaq.edu.pk/';
}
