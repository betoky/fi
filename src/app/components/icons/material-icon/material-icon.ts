import { Component, Input } from '@angular/core';

@Component({
  selector: 'material-icon',
  imports: [],
  templateUrl: './material-icon.html',
})
export class MaterialIcon {
  @Input() size = '24px';
  @Input() name: 'account_balance' | 'analytics' | 'code' | 'finance_mode' | 'logout' | 'receipt' = 'code';
}
