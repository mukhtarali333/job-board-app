import { computed, Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'jobboard_saved_jobs';

@Injectable({
  providedIn: 'root',
})


export class SavedJobsService {

  savedIds = signal<Set<number>>(this.loadFromStorage());

  savedCount = computed(() => this.savedIds().size);

  private loadFromStorage(): Set<number> {
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set<number>(arr);
    }
    catch {
      return new Set<number>();
    }
  }

  private saveToStorage(ids: Set<number>) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  }

  isSaved(jobId: number): boolean {
    return this.savedIds().has(jobId);
  }

  toggle(jobId: number) {
    const current = new Set(this.savedIds());
    if(current.has(jobId)){
      current.delete(jobId);
    }
    else {
      current.add(jobId);
    }
    this.savedIds.set(current);
    this.saveToStorage(current);
  }

  getSavedIds():number[] {
    return [...this.savedIds()];
  }
}
