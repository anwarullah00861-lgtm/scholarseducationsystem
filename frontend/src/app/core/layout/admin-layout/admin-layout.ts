import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom, map } from 'rxjs';
import { ADMIN_NAV } from '../../config/admin-nav.config';
import { AppIcon } from '../../../shared/components/app-icon/app-icon';
import { Logo } from '../../../shared/components/logo/logo';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [
    MatSidenavModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AppIcon,
    Logo,
    ThemeToggle,
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayout {
  private readonly breakpoint = inject(BreakpointObserver);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  protected readonly navGroups = ADMIN_NAV;
  protected readonly sidenavOpened = signal(true);
  protected readonly compactViewport = toSignal(
    this.breakpoint.observe('(max-width: 1023px)').pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  protected readonly token = this.auth.token;
  protected readonly isAuthenticated = this.auth.isAuthenticated;
  protected readonly user = this.auth.user;

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly currentItem = computed(() => {
    const url = this.currentUrl().split('?')[0];
    const items = this.navGroups.flatMap((group) => group.items);
    return items.find((item) => (item.exact ? url === item.path : url.startsWith(item.path)));
  });

  protected readonly pageTitle = computed(() => this.currentItem()?.label ?? 'Dashboard');
  protected readonly pageDescription = computed(
    () => this.currentItem()?.description ?? 'Scholars Education System workspace',
  );

  protected readonly today = new Intl.DateTimeFormat('en-PK', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  constructor() {
    // Note: an effect that wrote sidenavOpened here created an infinite loop
    // with mat-sidenav's [opened]/(openedChange) two-way binding. The initial
    // value (open on desktop) and the (openedChange) handler are sufficient.
  }

  protected toggleSidebar(): void {
    this.sidenavOpened.update((open) => !open);
  }

  protected closeOnMobile(): void {
    if (this.compactViewport()) {
      this.sidenavOpened.set(false);
    }
  }

  protected async logout(): Promise<void> {
    await firstValueFrom(this.auth.logout());
    void this.router.navigateByUrl('/admin/login');
  }
}
