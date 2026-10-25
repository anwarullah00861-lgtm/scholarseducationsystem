import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  LucideArrowRight,
  LucideArrowUpRight,
  LucideBell,
  LucideBookOpen,
  LucideBookmark,
  LucideCalendarDays,
  LucideChartColumn,
  LucideChevronDown,
  LucideCircleCheck,
  LucideClipboardList,
  LucideClock,
  LucideDatabase,
  LucideDownload,
  LucideDynamicIcon,
  LucideExternalLink,
  LucideEye,
  LucideFileText,
  LucideGlobe,
  LucideGraduationCap,
  LucideHouse,
  LucideImage,
  LucideInfo,
  LucideLaptop,
  LucideLayoutDashboard,
  LucideLibrary,
  LucideLink,
  LucideLock,
  LucideLogOut,
  LucideMail,
  LucideMapPin,
  LucideMenu,
  LucideMessageCircle,
  LucideMonitor,
  LucideMoon,
  LucidePanelLeft,
  LucidePanelLeftClose,
  LucidePhone,
  LucidePlay,
  LucideQuote,
  LucideSchool,
  LucideSearch,
  LucideSettings,
  LucideShare2,
  LucideShieldCheck,
  LucideSparkles,
  LucideSun,
  LucideTriangleAlert,
  LucideUserPlus,
  LucideUsers,
  LucideVideo,
  LucideX,
  type LucideIcon,
} from '@lucide/angular';

const ICONS = {
  'arrow-right': LucideArrowRight,
  'arrow-up-right': LucideArrowUpRight,
  bell: LucideBell,
  'book-open': LucideBookOpen,
  bookmark: LucideBookmark,
  'calendar-days': LucideCalendarDays,
  'chart-column': LucideChartColumn,
  'chevron-down': LucideChevronDown,
  'circle-check': LucideCircleCheck,
  'clipboard-list': LucideClipboardList,
  clock: LucideClock,
  database: LucideDatabase,
  download: LucideDownload,
  'external-link': LucideExternalLink,
  eye: LucideEye,
  'file-text': LucideFileText,
  globe: LucideGlobe,
  'graduation-cap': LucideGraduationCap,
  house: LucideHouse,
  image: LucideImage,
  info: LucideInfo,
  laptop: LucideLaptop,
  'layout-dashboard': LucideLayoutDashboard,
  library: LucideLibrary,
  link: LucideLink,
  lock: LucideLock,
  'log-out': LucideLogOut,
  mail: LucideMail,
  'map-pin': LucideMapPin,
  menu: LucideMenu,
  'message-circle': LucideMessageCircle,
  monitor: LucideMonitor,
  moon: LucideMoon,
  'panel-left': LucidePanelLeft,
  'panel-left-close': LucidePanelLeftClose,
  phone: LucidePhone,
  play: LucidePlay,
  quote: LucideQuote,
  school: LucideSchool,
  search: LucideSearch,
  settings: LucideSettings,
  'share-2': LucideShare2,
  'shield-check': LucideShieldCheck,
  sparkles: LucideSparkles,
  sun: LucideSun,
  'triangle-alert': LucideTriangleAlert,
  'user-plus': LucideUserPlus,
  users: LucideUsers,
  video: LucideVideo,
  x: LucideX,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

@Component({
  selector: 'app-icon',
  imports: [LucideDynamicIcon],
  template: `
    <svg
      [lucideIcon]="glyph()"
      [size]="size()"
      [strokeWidth]="strokeWidth()"
      aria-hidden="true"
      focusable="false"
    ></svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex: 0 0 auto;
      line-height: 0;
      vertical-align: middle;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppIcon {
  readonly name = input.required<IconName>();
  readonly size = input(20);
  readonly strokeWidth = input(1.8);

  protected readonly glyph = computed(() => ICONS[this.name()]);
}
