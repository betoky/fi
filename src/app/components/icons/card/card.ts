import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-card',
  imports: [],
  templateUrl: './card.html',
})
export class Card {
  @Input() size = "24px";
}
