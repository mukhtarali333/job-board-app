import { inject, Injectable } from '@angular/core';
import { collectionData, docData, Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDoc, query, updateDoc, where } from 'firebase/firestore';
import { from, Observable } from 'rxjs';
import { PostedJob } from '../models/posted-job.model';

@Injectable({
  providedIn: 'root',
})
export class JobPostService {
  private firestore = inject(Firestore);
  private jobCollection = collection(this.firestore, 'jobs');

  getMyJobs(uid: string):Observable<PostedJob[]> {
    const q = query(this.jobCollection, where('postedBy','==',uid));
    return collectionData(q, {idField: 'id'}) as Observable<PostedJob[]>;
  }

  getJobById(id: string): Observable<PostedJob> {
  const jobDoc = doc(this.firestore, 'jobs', id);
  return from(getDoc(jobDoc).then(snap => ({
    id: snap.id,
    ...snap.data()
  } as PostedJob)));
}

  addJob(job: PostedJob) {
    return from(addDoc(this.jobCollection, job));
  }

  updateJob(id: string, job: Partial<PostedJob>) {
    const jobDoc = doc(this.firestore, 'jobs', id);
    return from(updateDoc(jobDoc,job));
  }

  deleteJob(id:string) {
    const jobDoc = doc(this.firestore, 'jobs', id);
    return from(deleteDoc(jobDoc));
  }

}
