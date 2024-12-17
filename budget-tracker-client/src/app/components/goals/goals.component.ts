import { Component, OnInit } from '@angular/core';
import { GoalService } from '../../services/goal.service';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css'],
  standalone:false,
})
export class GoalsComponent implements OnInit {
  goals: any[] = []; // List of goals
  newGoal = { name: '', targetAmount: 0, deadline: '' }; // Form for adding a goal
  isLoading = true;
new: any;

  constructor(private goalService: GoalService) {}

  ngOnInit(): void {
    this.fetchGoals();
  }

  // Fetch goals from the server
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

  // Add a new goal
  addGoal() {
    const today = new Date();
    const selectedDate = new Date(this.newGoal.deadline);
  
    // Check if the deadline is in the past
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
        this.goals.push(goal); // Add the new goal to the list
        this.newGoal = { name: '', targetAmount: 0, deadline: '' }; // Reset the form
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
    if (!this.newGoal.deadline) return false; // If no date is selected
    const selectedDate = new Date(this.newGoal.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
    return selectedDate < today;
  }
}
