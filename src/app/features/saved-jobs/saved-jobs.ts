import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SavedJobsService } from '../../core/services/saved-jobs-service';
import { Job } from '../../core/models/job.model';
import { JobService } from '../../core/services/jobService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-saved-jobs',
  imports: [],
  templateUrl: './saved-jobs.html',
  styleUrl: './saved-jobs.scss',
})
export class SavedJobs implements OnInit {

  private jobService = inject(JobService);
  savedJobsService = inject(SavedJobsService);
  private router = inject(Router);

  private allFetchedJobs = signal<Job[]>([]);
  isLoading = signal<boolean>(true);

  savedJobs = computed(() => {
    const ids = this.savedJobsService.savedIds();
    return this.allFetchedJobs().filter(j => ids.has(j.id));
  });

  ngOnInit() {
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        this.allFetchedJobs.set(jobs);
        this.isLoading.set(false);
      }
    });
  }

  onJobClick(id: number) {
    this.router.navigate(['/jobs',id]);
  }

  formatJobType(type: string): string {
    if(!type) return 'Full Time';
    return type.split('_').map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }
}
