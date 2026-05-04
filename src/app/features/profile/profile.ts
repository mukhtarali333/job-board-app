import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;

  displayName = signal<string>('');
  isUpdating = signal<boolean>(false);
  successMsg = signal<string>('');
  errorMsg = signal<string>('');

  passwordSuccess = signal<string>('');
  passwordError = signal<string>('');
  currentPassword = signal<string>('');
  newPassword = signal<string>('');
  confirmPassword = signal<string>('');
  isChangingPassword = signal<boolean>(false);


  ngOnInit() {
    const user = this.currentUser();
    if(user?.displayName){
      this.displayName.set(user.displayName);
    }
  }

  updateProfile() {
    if(!this.displayName().trim()) {
      this.errorMsg.set('Name cannot be empty');
      return
    }

    this.isUpdating.set(true);
    this.successMsg.set('');
    this.errorMsg.set('');

    this.authService.updateDisplayName(this.displayName()).subscribe({
      next: () => {
        this.isUpdating.set(false);
        this.successMsg.set('Profile updated successfully!');
        setTimeout(() => {
          this.successMsg.set('');
        }, 3000);
      },
      error: () => {
        this.isUpdating.set(false);
        this.successMsg.set('Failed to update. Please try again.')
      }
    });
  }

  getInitial() {
    const user = this.currentUser();
    const name = user?.displayName || user?.email || '?';
    return name.charAt(0).toUpperCase();
  }

  changePassword() {
    this.passwordSuccess.set('');
    this.passwordError.set('');

    if(!this.currentPassword().trim() || !this.newPassword().trim()) {
      this.passwordError.set('Please fill all the fields');
      return;
    }
    if(this.newPassword().length < 6) {
      this.passwordError.set('New password must be at lease 6 characters');
      return;
    }
    if(this.newPassword() !== this.confirmPassword()) {
      this.passwordError.set('Password do not match');
      return;
    }

    this.isChangingPassword.set(true);
    this.authService.changePassword(this.currentPassword(), this.newPassword()).subscribe({
      next: () => {
        this.isChangingPassword.set(false);
        this.passwordSuccess.set('Password changed successfully!');
        this.currentPassword.set('');
        this.newPassword.set('');
        this.confirmPassword.set('');
        setTimeout(() => this.passwordSuccess.set(''), 3000);
      },
      error: (err) => {
        this.isChangingPassword.set(false);
        this.passwordError.set(this.parsePasswordError(err.code));
      }
    })
  }

  parsePasswordError(code: string): string {
  switch (code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Current password is incorrect';
    case 'auth/weak-password':
      return 'New password is too weak';
    case 'auth/requires-recent-login':
      return 'Please logout and login again, then retry';
    default:
      return 'Something went wrong. Please try again.';
    }
  }
}
