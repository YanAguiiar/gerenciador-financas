import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { SummaryComponent } from './pages/summary/summary.component';

const routes: Routes = [
    { path: 'transactions', component: TransactionsComponent},
    { path: 'categories', component: CategoriesComponent},
    { path: 'summary', component: SummaryComponent},
    { path: '', redirectTo: 'summary', pathMatch: 'full' }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
