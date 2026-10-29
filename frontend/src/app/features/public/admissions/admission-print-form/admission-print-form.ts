import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SITE } from '../../../../core/config/site.config';
import { AppIcon } from '../../../../shared/components/app-icon/app-icon';

/**
 * Printable A4 portrait admission form.
 *
 * Renders a blank, print-ready replica of the school's official paper
 * application so families can fill it in by hand. Two controls are offered:
 *
 * - "Print Admission Form" opens the browser print dialog directly.
 * - "Download Admission Form" opens the same dialog where the family picks
 *   "Save as PDF" as the destination (the same approach the admin workspace
 *   uses for "Export PDF" — no extra PDF dependency is shipped to the client).
 *
 * The admissions page links here with `?action=print` / `?action=download`
 * so the dialog opens as soon as the sheet has rendered.
 */
@Component({
  selector: 'app-admission-print-form',
  imports: [AppIcon],
  templateUrl: './admission-print-form.html',
  styleUrl: './admission-print-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdmissionPrintForm {
  protected readonly site = SITE;

  constructor() {
    const action = inject(ActivatedRoute).snapshot.queryParamMap.get('action');
    if (action === 'print' || action === 'download') {
      // Let the logo image and display fonts settle first so the sheet is
      // complete when the print dialog opens.
      setTimeout(() => this.print(), 700);
    }
  }

  protected print(): void {
    window.print();
  }

  protected download(): void {
    // Opens the print dialog; the user chooses "Save as PDF" as destination.
    window.print();
  }
}
