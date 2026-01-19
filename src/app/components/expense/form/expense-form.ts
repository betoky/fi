import { Component, effect, inject, Input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { CurrencyPipe } from '@/pipes/currency-pipe';
import { Alert } from '@/services/alert';
import { Categories } from '@/services/expense/categories';
import { Items } from '@/services/expense/items';
import { Expenses } from '@/services/expense/expenses';
import { Home } from '@/services/supabase/home';
import { ExpenseType } from '@/domains/expense';
import { ExpenseDetail } from '@/domains/expense-detail';
import { Expense } from '@/services/supabase/expense';
import { ExpenseFormType } from '@/domains/expense-form';

const prime = [AutoComplete, Button, DatePicker, InputNumber, InputText, Textarea, ToggleSwitch];

@Component({
  selector: 'app-expense-form',
  imports: [FormsModule, ReactiveFormsModule, ...prime, CurrencyPipe],
  templateUrl: './expense-form.html',
})
export class ExpenseForm implements OnInit {
  @Input() expense?: ExpenseType;
  @Input() details?: ExpenseDetail[];

  protected currentHome = inject(Home).instance;
  private alert = inject(Alert);
  private dialogRef = inject(DynamicDialogRef);
  protected categories = inject(Categories);
  protected items = inject(Items);
  private listing = inject(Expenses);
  private database = inject(Expense);

  protected totalAmount = signal(0);
  protected groupSwitcher = signal(false);

  private fb = inject(NonNullableFormBuilder);

  protected form = this.fb.group({
    date: this.fb.control(new Date(), { validators: Validators.required }),
    name: this.fb.control<string | undefined>(undefined),
    description: this.fb.control<string | undefined>(undefined),
    selectedCategory: this.fb.control<number | null>(null),
    items: this.fb.array([this.createItem()]),
  });

  loading = signal(false);

  get maxDateForDatepicker() {
    return new Date();
  }

  get itemsControls() {
    return this.form.get('items') as FormArray<FormGroup<any>>;
  }

  constructor() {
    effect(() => this.toggleValidators('name', this.groupSwitcher()));
    this.form
      .get('selectedCategory')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe({
        next: (categoryId) =>
          this.items.setCategory(categoryId ? this.categories.getCategory(categoryId) : null),
      });
  }

  ngOnInit(): void {
    if (this.expense) {
      this.fillFormFromData();
    }
  }

  private async fillFormFromData() {
    const { id, date, name, description, amount } = this.expense!;
    this.form.patchValue({
      date: new Date(date),
      name,
      description: description ?? undefined,
    });
    this.groupSwitcher.set(true);
    this.totalAmount.set(amount);
    this.form.get('date')?.disable();

    if (!this.details) {
      this.details = await this.database.fetchDetails(id);
    }
    this.itemsControls.clear();
    this.details.forEach((i) =>
      this.itemsControls.push(this.createItem(i.article, i.amount, i.quantity))
    );
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

  closeModal(success = false) {
    this.dialogRef?.close(success);
  }

  async save() {
    if (this.form.invalid) {
      return;
    }
    try {
      const formValue = this.form.getRawValue() as ExpenseFormType;
      this.expense
        ? await this.listing.updateExpGroup(this.expense.id, formValue, {
            ...this.expense,
            items: this.details!,
          })
        : await this.listing.save(formValue, this.groupSwitcher());

      this.alert.success({
        detail: this.expense
          ? 'Modification enregistrée avec succès'
          : 'Dépenses enregistrées avec succès',
      });
      this.closeModal(true);
    } catch (error) {
      this.alert.error({
        summary: 'Erreur inattendue',
        detail: this.expense
          ? 'La modifcation a été annulée.'
          : "L'enregistrement des dépenses est annulé.",
      });
      this.closeModal();
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

  private createItem(
    item?: { id: number; category_id: number; name: string },
    amount?: number,
    quantity = 1
  ) {
    return this.fb.group({
      item: this.fb.control(
        { value: item, disabled: item !== undefined },
        { validators: Validators.required }
      ),
      amount: this.fb.control(amount, { validators: [Validators.required, Validators.min(0)] }),
      quantity,
    });
  }

  addItem(): void {
    this.itemsControls.push(this.createItem());
  }

  removeItem(index: number): void {
    this.itemsControls.removeAt(index);
    this.updateTotal();
  }
}
