import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { Category } from '../../services/expense/category';
import { CategoryService } from '../../services/expense/category.service';
import { ItemService } from '../../services/expense/item.service';

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
  imports: [ReactiveFormsModule, ...prime],
  templateUrl: './expense-form.html',
})
export class ExpenseForm implements OnInit, OnDestroy {
  private dialogRef = inject(DynamicDialogRef);
  private category = inject(Category);
  protected categorySrv = inject(CategoryService);
  protected itemSrv = inject(ItemService);

  protected now = new Date();

  protected form = new FormGroup({
    date: new FormControl(new Date(), Validators.required),
    description: new FormControl<string | null>(null),
    items: new FormArray([this.createItem()]),
    isGrouped: new FormControl(false),
    groupName: new FormControl<string | null>(null),
    groupCategory: new FormControl<string | null>(null),
  });

  get items(): FormArray {
    return this.form.get('items') as FormArray;
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
        next: (grouped) => {
          this.toggleValidators('groupName', grouped);
          this.toggleValidators('groupCategory', grouped);
        },
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

  save() {
    console.log('++ TODO Save expense', this.form.getRawValue());
  }

  private createItem(): FormGroup {
    return new FormGroup({
      item: new FormControl<string | null>(null, Validators.required),
      amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
      quantity: new FormControl(1),
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }
}
