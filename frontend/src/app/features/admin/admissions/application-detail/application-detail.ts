import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AdmissionService, AdmissionApplication } from '../../../public/apply/admission.service';
import { AppIcon, IconName } from '../../../../shared/components/app-icon/app-icon';

type PrintTemplate = 'classic' | 'modern' | 'compact' | 'detailed';

interface TemplateOption {
  readonly id: PrintTemplate;
  readonly label: string;
  readonly description: string;
  readonly icon: IconName;
}

@Component({
  selector: 'app-application-detail',
  imports: [RouterLink, AppIcon],
  templateUrl: './application-detail.html',
  styleUrl: './application-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly admissionService = inject(AdmissionService);

  private readonly applicationId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
    { initialValue: null },
  );

  protected readonly application = signal<AdmissionApplication | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly selectedTemplate = signal<PrintTemplate>('classic');

  protected readonly templates: readonly TemplateOption[] = [
    {
      id: 'classic',
      label: 'Classic form',
      description: 'Traditional bordered paper form layout.',
      icon: 'file-text',
    },
    {
      id: 'modern',
      label: 'Modern',
      description: 'Clean two-column layout with grouped sections.',
      icon: 'layout-dashboard',
    },
    {
      id: 'compact',
      label: 'Compact',
      description: 'Single-page summary for quick filing.',
      icon: 'bookmark',
    },
    {
      id: 'detailed',
      label: 'Detailed',
      description: 'Full record with documents and review status.',
      icon: 'clipboard-list',
    },
  ];

  constructor() {
    this.loadApplication();
  }

  protected loadApplication(): void {
    const id = this.applicationId();
    if (!id) {
      this.loading.set(false);
      this.error.set('Application reference is missing.');
      return;
    }

    this.admissionService.getApplication(id).subscribe({
      next: (application) => {
        this.application.set(application);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.error.set(
          (err as { error?: { message?: string } })?.error?.message ||
            'Failed to load the application.',
        );
      },
    });
  }

  protected selectTemplate(template: PrintTemplate): void {
    this.selectedTemplate.set(template);
  }

  protected print(): void {
    window.print();
  }

  protected classLabel(value: string): string {
    const labels: Record<string, string> = {
      PG: 'Play Group (PG)',
      NURSERY: 'Nursery',
      PREP: 'Prep',
      GRADE_1: 'Class 1',
      GRADE_2: 'Class 2',
      GRADE_3: 'Class 3',
      GRADE_4: 'Class 4',
      GRADE_5: 'Class 5',
      GRADE_6: 'Class 6',
      GRADE_7: 'Class 7',
      GRADE_8: 'Class 8',
    };
    return labels[value] ?? value;
  }

  protected templateLabel(value: string): string {
    const labels: Record<string, string> = {
      NEW: 'New admission',
      RE_ADMISSION: 'Re-admission',
      SIBLING: 'Sibling admission',
      TRANSFER: 'Transfer admission',
    };
    return labels[value] ?? value;
  }

  protected genderLabel(value: string): string {
    const labels: Record<string, string> = {
      MALE: 'Male',
      FEMALE: 'Female',
      OTHER: 'Other',
    };
    return labels[value] ?? value;
  }

  protected statusLabel(value: string): string {
    const labels: Record<string, string> = {
      SUBMITTED: 'Submitted',
      UNDER_REVIEW: 'Under review',
      ACCEPTED: 'Accepted',
      REJECTED: 'Rejected',
      WAITLISTED: 'Waitlisted',
    };
    return labels[value] ?? value;
  }

  protected formatDate(value: string | null): string {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
