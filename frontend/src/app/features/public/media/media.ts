import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../../core/config/site.config';
import { AppIcon, IconName } from '../../../shared/components/app-icon/app-icon';
import { PageHero } from '../../../shared/components/page-hero/page-hero';
import { SectionHeading } from '../../../shared/components/section-heading/section-heading';

interface Channel {
  readonly name: string;
  readonly description: string;
  readonly icon: IconName;
}

@Component({
  selector: 'app-media',
  imports: [RouterLink, AppIcon, PageHero, SectionHeading],
  templateUrl: './media.html',
  styleUrl: './media.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Media {
  protected readonly site = SITE;

  protected readonly channels: readonly Channel[] = [
    {
      name: 'YouTube',
      description: 'Long-form school videos, event highlights and recorded presentations.',
      icon: 'play',
    },
    {
      name: 'Facebook',
      description: 'School updates, photographs and community announcements.',
      icon: 'share-2',
    },
    {
      name: 'WhatsApp',
      description: 'A managed channel for official school communication where enabled.',
      icon: 'message-circle',
    },
    {
      name: 'Other channels',
      description: 'Additional official profiles can be added without changing the website code.',
      icon: 'link',
    },
  ];

  protected readonly upcoming = [
    'School event highlights and campus glimpses',
    'Short updates from classrooms and activities',
    'Recorded talks and parent information sessions',
    'Official social channel links, configured by administrators',
  ];
}
