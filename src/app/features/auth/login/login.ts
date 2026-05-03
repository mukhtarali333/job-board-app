import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = signal<string>('');
  password = signal<string>('');
  errorMsg = signal<string>('');
  isSubmitting = signal<boolean>(false);

  onSubmit() {debugger
    console.log("login submit")
    if(!this.email().trim() || !this.password().trim()) {
      this.errorMsg.set('Please fill all the fields');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMsg.set('');

    this.authService.login(this.email(), this.password()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        console.log("when loggin success")
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        console.log("when loggin error")
        this.isSubmitting.set(false);
        this.errorMsg.set(this.parseError(err.code))
      }
    });
  }

  parseError(code: string): string {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Invalid email or password';
      case 'auth/invalid-email':
        return 'Please enter a valid email';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }

}
