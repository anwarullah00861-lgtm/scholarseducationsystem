import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../../../shared/components/app-icon/app-icon';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, AppIcon],
  template: `
    <section class="not-found">
      <div class="not-found__pattern" aria-hidden="true"></div>
      <div class="container not-found__inner">
        <p class="not-found__code">404</p>
        <p class="eyebrow eyebrow--light">Page not found</p>
        <h1>This page is not on the shelf.</h1>
        <p>
          The link may be out of date, or the page may not be published yet. Use the links below to
          get back to the school website.
        </p>
        <div class="not-found__actions">
          <a class="btn btn--accent" routerLink="/">
            Back to home
            <app-icon name="arrow-right" [size]="17" />
          </a>
          <a class="btn btn--ghost" routerLink="/contact">Contact the school</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .not-found {
      position: relative;
      display: flex;
      min-height: 68vh;
      overflow: hidden;
      align-items: center;
      background:
        radial-gradient(circle at 20% 10%, rgba(216, 180, 90, 0.15), transparent 32%),
        linear-gradient(145deg, var(--ses-deep), var(--ses-deep-2));
      color: var(--ses-deep-text);
    }

    .not-found__pattern {
      position: absolute;
      inset: 0;
      opacity: 0.24;
      background-image: radial-gradient(rgba(255, 255, 255, 0.22) 1px, transparent 1px);
      background-size: 1.7rem 1.7rem;
      mask-image: linear-gradient(120deg, black, transparent 65%);
    }

    .not-found__inner {
      position: relative;
      z-index: 1;
      padding-block: 5rem;
    }

    .not-found__code {
      color: rgba(255, 255, 255, 0.08);
      font-family: var(--ses-font-display);
      font-size: clamp(7rem, 20vw, 15rem);
      font-weight: 550;
      letter-spacing: -0.06em;
      line-height: 0.8;
    }

    .not-found h1 {
      max-width: 36rem;
      margin-top: 0.8rem;
      color: var(--ses-deep-text);
      font-size: clamp(2.2rem, 5vw, 3.5rem);
    }

    .not-found__inner > p:not(.not-found__code, .eyebrow) {
      max-width: 34rem;
      margin-top: 1rem;
      color: var(--ses-deep-muted);
      font-size: var(--ses-text-base);
      line-height: 1.75;
    }

    .not-found__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.7rem;
      margin-top: 1.8rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {}
