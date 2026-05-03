import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');
  errorMsg = signal<string>('');
  isSubmitting = signal<boolean>(false);

  onSubmit() {
    if (!this.name().trim() || !this.email().trim() || !this.password().trim()) {
      this.errorMsg.set('Please fill in all fields');
      return;
    }
    if (this.password().length < 6) {
      this.errorMsg.set('Password must be at least 6 characters');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMsg.set('');

    this.authService.register(this.email(), this.password(), this.name()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMsg.set(this.parseError(err.code));
      }
    });
  }

  parseError(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/invalid-email':
        return 'Please enter a valid email';
      case 'auth/weak-password':
        return 'Password is too weak';
      default:
        return 'Something went wrong. Please try again.';
    }
  }
}
