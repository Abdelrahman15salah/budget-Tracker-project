import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budget.service';

@Component({
  selector: 'app-budgets',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
})
export class BudgetsComponent implements OnInit {
  budgets: any[] = [];
  newBudget: { _id?: string; month: string; categories: { name: string; limit: number }[] } = {
    month: '',
    categories: [{ name: '', limit: 0 }],
  };
  showAddBudgetModal: boolean = false; 
  editMode: boolean = false; 
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ]; // List of months

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets() {
    this.budgetService.getBudgets().subscribe((data) => {
      this.budgets = data;
    });
  }

  addBudget() {
    const budgetToSave = { ...this.newBudget };

    const existingBudget = this.budgets.find(budget => budget.month === this.newBudget.month);

    if (existingBudget) {
      this.updateBudget(existingBudget);
    } else {
      this.budgetService.addBudget(budgetToSave).subscribe(() => {
        this.loadBudgets();
        this.resetForm();
      });
    }
  }

  updateBudget(existingBudget: any) {
    const updatedCategories = [...existingBudget.categories];

    this.newBudget.categories.forEach(newCategory => {
      const existingCategory = updatedCategories.find(category => category.name === newCategory.name);

      if (existingCategory) {
        existingCategory.limit = newCategory.limit;
      } else {
        updatedCategories.push(newCategory);
      }
    });

    const updatedBudget = { ...existingBudget, categories: updatedCategories };

    this.budgetService.editBudget(existingBudget._id!, updatedBudget).subscribe(() => {
      this.loadBudgets();
      this.resetForm();
    });
  }

  editBudget(budget: any) {
    this.showAddBudgetModal = true; 
    this.editMode = true;
    this.newBudget = { ...budget }; 
  }

  // Delete a budget
  deleteBudget(id: string) {
    this.budgetService.deleteBudget(id).subscribe(() => {
      this.loadBudgets();
    });
  }

  addCategory(): void {
    this.newBudget.categories.push({ name: '', limit: 0 });
  }

  removeCategory(index: number): void {
    if (this.newBudget.categories.length > 1) {
      this.newBudget.categories.splice(index, 1);
    }
  }

  closeModal(): void {
    this.showAddBudgetModal = false;
    this.resetForm();
  }

  resetForm() {
    this.newBudget = {
      month: '',
      categories: [{ name: '', limit: 0 }],
    };
    this.editMode = false;
  }
}
