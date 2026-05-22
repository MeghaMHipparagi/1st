// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common'; // Required for *ngIf and *ngFor [cite: 445]
// import { FormsModule } from '@angular/forms';     // Required for [(ngModel)] [cite: 447]
// import { ApiService } from '../../services/api.service';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, FormsModule], // Explicit standalone imports [cite: 443]
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent implements OnInit {
//   isLoading: boolean = false;
//   errorMessage: string = '';
//   successMessage: string = '';

//   habits: any[] = [];
//   myLogs: any[] = [];

//   // Form binding matching CreateLogRequestDto [cite: 107, 277]
//   logForm = {
//     habitId: null,
//     quantity: 1
//   };

//   username: string = '';
//   userRole: string = '';
//   userTeamId: number | null = null;
//   teamTotalPoints: number = 0;

//   constructor(private apiService: ApiService) {}

//   ngOnInit(): void {
//     // Read session context from localStorage via Person 3 service helpers [cite: 361, 543]
//     this.username = this.apiService.getUsername();
//     this.userRole = this.apiService.getRole();
//     this.userTeamId = this.apiService.getTeamId();
    
//     this.loadDashboardData();
//   }

//   loadDashboardData(): void {
//     this.isLoading = true;
//     this.errorMessage = '';

//     // Fetch active master habits [cite: 347]
//     this.apiService.getHabits().subscribe({
//       next: (data) => {
//         this.habits = data.filter((h: any) => h.isActive);
//       },
//       error: (err) => {
//         this.errorMessage = 'Failed to load habits list.';
//         this.isLoading = false;
//       }
//     });

//     // Fetch personal logs [cite: 350]
//     this.apiService.getMyLogs().subscribe({
//       next: (data) => {
//         this.myLogs = data;
//         this.isLoading = false;
//       },
//       error: (err) => {
//         this.errorMessage = 'Failed to load personal logs.';
//         this.isLoading = false;
//       }
//     });

//     // Sync current team total metrics [cite: 343]
//     if (this.userTeamId) {
//       this.apiService.getTeams().subscribe({
//         next: (teams) => {
//           const myTeam = teams.find((t: any) => t.id === this.userTeamId);
//           if (myTeam) {
//             this.teamTotalPoints = myTeam.totalPoints;
//           }
//         },
//         error: (err) => console.error('Failed to sync team stats', err)
//       });
//     }
//   }

//   submitLog(): void {
//     if (!this.logForm.habitId || this.logForm.quantity <= 0) {
//       this.errorMessage = 'Please select a habit and enter a valid quantity.';
//       return;
//     }

//     this.isLoading = true;
//     this.errorMessage = '';
//     this.successMessage = '';

//     const payload = {
//       habitId: Number(this.logForm.habitId),
//       quantity: Number(this.logForm.quantity)
//     };

//     // Post log entry to single connection point API [cite: 349, 543]
//     this.apiService.createLog(payload).subscribe({
//       next: (res) => {
//         this.successMessage = `Successfully logged ${res.quantity} instance(s) of ${res.habitName}!`;
//         this.logForm.habitId = null;
//         this.logForm.quantity = 1;
        
//         // Instant Client-side Reactivity: Recalculate KPIs instantly 
//         this.loadDashboardData();
//       },
//       error: (err) => {
//         this.errorMessage = 'Error submitting habit log.';
//         this.isLoading = false;
//       }
//     });
//   }

//   // --- KPI Getters for Instant Template Sync --- [cite: 311, 545]
//   get totalPersonalPoints(): number {
//     return this.myLogs.reduce((sum, log) => sum + log.pointsAwarded, 0);
//   }

//   get totalCarbonOffset(): number {
//     return this.myLogs.reduce((sum, log) => sum + log.carbonOffsetAwarded, 0);
//   }

//   get logsTodayCount(): number {
//     const todayStr = new Date().toDateString();
//     return this.myLogs.filter(log => new Date(log.loggedAt).toDateString() === todayStr).length;
//   }

//   get isAdmin(): boolean {
//     return this.userRole === 'Admin';
//   }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';     
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  habits: any[] = [];
  myLogs: any[] = [];

  logForm = {
    habitId: null,
    quantity: 1
  };

  username: string = '';
  userRole: string = '';
  userTeamId: number | null = null;
  teamTotalPoints: number = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.username = this.apiService.getUsername() || 'Eco User'; [cite: 629]
    this.userRole = this.apiService.getRole() || 'User'; [cite: 629]
    this.userTeamId = this.apiService.getTeamId(); [cite: 630]
    
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getHabits().subscribe({
      next: (data) => {
        this.habits = data.filter((h: any) => h.isActive); [cite: 638]
      },
      error: (err) => {
        this.errorMessage = 'Failed to load habits list.';
        this.isLoading = false;
      }
    });

    this.apiService.getMyLogs().subscribe({
      next: (data) => {
        this.myLogs = data; [cite: 640]
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load personal logs.';
        this.isLoading = false;
      }
    });

    if (this.userTeamId) {
      this.apiService.getTeams().subscribe({
        next: (teams) => {
          const myTeam = teams.find((t: any) => t.id === this.userTeamId); [cite: 635]
          if (myTeam) {
            this.teamTotalPoints = myTeam.totalPoints;
          }
        },
        error: (err) => console.error('Failed to sync team stats', err)
      });
    }
  }

  submitLog(): void {
    if (!this.logForm.habitId || this.logForm.quantity <= 0) {
      this.errorMessage = 'Please select a habit and enter a valid quantity.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      habitId: Number(this.logForm.habitId),
      quantity: Number(this.logForm.quantity)
    };

    this.apiService.createLog(payload).subscribe({
      next: (res) => {
        this.successMessage = `Successfully logged instance(s)!`; [cite: 639]
        this.logForm.habitId = null;
        this.logForm.quantity = 1;
        this.loadDashboardData();
      },
      error: (err) => {
        this.errorMessage = 'Error submitting habit log.';
        this.isLoading = false;
      }
    });
  }

  get totalPersonalPoints(): number {
    return this.myLogs.reduce((sum, log) => sum + (log.pointsAwarded || 0), 0);
  }

  get totalCarbonOffset(): number {
    return this.myLogs.reduce((sum, log) => sum + (log.carbonOffsetAwarded || 0), 0);
  }

  get logsTodayCount(): number {
    const todayStr = new Date().toDateString();
    return this.myLogs.filter(log => new Date(log.loggedAt).toDateString() === todayStr).length;
  }

  get isAdmin(): boolean {
    return this.apiService.isAdmin(); [cite: 633]
  }
}