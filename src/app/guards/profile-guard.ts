import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of, switchMap, combineLatest } from 'rxjs';
import { distinctUntilChanged, map } from "rxjs/operators";
import { Auth } from '../services/auth';
import { User } from '../services/user';
import { Home } from '../services/home';

export const profileGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(Auth);
  const user = inject(User);
  const home = inject(Home);

  return auth.isAuthenticated$.pipe(
    distinctUntilChanged(),
    switchMap((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/login'], { replaceUrl: true });
        return of(false);
      }
      return combineLatest([user.hasProfile$, home.hasHome$]).pipe(
        map(([hasProfile, hasHome]) => {
          if ((hasProfile && !hasHome) || (!hasProfile && hasHome)) {
            auth.logout().then(() => {
              const needVerification =
                "Veuillez contacter l'administrateur pour compléter votre profil.";
              router.navigate(['/login', { error: needVerification }], { replaceUrl: true });
            });
            return false;
          }

          if (hasHome && hasProfile) {
            return true;
          }

          router.navigate(['/confirm'], { replaceUrl: true });
          return false;
        })
      );
    })
  );
};
