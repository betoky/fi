import { DarkModeSwitcher } from '@/services/dark-mode-switcher';
import { CategoryDataChart, CategoriesSummary } from '@/services/expense/categories-summary';
import { Home } from '@/services/supabase/home';
import { formatCurrency } from '@/utils/number';
import { PeriodMap } from '@/utils/period';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { SelectButton } from 'primeng/selectbutton';

@Component({
  selector: 'exp-cat-summary',
  imports: [Button, ChartModule, FormsModule, SelectButton],
  templateUrl: './categories.html',
})
export class ExpenseCatSummary {
  catSummary = inject(CategoriesSummary);
  private color = inject(DarkModeSwitcher).textColor;
  private home = inject(Home).instance;

  get periodOptions() {
    return [...PeriodMap.values()];
  }

  chartOptions = computed(() => ({
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: this.color(),
        },
      },
      tooltip: {
        usePointStyle: true,
      },
    },
  }));

  root = signal([] as CategoryDataChart);
  childs = signal(new Map<number, CategoryDataChart>());

  pieData = computed(() => {
    const items = this.root();
    return {
      labels: items.map(({ category }) => category),
      datasets: [
        {
          data: items.map(({ total }) => total),
          hoverOffset: 5,
          tooltip: {
            callbacks: {
              label: (context: { dataIndex: number; parsed: number }) => {
                const { dataIndex } = context;
                const { id: parentId, total } = this.root()[dataIndex];
                const data = this.childs().get(parentId);

                if (!data) return this.fc(total);

                if (data.length > 1) {
                  return (
                    this.fc(total) +
                    ': ' +
                    data.map(({ category, total }) => `${category}: ${this.fc(total)}`).join('\n')
                  );
                }

                const childTotal = data[0].total;

                return total === childTotal
                  ? this.fc(total)
                  : `${this.fc(total)}: ${this.fc(total - childTotal)} + ${this.fc(childTotal)} (${data[0].category})`;
              },
            },
          },
        },
      ],
    };
  });

  constructor() {
    effect(() => {
      const data = this.catSummary.categories();
      if (!data) return;
      const root = [] as CategoryDataChart;
      const childs = new Map<number, CategoryDataChart>();

      data.forEach((item) => {
        if (item.parent) {
          if (childs.has(item.parent)) {
            const elements = childs.get(item.parent)!;
            elements.push(item);
          } else {
            childs.set(item.parent, [item]);
          }
        } else {
          root.push(item);
        }
      });

      this.root.set(root);
      this.childs.set(childs);
    });
  }

  private fc(value: number) {
    return formatCurrency(value, this.home()?.currency);
  }
}
