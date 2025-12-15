import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import AuthFormModule from '@/imports/auth-form';
import { Auth } from '@/services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ...AuthFormModule],
  templateUrl: './login.html',
})
export class Login {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(Auth);

  protected isLoading = signal(false);

  errorMsg = signal<string | null>(null);
  warningMsg = signal<string | null>(null);

  constructor() {
    const error = this.route.snapshot.paramMap.get('error');
    if (error) {
      this.errorMsg.set(error);
    }
    const warn = this.route.snapshot.paramMap.get('warn');
    if (warn) {
      this.warningMsg.set(warn);
    }
  }

  async onSubmit(event: NgForm) {
    try {
      const { email, password } = event.value;
      this.isLoading.set(true);
      await this.auth.login(email, password);
      this.router.navigate(['/'], { replaceUrl: true });
    } catch (error) {
      if (error instanceof Error) {
        this.errorMsg.set(error.message);
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  reset() {
    this.errorMsg.set(null);
    this.warningMsg.set(null);
  }
}
