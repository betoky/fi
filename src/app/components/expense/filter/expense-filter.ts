import { DatepickerFocusFix } from '@/directives/datepicker-focus-fix';
import { ExpFetchParams } from '@/domains/expense';
import { CategoryParentType } from '@/domains/expense-category';
import { Categories } from '@/services/expense/categories';
import { Expenses } from '@/services/expense/expenses';
import { Home } from '@/services/supabase/home';
import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { ToggleButton } from 'primeng/togglebutton';
import { distinctUntilChanged } from 'rxjs/operators';

const FILTER_KEY = 'exp-c-f';

@Component({
  selector: 'app-expense-filter',
  imports: [
    AutoComplete,
    Button,
    DatePicker,
    DatepickerFocusFix,
    FormsModule,
    InputGroup,
    InputGroupAddon,
    InputNumber,
    ReactiveFormsModule,
    Select,
    ToggleButton,
  ],
  templateUrl: './expense-filter.html',
})
export class ExpenseFilter implements OnInit {
  @Input() firstOpen!: boolean;

  catService = inject(Categories);
  currentHome = inject(Home).instance;
  private expService = inject(Expenses);
  private dialogRef = inject(DynamicDialogRef);

  private fb = inject(NonNullableFormBuilder);
  form = this.fb.group({
    type: this.fb.control<ExpFetchParams['type']>('all'),
    date: this.fb.group({
      asRange: this.fb.control(false),
      values: this.fb.control<[Date, Date] | Date | undefined>(undefined),
    }),
    amount: this.fb.group({
      min: this.fb.control<number | undefined>(undefined),
      max: this.fb.control<number | undefined>(undefined),
    }),
    categories: this.fb.control<CategoryParentType[]>([]),
    order: this.fb.group({
      field: this.fb.control<'category' | 'amount' | 'date'>('date'),
      ascending: this.fb.control(false),
    }),
  });

  private enableOrder = () => this.form.get('order')?.enable();
  private disableOrder = () => this.form.get('order')?.disable();

  selectedCatIds?: number[];
  autoSuggestion = computed(() => this.hideSelectedCategories());

  typeChoice = [
    { label: 'Toutes les dépenses', value: 'all' },
    { label: 'Seulement les groupées', value: 'group' },
    { label: 'Seulement les non-groupées', value: 'simple' },
  ];

  sortingOptions = [
    { label: 'Date', value: 'date' },
    { label: 'Montant', value: 'amount' },
    { label: 'Catégorie', value: 'category' },
  ];

  get now() {
    return new Date();
  }

  get dateRangeControl() {
    return this.form.get('date.asRange') as FormControl<boolean>;
  }

  get orderControl() {
    return this.form.get('order');
  }

  constructor() {
    this.disableOrder();

    this.form
      .get('date.values')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe((date) => (date ? this.enableOrder() : this.disableOrder()));

    this.form
      .get('categories')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe((categories) => this.updateSelectedCatIds(categories));
  }

  ngOnInit(): void {
    this.catService.init();
    if (this.firstOpen) {
      localStorage.removeItem(FILTER_KEY);
      return;
    }
    const cached = localStorage.getItem(FILTER_KEY);
    if (cached) {
      const data = JSON.parse(cached) as CategoryParentType[];
      // this.selectedCategories.set(data);
    }
  }

  changeDateMode() {
    const currentValue = this.form.value.date?.asRange ?? false;
    console.log(currentValue);

    this.form.patchValue({
      date: {
        values: undefined,
        asRange: !currentValue,
      },
    });
  }

  onReset() {
    this.form.reset();
  }

  onApply() {
    console.log(this.form.value);
    localStorage.setItem(FILTER_KEY, JSON.stringify(this.form.value));

    const { date, order, amount, type } = this.form.getRawValue();
    this.expService.applyFilter({
      type,
      date: date?.values,
      amount,
      categorieIds: this.selectedCatIds,
      order: date.asRange ? order : undefined,
    });
    this.dialogRef.close();
  }

  private updateSelectedCatIds(categories: CategoryParentType[]): void {
    this.selectedCatIds = categories
      .map(({ id }) => {
        const cat = this.catService.getCategory(id);
        if (cat && 'children' in cat) {
          const childIds = cat.children.map(({ id }) => id);
          return [id, ...childIds];
        }
        return [id];
      })
      .flat();
  }

  private hideSelectedCategories() {
    const categories = this.catService.categories();
    const ids = this.selectedCatIds;
    return categories.filter(({ id }, index) => {
      if (!ids) return true;
      categories[index].children = categories[index].children.filter(
        (child) => !ids.includes(child.id),
      );
      return !ids.includes(id);
    });
  }
}
