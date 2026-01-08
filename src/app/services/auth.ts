import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { isAuthApiError, VerifyOtpParams } from '@supabase/supabase-js';
import { BehaviorSubject, distinctUntilChanged, filter } from 'rxjs';
import { Supabase } from '@/services/supabase';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private supabase = inject(Supabase).getInstance();
  private router = inject(Router);

  private authenticated = new BehaviorSubject<boolean | undefined>(undefined);

  isAuthenticated$ = this.authenticated.asObservable().pipe(
    distinctUntilChanged(),
    filter((auth) => auth !== undefined)
  );

  constructor() {
    this.supabase.auth.onAuthStateChange((_, session) => {
      console.log(_, session);
      this.authenticated.next(session ? true : false);
    });
  }

  async getAuthUser() {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser();
    if (error) {
      if (error.code === 'user_not_found') {
        await this.logout();
        this.router.navigate(['/login'], { replaceUrl: true });
        return null;
      }
      throw error;
    }

    return user;
  }

  async updatePassword(email: string, password: string) {
    await this.supabase.auth.updateUser({ email, password });
  }

  verifyOtp(params: VerifyOtpParams) {
    return this.supabase.auth.verifyOtp(params);
  }

  async login(email: string, password: string) {
    const { error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (isAuthApiError(error)) {
        if (error.code === 'invalid_credentials') {
          throw new Error('Identifiants de connexion invalides.');
        }
      }
      throw new Error('Vous ne pouvez pas vous connecter.');
    }
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }
}
