import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AdmissionApplication } from '../admission.service';
import { SITE } from '../../../../core/config/site.config';
import { AppIcon } from '../../../../shared/components/app-icon/app-icon';
import { PageHero } from '../../../../shared/components/page-hero/page-hero';

const STORAGE_KEY = 'ses.lastAdmissionApplication';

@Component({
  selector: 'app-application-submitted',
  imports: [RouterLink, AppIcon, PageHero],
  templateUrl: './application-submitted.html',
  styleUrl: './application-submitted.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationSubmitted {
  private readonly route = inject(ActivatedRoute);

  protected readonly site = SITE;

  protected readonly referenceId = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('id'))),
    { initialValue: null },
  );

  /**
   * The application captured at submit time. It powers the printable A4 copy;
   * without it (fresh visit or cleared storage) only the reference is shown.
   */
  protected readonly application = signal<AdmissionApplication | null>(
    this.readStoredApplication(),
  );

  private readStoredApplication(): AdmissionApplication | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as AdmissionApplication | null;
      if (!parsed || typeof parsed !== 'object' || !parsed.id) {
        return null;
      }
      const referenceId = this.referenceId();
      if (referenceId && parsed.id !== referenceId) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
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
