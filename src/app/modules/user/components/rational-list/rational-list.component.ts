// rational-list.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rational-list',
  templateUrl: './rational-list.component.html',
  styleUrls: ['./rational-list.component.css']
})
export class RationalListComponent implements OnInit {
  show = false;
  rationaleData: any[] = [];

  constructor(
    private rServ: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rServ.getRationalList().subscribe({
      next: (res: any) => {
        this.rationaleData = res.data.map((rationale: any) => ({
          ...rationale,
          enable: rationale.enable || false
        }));
        this.show = true;
      },
      error: (error) => {
        console.error('Error fetching rationale data:', error);
      }
    });
  }

  navigateToDetails(rationaleId: number): void {
    this.router.navigate([`/user/rationale/${rationaleId}`]);
  }

  navigateToAddNew(){
    this.router.navigate([`/user/rationale/add`]);

  }

  toggleSpecialty(rationale: any, event: Event): void {
    event.stopPropagation(); // Prevents triggering the navigation
    rationale.enable = !rationale.enable;
    // Optionally, update backend with new enable status
  }
}
