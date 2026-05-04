import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobService } from '../../core/services/jobService';
import { JobPostService } from '../../core/services/job-post-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post-job',
  imports: [ReactiveFormsModule],
  templateUrl: './post-job.html',
  styleUrl: './post-job.scss',
})
export class PostJob implements OnInit {

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  jobPostService = inject(JobPostService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  errorMsg = signal<string>('');
  isSubmitting = signal<boolean>(false);
  isEditMode = signal(false);
  isLoading = signal(false);
  jobId = signal('');

  jobForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    company: ['', [Validators.required]],
    location: ['', [Validators.required]],
    type: ['Full-time', [Validators.required]],
    salary: [''],
    description: ['', [Validators.required, Validators.minLength(20)]]
  })

  get f() {
    return this.jobForm.controls;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.isEditMode.set(true);
      this.jobId.set(id);
      this.isLoading.set(true);

      this.jobPostService.getJobById(id).subscribe({
        next: (job) => {
          this.jobForm.patchValue({
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.type,
            salary: job.salary,
            description: job.description,
          });
        },
        error: (err) => {
          console.log(err);
          this.errorMsg.set('Failed to load job');
          this.isLoading.set(false);
        }
      })
    }
  }

  submit() {
    if(this.jobForm.invalid) {
      return
    }

    const user = this.authService.currentUser();
    if(!user) return

    this.isSubmitting.set(true);
    this.errorMsg.set('');

    if(this.isEditMode()){
      this.jobPostService.updateJob(this.jobId(), this.jobForm.value as any).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigateByUrl('/my-jobs');
        },
        error: () => {
          this.isSubmitting.set(false);
          this.errorMsg.set("Failed to update job. Try again")
        }
      })
    }
    else {
      const job = {
        ...this.jobForm.value as any,
        postedBy: user.uid,
        postedByEmail: user.email,
        postedAt: new Date(),
      }
  
      this.jobPostService.addJob(job).subscribe({
        next: () => {
          this.isSubmitting.set(true);
          this.router.navigateByUrl('/my-jobs');
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMsg.set('Failed to Post job');
          console.log(err);
        }
      })
    }
    
  }
}
