import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false,  
})

export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.pageYOffset > 0) {
      navbar?.classList.add('sticky');
    } else {
      navbar?.classList.remove('sticky');
    }
  }

  ngOnInit() {
    this.checkLoginStatus();
    this.router.events.subscribe(() => {
      this.checkLoginStatus();
    });
  }

  
  checkLoginStatus() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;  
  }

  // Sign out the user
  signOut() {
    this.authService.logout(); 
    this.isLoggedIn = false; 
    this.router.navigate(['/login']);  
  }
}
