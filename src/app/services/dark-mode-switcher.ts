import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeSwitcher {
  private readonly KEY = 'dark-mode';

  isDarkMode = signal(false);

  init() {
    const savedMode = localStorage.getItem(this.KEY);
    if (savedMode) {
      const isDark = JSON.parse(savedMode);
      this.setMode(isDark);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setMode(prefersDark);
      this.listenToSystemChanges();
    }
  }

  toggle() {
    const rootElement = document.documentElement;
    rootElement.classList.toggle('dark-mode');
    const nextMode = !this.isDarkMode();
    this.isDarkMode.set(nextMode);
    localStorage.setItem(this.KEY, JSON.stringify(nextMode));
  }

  private setMode(isDark: boolean) {
    const rootElement = document.documentElement;
    isDark ? rootElement.classList.add('dark-mode') : rootElement.classList.remove('dark-mode');
    this.isDarkMode.set(isDark);
  }

  private listenToSystemChanges() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      this.setMode(e.matches);
    });
  }
}
