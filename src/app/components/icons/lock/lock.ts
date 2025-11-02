import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-lock',
  imports: [],
  templateUrl: './lock.html',
})
export class Lock {
  @Input() size = "24px";
}
