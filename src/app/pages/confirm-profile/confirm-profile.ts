import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { Auth } from '../../services/auth';
import { passwordsMatching } from '../../validators/passwords-matching';
import { User as UserService } from '../../services/user';
import { Home as HomeService } from '../../services/home';
import AuthFormModule from '../../imports/auth-form';

@Component({
  selector: 'app-cofirm-profile',
  imports: [ReactiveFormsModule, ...AuthFormModule],
  templateUrl: './confirm-profile.html',
})
export class ConfirmProfile implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(Auth);
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private homeService = inject(HomeService);

  protected isInvited: boolean;

  protected user = signal<User | undefined>(undefined);

  protected isLoading = signal(false);
  protected registrationForm = this.fb.nonNullable.group(
    {
      name: ['', Validators.required],
      home: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
      confirm: ['', Validators.required],
    },
    { validators: passwordsMatching }
  );

  get name() {
    return this.registrationForm.get('name')!;
  }

  get home() {
    return this.registrationForm.get('home')!;
  }

  get password() {
    return this.registrationForm.get('password')!;
  }

  get confirm() {
    return this.registrationForm.get('confirm')!;
  }

  constructor() {
    const token = this.route.snapshot.queryParamMap.get('token');
    const type = this.route.snapshot.queryParamMap.get('type');
    this.isInvited = type === 'invite';

    this.auth.isAuthenticated$.pipe(take(1)).subscribe((isAuth) => {
      if (!isAuth && !token) {
        this.router.navigate(['/login'], { replaceUrl: true });
        return;
      }

      this.auth
        .getAuthUser()
        .then((user) => {
          if (user) {
            this.user.set(user);
          }
        })
        .catch((error) => console.debug(error));

      if (token) {
        this.auth
          .verifyOtp({
            token_hash: token,
            type: 'invite',
          })
          .then(({ error, data: { user } }) => {
            if (error || !user) {
              const msgToLogin = "Contacter l'administrateur si vous n'avez pas encore de compte";
              this.router.navigate(['/login', { warn: msgToLogin }], { replaceUrl: true });
              return;
            }
            this.user.set(user);
          });
      }
    });
  }

  async ngOnInit(): Promise<void> {
    const hasProfile = await this.userService.hasProfile();
    const hasHome = await this.homeService.hasHome();

    if (hasHome && hasProfile) {
      this.router.navigate(['/'], { replaceUrl: true });
    }
  }

  async onSubmit() {
    const { id, email } = this.user()!;
    const { name, home, password } = this.registrationForm.getRawValue();
    try {
      this.isLoading.set(true);
      await Promise.all([this.userService.saveUser(id, name), this.homeService.saveHome(id, home)]);
      await this.auth.updatePassword(email!, password);
      await this.auth.logout();
      this.router.navigate(['/login'], { replaceUrl: true });
    } catch (error) {
      console.debug(error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
