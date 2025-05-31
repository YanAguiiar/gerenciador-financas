import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = 'http://localhost:3001/api/categories';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  createCategory(name: string): Observable<Category> {
    return this.http.post<Category>(this.apiUrl + '/create', { name });
  }

  updateCategory(id: number, name: string): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/update`, { name, id });
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  addCategory(name: string): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, { name });
  }
}
