import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { Auth } from '@/services/auth';

export const noAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(Auth).isAuthenticated$.pipe(
    map((isAuth) => {
      if (isAuth) {
        router.navigateByUrl('/');
        return false;
      }
      return true;
    })
  );
};
