import { Component, effect, inject, Input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
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
import { ExpenseGroupType, ExpGrpItemType } from '@/domains/expense-group';
import { CurrencyPipe } from '@/pipes/currency-pipe';
import { Alert } from '@/services/alert';
import { AutocompleteCategories } from '@/services/expense/autocomplete-categories';
import { AutocompleteItems } from '@/services/expense/autocomplete-items';
import { ExpenseGroup } from '@/services/expense/expense-group';
import { ExpenseListing } from '@/services/expense/expense-listing';
import { Home } from '@/services/home';

const prime = [
  AutoComplete,
  Button,
  DatePicker,
  InputNumber,
  InputText,
  Textarea,
  ToggleSwitch,
];

@Component({
  selector: 'app-expense-form',
  imports: [FormsModule, ReactiveFormsModule, ...prime, CurrencyPipe],
  templateUrl: './expense-form.html',
})
export class ExpenseForm implements OnInit {
  @Input('group') groupToEdit?: ExpenseGroupType;
  @Input('items') groupItems?: ExpGrpItemType[];

  protected currentHome = inject(Home).instance;
  private alert = inject(Alert);
  private dialogRef = inject(DynamicDialogRef);
  protected autoCompleteCategories = inject(AutocompleteCategories);
  protected autoCompleteExpItems = inject(AutocompleteItems);
  private listing = inject(ExpenseListing);
  private expenseGroup = inject(ExpenseGroup);

  protected totalAmount = signal(0);
  protected groupSwitcher = signal(false);

  protected form = new FormGroup({
    date: new FormControl(new Date(), { nonNullable: true, validators: Validators.required }),
    name: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
    items: new FormArray([this.createItem()]),
    selectedCategory: new FormControl<string>(''),
  });

  loading = signal(false);

  get maxDateForDatepicker() {
    return new Date();
  }

  get items() {
    return this.form.get('items') as FormArray<FormGroup<any>>;
  }

  constructor() {
    effect(() => this.toggleValidators('name', this.groupSwitcher()));
    this.form
      .get('selectedCategory')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe({
        next: (categoryId) =>
          this.autoCompleteExpItems.setCategory(
            categoryId ? this.autoCompleteCategories.getCategory(categoryId) : null
          ),
      });
  }

  ngOnInit(): void {
    this.autoCompleteCategories.init();

    if (this.groupToEdit) {
      this.fillFormFromData();
    }
  }

  private async fillFormFromData() {
    const { id, date, name, description, total } = this.groupToEdit!;
    this.form.patchValue({
      date: new Date(date),
      name,
      description,
    });
    this.groupSwitcher.set(true);
    this.totalAmount.set(total);
    this.form.get('date')?.disable();

    if (!this.groupItems) {
      this.groupItems = await this.expenseGroup.fetchGroupItems(id);
    }
    this.items.clear();
    this.groupItems.forEach((i) =>
      this.items.push(this.createItem(i.article, i.amount, i.quantity))
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
      this.groupToEdit
        ? await this.listing.updateExpGroup(
            this.groupToEdit.id,
            this.form.getRawValue(),
            this.groupItems!
          )
        : await this.listing.save(this.form.getRawValue(), this.groupSwitcher());

      this.alert.success({
        detail: this.groupToEdit
          ? 'Modification enregistrée avec succès'
          : 'Dépenses enregistrées avec succès',
      });
      this.closeModal(true);
    } catch (error) {
      this.alert.error({
        summary: 'Erreur inattendue',
        detail: this.groupToEdit
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
    item?: { id: string; category_id: string; name: string },
    amount?: number,
    quantity?: number
  ) {
    return new FormGroup({
      item: new FormControl({ value: item, disabled: !!item }, Validators.required),
      amount: new FormControl(amount, [Validators.required, Validators.min(0)]),
      quantity: new FormControl(quantity ?? 1),
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
