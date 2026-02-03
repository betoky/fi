import { ExpenseSummary } from '@/services/expense/annual-summary';
import { Component, computed, inject, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { Skeleton } from "primeng/skeleton";

@Component({
  selector: 'exp-annual-summary',
  imports: [Button, ChartModule, Skeleton],
  templateUrl: './annual.html',
})
export class ExpAnnualSummary implements OnInit {
  summary = inject(ExpenseSummary);

  chartOptions = {
    plugins: {
      legend: {
        display: false
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  dataChart = computed(() => {
    const data = this.summary.data();
    if (!data) return;
    return {
      labels: Array.from({ length: 12 }, (_, i) =>
        new Date(2000, i).toLocaleString('fr-FR', { month: 'short' }),
      ),
      datasets: [
        {
          data: data.map((i) => i.total),
        },
      ],
    };
  });

  ngOnInit(): void {
    this.summary.load();
  }
}
