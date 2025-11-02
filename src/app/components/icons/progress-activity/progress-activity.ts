import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-progress-activity',
  imports: [],
  templateUrl: './progress-activity.html',
})
export class ProgressActivity {
  @Input() size = "24px";
}
