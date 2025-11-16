import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';

import { Auth } from '../../services/auth';
import { User } from '../../services/user';
import { DarkModeSwitcher } from '../../services/dark-mode-switcher';
import { Tables } from '../../../../database.types';

import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { PopoverModule } from 'primeng/popover';
import { Toast } from 'primeng/toast';

const primeModule = [ButtonModule, PopoverModule, MenubarModule, Toast];

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, ...primeModule],
  templateUrl: './main-layout.html',
  providers: [MessageService],
})
export class MainLayout implements OnInit, AfterViewInit, OnDestroy {
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

  protected dvh = signal('100dvh');

  protected offsetTop = signal('58px');

  @ViewChild('toolbar') toolbar?: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    this.userService.getCurrentUser().then((user) => this.loggedUser.set(user));
    window.addEventListener('resize', this.updateCustomProperty.bind(this));
  }

  ngAfterViewInit(): void {
    this.updateCustomProperty();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.updateCustomProperty.bind(this));
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  private updateCustomProperty() {
    const toolbarElement = this.toolbar?.nativeElement;
    if (!toolbarElement) {
      this.dvh.set('100dvh');
      this.offsetTop.set('58px');
      return;
    }
    const windowHeight = window.innerHeight + 1;
    const toolbarHeight = toolbarElement.offsetHeight + 1;

    this.dvh.set(`calc(${windowHeight - toolbarHeight}px - 1.5rem`);
    this.offsetTop.set(`calc(${toolbarHeight}px + 1.5rem)`);
  }
}
