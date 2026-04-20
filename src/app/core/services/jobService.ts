import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Job, JobResponse } from '../models/job.model';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  
  private apiUrl = 'https://remotive.com/api/remote-jobs';

  constructor(private http: HttpClient) {}

  getJobs():Observable<Job[]> {
    return this.http.get<JobResponse>(this.apiUrl).pipe(
      map(response => response.jobs)
    );
  }

  getJobById(id: number):Observable<Job | undefined> {
    return this.getJobs().pipe(
      map(jobs => jobs.find(j => j.id === id))
    );
  }

  getSimilarJobs(category: string, excludeId: number, limit: number = 4):Observable<Job[]> {
    return this.getJobs().pipe(
      map(jobs => jobs
        .filter(j => j.category === category && j.id !== excludeId)
        .slice(0, limit)
      )
    )
  }

  getFeaturedJobs(limit: number = 6):Observable<Job[]> {
    return this.http.get<JobResponse>(this.apiUrl).pipe(
      map(response => response.jobs.slice(0,limit))
    );
  }

  getJobsByCategory(category: string):Observable<Job[]> {
    const params = new HttpParams().set('category', category);

    return this.http.get<JobResponse>(this.apiUrl, {params}).pipe(
      map(response => response.jobs)
    );
  }

  searchJobs(searchTerm: string):Observable<Job[]> {
    const params = new HttpParams().set('search', searchTerm);
    return this.http.get<JobResponse>(this.apiUrl, {params}).pipe(
      map(response => response.jobs)
    );
  }

  getCategories(): {name: string; icon: string; slug: string}[] {
    return [
      { name: 'Software Development', icon: '💻', slug: 'software-dev' },
      { name: 'Design', icon: '🎨', slug: 'design' },
      { name: 'Marketing', icon: '📢', slug: 'marketing' },
      { name: 'Customer Service', icon: '🎧', slug: 'customer-support' },
      { name: 'Sales', icon: '💼', slug: 'sales' },
      { name: 'Data', icon: '📊', slug: 'data' },
      { name: 'DevOps', icon: '⚙️', slug: 'devops' },
      { name: 'Writing', icon: '✍️', slug: 'writing' }
    ]
  }
}
