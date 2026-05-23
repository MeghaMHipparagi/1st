import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  items: any[] = [];
  loading: boolean = false;

  // Notification Banners
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // New Gig Forms Binding Model properties matching blueprint definitions
  title: string = '';
  description: string = '';
  rewardCredits: number = 0;
  category: number = 0; // Maps to numeric enums: 0 = Writing, 4 = Programming

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboardRegistry();
  }

  loadDashboardRegistry(): void {
    this.loading = true;
    this.apiService.getAll().subscribe({
      next: (data: any[]) => {
        this.items = data || [];
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to download real-time telemetry marketplace data.';
        this.loading = false;
      }
    });
  }

  // Role Validation Guards
  isManager(): boolean {
    const role = localStorage.getItem('role');
    return role?.toLowerCase() === 'manager';
  }

  getUsername(): string {
    return localStorage.getItem('username') || 'User';
  }

  // Performance-Optimized Computed Getters for KPI Metrics
  get pendingCount(): number {
    // Enum mapping: 0 = Open / Pending Evaluation
    return this.items.filter(item => item.status === 0).length;
  }

  get approvedCount(): number {
    // Enum mapping: 1 = Assigned or 4 = Completed configurations
    return this.items.filter(item => item.status === 1 || item.status === 4).length;
  }

  get rejectedCount(): number {
    // Enum mapping: 5 = Cancelled / Rejected status metrics
    return this.items.filter(item => item.status === 5).length;
  }

  // Interactive Form Action Submissions
  submitGigOrder(): void {
    this.clearNotifications();

    if (!this.title.trim() || !this.description.trim() || this.rewardCredits <= 0) {
      this.errorMessage = 'Validation Fail: Title, description, and valid reward values must be populated.';
      return;
    }

    const payload = {
      title: this.title,
      description: this.description,
      rewardCredits: Number(this.rewardCredits),
      category: Number(this.category),
      status: 0 // Initialize cleanly to Open / Pending
    };

    this.apiService.create(payload).subscribe({
      next: (response) => {
        this.successMessage = 'Gig listing created successfully! Wallet criteria bounds verified.';
        this.resetForm();
        this.loadDashboardRegistry();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Transaction Blocked: Stated reward value exceeds available wallet balance.';
      }
    });
  }

  // Management Operational Evaluation Control Functions
  approveGig(id: number): void {
    this.clearNotifications();
    this.apiService.updateStatus('gigs', id, 'approve', { comment: 'Approved via operational dashboard review.' }).subscribe({
      next: () => {
        this.successMessage = `Gig #${id} moved to Assigned pipeline state successfully.`;
        this.loadDashboardRegistry();
      },
      error: (err) => {
        this.errorMessage = 'Authorization Denied: Server signature rejected execution permissions (403 Forbidden).';
      }
    });
  }

  rejectGig(id: number): void {
    this.clearNotifications();
    this.apiService.updateStatus('gigs', id, 'reject', { comment: 'Rejected by management evaluation standards.' }).subscribe({
      next: () => {
        this.successMessage = `Gig #${id} cancelled and archived successfully.`;
        this.loadDashboardRegistry();
      },
      error: (err) => {
        this.errorMessage = 'Action Refused: Server rejected transactional state adjustment modifications.';
      }
    });
  }

  // Interface Housekeeping Utility Helpers
  clearNotifications(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }

  resetForm(): void {
    this.title = '';
    this.description = '';
    this.rewardCredits = 0;
    this.category = 0;
  }

  // Platform Mapping Utility Translators
  getCategoryName(val: number): string {
    const categories = ['Writing & Translation', 'Graphic Design', 'Photography', 'Campus Tutoring', 'Software Programming', 'Academic Research'];
    return categories[val] || 'General Task Scope';
  }

  getStatusName(val: number): string {
    const statuses = ['Open / Pending', 'Assigned', 'In Progress', 'Pending Completion', 'Completed', 'Cancelled / Rejected'];
    return statuses[val] || 'Unknown Flag';
  }
}