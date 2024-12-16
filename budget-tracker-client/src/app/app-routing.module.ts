import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';  
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';  
import { GoalsComponent } from './components/goals/goals.component';
import { IncomeComponent } from './components/income/income.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { BudgetsComponent } from './components/budget/budget.component';

// import { BudgetComponent } from './budget/budget.component';

const routes: Routes = [
  
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

 
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  // { path: 'budget', component: BudgetComponent, canActivate: [AuthGuard] },
  { path: 'goals', component: GoalsComponent , canActivate: [AuthGuard]},
  { path: 'income', component: IncomeComponent , canActivate: [AuthGuard]},
  { path: 'expenses', component: ExpensesComponent , canActivate: [AuthGuard]},
  { path: 'budget', component: BudgetsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
