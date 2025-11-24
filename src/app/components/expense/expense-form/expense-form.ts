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
import { CurrencyPipe } from '../../../pipes/currency-pipe';
import { Alert } from '../../../services/alert';
import { Category } from '../../../services/expense/category';
import { CategoryService } from '../../../services/expense/category.service';
import { ItemService } from '../../../services/expense/item.service';
import { Home } from '../../../services/home';
import { ExpenseListing } from '../../../services/expense/expense-listing';
import { buildExpenseGroup, buildExpenses } from '../../../utils/expense';

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
  private dialogRef = inject(DynamicDialogRef);
  private category = inject(Category);
  protected categorySrv = inject(CategoryService);
  protected itemSrv = inject(ItemService);
  private listing = inject(ExpenseListing);

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

  closeModal() {
    this.dialogRef?.close();
  }

  async save() {
    if (this.form.invalid) {
      return;
    }

    try {
      this.loading.set(true);
      const currentHome = await this.home.getHome();
      if (!currentHome) return;

      const formValue = this.form.getRawValue();
      if (formValue.isGrouped) {
        formValue.groupName &&
          (await this.listing.saveAsGroupExpenses(buildExpenseGroup(formValue, this.itemSrv)));
      } else {
        await this.listing.saveExpenses(buildExpenses(formValue, currentHome.id, this.itemSrv))
      }

      this.alert.success({ detail: 'Dépenses enregistrées avec succès' });
      this.closeModal();
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
