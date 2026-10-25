import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AppIcon } from '../../../shared/components/app-icon/app-icon';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, RouterLink, AppIcon],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLogin {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected email = '';
  protected password = '';
  protected submitting = signal(false);
  protected errorMessage = signal<string | null>(null);

  submit(): void {
    if (this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigateByUrl('/admin');
      },
      error: (error: unknown) => {
        const fallback = 'Sign-in failed. Check your details and try again.';
        const message = (error as { error?: { message?: string } })?.error?.message ?? fallback;

        this.submitting.set(false);
        this.errorMessage.set(message);
      },
    });
  }
}
