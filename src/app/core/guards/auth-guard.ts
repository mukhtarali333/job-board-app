import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

export const authGuard: CanActivateFn = (route, state) => {

  const auth = inject(Auth);
  const router = inject(Router);

  return auth.authStateReady().then(() => {
    if(auth.currentUser){
      return true;
    }
  
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url}
    })
  })

};
