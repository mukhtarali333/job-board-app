import { Component, computed, inject, signal } from '@angular/core';
import { JobService } from '../../../core/services/jobService';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Job } from '../../../core/models/job.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jobs-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './jobs-list.html',
  styleUrl: './jobs-list.scss',
})
export class JobsList {
  private jobService = inject(JobService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  allJobs = signal<Job[]>([]);
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);

  searchTerm = signal<string>('');
  locationTerm = signal<string>('');
  selectedCategory = signal<string>('');
  selectedJobType = signal<string>('');
  currentPage = signal<number>(1);
  pageSize = 10;

  categories = this.jobService.getCategories();
  jobTypes = ['full_time', 'part_time', 'contract', 'freelance', 'internship'];

  filteredJobs = computed(() => {
    let jobs = this.allJobs();
    const q = this.searchTerm().toLowerCase().trim();
    const loc = this.locationTerm().toLowerCase().trim();
    const cat = this.selectedCategory();
    const type = this.selectedJobType();

    if (q) {
      jobs = jobs.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company_name.toLowerCase().includes(q)
      );
    }
    if (loc) {
      jobs = jobs.filter(j =>
        j.candidate_required_location.toLowerCase().includes(loc)
      );
    }
    if (cat) {
      jobs = jobs.filter(j => j.category.toLowerCase().includes(cat.toLowerCase()));
    }
    if (type) {
      jobs = jobs.filter(j => j.job_type === type);
    }
    return jobs;
  });

  totalPages = computed(() => Math.ceil(this.filteredJobs().length / this.pageSize));

  paginatedJobs = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredJobs().slice(start, start + this.pageSize);
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) this.searchTerm.set(params['q']);
      if (params['category']) this.selectedCategory.set(params['category']);
    });
    this.loadJobs();
  }

  loadJobs() {
    this.isLoading.set(true);
    this.jobService.getJobs().subscribe({
      next: (jobs) => { this.allJobs.set(jobs); this.isLoading.set(false); },
      error: () => { this.hasError.set(true); this.isLoading.set(false); }
    });
  }

  onFilterChange() { this.currentPage.set(1); }

  clearFilters() {
    this.searchTerm.set('');
    this.locationTerm.set('');
    this.selectedCategory.set('');
    this.selectedJobType.set('');
    this.currentPage.set(1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onJobClick(id: number) { this.router.navigate(['/jobs', id]); }

  formatJobType(type: string): string {
    if (!type) return 'Full Time';
    return type.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    return d.toLocaleDateString();
  }
}
