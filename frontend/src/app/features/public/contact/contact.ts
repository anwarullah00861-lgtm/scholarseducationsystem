import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../../core/config/site.config';
import { AppIcon } from '../../../shared/components/app-icon/app-icon';
import { PageHero } from '../../../shared/components/page-hero/page-hero';
import { SectionHeading } from '../../../shared/components/section-heading/section-heading';

@Component({
  selector: 'app-contact',
  imports: [RouterLink, AppIcon, PageHero, SectionHeading],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  protected readonly site = SITE;

  protected readonly visitSteps = [
    {
      title: 'Check the latest information',
      description: 'Admission guidance and school updates are published on this website first.',
    },
    {
      title: 'Contact the school office',
      description:
        'Official phone and email details will be added here as soon as they are confirmed.',
    },
    {
      title: 'Visit during school hours',
      description:
        'Families can visit the school office in Miran Shah. Confirmed office hours will be published here.',
    },
  ];
}
