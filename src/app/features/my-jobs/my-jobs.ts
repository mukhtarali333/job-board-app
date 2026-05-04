import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { PostedJob } from '../../core/models/posted-job.model';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { JobPostService } from '../../core/services/job-post-service';

@Component({
  selector: 'app-my-jobs',
  imports: [RouterLink],
  templateUrl: './my-jobs.html',
  styleUrl: './my-jobs.scss',
})
export class MyJobs implements OnInit {

  private authService = inject(AuthService);
  private jobPostService = inject(JobPostService);

  isLoading = signal(true);
  jobs = signal<PostedJob[]>([]);
  deletingId = signal<string | null>(null);

  ngOnInit() {
    const user = this.authService.currentUser();
    if(!user) return;

    this.jobPostService.getMyJobs(user.uid).subscribe({
      next: (data) => {
        console.log('Jobs data:', data);
        this.jobs.set(data);
        this.isLoading.set(false)
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false)
      }
    })
  }

  deleteJob(id: string, event: Event) {
    event.stopPropagation();
    if(!confirm('are you sure you want to delete this job')) return;

    this.deletingId.set(id);
    this.jobPostService.deleteJob(id).subscribe({
      next: () => {
        this.jobs.update(list => list.filter(j => j.id !== id));
        this.deletingId.set(null);
      },
      error: (err) => {
        console.log(err);
        this.deletingId.set(null);
      }
    });
  }
}
