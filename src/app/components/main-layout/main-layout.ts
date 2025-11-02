import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLinkActive, Router } from '@angular/router';
import { MaterialIcon } from "../icons/material-icon/material-icon";
import { Auth } from '../../services/auth';
import { User } from '../../services/user';
import { Tables } from '../../types/database.types';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLinkActive, MaterialIcon],
  templateUrl: './main-layout.html',
})
export class MainLayout implements OnInit {
  private router = inject(Router);
  private auth = inject(Auth);
  private userService = inject(User);

  protected loggedUser = signal<Tables<'users'>|null>(null);

  ngOnInit(): void {
    this.userService
      .getCurrentUser()
      .then(user => this.loggedUser.set(user));
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
