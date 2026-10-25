import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon, IconName } from '../app-icon/app-icon';

@Component({
  selector: 'app-stat-card',
  imports: [AppIcon],
  template: `
    <article
      class="stat"
      [class.stat--accent]="tone() === 'accent'"
      [class.stat--positive]="tone() === 'positive'"
    >
      <div class="stat__top">
        <span class="stat__icon">
          <app-icon [name]="icon()" [size]="20" />
        </span>
        @if (badge()) {
          <span class="stat__badge">{{ badge() }}</span>
        }
      </div>
      <p class="stat__value">{{ value() }}</p>
      <p class="stat__label">{{ label() }}</p>
      @if (note()) {
        <p class="stat__note">{{ note() }}</p>
      }
    </article>
  `,
  styles: `
    .stat {
      display: flex;
      min-height: 10rem;
      flex-direction: column;
      padding: 1.15rem 1.2rem;
      border: 1px solid var(--ses-border);
      border-radius: var(--ses-radius-md);
      background: var(--ses-surface);
      box-shadow: var(--ses-shadow-sm);
    }

    .stat--accent {
      background: linear-gradient(145deg, var(--ses-primary), var(--ses-primary-strong));
      border-color: transparent;
      color: var(--ses-primary-contrast);
    }

    .stat--accent .stat__icon,
    .stat--accent .stat__value,
    .stat--accent .stat__label {
      color: var(--ses-primary-contrast);
    }

    .stat--accent .stat__icon {
      background: rgba(255, 255, 255, 0.12);
    }

    .stat--accent .stat__note,
    .stat--accent .stat__badge {
      color: var(--ses-deep-muted);
    }

    .stat--positive .stat__value {
      color: var(--ses-success);
    }

    .stat__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .stat__icon {
      display: inline-flex;
      width: 2.4rem;
      height: 2.4rem;
      align-items: center;
      justify-content: center;
      border-radius: var(--ses-radius-sm);
      background: var(--ses-primary-soft);
      color: var(--ses-primary);
    }

    .stat__badge {
      color: var(--ses-muted);
      font-size: 0.65rem;
      font-weight: 750;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .stat__value {
      margin-top: 1rem;
      color: var(--ses-heading);
      font-family: var(--ses-font-display);
      font-size: 2rem;
      font-weight: 600;
      letter-spacing: -0.03em;
      line-height: 1;
    }

    .stat__label {
      margin-top: 0.4rem;
      color: var(--ses-text);
      font-size: var(--ses-text-sm);
      font-weight: 700;
    }

    .stat__note {
      margin-top: auto;
      padding-top: 0.55rem;
      color: var(--ses-muted);
      font-size: var(--ses-text-xs);
      line-height: 1.45;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  readonly icon = input.required<IconName>();
  readonly value = input.required<string>();
  readonly label = input.required<string>();
  readonly note = input('');
  readonly badge = input('');
  readonly tone = input<'default' | 'accent' | 'positive'>('default');
}
