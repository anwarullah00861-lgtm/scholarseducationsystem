import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FOOTER_NAV, SITE } from '../../../core/config/site.config';
import { AppIcon } from '../../../shared/components/app-icon/app-icon';
import { Logo } from '../../../shared/components/logo/logo';

@Component({
  selector: 'app-public-footer',
  imports: [RouterLink, AppIcon, Logo],
  template: `
    <footer class="site-footer">
      <div class="container site-footer__grid">
        <div class="site-footer__brand">
          <app-logo variant="light" />
          <p class="site-footer__tagline">{{ site.tagline }}</p>
          <p class="site-footer__about">
            A PG to Class 8 school in Miran Shah, built around strong foundations, thoughtful
            teaching and character that lasts.
          </p>
          <p class="site-footer__location">
            <app-icon name="map-pin" [size]="16" />
            <span>{{ site.location }}</span>
          </p>
        </div>

        <nav class="site-footer__column" aria-label="School links">
          <h2>School</h2>
          @for (item of nav.school; track item.path) {
            <a [routerLink]="item.path">{{ item.label }}</a>
          }
          <a routerLink="/admissions">Admission information</a>
        </nav>

        <nav class="site-footer__column" aria-label="Explore links">
          <h2>Explore</h2>
          @for (item of nav.explore; track item.path) {
            <a [routerLink]="item.path">{{ item.label }}</a>
          }
        </nav>

        <div class="site-footer__column site-footer__contact">
          <h2>Visit or contact</h2>
          <p>{{ site.shortLocation }}</p>
          @if (site.contact.phone) {
            <a [href]="'tel:' + site.contact.phone">
              <app-icon name="phone" [size]="15" />
              {{ site.contact.phone }}
            </a>
          }
          @if (site.contact.email) {
            <a [href]="'mailto:' + site.contact.email">
              <app-icon name="mail" [size]="15" />
              {{ site.contact.email }}
            </a>
          }
          @if (!site.contact.phone && !site.contact.email) {
            <p class="site-footer__pending">
              <app-icon name="info" [size]="15" />
              Contact details will be published once confirmed by the school office.
            </p>
          }
          <a class="site-footer__contact-link" routerLink="/contact">
            Contact page
            <app-icon name="arrow-right" [size]="15" />
          </a>
        </div>
      </div>

      <div class="container site-footer__bottom">
        <p>&copy; {{ year }} {{ site.name }}. All rights reserved.</p>
        <div class="site-footer__bottom-links">
          @for (social of site.socialLinks; track social.href) {
            <a [href]="social.href" target="_blank" rel="noopener noreferrer">
              <app-icon name="share-2" [size]="14" />
              {{ social.label }}
            </a>
          }
          @if (site.whatsappGroupUrl) {
            <a
              [href]="site.whatsappGroupUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="site-footer__whatsapp"
            >
              <app-icon name="message-circle" [size]="14" />
              Join Our WhatsApp Group
            </a>
          }
          <a routerLink="/admin">Administrator access</a>
        </div>
      </div>
    </footer>
  `,
  styles: `
    .site-footer {
      position: relative;
      overflow: hidden;
      padding-top: clamp(3rem, 6vw, 4.5rem);
      background:
        radial-gradient(circle at 85% 10%, rgba(184, 134, 27, 0.12), transparent 30%),
        linear-gradient(150deg, var(--ses-deep), var(--ses-deep-2));
      color: var(--ses-deep-text);
    }

    .site-footer__grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2.2rem;
      padding-bottom: 3rem;
    }

    .site-footer__brand {
      max-width: 23rem;
    }

    .site-footer__tagline {
      margin-top: 0.9rem;
      color: var(--ses-accent);
      font-family: var(--ses-font-display);
      font-size: 1.1rem;
      font-weight: 500;
      letter-spacing: -0.01em;
    }

    .site-footer__about {
      margin-top: 0.55rem;
      color: var(--ses-deep-muted);
      font-size: var(--ses-text-sm);
      line-height: 1.7;
    }

    .site-footer__location {
      display: flex;
      align-items: flex-start;
      gap: 0.45rem;
      margin-top: 1rem;
      color: var(--ses-deep-muted);
      font-size: var(--ses-text-xs);
      line-height: 1.55;
    }

    .site-footer__location app-icon {
      margin-top: 0.1rem;
      color: var(--ses-accent);
    }

    .site-footer__column {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.55rem;
      font-size: var(--ses-text-sm);
    }

    .site-footer__column h2 {
      margin-bottom: 0.3rem;
      color: var(--ses-deep-text);
      font-family: var(--ses-font-sans);
      font-size: 0.7rem;
      font-weight: 750;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    .site-footer__column a {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--ses-deep-muted);
      text-decoration: none;
      transition: color var(--ses-duration) ease;
    }

    .site-footer__column a:hover {
      color: var(--ses-deep-text);
    }

    .site-footer__contact p {
      color: var(--ses-deep-muted);
      line-height: 1.6;
    }

    .site-footer__pending {
      display: flex;
      align-items: flex-start;
      gap: 0.4rem;
      max-width: 19rem;
      font-size: var(--ses-text-xs);
    }

    .site-footer__pending app-icon {
      margin-top: 0.12rem;
      color: var(--ses-accent);
    }

    .site-footer__contact-link {
      margin-top: 0.35rem;
      color: var(--ses-accent) !important;
      font-weight: 700;
    }

    .site-footer__bottom {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
      padding-block: 1.2rem;
      border-top: 1px solid var(--ses-deep-border);
      color: var(--ses-deep-muted);
      font-size: var(--ses-text-xs);
    }

    .site-footer__bottom-links {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
    }

    .site-footer__bottom-links a {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      color: var(--ses-deep-muted);
      text-decoration: none;
    }

    .site-footer__bottom-links a.site-footer__whatsapp {
      color: var(--ses-deep-text);
      font-weight: 700;
    }

    .site-footer__bottom-links a.site-footer__whatsapp:hover {
      color: var(--ses-accent);
    }

    .site-footer__bottom-links a.site-footer__whatsapp app-icon {
      color: var(--ses-accent);
    }

    .site-footer__bottom-links a:hover {
      color: var(--ses-deep-text);
    }

    @media (min-width: 40rem) {
      .site-footer__grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .site-footer__bottom {
        flex-direction: row;
        align-items: center;
      }
    }

    @media (min-width: 64rem) {
      .site-footer__grid {
        grid-template-columns: 1.65fr 0.7fr 0.75fr 1.1fr;
        gap: 2.5rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFooter {
  protected readonly site = SITE;
  protected readonly nav = FOOTER_NAV;
  protected readonly year = new Date().getFullYear();
}
