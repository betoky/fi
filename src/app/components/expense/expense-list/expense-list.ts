import { Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ExpenseCardSkeleton } from '@/components/expense/expense-card-skeleton/expense-card-skeleton';
import { ExpenseGroupCard } from '@/components/expense/expense-group-card/expense-group-card';
import { ExpenseSimpleCard } from '@/components/expense/expense-simple-card/expense-simple-card';
import { AsGroupExpensePipe } from '@/pipes/expense/as-group-expense-pipe';
import { AsSimpleExpensePipe } from '@/pipes/expense/as-simple-expense-pipe';
import { ExpenseListing } from '@/services/expense/expense-listing';

@Component({
  selector: 'app-expense-list',
  imports: [
    ExpenseCardSkeleton,
    AsSimpleExpensePipe,
    ExpenseSimpleCard,
    AsGroupExpensePipe,
    ExpenseGroupCard,
  ],
  templateUrl: './expense-list.html',
})
export class ExpenseList {
  private listing = inject(ExpenseListing);

  expTriggerEl = viewChild<ElementRef<HTMLDivElement>>('exp_end');
  private page = 1;
  protected expenses = this.listing.expenses;
  protected isLoading = signal(false);
  private observer?: IntersectionObserver;

  get skeletons() {
    return Array.from({ length: 6 });
  }

  constructor() {
    this.listenToInfiniteScroll();
  }

  listenToInfiniteScroll() {
    effect(() => {
      const triggerEl = this.expTriggerEl();
      if (triggerEl) {
        this.observer?.disconnect();
        this.observer = new IntersectionObserver((entries) => {
          if (entries[0].intersectionRatio <= 0) return;
          this.loadMore();
        });
        this.observer.observe(triggerEl.nativeElement);
      }
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  ngOnInit(): void {
    this.listing.fetchData(this.page);
  }

  loadMore() {
    this.isLoading.set(true);
    this.listing
      .fetchData(this.page + 1)
      .then(() => this.page++)
      .finally(() => this.isLoading.set(false));
  }
}
