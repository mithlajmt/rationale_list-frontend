import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-rational-list',
  templateUrl: './rational-list.component.html',
  styleUrls: ['./rational-list.component.css']
})
export class RationalListComponent implements OnInit {
  show = false;
  rationaleData: any[] = [];
  currentPage = 1;
  totalPages = 1;
  pageSize = 8;
  
  selectedGroup: number | null | string= '';
  selectedSpecialty: string | null| string  = '' ;
  specialtyFilterText = '';

  rationaleGroups = [
    { GroupID: 0, GroupName: 'Rationale defined by Procedure to Procedure (PTP) edits' },
    { GroupID: 1, GroupName: 'Rationale defined by National Council on Compensation Insurance (NCCI)' },
    { GroupID: 2, GroupName: 'Most frequently used rationale' },
    { GroupID: 3, GroupName: 'All others' },
    { GroupID: 4, GroupName: 'Rationale that are applicable to certain modifiers' },
    { GroupID: 5, GroupName: 'Client specific rationale' },
  ];
  
  specialtyCodes = [
    "BRAIN", "BREAST", "CARD-SURG", "CVM", "DERM", "ENT", "GEN-SURG",
    "HAND", "INJECTION", "NES", "ORS", "PHM", "PLS", "PM", "POD", "URO",
    "VASC-SURG", "DME", "OPH"
  ];


  constructor(
    private rServ: UserService,
    private router: Router,
    private loading: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadRationaleData(this.currentPage);
  }

  loadRationaleData(page: number): void {
    this.loading.show()
    this.rServ.getRationalList(page, this.pageSize, this.selectedGroup, this.selectedSpecialty).subscribe({
      next: (res: any) => {
        console.log(res.t)
        this.rationaleData = res.data.map((rationale: any) => ({
          ...rationale,
        }));
        this.loading.hide()
        this.show = true;
        this.totalPages = res.pagination.totalPages;
      },
      error: (error) => {
        console.error('Error fetching rationale data:', error);
        alert(error.error.message)
        this.loading.hide()
      }
    });
  }
  

  applyFilters(): void {
    this.currentPage = 1; // Reset to first page when filters are applied
    this.loadRationaleData(this.currentPage);
  }

  // Pagination functions
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadRationaleData(page);
    }
  }


  navigateToDetails(rationaleId: number): void {
    this.router.navigate([`/user/rationale/${rationaleId}`]);
  }

  navigateToAddNew(): void {
    this.router.navigate([`/user/rationale/add`]);
  }
}
