import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { isAuthApiError, VerifyOtpParams } from '@supabase/supabase-js';
import { Supabase } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private supabase = inject(Supabase).getInstance();
  private router = inject(Router);

  private authenticated = new BehaviorSubject<boolean | undefined>(undefined);

  isAuthenticated$ = this.authenticated.asObservable().pipe(filter((auth) => auth !== undefined));

  constructor() {
    this.supabase.auth.onAuthStateChange((_, session) => {
      this.authenticated.next(session ? true : false);
      console.log(_, session);
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
