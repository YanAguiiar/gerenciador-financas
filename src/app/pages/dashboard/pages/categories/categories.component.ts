import { Component, OnInit } from '@angular/core';
import { CategoryService } from './category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from './category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  newCategory: string = '';
  editingId: number | null = null;
  editingName: string = '';

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.isLoading = false;
      }
    });
  }

  createCategory(): void {
    if (!this.newCategory.trim()) return;

    this.categoryService.createCategory(this.newCategory).subscribe({
      next: () => {
        this.getCategories();
        this.newCategory = '';
      },
      error: (error) => {
        this.error = error.message;
      }
    });
  }

  startEdit(category: Category): void {
    this.editingId = category.id;
    this.editingName = category.name;
  }

  saveEdit(): void {
    if (!this.editingId || !this.editingName.trim()) return;

    this.categoryService.updateCategory(this.editingId, this.editingName).subscribe({
      next: () => {
        this.getCategories();
        this.cancelEdit();
      },
      error: (error) => {
        this.error = error.message;
      }
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editingName = '';
  }

  deleteCategory(id: number): void {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.getCategories();
      },
      error: (error) => {
        this.error = error.message;
      }
    });
  }
}
