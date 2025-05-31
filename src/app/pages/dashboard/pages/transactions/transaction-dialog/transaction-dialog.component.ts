import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

interface Transaction {
  id?: number;
  title: string;
  value: string;
  type: 'RECEITA' | 'DESPESA';
  date: string;
  category: {
    id: number;
    name: string;
  }
}

@Component({
  selector: 'app-transaction-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  template: `
    <div class="min-w-[400px] p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">{{data ? 'Editar' : 'Nova'}} Transação</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <div class="space-y-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Título</mat-label>
            <input matInput formControlName="title" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Valor</mat-label>
            <input matInput type="number" formControlName="value" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Tipo</mat-label>
            <mat-select formControlName="type" required>
              <mat-option value="RECEITA">Receita</mat-option>
              <mat-option value="DESPESA">Despesa</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Data</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date" required>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Categoria</mat-label>
            <mat-select formControlName="categoryId" required>
              <mat-option *ngFor="let category of categories" [value]="category.id">
                {{category.name}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="flex justify-end items-center space-x-2 pt-4 border-t border-gray-200">
          <button mat-button 
                  (click)="onCancel()"
                  class="text-gray-600 hover:bg-gray-100">
            Cancelar
          </button>
          <button mat-raised-button 
                  color="primary" 
                  type="submit" 
                  [disabled]="!form.valid"
                  class="bg-blue-600 hover:bg-blue-700">
            {{data ? 'Atualizar' : 'Criar'}}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    ::ng-deep .mat-mdc-dialog-container {
      border-radius: 0.75rem !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
    }

    ::ng-deep .mdc-text-field--outlined {
      --mdc-outlined-text-field-container-shape: 0.5rem;
    }
  `]
})
export class TransactionDialogComponent {
  form: FormGroup;
  categories = [
    { id: 1, name: 'Alimentação' },
    { id: 2, name: 'Transporte' },
    { id: 3, name: 'Moradia' },
    { id: 4, name: 'Saúde' },
    { id: 5, name: 'Educação' },
    { id: 6, name: 'Lazer' },
    { id: 7, name: 'Salário' },
    { id: 8, name: 'Investimentos' },
    { id: 9, name: 'Outros' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Transaction | null
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      value: ['', [Validators.required, Validators.min(0)]],
      type: ['RECEITA', Validators.required],
      date: [new Date(), Validators.required],
      categoryId: ['', Validators.required]
    });

    if (data) {
      this.form.patchValue({
        title: data.title,
        value: data.value,
        type: data.type,
        date: new Date(data.date),
        categoryId: data.category.id
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const category = this.categories.find(c => c.id === formValue.categoryId);

      const transaction: Transaction = {
        ...this.data,
        title: formValue.title,
        value: formValue.value.toString(),
        type: formValue.type,
        date: formValue.date.toISOString().split('T')[0],
        category: {
          id: formValue.categoryId,
          name: category?.name || ''
        }
      };

      this.dialogRef.close(transaction);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 