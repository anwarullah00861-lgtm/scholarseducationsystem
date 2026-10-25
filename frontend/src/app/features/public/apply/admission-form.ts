import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SITE } from '../../../core/config/site.config';
import { AdmissionService } from './admission.service';
import { AppIcon } from '../../../shared/components/app-icon/app-icon';
import { PageHero } from '../../../shared/components/page-hero/page-hero';

interface ClassOption {
  value: string;
  label: string;
}

interface TemplateOption {
  value: string;
  label: string;
  description: string;
}

@Component({
  selector: 'app-admission-form',
  imports: [ReactiveFormsModule, AppIcon, PageHero],
  templateUrl: './admission-form.html',
  styleUrl: './admission-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdmissionForm {
  private readonly fb = inject(FormBuilder);
  private readonly admissionService = inject(AdmissionService);
  private readonly router = inject(Router);

  protected readonly site = SITE;
  protected readonly form: FormGroup;
  protected readonly submitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly classOptions: ClassOption[] = [
    { value: 'PG', label: 'PG (Play Group)' },
    { value: 'NURSERY', label: 'Nursery' },
    { value: 'PREP', label: 'Prep' },
    { value: 'GRADE_1', label: 'Class 1' },
    { value: 'GRADE_2', label: 'Class 2' },
    { value: 'GRADE_3', label: 'Class 3' },
    { value: 'GRADE_4', label: 'Class 4' },
    { value: 'GRADE_5', label: 'Class 5' },
    { value: 'GRADE_6', label: 'Class 6' },
    { value: 'GRADE_7', label: 'Class 7' },
    { value: 'GRADE_8', label: 'Class 8' },
  ];

  protected readonly templateOptions: TemplateOption[] = [
    {
      value: 'NEW',
      label: 'New Admission',
      description: 'First-time application to any class from PG to Class 8.',
    },
    {
      value: 'RE_ADMISSION',
      label: 'Re-admission',
      description: 'For a student returning after a break in enrolment.',
    },
    {
      value: 'SIBLING',
      label: 'Sibling Admission',
      description: 'For another child when a sibling is already enrolled.',
    },
    {
      value: 'TRANSFER',
      label: 'Transfer Admission',
      description: 'For students moving from another school.',
    },
  ];

  constructor() {
    this.form = this.fb.group({
      template: ['NEW', Validators.required],
      appliedClass: ['', Validators.required],
      studentFullName: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
      ],
      fatherFullName: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
      ],
      fatherCNIC: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      dateOfBirth: ['', Validators.required],
      dateOfBirthInWords: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(200)],
      ],
      gender: ['', Validators.required],
      fatherOccupation: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
      ],
      domicile: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      nationality: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      residentialAddress: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(500)],
      ],
      primaryContact: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(20)],
      ],
      alternateContact: ['', [Validators.minLength(5), Validators.maxLength(20)]],
      previousClass: [''],
      previousSchoolName: [''],
      leavingDate: [''],
      consent: [false, Validators.requiredTrue],
    });
  }

  protected get fileFields(): string[] {
    return ['photo', 'cnicCopy', 'domicileCopy', 'schoolLeavingCert'];
  }

  protected onFileChange(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      // Store file reference on the form control as a custom property
      (this.form as any).fileRefs = (this.form as any).fileRefs || {};
      (this.form as any).fileRefs[field] = file;
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const fileRefs = (this.form as any).fileRefs || {};
    const photoFile = fileRefs.photo;

    if (!photoFile) {
      this.error.set('Passport-size photo is required.');
      return;
    }

    const formData = new FormData();
    const value = this.form.value;

    formData.append('template', value.template);
    formData.append('appliedClass', value.appliedClass);
    formData.append('studentFullName', value.studentFullName);
    formData.append('fatherFullName', value.fatherFullName);
    formData.append('fatherCNIC', value.fatherCNIC);
    formData.append('dateOfBirth', value.dateOfBirth);
    formData.append('dateOfBirthInWords', value.dateOfBirthInWords);
    formData.append('gender', value.gender);
    formData.append('fatherOccupation', value.fatherOccupation);
    formData.append('domicile', value.domicile);
    formData.append('nationality', value.nationality);
    formData.append('residentialAddress', value.residentialAddress);
    formData.append('primaryContact', value.primaryContact);

    if (value.alternateContact) {
      formData.append('alternateContact', value.alternateContact);
    }
    if (value.previousClass) {
      formData.append('previousClass', value.previousClass);
    }
    if (value.previousSchoolName) {
      formData.append('previousSchoolName', value.previousSchoolName);
    }
    if (value.leavingDate) {
      formData.append('leavingDate', value.leavingDate);
    }

    formData.append('photo', photoFile);

    if (fileRefs.cnicCopy) {
      formData.append('cnicCopy', fileRefs.cnicCopy);
    }
    if (fileRefs.domicileCopy) {
      formData.append('domicileCopy', fileRefs.domicileCopy);
    }
    if (fileRefs.schoolLeavingCert) {
      formData.append('schoolLeavingCert', fileRefs.schoolLeavingCert);
    }

    this.submitting.set(true);
    this.error.set(null);

    this.admissionService.submitApplication(formData).subscribe({
      next: (application) => {
        this.submitting.set(false);
        this.submitted.set(true);
        this.router.navigate(['/admissions/apply/success'], {
          queryParams: { id: application.id },
        });
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(err.error?.message || 'Application submission failed. Please try again.');
      },
    });
  }

  protected isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  protected getFieldError(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.errors) return '';
    const errors = control.errors as ValidationErrors;
    if (errors['required']) return 'This field is required.';
    if (errors['minlength']) return `Minimum ${errors['requiredLength']} characters required.`;
    if (errors['maxlength']) return `Maximum ${errors['requiredLength']} characters allowed.`;
    if (errors['requiredTrue']) return 'You must consent to proceed.';
    return '';
  }
}
