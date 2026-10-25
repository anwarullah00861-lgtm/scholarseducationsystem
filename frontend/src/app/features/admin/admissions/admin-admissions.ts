import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  AdmissionService,
  AdmissionApplication,
  AdmissionApplicationList,
} from '../../public/apply/admission.service';
import { AppIcon } from '../../../shared/components/app-icon/app-icon';
import { PageHero } from '../../../shared/components/page-hero/page-hero';

@Component({
  selector: 'app-admin-admissions',
  imports: [AppIcon, PageHero],
  templateUrl: './admin-admissions.html',
  styleUrl: './admin-admissions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAdmissions {
  private readonly admissionService = inject(AdmissionService);
  private readonly router = inject(Router);

  protected readonly applications = signal<AdmissionApplication[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly filterStatus = signal<string>('');

  constructor() {
    this.loadApplications();
  }

  protected loadApplications(): void {
    this.loading.set(true);
    this.error.set(null);

    this.admissionService.getApplications(this.filterStatus() || undefined).subscribe({
      next: (result: AdmissionApplicationList) => {
        this.applications.set(result.data);
        this.total.set(result.total);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.error.set(
          (err as { error?: { message?: string } })?.error?.message ||
            'Failed to load applications.',
        );
      },
    });
  }

  protected onStatusFilterChange(status: string): void {
    this.filterStatus.set(status);
    this.loadApplications();
  }

  protected onViewApplication(id: string): void {
    void this.router.navigate(['/admin/admissions', id]);
  }

  protected onUpdateStatus(application: AdmissionApplication, newStatus: string): void {
    this.admissionService.updateStatus(application.id, { status: newStatus }).subscribe({
      next: () => {
        this.loadApplications();
      },
      error: (err: unknown) => {
        this.error.set(
          (err as { error?: { message?: string } })?.error?.message || 'Failed to update status.',
        );
      },
    });
  }

  protected statusLabel(status: string): string {
    const labels: Record<string, string> = {
      SUBMITTED: 'Submitted',
      UNDER_REVIEW: 'Under Review',
      ACCEPTED: 'Accepted',
      REJECTED: 'Rejected',
      WAITLISTED: 'Waitlisted',
    };
    return labels[status] || status;
  }

  protected statusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      SUBMITTED: 'badge-submitted',
      UNDER_REVIEW: 'badge-review',
      ACCEPTED: 'badge-accepted',
      REJECTED: 'badge-rejected',
      WAITLISTED: 'badge-waitlisted',
    };
    return classes[status] || '';
  }

  protected formatDate(dateString: string | null): string {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-PK');
  }
}
