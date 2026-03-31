import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit, OnDestroy {
  timer = signal<number>(5);
  private intervalId: any;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.intervalId = setInterval(() => {
      const current = this.timer();
      if (current > 1) {
        this.timer.set(current - 1);
      } else {
        this.redirect();
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  redirect() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null; // Prevent double execution
    }
    
    // Check if user is logged in
    const isLogged = this.authService.isAuthenticated();
    if (isLogged) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
