import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;
}
