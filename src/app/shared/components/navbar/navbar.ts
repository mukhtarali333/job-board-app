import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../../core/services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser
  isMenuOpen = signal(false);
  isDropdownOpen = signal<boolean>(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  toggleDropdown() {
    this.isDropdownOpen.update(v => !v);
  }

  closeDropdown() {
    this.isDropdownOpen.set(false);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.closeDropdown();
        this.router.navigate(['/']);
      }
    });
  }

  getInitial() {
    const user = this.currentUser();
    if(!user) return '?';
    const name = user.displayName || user.email || '?';
    return name.charAt(0).toUpperCase();
  }
}
