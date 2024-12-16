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
  showAddBudgetModal: boolean = false; // Flag to show/hide the modal
  editMode: boolean = false; // Flag to toggle between Add/Edit mode
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ]; // List of months

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.loadBudgets();
  }

  // Load all budgets from the backend
  loadBudgets() {
    this.budgetService.getBudgets().subscribe((data) => {
      this.budgets = data;
    });
  }

  // Add or update a budget
  addBudget() {
    const budgetToSave = { ...this.newBudget };

    // Check if the budget for the selected month already exists
    const existingBudget = this.budgets.find(budget => budget.month === this.newBudget.month);

    if (existingBudget) {
      // If the month exists, update it with new/updated categories
      this.updateBudget(existingBudget);
    } else {
      // If the month doesn't exist, add a new budget
      this.budgetService.addBudget(budgetToSave).subscribe(() => {
        this.loadBudgets();
        this.resetForm();
      });
    }
  }

  // Update the existing budget if it already exists
  updateBudget(existingBudget: any) {
    const updatedCategories = [...existingBudget.categories];

    // Loop through new categories and update/add to the existing ones
    this.newBudget.categories.forEach(newCategory => {
      const existingCategory = updatedCategories.find(category => category.name === newCategory.name);

      if (existingCategory) {
        // If category exists, update it
        existingCategory.limit = newCategory.limit;
      } else {
        // If category doesn't exist, add the new category
        updatedCategories.push(newCategory);
      }
    });

    // Create updated budget object
    const updatedBudget = { ...existingBudget, categories: updatedCategories };

    // Call service to update the budget with the new categories
    this.budgetService.editBudget(existingBudget._id!, updatedBudget).subscribe(() => {
      this.loadBudgets();
      this.resetForm();
    });
  }

  // Set the budget for editing
  editBudget(budget: any) {
    this.showAddBudgetModal = true; // Show the modal for editing
    this.editMode = true;
    this.newBudget = { ...budget }; // Copy existing budget with _id
  }

  // Delete a budget
  deleteBudget(id: string) {
    this.budgetService.deleteBudget(id).subscribe(() => {
      this.loadBudgets();
    });
  }

  // Add a new category to the budget
  addCategory(): void {
    this.newBudget.categories.push({ name: '', limit: 0 });
  }

  // Remove a category from the budget
  removeCategory(index: number): void {
    if (this.newBudget.categories.length > 1) {
      this.newBudget.categories.splice(index, 1);
    }
  }

  // Close the modal and reset the form
  closeModal(): void {
    this.showAddBudgetModal = false;
    this.resetForm();
  }

  // Reset the form after adding/editing a budget
  resetForm() {
    this.newBudget = {
      month: '',
      categories: [{ name: '', limit: 0 }],
    };
    this.editMode = false;
  }
}
