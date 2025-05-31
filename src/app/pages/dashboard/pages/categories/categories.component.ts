import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CategoryService } from './category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from './category.model';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export class CustomPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Itens por página:';
  override nextPageLabel = 'Próxima página';
  override previousPageLabel = 'Página anterior';
  override firstPageLabel = 'Primeira página';
  override lastPageLabel = 'Última página';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSnackBarModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit, AfterViewInit {
  categories: Category[] = [];
  categoriesDataSource: MatTableDataSource<Category>;
  isLoading: boolean = false;
  error: string | null = null;
  isEditing: boolean = false;
  editingId: number | null = null;
  editingName: string = '';
  displayedColumns: string[] = ['name', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {
    this.categoriesDataSource = new MatTableDataSource<Category>([]);
  }

  ngOnInit(): void {
    this.getCategories();
  }

  ngAfterViewInit() {
    this.categoriesDataSource.paginator = this.paginator;
  }

  getCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.categoriesDataSource.data = categories;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar categorias', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  startNewCategory(): void {
    this.isEditing = true;
    this.editingId = null;
    this.editingName = '';
  }

  startEdit(category: Category): void {
    this.isEditing = true;
    this.editingId = category.id;
    this.editingName = category.name;
  }

  saveCategory(): void {
    if (!this.editingName.trim()) return;

    if (this.editingId) {
      this.updateCategory();
    } else {
      this.createCategory();
    }
  }

  private createCategory(): void {
    this.categoryService.createCategory(this.editingName).subscribe({
      next: () => {
        this.getCategories();
        this.cancelEdit();
        this.snackBar.open('Categoria criada com sucesso', 'Fechar', {
          duration: 3000
        });
      },
      error: (error) => {
        this.error = error.message;
        this.snackBar.open('Erro ao criar categoria', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  private updateCategory(): void {
    if (!this.editingId) return;

    this.categoryService.updateCategory(this.editingId, this.editingName).subscribe({
      next: () => {
        this.getCategories();
        this.cancelEdit();
        this.snackBar.open('Categoria atualizada com sucesso', 'Fechar', {
          duration: 3000
        });
      },
      error: (error) => {
        this.error = error.message;
        this.snackBar.open('Erro ao atualizar categoria', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingId = null;
    this.editingName = '';
  }

  deleteCategory(id: number): void {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.getCategories();
        this.snackBar.open('Categoria excluída com sucesso', 'Fechar', {
          duration: 3000
        });
      },
      error: (error) => {
        this.error = error.message;
        this.snackBar.open('Erro ao excluir categoria', 'Fechar', {
          duration: 3000
        });
      }
    });
  }
}
