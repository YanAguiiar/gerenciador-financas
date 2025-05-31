import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private apiUrl = 'http://localhost:3001/api/transactions';
  private categoriesUrl = 'http://localhost:3001/api/categories';

  constructor(private http: HttpClient) { }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl);
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/create`, transaction);
  }

  updateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/update`, { ...transaction, id });
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
