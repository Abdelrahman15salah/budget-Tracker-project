import { HttpClientModule } from '@angular/common/http';
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardService } from './services/dashboard.service'; 
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { provideHttpClient } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GoalsComponent } from './components/goals/goals.component';
import { IncomeComponent } from './components/income/income.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { BudgetsComponent } from './components/budget/budget.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { BudgetComponent } from './budget/budget.component'; 

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    GoalsComponent,
    IncomeComponent,
    ExpensesComponent,
    BudgetsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule , ChartModule,
    ProgressBarModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule ,
    MatFormFieldModule,
    MatInputModule
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DashboardService,JwtHelperService,  
    {
      provide: JWT_OPTIONS,
      useValue: {
        tokenGetter: () => localStorage.getItem('token')  
      }
    },
    provideHttpClient(),
    provideAnimationsAsync()  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
