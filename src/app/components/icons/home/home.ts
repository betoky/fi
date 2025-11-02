import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-home',
  imports: [],
  templateUrl: './home.html',
})
export class Home {
  @Input() size = "24px";
}
