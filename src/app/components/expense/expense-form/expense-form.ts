import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';
import { CreateExpenseType, ExpenseGroupType } from '../../../domain/expense';
import { CurrencyPipe } from '../../../pipes/currency-pipe';
import { Alert } from '../../../services/alert';
import { Category } from '../../../services/expense/category';
import { CategoryService } from '../../../services/expense/category.service';
import { Expense } from '../../../services/expense/expense';
import { ItemService } from '../../../services/expense/item.service';
import { Home } from '../../../services/home';

const prime = [
  AutoCompleteModule,
  ButtonModule,
  DatePickerModule,
  InputNumberModule,
  InputTextModule,
  SelectModule,
  TextareaModule,
  ToggleSwitchModule,
];

@Component({
  selector: 'app-expense-form',
  imports: [ReactiveFormsModule, ...prime, CurrencyPipe],
  templateUrl: './expense-form.html',
})
export class ExpenseForm implements OnInit, OnDestroy {
  private alert = inject(Alert);
  private home = inject(Home);
  private expense = inject(Expense);
  private dialogRef = inject(DynamicDialogRef);
  private category = inject(Category);
  protected categorySrv = inject(CategoryService);
  protected itemSrv = inject(ItemService);

  protected now = new Date();
  protected totalAmount = signal(0);

  protected form = new FormGroup({
    date: new FormControl(new Date(), { nonNullable: true, validators: Validators.required }),
    description: new FormControl<string | null>(null),
    items: new FormArray([this.createItem()]),
    isGrouped: new FormControl(false, { nonNullable: true }),
    groupName: new FormControl<string | null>(null),
    groupCategory: new FormControl<string | null>(null),
  });

  loading = signal(false);

  get items() {
    return this.form.get('items') as FormArray<FormGroup<any>>;
  }

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.category.fetchCategories().then((data) => this.categorySrv.set(data));
    // Category listener
    this.form.get('groupCategory')?.valueChanges.subscribe({
      next: (categoryId) => {
        if (!categoryId) {
          this.itemSrv.setCategory(null);
        } else {
          const selectedCategory = this.categorySrv.getCategory(categoryId);
          this.itemSrv.setCategory(selectedCategory);
        }
      },
    });
    // Listen to group switcher
    this.form
      .get('isGrouped')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (grouped) => this.toggleValidators('groupName', grouped),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isValid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && control.touched;
  }

  private toggleValidators(controlName: string, haveValidator: boolean | null) {
    const control = this.form.get(controlName);
    if (haveValidator) {
      control?.addValidators(Validators.required);
    } else {
      control?.setValue(null);
      control?.clearValidators();
    }
    control?.updateValueAndValidity();
  }

  closeModal(submitted = false) {
    this.dialogRef?.close(submitted);
  }

  async save() {
    if (this.form.invalid) {
      return;
    }

    try {
      this.loading.set(true);
      const currentHome = await this.home.getHome();
      if (!currentHome) {
        return;
      }

      const { isGrouped, groupName, items, date, description } = this.form.getRawValue();

      const desc = description && description.length > 0 ? description : null;

      // Save and get expense group
      let group: ExpenseGroupType | null = null;
      if (isGrouped && groupName) {
        group = await this.expense.createGroup({
          description: desc,
          home_id: currentHome.id,
          name: groupName,
          total: this.totalAmount(),
        });
      }

      // Build expenses to save
      let expenses: CreateExpenseType[] = [];
      for (const item of items) {
        const { amount, item: article_id, quantity } = item;
        if (!amount || !article_id) {
          throw 'amount and article not be empty';
        }
        const expense: CreateExpenseType = {
          amount,
          article_id,
          date: date.toISOString(),
          description: isGrouped ? null : desc,
          quantity: !quantity || quantity <= 0 ? 1 : quantity,
          group_id: isGrouped ? (group ? group.id : null) : null,
          home_id: currentHome.id,
        };
        expenses.push(expense);
      }

      await this.expense.saveExpense(...expenses);
      this.alert.success({ detail: 'Dépenses enregistrées avec succès' });
      this.closeModal(true);
    } catch (error) {
      console.error(error);
      this.alert.error({ detail: 'Erreur inattendue' });
    } finally {
      this.loading.set(false);
    }
  }

  updateTotal() {
    const items = this.form.get('items')?.value;
    if (items) {
      const total = items.reduce((total, item) => (total += item['amount'] ?? 0), 0);
      this.totalAmount.set(total);
    }
  }

  private createItem() {
    return new FormGroup({
      item: new FormControl<string | null>(null, Validators.required),
      amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
      quantity: new FormControl<number>(1),
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.updateTotal();
  }
}
