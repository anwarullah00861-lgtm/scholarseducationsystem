import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  viewChild,
  ElementRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  type ChartConfiguration,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { ThemeService } from '../../../core/services/theme.service';
import { AppIcon, IconName } from '../../../shared/components/app-icon/app-icon';
import { StatCard } from '../../../shared/components/stat-card/stat-card';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface DashboardStat {
  readonly icon: IconName;
  readonly value: string;
  readonly label: string;
  readonly note: string;
  readonly badge?: string;
  readonly tone?: 'default' | 'accent' | 'positive';
}

interface QuickAction {
  readonly label: string;
  readonly description: string;
  readonly icon: IconName;
  readonly path: string;
}

interface ReadinessItem {
  readonly label: string;
  readonly detail: string;
  readonly status: 'ready' | 'planned';
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, AppIcon, StatCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboard {
  private readonly theme = inject(ThemeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly chartCanvas =
    viewChild.required<ElementRef<HTMLCanvasElement>>('enrollmentChart');
  private chart?: Chart;

  protected readonly stats: readonly DashboardStat[] = [
    {
      icon: 'users',
      value: '—',
      label: 'Enrolled students',
      note: 'Student records will connect in Phase 3.',
      badge: 'No data',
    },
    {
      icon: 'user-plus',
      value: '—',
      label: 'Admission applications',
      note: 'Online admissions arrive in Phase 3.',
      badge: 'No data',
    },
    {
      icon: 'graduation-cap',
      value: '11',
      label: 'Class levels',
      note: 'PG, Nursery, Prep and Classes 1–8.',
      badge: 'Configured',
      tone: 'accent',
    },
    {
      icon: 'library',
      value: '0',
      label: 'Published resources',
      note: 'PDF library is ready for Phase 4 uploads.',
      badge: 'Current',
    },
  ];

  protected readonly quickActions: readonly QuickAction[] = [
    {
      label: 'Review admissions',
      description: 'Applications, templates and status',
      icon: 'user-plus',
      path: '/admin/admissions',
    },
    {
      label: 'Manage website content',
      description: 'Pages, notices and announcements',
      icon: 'file-text',
      path: '/admin/content',
    },
    {
      label: 'Publish a resource',
      description: 'Textbooks, syllabus and curriculum',
      icon: 'library',
      path: '/admin/resources',
    },
    {
      label: 'Configure media',
      description: 'Videos and official social links',
      icon: 'play',
      path: '/admin/media',
    },
  ];

  protected readonly readiness: readonly ReadinessItem[] = [
    {
      label: 'Foundation & design system',
      detail: 'Tokens, responsive layout, shared components',
      status: 'ready',
    },
    {
      label: 'Public website shell',
      detail: 'Navigation, pages, light / dark / system themes',
      status: 'ready',
    },
    {
      label: 'Admin workspace shell',
      detail: 'Sidebar, topbar, dashboard and module routes',
      status: 'ready',
    },
    {
      label: 'Authentication & roles',
      detail: 'NestJS, PostgreSQL, JWT and RBAC',
      status: 'planned',
    },
    {
      label: 'Live school data',
      detail: 'Admissions, students, resources and exams',
      status: 'planned',
    },
  ];

  constructor() {
    afterNextRender(() => this.renderChart());

    effect(() => {
      // Re-theme the chart when the resolved light/dark theme changes.
      this.theme.resolved();
      if (this.chart) {
        this.renderChart();
      }
    });

    this.destroyRef.onDestroy(() => this.chart?.destroy());
  }

  private renderChart(): void {
    const canvas = this.chartCanvas().nativeElement;
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    this.chart?.destroy();

    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue('--ses-accent').trim() || '#b8861b';
    const muted = styles.getPropertyValue('--ses-muted').trim() || '#5d6b65';
    const border = styles.getPropertyValue('--ses-border').trim() || '#ded6c6';
    const fontFamily = styles.getPropertyValue('--ses-font-sans').trim() || 'Manrope, sans-serif';

    const gradient = context.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, accent);
    gradient.addColorStop(1, 'rgba(14, 74, 62, 0.16)');

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [
          {
            label: 'Sample admission enquiries',
            data: [18, 24, 21, 32, 39, 46],
            backgroundColor: gradient,
            borderRadius: 6,
            borderSkipped: false,
            maxBarThickness: 38,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#082b24',
            titleColor: '#f3f7f2',
            bodyColor: '#c8dbd3',
            padding: 10,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: (item) => `${item.parsed.y} enquiries (sample)`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: muted, font: { family: fontFamily, size: 11 } },
          },
          y: {
            beginAtZero: true,
            border: { display: false },
            grid: { color: border },
            ticks: {
              color: muted,
              font: { family: fontFamily, size: 11 },
              stepSize: 10,
            },
          },
        },
      },
    };

    this.chart = new Chart(canvas, config);
  }
}
