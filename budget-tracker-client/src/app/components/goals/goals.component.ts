import { Component, OnInit } from '@angular/core';
import { GoalService } from '../../services/goal.service';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css'],
  standalone:false,
})
export class GoalsComponent implements OnInit {
  goals: any[] = []; 
  newGoal = { name: '', targetAmount: 0, deadline: '' }; 
  isLoading = true;
new: any;

  constructor(private goalService: GoalService) {}

  ngOnInit(): void {
    this.fetchGoals();
  }

 
  fetchGoals(): void {
    this.goalService.getGoals().subscribe({
      next: (data) => {
        this.goals = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching goals:', err);
        this.isLoading = false;
      }
    });
  }

  
  addGoal() {
    const today = new Date();
    const selectedDate = new Date(this.newGoal.deadline);
  
    
    if (selectedDate < today) {
      alert('You cannot set a goal date that has already passed.');
      return;
    }
  
    if (!this.newGoal.name || !this.newGoal.targetAmount || !this.newGoal.deadline) {
      alert('Please fill in all fields.');
      return;
    }
  
    this.goalService.addGoal(this.newGoal).subscribe(
      (goal) => {
        this.goals.push(goal); 
        this.newGoal = { name: '', targetAmount: 0, deadline: '' }; 
        this.fetchGoals();
      },
      (error) => {
        console.error('Error adding goal:', error);
        alert('Failed to add goal. Please try again.');
      }
    );
  }
  // Delete a goal
  deleteGoal(goalId: string): void {
    if (!goalId) {
      console.error('Invalid goalId:', goalId);
      return;
    }

    this.goalService.deleteGoal(goalId).subscribe({
      next: () => {
        this.goals = this.goals.filter(goal => goal._id !== goalId);
      },
      error: (error) => {
        console.error('Error deleting goal:', error);
      }
    });
  }
  isDeadlineInvalid(): boolean {
    if (!this.newGoal.deadline) return false; 
    const selectedDate = new Date(this.newGoal.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  }
}
