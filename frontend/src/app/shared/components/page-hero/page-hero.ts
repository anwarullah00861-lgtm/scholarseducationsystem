import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-hero',
  imports: [RouterLink],
  template: `
    <section class="page-hero">
      <div class="page-hero__glow" aria-hidden="true"></div>
      <div class="page-hero__grid" aria-hidden="true"></div>
      <div class="container page-hero__inner">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a routerLink="/">Home</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{{ title() }}</span>
        </nav>
        @if (eyebrow()) {
          <p class="eyebrow eyebrow--light">{{ eyebrow() }}</p>
        }
        <h1>{{ title() }}</h1>
        @if (description()) {
          <p class="page-hero__description">{{ description() }}</p>
        }
        <ng-content />
      </div>
    </section>
  `,
  styles: `
    .page-hero {
      position: relative;
      overflow: hidden;
      padding-block: clamp(3.5rem, 7vw, 5.5rem) clamp(3rem, 6vw, 5rem);
      background:
        radial-gradient(circle at 15% 10%, rgba(216, 180, 90, 0.14), transparent 34%),
        linear-gradient(140deg, var(--ses-deep), var(--ses-deep-2));
      color: var(--ses-deep-text);
      isolation: isolate;
    }

    .page-hero__glow {
      position: absolute;
      z-index: -1;
      top: -40%;
      right: -10%;
      width: 34rem;
      height: 34rem;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(125, 216, 186, 0.13), transparent 65%);
      filter: blur(12px);
      pointer-events: none;
    }

    .page-hero__grid {
      position: absolute;
      z-index: -1;
      inset: 0;
      opacity: 0.25;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
      background-size: 4.5rem 4.5rem;
      mask-image: linear-gradient(to bottom, black, transparent 78%);
      pointer-events: none;
    }

    .page-hero__inner {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .crumbs {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.6rem;
      color: var(--ses-deep-muted);
      font-size: var(--ses-text-xs);
      font-weight: 650;
      letter-spacing: 0.04em;
    }

    .crumbs a {
      color: var(--ses-deep-muted);
      text-decoration: none;
    }

    .crumbs a:hover {
      color: var(--ses-deep-text);
    }

    .page-hero h1 {
      max-width: 46rem;
      color: var(--ses-deep-text);
    }

    .page-hero__description {
      max-width: 42rem;
      margin-top: 0.35rem;
      color: var(--ses-deep-muted);
      font-size: var(--ses-text-lg);
      line-height: 1.75;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHero {
  readonly eyebrow = input('');
  readonly title = input.required<string>();
  readonly description = input('');
}
