import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { BudgetService } from '../../services/budget.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
  standalone: false,
})
export class ExpensesComponent implements OnInit {
  expenses: any[] = [];
  newExpense: { amount: number; category: string; date: string | Date; _id?: string } = {
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
  };
  sortKey: string = 'category'; 
  sortDirection: 'asc' | 'desc' = 'asc'; 
  
  showAddExpenseModal: boolean = false;
  editMode: boolean = false;
  showWarningMessage: boolean = false;
  warningMessage: string = '';

  budgets: any[] = [];
  allowAddExpense: boolean = false;
  isConfirmed: boolean = false; 

  constructor(
    private expenseService: ExpenseService,
    private budgetService: BudgetService
  ) {}

  ngOnInit() {
    this.loadExpenses();
    this.loadBudgets();
  }

  loadExpenses() {
    this.expenseService.getExpenses().subscribe((data) => {
      this.expenses = data.map((expense: any) => ({
        ...expense,
        date: expense.date ? new Date(expense.date) : null,
      }));
      this.sortExpenses(); 
    });
  }

  loadBudgets() {
    this.budgetService.getBudgets().subscribe((data) => {
      this.budgets = data;
    });
  }

  exceedsBudget(expenseToSave: { amount: number; category: string; date: string | Date }): boolean {
    const budget = this.budgets.find((budget) => budget.month === this.getMonthFromDate(expenseToSave.date));
    if (!budget) return false;

    const categoryBudget = budget.categories.find((category: { name: string }) => category.name === expenseToSave.category);
    if (!categoryBudget) return false;

    const totalCategoryExpenses = this.expenses
      .filter(
        (expense) =>
          expense.category === expenseToSave.category &&
          this.getMonthFromDate(expense.date) === this.getMonthFromDate(expenseToSave.date)
      )
      .reduce((sum, expense) => sum + expense.amount, 0);

    if (totalCategoryExpenses + expenseToSave.amount > categoryBudget.limit) {
      this.warningMessage = `You are about to add an expense of $${expenseToSave.amount} for ${expenseToSave.category}, but your total expenses for this category in ${this.getMonthFromDate(expenseToSave.date)} will exceed the budget limit of $${categoryBudget.limit}. Do you want to proceed?`;
      this.showWarningMessage = true;
      return true;
    }

    return false;
  }

  addExpense() {
    const expenseToSave = {
      ...this.newExpense,
      date: this.convertDateForBackend(this.newExpense.date),
    };

    if (this.isConfirmed || !this.exceedsBudget(expenseToSave)) {
      if (this.editMode) {
        this.expenseService.editExpense(this.newExpense._id!, expenseToSave).subscribe(
          () => {
            this.loadExpenses();
            this.resetForm();
          },
          (error) => {
            console.error('Error editing expense:', error);
          }
        );
      } else {
        this.expenseService.addExpense(expenseToSave).subscribe(
          () => {
            this.loadExpenses();
            this.resetForm();
          },
          (error) => {
            console.error('Error adding expense:', error);
          }
        );
      }

      this.showAddExpenseModal = false;
      this.isConfirmed = false;
    }
  }

  confirmAddExpense() {
    this.isConfirmed = true;
    this.showWarningMessage = false;
    this.addExpense();
  }

  cancelAddExpense() {
    this.showWarningMessage = false;
    this.resetForm();
    this.isConfirmed = false;
  }

  editExpense(expense: any) {
    this.showAddExpenseModal = true;
    this.editMode = true;
    this.newExpense = { ...expense };
    this.newExpense.date = this.formatDate(this.newExpense.date);
  }

  deleteExpense(id: string) {
    this.expenseService.deleteExpense(id).subscribe(() => {
      this.loadExpenses();
    });
  }

  formatDate(date: Date | string): string {
    return date ? new Date(date).toISOString().split('T')[0] : '';
  }

  convertDateForBackend(date: string | Date): string {
    return new Date(date).toISOString();
  }

  resetForm() {
    this.newExpense = {
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0],
    };
    this.editMode = false;
    this.showAddExpenseModal = false;
    this.showWarningMessage = false;
    this.allowAddExpense = false;
  }

  getMonthFromDate(date: string | Date): string {
    const d = new Date(date);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return months[d.getMonth()];
  }

  sortExpenses() {
    this.expenses.sort((a, b) => {
      let valueA = a[this.sortKey];
      let valueB = b[this.sortKey];

      if (this.sortKey === 'date') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    });
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortExpenses();
  }
}
