import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobService } from '../../../core/services/jobService';
import { Job } from '../../../core/models/job.model';
import { SavedJobsService } from '../../../core/services/saved-jobs-service';

@Component({
  selector: 'app-jobs-detail',
  imports: [CommonModule],
  templateUrl: './jobs-detail.html',
  styleUrl: './jobs-detail.scss',
})
export class JobsDetail {
  private jobService = inject(JobService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  savedJobsService = inject(SavedJobsService);

  job = signal<Job | null>(null);
  similarJobs = signal<Job[]>([]);
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);
  notFound = signal<boolean>(false);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!id) {
        this.notFound.set(true);
        this.isLoading.set(false);
        return;
      }
      this.loadJob(id);
    });
  }

  loadJob(id: number) {
    this.isLoading.set(true);
    this.notFound.set(false);
    this.hasError.set(false);

    this.jobService.getJobById(id).subscribe({
      next: (job) => {
        if (!job) {
          this.notFound.set(true);
          this.isLoading.set(false);
          return;
        }
        this.job.set(job);
        this.isLoading.set(false);
        this.loadSimilar(job.category, job.id);
      },
      error: () => { this.hasError.set(true); this.isLoading.set(false); }
    });
  }

  loadSimilar(category: string, excludeId: number) {
    this.jobService.getSimilarJobs(category, excludeId, 4).subscribe({
      next: (jobs) => this.similarJobs.set(jobs)
    });
  }

  goBack() { this.router.navigate(['/jobs']); }

  onSimilarClick(id: number) {
    this.router.navigate(['/jobs', id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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
