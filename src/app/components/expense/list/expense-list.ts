import { ExpenseActionPanel } from '@/components/expense/action-panel/expense-action-panel';
import { ExpenseCard } from '@/components/expense/card/expense';
import { ExpenseCardSkeleton } from '@/components/expense/card/skeleton';
import { Expenses } from '@/services/expense/expenses';
import { Component, inject, signal, viewChild, ElementRef, effect } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-expense-list',
  imports: [ExpenseActionPanel, ExpenseCard, ExpenseCardSkeleton],
  providers: [DialogService],
  templateUrl: './expense-list.html',
})
export class ExpenseList {
  listing = inject(Expenses);
  isLoading = signal(false);
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

  private fetchData() {
    this.isLoading.set(true);
    this.listing.load().finally(() => this.isLoading.set(false));
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
}
