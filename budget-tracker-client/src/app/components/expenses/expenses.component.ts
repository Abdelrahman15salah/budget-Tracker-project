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

  showAddExpenseModal: boolean = false;
  editMode: boolean = false;
  showWarningMessage: boolean = false;
  warningMessage: string = '';

  budgets: any[] = [];
  allowAddExpense: boolean = false; // Flag to allow adding the expense
  isConfirmed: boolean = false; // Track if the user has confirmed the budget warning

  constructor(
    private expenseService: ExpenseService,
    private budgetService: BudgetService
  ) {}

  ngOnInit() {
    this.loadExpenses();
    this.loadBudgets();
  }

  loadExpenses() {
    // console.log('Loading expenses...');
    this.expenseService.getExpenses().subscribe((data) => {
      // console.log('Expenses loaded:', data);
      this.expenses = data.map((expense: any) => ({
        ...expense,
        date: expense.date ? new Date(expense.date) : null,
      }));
    });
  }

  loadBudgets() {
    // console.log('Loading budgets...');
    this.budgetService.getBudgets().subscribe((data) => {
      // console.log('Budgets loaded:', data);
      this.budgets = data;
    });
  }

  exceedsBudget(expenseToSave: { amount: number; category: string; date: string | Date }): boolean {
    // Find the relevant budget for the month
    const budget = this.budgets.find(
      (budget) => budget.month === this.getMonthFromDate(expenseToSave.date)
    );
  
    if (budget) {
      // console.log('Budget found for month:', budget);
      const categoryBudget = budget.categories.find(
        (category: { name: string }) => category.name === expenseToSave.category
      );
  
      if (categoryBudget) {
        // console.log('Category budget found:', categoryBudget);
  
        // Calculate total existing expenses for the category in the month
        const totalCategoryExpenses = this.expenses
          .filter(
            (expense) =>
              expense.category === expenseToSave.category &&
              this.getMonthFromDate(expense.date) === this.getMonthFromDate(expenseToSave.date)
          )
          .reduce((sum, expense) => sum + expense.amount, 0);
  
        // console.log('Total existing expenses for category:', totalCategoryExpenses);
  
        // Check if the new expense combined with existing expenses exceeds the limit
        if (totalCategoryExpenses + expenseToSave.amount > categoryBudget.limit) {
          // console.log('Expense exceeds category budget limit');
         
          
          this.warningMessage = `You are about to add an expense of $${expenseToSave.amount} for ${expenseToSave.category}, but your total expenses for this category in ${this.getMonthFromDate(expenseToSave.date)} will exceed the budget limit of $${categoryBudget.limit}. Do you want to proceed?`;
          this.showWarningMessage = true;
          return true; // Return true if the expense exceeds the budget
        }
      }
    }
    return false; // Return false if it doesn't exceed the budget
  }
  addExpense() {
    // console.log('Adding expense:', this.newExpense);

    const expenseToSave = {
      ...this.newExpense,
      date: this.convertDateForBackend(this.newExpense.date),
    };

    // console.log('Converted expense date:', expenseToSave.date);

    // If the user has confirmed, bypass the budget check
    if (this.isConfirmed || !this.exceedsBudget(expenseToSave)) {
      // Proceed with adding or editing the expense
      if (this.editMode) {
        // console.log('Editing expense:', this.newExpense._id);
        // Editing existing expense
        this.expenseService
          .editExpense(this.newExpense._id!, expenseToSave)
          .subscribe(
            () => {
              // console.log('Expense edited successfully');
              this.loadExpenses();
              this.resetForm();
            },
            (error) => {
              console.error('Error editing expense:', error);
            }
          );
      } else {
        // console.log('Adding new expense');
        // Adding new expense
        this.expenseService.addExpense(expenseToSave).subscribe(
          () => {
            // console.log('Expense added successfully');
            this.loadExpenses();
            this.resetForm();
          },
          (error) => {
            console.error('Error adding expense:', error);
          }
        );
      }

      // Close modal after add/edit
      this.showAddExpenseModal = false;
      this.isConfirmed = false; // Reset confirmation flag after adding expense
    }
  }

  confirmAddExpense() {
    console.log('Confirming expense addition...');
    this.isConfirmed = true; // Set confirmation flag to true
    this.showWarningMessage = false; // Hide the warning message
    this.addExpense(); // Proceed with adding the expense
  }

  cancelAddExpense() {
    console.log('Canceling expense addition...');
    this.showWarningMessage = false; // Hide the warning message
    this.resetForm(); // Reset the form without adding the expense
    this.isConfirmed = false; // Reset confirmation flag when canceling
  }

  editExpense(expense: any) {
    // console.log('Editing expense:', expense);
    this.showAddExpenseModal = true;
    this.editMode = true;
    this.newExpense = { ...expense };
    this.newExpense.date = this.formatDate(this.newExpense.date);
  }

  deleteExpense(id: string) {
    // console.log('Deleting expense with ID:', id);
    this.expenseService.deleteExpense(id).subscribe(() => {
      // console.log('Expense deleted');
      this.loadExpenses();
    });
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    if (typeof date === 'string') return date;
    return new Date(date).toISOString().split('T')[0];
  }

  convertDateForBackend(date: string | Date): string {
    if (typeof date === 'string') return new Date(date).toISOString();
    return date ? date.toISOString() : new Date().toISOString();
  }

  resetForm() {
    // console.log('Resetting form...');
    this.newExpense = {
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0],
    };
    this.editMode = false;
    this.showAddExpenseModal = false;
    this.showWarningMessage = false; // Reset warning message
    this.allowAddExpense = false; // Reset flag
  }

  getMonthFromDate(date: string | Date): string {
    const d = new Date(date);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[d.getMonth()];
  }
}
