import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  totalGigsCount: number = 0;
  activeAssignedCount: number = 0;
  completedPayoutsCount: number = 0;
  loading: boolean = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPlatformStatistics();
  }

  loadPlatformStatistics(): void {
    this.loading = true;
    this.apiService.getAll().subscribe({
      next: (gigs: any[]) => {
        if (gigs) {
          this.totalGigsCount = gigs.length;
          // State Machine Enums mapping: 1 = Assigned, 4 = Completed
          this.activeAssignedCount = gigs.filter(g => g.status === 1).length;
          this.completedPayoutsCount = gigs.filter(g => g.status === 4).length;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to compile marketplace telemetries', err);
        this.loading = false;
      }
    });
  }
}