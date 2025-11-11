import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  private fb = inject(FormBuilder);
  private category = inject(Category);
  protected categorySrv = inject(CategoryService);

  protected now = new Date();

  protected form = this.fb.group({
    date: [new Date(), Validators.required],
    description: [null],
    items: this.fb.array([this.createItem()]),
    isGrouped: [false],
    groupName: [null],
    groupCategory: [null],
  });

  protected expenseItems = [
    { label: 'Article 1', value: 'item-1' },
    { label: 'Article 2', value: 'item-2' },
    { label: 'Article 3', value: 'item-3' },
    { label: 'Article 4', value: 'item-4' },
  ];

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.form
      .get('isGrouped')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (grouped) => {
          this.toggleValidators('groupName', grouped);
          this.toggleValidators('groupCategory', grouped);

          if (grouped && this.categorySrv.categories().length === 0) {
            this.category.fetchCategories().then((data) => this.categorySrv.set(data));
          }
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
    return this.fb.group({
      item: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]],
      quantity: [1],
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }
}
