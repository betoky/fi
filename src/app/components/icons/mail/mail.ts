import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-mail',
  imports: [],
  templateUrl: './mail.html',
})
export class Mail {
  @Input() size = "24px";
}
