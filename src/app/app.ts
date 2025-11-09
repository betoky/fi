import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkModeSwitcher } from './services/dark-mode-switcher';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private darkModeSwitcher = inject(DarkModeSwitcher);

  ngOnInit(): void {
    this.darkModeSwitcher.init();
  }
}
