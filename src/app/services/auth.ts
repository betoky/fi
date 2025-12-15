import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { isAuthApiError, VerifyOtpParams } from '@supabase/supabase-js';
import { Supabase } from './supabase';
import { AutocompleteCategories } from './expense/autocomplete-categories';
import { Home } from './home';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private supabase = inject(Supabase).getInstance();
  private router = inject(Router);
  private autoComleteCategories = inject(AutocompleteCategories);
  private home = inject(Home);
  private user = inject(User);

  private authenticated = new BehaviorSubject<boolean | undefined>(undefined);

  isAuthenticated$ = this.authenticated.asObservable().pipe(filter((auth) => auth !== undefined));

  constructor() {
    this.supabase.auth.onAuthStateChange((_, session) => {
      console.log(_, session);
      const isAuthenticated = session ? true : false;
      this.authenticated.next(isAuthenticated);
      if (isAuthenticated) {
        this.syncHome();
        this.syncUser();
      } else {
        this.home.instance.set(undefined);
        this.user.instance.set(undefined);
        this.autoComleteCategories.reset();
      }
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

  private syncUser() {
    this.user.getUser()
      .then(user => this.user.instance.set(user))
      .catch(() => this.user.instance.set(undefined));
  }

  private syncHome() {
    this.home.getHome()
      .then(data => this.home.instance.set(data))
      .catch(() => this.home.instance.set(undefined));
  }
}
