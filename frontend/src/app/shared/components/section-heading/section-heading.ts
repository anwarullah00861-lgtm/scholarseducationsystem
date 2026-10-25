import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-heading',
  template: `
    <div class="section-heading" [class.section-heading--center]="align() === 'center'">
      @if (eyebrow()) {
        <p class="eyebrow">{{ eyebrow() }}</p>
      }
      <h2>{{ title() }}</h2>
      @if (description()) {
        <p class="lead">{{ description() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: `
    .section-heading {
      max-width: 46rem;
    }

    .section-heading h2 {
      margin-top: 0.7rem;
    }

    .section-heading .lead {
      margin-top: 1rem;
    }

    .section-heading--center {
      margin-inline: auto;
      text-align: center;
    }

    .section-heading--center .eyebrow {
      justify-content: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeading {
  readonly eyebrow = input('');
  readonly title = input.required<string>();
  readonly description = input('');
  readonly align = input<'start' | 'center'>('start');
}
