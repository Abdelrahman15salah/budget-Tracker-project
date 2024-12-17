import { Component, OnInit } from '@angular/core';
import { IncomeService } from '../../services/income.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css'],
})
export class IncomeComponent implements OnInit {
  incomes: any[] = [];
  newIncome: { amount: number; source: string; date: string } = {
    amount: 0,
    source: '',
    date: new Date().toISOString().split('T')[0],
  };
  showAddIncomeModal = false;
  editMode = false;
  currentIncomeId = '';

  constructor(
    private incomeService: IncomeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadIncomes();
  }

  loadIncomes() {
    this.incomeService.getIncomes().subscribe((data) => {
      this.incomes = data.map((income: any) => {
        try {
          const formattedDate = income.date ? new Date(income.date).toISOString().split('T')[0] : null;
          return { ...income, date: formattedDate };
        } catch (error) {
          console.error('Error formatting date for income:', income, error);
          return { ...income, date: null }; // Fallback for invalid dates
        }
      });
      this.sortIncomes(); // Sort incomes after loading
    });
  }

  addIncome() {
    const incomeToSave = {
      ...this.newIncome,
      date: new Date(this.newIncome.date).toISOString(), // Convert to ISO format
    };
  
    if (this.editMode) {
      this.incomeService
        .editIncome(this.currentIncomeId, incomeToSave)
        .subscribe(() => {
          this.loadIncomes();
          this.resetForm();
        });
    } else {
      this.incomeService.addIncome(incomeToSave).subscribe(() => {
        this.loadIncomes();
        this.resetForm();
      });
    }
  }

  editIncome(income: any) {
    this.showAddIncomeModal = true;
    this.editMode = true;
    this.currentIncomeId = income._id;
    this.newIncome = { ...income };
  }

  deleteIncome(id: string) {
    this.incomeService.deleteIncome(id).subscribe(() => {
      this.loadIncomes();
    });
  }

  resetForm() {
    this.newIncome = {
      amount: 0,
      source: '',
      date: new Date().toISOString().split('T')[0],  // Reset to today's date in `yyyy-MM-dd` format
    };
    this.editMode = false;
    this.showAddIncomeModal = false;
  }

  sortOption: string = 'date'; // Default sort option

  sortIncomes() {
    switch (this.sortOption) {
      case 'name':
        this.incomes.sort((a, b) => a.source.localeCompare(b.source));
        break;
      case 'date':
        this.incomes.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'amount':
        this.incomes.sort((a, b) => a.amount - b.amount);
        break;
      default:
        break;
    }
  }
}
