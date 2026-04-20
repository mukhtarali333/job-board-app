import { Component, inject, signal } from '@angular/core';
import { JobService } from '../../core/services/jobService';
import { Job } from '../../core/models/job.model';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  private jobService = inject(JobService);
  private router = inject(Router);

  featuredJobs = signal<Job[]>([]);
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);
  searchTerm = signal<string>('');
  categories = this.jobService.getCategories();

  ngOnInit() { this.loadFeaturedJobs(); }

  loadFeaturedJobs() {
    this.isLoading.set(true);
    this.jobService.getFeaturedJobs(6).subscribe({
      next: (jobs) => { this.featuredJobs.set(jobs); this.isLoading.set(false); },
      error: () => { this.hasError.set(true); this.isLoading.set(false); }
    });
  }

  onSearch() {
    if (this.searchTerm().trim()) {
      this.router.navigate(['/jobs'], { queryParams: { q: this.searchTerm() } });
    }
  }

  onCategoryClick(slug: string) {
    this.router.navigate(['/jobs'], { queryParams: { category: slug } });
  }

  onJobClick(id: number) {
    this.router.navigate(['/jobs', id]);
  }

  formatJobType(type: string): string {
    if (!type) return 'Full Time';
    return type.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  }

}
