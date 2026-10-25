import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { ThemePreference, ThemeService } from '../../../core/services/theme.service';
import { AppIcon, IconName } from '../app-icon/app-icon';

interface ThemeOption {
  readonly value: ThemePreference;
  readonly label: string;
  readonly icon: IconName;
}

@Component({
  selector: 'app-theme-toggle',
  imports: [MatMenuModule, AppIcon],
  template: `
    <button
      type="button"
      class="icon-btn theme-trigger"
      [class.theme-trigger--compact]="compact()"
      [matMenuTriggerFor]="themeMenu"
      [attr.aria-label]="'Theme: ' + currentLabel() + '. Change theme'"
      title="Change theme"
    >
      <app-icon [name]="currentIcon()" [size]="18" />
    </button>

    <mat-menu #themeMenu="matMenu" xPosition="before" yPosition="below">
      @for (option of options; track option.value) {
        <button
          mat-menu-item
          type="button"
          role="menuitemradio"
          class="theme-menu-item"
          [attr.aria-checked]="theme.preference() === option.value"
          (click)="theme.setPreference(option.value)"
        >
          <app-icon [name]="option.icon" [size]="18" />
          <span class="theme-menu-label">{{ option.label }}</span>
          @if (theme.preference() === option.value) {
            <span class="theme-menu-check">
              <app-icon name="circle-check" [size]="17" />
            </span>
          }
        </button>
      }
    </mat-menu>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    .theme-trigger {
      background: transparent;
    }

    .theme-trigger--compact {
      width: 1.8rem;
      height: 1.8rem;
      border: 0;
      background: transparent;
    }

    .theme-menu-item {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      min-width: 10.5rem;
    }

    .theme-menu-label {
      flex: 1;
    }

    .theme-menu-check {
      display: inline-flex;
      margin-left: 0.75rem;
      color: var(--ses-primary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  readonly compact = input(false);

  protected readonly theme = inject(ThemeService);

  protected readonly options: readonly ThemeOption[] = [
    { value: 'light', label: 'Light', icon: 'sun' },
    { value: 'dark', label: 'Dark', icon: 'moon' },
    { value: 'system', label: 'System default', icon: 'monitor' },
  ];

  protected readonly currentIcon = computed<IconName>(() => {
    switch (this.theme.preference()) {
      case 'light':
        return 'sun';
      case 'dark':
        return 'moon';
      default:
        return 'monitor';
    }
  });

  protected readonly currentLabel = computed(
    () =>
      this.options.find((option) => option.value === this.theme.preference())?.label ??
      'System default',
  );
}
