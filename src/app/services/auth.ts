import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { isAuthApiError, VerifyOtpParams } from '@supabase/supabase-js';
import { Supabase } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private supabase = inject(Supabase).getInstance();

  private authenticated = new BehaviorSubject<boolean|undefined>(undefined);

  isAuthenticated$ = this.authenticated.asObservable().pipe(filter(auth => auth !== undefined));

  constructor() {
    this.supabase.auth.onAuthStateChange((_, session) => {
      this.authenticated.next(session ? true : false);
      console.log(_,session);
    })
  }

  getAuthUser() {
    return this.supabase.auth.getUser();
  }

  async updatePassword(email: string, password: string) {
    await this.supabase.auth.updateUser({ email, password });
  }

  verifyOtp(params: VerifyOtpParams) {
    return this.supabase.auth.verifyOtp(params);
  }
  
  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email, password
    })

    if (error) {
      if (isAuthApiError(error)) {
        if (error.code === 'invalid_credentials') {
          throw new Error('Identifiants de connexion invalides.');
        }
      }
        throw new Error('Vous ne pouvez pas vous connecter.')
    }
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    // this.router.navigate(['/login'], { replaceUrl: true });
  }
}
