import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionsService } from './transactions.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';

interface Transaction {
  id: number;
  title: string;
  value: string;
  type: 'RECEITA' | 'DESPESA';
  date: string;
  category: number;
}

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    TransactionDialogComponent
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  categories: any[] = [];
  isEditing = false;
  editingTransaction: Partial<Transaction> = {};
  transactionForm: FormGroup;
  displayedColumns: string[] = ['title', 'value', 'type', 'date', 'category', 'actions'];

  constructor(
    private transactionsService: TransactionsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.transactionForm = this.createForm();
  }

  ngOnInit() {
    this.loadTransactions();
    this.loadCategories();
  }

  createForm(): FormGroup {
    return this.fb.group({
      id: [null],
      title: ['', Validators.required],
      value: ['', [Validators.required, Validators.min(0)]],
      type: ['RECEITA', Validators.required],
      date: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  loadTransactions() {
    this.transactionsService.getTransactions().subscribe({
      next: (data: any[]) => {
        this.transactions = data.map(transaction => ({
          ...transaction,
          category: transaction.category.id
        }));
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar transações', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  loadCategories() {
    this.transactionsService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
      },
      error: (error: Error) => {
        this.snackBar.open('Erro ao carregar categorias', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  startNewTransaction() {
    this.isEditing = true;
    this.editingTransaction = {};
    this.transactionForm.reset({
      type: 'RECEITA',
      date: new Date().toISOString().split('T')[0]
    });
  }

  editTransaction(transaction: Transaction) {
    this.isEditing = true;
    this.editingTransaction = { ...transaction };
    this.transactionForm.patchValue({
      id: transaction.id,
      title: transaction.title,
      value: transaction.value,
      type: transaction.type,
      date: transaction.date,
      category: transaction.category
    });
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingTransaction = {};
    this.transactionForm.reset();
  }

  saveTransaction() {
    if (this.transactionForm.invalid) {
      this.snackBar.open('Por favor, preencha todos os campos corretamente', 'Fechar', {
        duration: 3000
      });
      return;
    }

    const formData = this.transactionForm.value;
    const transaction = {
      ...formData
    };

    if (formData.id) {
      this.updateTransaction(transaction);
    } else {
      this.createTransaction(transaction);
    }
  }

  createTransaction(transaction: Transaction) {
    const transactionToSend = {
      ...transaction,
      value: transaction.value.toString()
    };

    this.transactionsService.createTransaction(transactionToSend).subscribe({
      next: () => {
        this.loadTransactions();
        this.isEditing = false;
        this.snackBar.open('Transação criada com sucesso', 'Fechar', {
          duration: 3000
        });
      },
      error: (error) => {
        this.snackBar.open('Erro ao criar transação', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  updateTransaction(transaction: Transaction) {
    const transactionToSend = {
      ...transaction,
      value: transaction.value.toString()
    };

    this.transactionsService.updateTransaction(transaction.id, transactionToSend).subscribe({
      next: () => {
        this.loadTransactions();
        this.isEditing = false;
        this.snackBar.open('Transação atualizada com sucesso', 'Fechar', {
          duration: 3000
        });
      },
      error: (error) => {
        this.snackBar.open('Erro ao atualizar transação', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  deleteTransaction(id: number) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      this.transactionsService.deleteTransaction(id).subscribe({
        next: () => {
          this.loadTransactions();
          this.snackBar.open('Transação excluída com sucesso', 'Fechar', {
            duration: 3000
          });
        },
        error: (error) => {
          this.snackBar.open('Erro ao excluir transação', 'Fechar', {
            duration: 3000
          });
        }
      });
    }
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }
}
