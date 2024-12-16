import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ExpenseService } from '../../services/expense.service';
import { IncomeService } from '../../services/income.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  income: { source: string; amount: number }[] = [];
  expenses: { category: string; amount: number }[] = [];
  savingsGoals: { name: string; targetAmount: number; currentAmount: number }[] = [];
  report: any = null;
  savingsGoalName: string = '';
  savingsGoal: number = 0;
  totalIncome: number = 0;
  totalExpenses: number = 0;
  savingsGoalProgress: number = 0;
  categoryStatus: { [key: string]: string } = {};

  incomeChartData: any;
  expenseChartData: any;
  budgetChartData: any;

  chartOptions = {
    plugins: {
      legend: {
        position: 'top',
      },
    },
    responsive: true,
  };

  chartData: { labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string[]; }[]; } | undefined;
  savingsGoalId: any;
  totalBudget: number = 0;

  budget: { category: string; amount: number }[] = [];

  constructor(
    private dashboardService: DashboardService,
    private expenseService: ExpenseService,
    private cdr: ChangeDetectorRef,
    private incomeService: IncomeService,
  ) {}

  ngOnInit(): void {
    console.log('Dashboard component initialized');
    this.getIncome();
    this.getExpenses();
    this.getSavingsGoal();
    this.getBudget();
  }

  getIncome(): void {
    console.log('Fetching income data...');
    this.dashboardService.getIncome().subscribe(
      (data: any[]) => {
        console.log('Income data received:', data);
        if (data && data.length > 0) {
          this.income = data;
          this.calculateTotalIncome();
          this.prepareIncomeChart();
        } else {
          console.error('No income data found.');
        }
      },
      (error) => {
        console.error('Error fetching income', error);
      }
    );
  }

  calculateTotalIncome(): void {
    console.log('Calculating total income...');
    if (this.income && this.income.length > 0) {
      this.totalIncome = this.income.reduce((sum, incomeItem) => sum + (incomeItem.amount || 0), 0);
      console.log('Total income:', this.totalIncome);
      this.calculateSavingsProgress();
    } else {
      this.totalIncome = 0;
      console.log('No income data to calculate total income.');
    }
  }

  prepareIncomeChart(): void {
    console.log('Preparing income chart...');
    const aggregatedIncome: { [key: string]: number } = {};
    this.income.forEach((incomeItem) => {
      if (incomeItem && incomeItem.source) {
        if (aggregatedIncome[incomeItem.source]) {
          aggregatedIncome[incomeItem.source] += incomeItem.amount || 0;
        } else {
          aggregatedIncome[incomeItem.source] = incomeItem.amount || 0;
        }
      }
    });

    const labels = Object.keys(aggregatedIncome);
    const data = Object.values(aggregatedIncome);

    this.incomeChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        },
      ],
    };
    console.log('Income chart data prepared:', this.incomeChartData);
  }

  getExpenses(): void {
    console.log('Fetching expense data...');
    this.expenseService.getExpenses().subscribe(
      (data: any[]) => {
        console.log('Expense data received:', data);
        if (data && data.length > 0) {
          this.expenses = data;
          this.calculateTotalExpenses();
          this.prepareExpenseChart();
          this.compareBudgetAndExpenses();
        } else {
          console.error('No expense data found.');
        }
      },
      (error) => {
        console.error('Error fetching expenses', error);
      }
    );
  }

  compareBudgetAndExpenses(): void {
    console.log('Comparing budget and expenses...');
    this.categoryStatus = {};  // Reset the category status
    this.budget.forEach(budgetItem => {
      const budgetAmount = budgetItem.amount || 0;
      const expenseItem = this.expenses.find(expense => expense.category === budgetItem.category);
      const expenseAmount = expenseItem ? expenseItem.amount : 0;

      if (expenseAmount > budgetAmount) {
        this.categoryStatus[budgetItem.category] = 'Exceeded';
      } else if (expenseAmount < budgetAmount) {
        this.categoryStatus[budgetItem.category] = 'Under';
      } else {
        this.categoryStatus[budgetItem.category] = 'On Budget';
      }
    });
    console.log('Category status:', this.categoryStatus);
  }

  calculateTotalExpenses(): void {
    console.log('Calculating total expenses...');
    if (this.expenses && this.expenses.length > 0) {
      this.totalExpenses = this.expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
      console.log('Total expenses:', this.totalExpenses);
      this.calculateSavingsProgress();
    } else {
      this.totalExpenses = 0;
      console.log('No expense data to calculate total expenses.');
    }
  }

  prepareExpenseChart(): void {
    console.log('Preparing expense chart...');
    const aggregatedExpenses: { [key: string]: number } = {};
    this.expenses.forEach((expenseItem) => {
      if (expenseItem && expenseItem.category) {
        if (aggregatedExpenses[expenseItem.category]) {
          aggregatedExpenses[expenseItem.category] += expenseItem.amount || 0;
        } else {
          aggregatedExpenses[expenseItem.category] = expenseItem.amount || 0;
        }
      }
    });

    const labels = Object.keys(aggregatedExpenses);
    const data = Object.values(aggregatedExpenses);

    this.expenseChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#FFA07A', '#20B2AA', '#9370DB', '#FF4500'],
        },
      ],
    };
    console.log('Expense chart data prepared:', this.expenseChartData);
  }

  getSavingsGoal(): void {
    console.log('Fetching savings goal...');
    this.dashboardService.getSavingsGoal().subscribe(
      (data: any[]) => {
        console.log('Savings goal data received:', data);
        if (data && data.length > 0) {
          data.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
          const closestGoal = data[0];
          this.savingsGoalName = closestGoal.name || '';
          this.savingsGoal = closestGoal.targetAmount || 0;
          this.savingsGoalId = closestGoal._id || null;
          this.calculateSavingsProgress();
        } else {
          this.savingsGoal = 0;
          this.savingsGoalId = null;
          console.log('No savings goal found.');
          this.calculateSavingsProgress();
        }
      },
      (error) => {
        console.error('Error fetching savings goal', error);
      }
    );
  }

  calculateSavingsProgress(): void {
    console.log('Calculating savings progress...');
    if (this.savingsGoal > 0) {
      const availableSavings = this.totalIncome - this.totalExpenses;
      this.savingsGoalProgress = Math.min(
        (availableSavings / this.savingsGoal) * 100,
        100
      );
      this.savingsGoalProgress = Math.max(this.savingsGoalProgress, 0);
    } else {
      this.savingsGoalProgress = 0;
    }
    console.log('Savings progress:', this.savingsGoalProgress);
    this.cdr.detectChanges();
  }

  generateReport(): void {
    console.log('Generating report...');
    const incomeVsExpenses = this.totalIncome - this.totalExpenses;
    const budgetVariance = this.totalIncome - this.totalExpenses - this.savingsGoal;

    const reportData = {
      totalIncome: this.totalIncome,
      totalExpenses: this.totalExpenses,
      incomeVsExpenses: incomeVsExpenses,
      savingsGoal: this.savingsGoal,
      savingsProgress: this.savingsGoalProgress,
      budgetVariance: budgetVariance,
    };

    this.chartData = {
      labels: ['Income', 'Expenses'],
      datasets: [
        {
          label: 'Amount',
          data: [this.totalIncome, this.totalExpenses],
          backgroundColor: ['#4BC0C0', '#FF6384'],
        },
      ],
    };

    this.dashboardService.generateReport(reportData).subscribe(
      (data) => {
        console.log('Report generated:', data);
        this.report = data;
      },
      (error) => {
        console.error('Error generating report', error);
      }
    );
  }

  finishGoal(): void {
    console.log('Finishing savings goal...');
    const today = new Date();
    const goalToFinish = {
      name: this.savingsGoalName,
      amount: this.savingsGoal,
      date: today.toISOString().split('T')[0],
    };

    this.expenseService.addExpense({
      category: this.savingsGoalName,
      amount: this.savingsGoal,
      date: today.toISOString(),
    }).subscribe(
      (expenseResponse) => {
        console.log('Goal added to expenses:', expenseResponse);
        if (this.savingsGoalId) {
          this.dashboardService.deleteSavingsGoal(this.savingsGoalId).subscribe(
            (deleteResponse) => {
              console.log('Goal removed from savings goals:', deleteResponse);
              this.getSavingsGoal();
              this.refreshPageContent();
            },
            (error) => {
              console.error('Error deleting goal:', error);
            }
          );
        } else {
          console.error('No valid savings goal id to delete');
        }
      },
      (error) => {
        console.error('Error adding goal to expenses:', error);
      }
    );
  }

  refreshPageContent(): void {
    console.log('Refreshing page content...');
    this.getExpenses();
    this.getSavingsGoal();

    this.savingsGoalName = '';
    this.savingsGoal = 0;
    this.savingsGoalId = null;
    this.savingsGoalProgress = 0;
  }

  getBudget(): void {
    console.log('Fetching budget data...');
    this.dashboardService.getBudget().subscribe(
      (data: any[]) => {
        console.log('Fetched budget data:', data);
        if (data && data.length > 0) {
          this.budget = data;
          this.calculateTotalBudget();
          this.prepareBudgetChartData();
        } else {
          console.error('Budget data is empty or undefined');
        }
        
      },
      
      (error) => {
        console.error('Error fetching budget:', error);
      }
    );
    console.log('Fetched budget data:', this.budget);
  }

  calculateTotalBudget(): void {
    console.log('Calculating total budget...');
    this.totalBudget = 0;
    if (this.budget && this.budget.length > 0) {
      this.budget.forEach(budgetItem => {
        this.totalBudget += budgetItem.amount || 0;
      });
      console.log('Total budget:', this.totalBudget);
    } else {
      console.error('Budget data is empty, unable to calculate total budget');
    }
    this.prepareBudgetChartData();
  }

  prepareBudgetChartData() {
    console.log('Preparing budget chart...');
    
    // Assuming the budgetData is an array of objects with a 'categories' property
    const categories = this.budget.flatMap((budget: any) => budget.categories.map((item: any) => item.name));
    const limits = this.budget.flatMap((budget: any) => budget.categories.map((item: any) => item.limit));
  
    console.log('Categories:', categories);
    console.log('Limits:', limits);
  
    // Create the chart data
    this.budgetChartData = {
      labels: categories,
      datasets: [
        {
          data: limits,
          label: 'Budget Limits',
          backgroundColor: 'rgba(0, 123, 255, 0.5)', // Customize the color if you like
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1
        }
      ]
    };
  
    console.log('Budget Chart Data Prepared:', this.budgetChartData);
  }
}
