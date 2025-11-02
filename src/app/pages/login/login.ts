import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { MaterialIcon } from '../../components/icons/material-icon/material-icon';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MaterialIcon],
  templateUrl: './login.html',
})
export class Login {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(Auth);

  protected isLoading = signal(false);

  errorMsg?: string;
  warningMsg?: string;

  constructor() {
    const error = this.route.snapshot.paramMap.get('error');
    if (error) {
      this.errorMsg = error;
    }
    const warn = this.route.snapshot.paramMap.get('warn');
    if (warn) {
      this.warningMsg = warn;
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
        this.errorMsg = error.message;
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}
