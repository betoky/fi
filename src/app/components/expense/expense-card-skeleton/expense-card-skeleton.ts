import { Component } from '@angular/core';
import { Card } from "primeng/card";
import { Skeleton } from "primeng/skeleton";

@Component({
  selector: 'app-expense-card-skeleton',
  imports: [Card, Skeleton],
  templateUrl: './expense-card-skeleton.html',
})
export class ExpenseCardSkeleton {

}
