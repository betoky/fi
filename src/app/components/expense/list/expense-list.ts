import { Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ExpenseCardSkeleton } from '@/components/expense/card/skeleton';
import { ExpenseCard } from '@/components/expense/card/expense';
import { Expenses } from '@/services/expense/expenses';

@Component({
  selector: 'app-expense-list',
  imports: [
    ExpenseCardSkeleton,
    ExpenseCard,
  ],
  templateUrl: './expense-list.html',
})
export class ExpenseList {
  listing = inject(Expenses);
  protected isLoading = signal(false);
  private observer?: IntersectionObserver;
  
  // Infinite scroll trigger
  infiniteTriggerEl = viewChild<ElementRef<HTMLDivElement>>('is_trigger');

  get skeletons() {
    return Array.from({ length: 6 });
  }

  constructor() {
    this.listenToInfiniteScroll();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  ngOnInit(): void {
    this.listing.load();
  }

  private listenToInfiniteScroll() {
    effect(() => {
      const infiniteScroll = this.infiniteTriggerEl();
      if (infiniteScroll) {
        this.observer?.disconnect();
        this.observer = new IntersectionObserver((entries) => {
          if (entries[0].intersectionRatio <= 0) return;
          this.fetchData();
        });
        this.observer.observe(infiniteScroll.nativeElement);
      }
    });
  }

  private fetchData() {
    this.isLoading.set(true);
    this.listing
      .load()
      .finally(() => this.isLoading.set(false));
  }
}
