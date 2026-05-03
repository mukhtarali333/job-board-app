import { inject, Injectable, signal } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User } from 'firebase/auth';
import { from, Observable } from 'rxjs';
import { AppUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);

  currentUser = signal<AppUser | null>(null);
  isLoading = signal<boolean>(true);

  user$: Observable<User | null> = user(this.auth);

  constructor() {debugger
    this.user$.subscribe(fireBaseUser => {
      console.log("auth service constructor")
      if(fireBaseUser) {
        this.currentUser.set({
          uid: fireBaseUser.uid,
          email: fireBaseUser.email,
          displayName: fireBaseUser.displayName,
          photoUrl: fireBaseUser.photoURL
        });
      }
      else{
        this.currentUser.set(null);
      }
      this.isLoading.set(false);
    })
  }

  register(email: string, password: string, displayName: string) {
    return from(
      createUserWithEmailAndPassword(this.auth,email, password)
      .then(async (credential) => {
        await updateProfile(credential.user, {displayName});
        return credential;
      })
    )
  }

  login(email: string, password: string) {debugger
    return from(signInWithEmailAndPassword(this.auth,email,password));
  }

  logout() {
    return from(signOut(this.auth));
  }

  isLoggedIn():boolean {
    return this.auth.currentUser !== null;
  }

}
