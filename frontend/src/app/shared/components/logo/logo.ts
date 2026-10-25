import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  template: `
    <a
      class="logo"
      [class.logo--light]="variant() === 'light'"
      [class.logo--sm]="size() === 'sm'"
      [class.logo--lg]="size() === 'lg'"
      [class.logo--xl]="size() === 'xl'"
      [routerLink]="link()"
      [attr.aria-label]="showText() ? null : 'Scholars Education System home'"
    >
      <img
        class="logo__mark"
        src="assets/images/school-logo.jpeg"
        alt="Scholars Education System logo"
        width="64"
        height="64"
        loading="eager"
        decoding="async"
      />

      @if (showText()) {
        <span class="logo__text">
          <span class="logo__name">Scholars</span>
          <span class="logo__sub">Education System</span>
        </span>
      }
    </a>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    .logo {
      display: inline-flex;
      align-items: center;
      gap: 0.7rem;
      color: var(--ses-heading);
      font-family: var(--ses-font-sans);
      text-decoration: none;
    }

    .logo:hover {
      color: var(--ses-heading);
    }

    .logo__mark {
      width: 2.7rem;
      height: 2.7rem;
      flex: 0 0 auto;
      object-fit: contain;
      display: block;
    }

    .logo--sm .logo__mark {
      width: 2.2rem;
      height: 2.2rem;
    }

    .logo--lg .logo__mark {
      width: 3.4rem;
      height: 3.4rem;
    }

    .logo--xl .logo__mark {
      width: clamp(4.5rem, 10vw, 6.4rem);
      height: clamp(4.5rem, 10vw, 6.4rem);
    }

    .logo--xl .logo__name {
      font-size: 2rem;
    }

    .logo--xl .logo__sub {
      font-size: 0.85rem;
    }

    .logo__text {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }

    .logo__name {
      font-size: 1.15rem;
      font-weight: 780;
      letter-spacing: -0.02em;
    }

    .logo__sub {
      margin-top: 0.25rem;
      color: var(--ses-muted);
      font-size: 0.58rem;
      font-weight: 720;
      letter-spacing: 0.17em;
      text-transform: uppercase;
    }

    .logo--light {
      color: var(--ses-deep-text);
    }

    .logo--light:hover {
      color: var(--ses-deep-text);
    }

    .logo--light .logo__sub {
      color: var(--ses-deep-muted);
    }

    @media (prefers-reduced-motion: reduce) {
      .logo__mark {
        animation: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logo {
  readonly variant = input<'default' | 'light'>('default');
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly showText = input(true);
  readonly link = input('/');
}
