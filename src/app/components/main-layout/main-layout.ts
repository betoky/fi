import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';

import { Auth } from '../../services/auth';
import { User } from '../../services/user';
import { DarkModeSwitcher } from '../../services/dark-mode-switcher';
import { Tables } from '../../../../database.types';

import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { PopoverModule } from 'primeng/popover';

const primeModule = [ButtonModule, PopoverModule, MenubarModule];

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, ...primeModule],
  templateUrl: './main-layout.html',
})
export class MainLayout implements OnInit {
  private router = inject(Router);
  private auth = inject(Auth);
  private userService = inject(User);

  protected darkModeSwitcher = inject(DarkModeSwitcher);

  protected loggedUser = signal<Tables<'users'> | null>(null);

  protected menu: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-chart-bar',
      routerLink: 'dashboard',
    },
    {
      label: 'Dépenses',
      icon: 'pi pi-shopping-bag',
      routerLink: 'expenses',
    },
    {
      label: 'Banque',
      icon: 'pi pi-building-columns',
      routerLink: 'banking-transactions',
    },
    {
      label: 'Investir',
      icon: 'pi pi-money-bill',
      routerLink: 'investments',
    },
  ];

  ngOnInit(): void {
    this.userService.getCurrentUser().then((user) => this.loggedUser.set(user));
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
