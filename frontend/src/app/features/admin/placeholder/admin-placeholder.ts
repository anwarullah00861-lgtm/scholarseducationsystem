import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon, IconName } from '../../../shared/components/app-icon/app-icon';

@Component({
  selector: 'app-admin-placeholder',
  imports: [RouterLink, AppIcon],
  template: `
    <div class="module-page">
      <section class="module-head">
        <span class="module-head__icon"><app-icon [name]="icon()" [size]="28" /></span>
        <div class="module-head__copy">
          <span class="chip chip--accent">{{ phase() }}</span>
          <h2>{{ title() }}</h2>
          <p>{{ description() }}</p>
        </div>
      </section>

      <div class="module-grid">
        <section class="module-panel">
          <div class="empty-state">
            <span class="empty-state__icon"><app-icon name="clock" [size]="26" /></span>
            <p class="empty-state__eyebrow">Planned module</p>
            <h3>{{ title() }} is planned for {{ phase() }}.</h3>
            <p>
              This route is part of the Phase 1 admin shell so the navigation and layout can be
              reviewed. No records can be created, edited or deleted here yet.
            </p>
          </div>

          <div class="feature-block">
            <h4>Planned capabilities</h4>
            <ul>
              @for (feature of features(); track feature) {
                <li>
                  <app-icon name="circle-check" [size]="16" />
                  <span>{{ feature }}</span>
                </li>
              }
            </ul>
          </div>

          <div class="module-note">
            <app-icon name="shield-check" [size]="18" />
            <p>
              This module will be protected by authentication and role-based permissions before any
              school data is connected.
            </p>
          </div>
        </section>

        <aside class="side-panel">
          <h3>Phase 1 status</h3>
          <p>
            The layout, navigation, theme support and route structure are complete. Module
            functionality is intentionally deferred.
          </p>
          <div class="side-panel__status">
            <span>Route</span>
            <strong>Ready</strong>
          </div>
          <div class="side-panel__status">
            <span>Data</span>
            <strong>Not connected</strong>
          </div>
          <div class="side-panel__status">
            <span>Access control</span>
            <strong>Phase 2</strong>
          </div>
          <a class="btn btn--outline btn--sm" routerLink="/admin">
            <app-icon name="arrow-right" [size]="15" />
            Back to dashboard
          </a>
        </aside>
      </div>
    </div>
  `,
  styles: `
    .module-page {
      display: flex;
      max-width: 1100px;
      flex-direction: column;
      gap: 1rem;
      margin-inline: auto;
    }

    .module-head {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: clamp(1.2rem, 2.5vw, 1.8rem);
      border: 1px solid var(--ses-border);
      border-radius: var(--ses-radius-lg);
      background:
        radial-gradient(circle at 100% 0, var(--ses-accent-soft), transparent 35%),
        var(--ses-surface);
      box-shadow: var(--ses-shadow-sm);
    }

    .module-head__icon {
      display: inline-flex;
      width: 3.6rem;
      height: 3.6rem;
      flex: 0 0 auto;
      align-items: center;
      justify-content: center;
      border-radius: var(--ses-radius-md);
      background: var(--ses-primary);
      color: var(--ses-primary-contrast);
    }

    .module-head h2 {
      margin-top: 0.5rem;
      font-size: clamp(1.4rem, 2.5vw, 1.9rem);
    }

    .module-head p {
      max-width: 42rem;
      margin-top: 0.35rem;
      color: var(--ses-muted);
      font-size: var(--ses-text-sm);
      line-height: 1.65;
    }

    .module-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      align-items: start;
    }

    .module-panel,
    .side-panel {
      padding: 1.3rem;
      border: 1px solid var(--ses-border);
      border-radius: var(--ses-radius-md);
      background: var(--ses-surface);
      box-shadow: var(--ses-shadow-sm);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.6rem 1rem 1.8rem;
      border: 1px dashed var(--ses-border-strong);
      border-radius: var(--ses-radius-md);
      background: var(--ses-surface-2);
      text-align: center;
    }

    .empty-state__icon {
      display: inline-flex;
      width: 3.5rem;
      height: 3.5rem;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.8rem;
      border-radius: 50%;
      background: var(--ses-surface);
      color: var(--ses-muted);
    }

    .empty-state__eyebrow {
      color: var(--ses-accent-strong);
      font-size: 0.6rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .empty-state h3 {
      margin-top: 0.3rem;
      font-family: var(--ses-font-sans);
      font-size: 1rem;
      font-weight: 780;
    }

    .empty-state > p:last-child {
      max-width: 30rem;
      margin-top: 0.35rem;
      color: var(--ses-muted);
      font-size: 0.72rem;
      line-height: 1.6;
    }

    .feature-block {
      margin-top: 1.3rem;
      padding-top: 1.1rem;
      border-top: 1px solid var(--ses-border);
    }

    .feature-block h4 {
      font-family: var(--ses-font-sans);
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .feature-block ul {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
      gap: 0.55rem;
      margin-top: 0.75rem;
    }

    .feature-block li {
      display: flex;
      align-items: flex-start;
      gap: 0.4rem;
      color: var(--ses-muted);
      font-size: 0.73rem;
      line-height: 1.5;
    }

    .feature-block app-icon {
      margin-top: 0.08rem;
      color: var(--ses-primary);
    }

    .module-note {
      display: flex;
      align-items: flex-start;
      gap: 0.55rem;
      margin-top: 1.3rem;
      padding: 0.8rem;
      border: 1px solid var(--ses-border);
      border-radius: var(--ses-radius-sm);
      background: var(--ses-surface-2);
      color: var(--ses-muted);
      font-size: 0.68rem;
      line-height: 1.5;
    }

    .module-note app-icon {
      margin-top: 0.08rem;
      color: var(--ses-primary);
    }

    .side-panel h3 {
      font-family: var(--ses-font-sans);
      font-size: 0.9rem;
      font-weight: 780;
    }

    .side-panel > p {
      margin-top: 0.35rem;
      color: var(--ses-muted);
      font-size: 0.7rem;
      line-height: 1.55;
    }

    .side-panel__status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding-block: 0.55rem;
      border-bottom: 1px solid var(--ses-border);
      font-size: 0.68rem;
    }

    .side-panel__status span {
      color: var(--ses-muted);
    }

    .side-panel__status strong {
      color: var(--ses-text);
      font-weight: 700;
    }

    .side-panel .btn {
      width: 100%;
      margin-top: 1rem;
    }

    @media (min-width: 56rem) {
      .module-grid {
        grid-template-columns: minmax(0, 1.6fr) minmax(16rem, 1fr);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPlaceholder {
  readonly title = input('Admin module');
  readonly description = input('This module is part of the planned admin workspace.');
  readonly phase = input('a future phase');
  readonly icon = input<IconName>('layout-dashboard');
  readonly features = input<readonly string[]>([]);
}
