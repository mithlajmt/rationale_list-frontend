// rational-data.component.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-rational-data',
  templateUrl: './rational-data.component.html',
  styleUrls: ['./rational-data.component.css']
})
export class RationalDataComponent implements OnInit {
  id: string | null = null;
  rationaleData: any = null;
  rationalForm!: FormGroup;
  DecisionsList: any[] = [];
  specialtiesList: any[] = [];
  isEditMode = false;

  showSpecialtyInput = false;
  filteredSpecialties: any[] = [];
  searchTerm:any;

  constructor(
    private rServe: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!(this.id && this.id !== 'add');

    this.initializeForm();
    this.loadDecisionList();
    
    if (this.isEditMode) {
      this.loadRationaleData();
    }
  }

   toggleSpecialtyInput() {
    this.showSpecialtyInput = !this.showSpecialtyInput;
    if(this.showSpecialtyInput){
       this.loadSpecialties()
      this.filteredSpecialties = this.specialtiesList;
    }
  }

  filterSpecialties(): void {
    this.filteredSpecialties = this.specialtiesList.filter(specialty =>
      specialty.SpecialtyCode.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  addSpecialty(specialty: any): void {
    const specialtiesArray = this.rationalForm.get('specialties') as FormArray;
  
    // Add the selected specialty to the FormArray
    specialtiesArray.push(this.createSpecialtyFormGroup({
      SpecialtyCode: specialty.SpecialtyCode,
      Enable: true
    }));
  
    // Remove the selected specialty from specialtiesList
    this.specialtiesList = this.specialtiesList.filter(
      (s) => s.SpecialtyCode !== specialty.SpecialtyCode
    );
  
    // Update filteredSpecialties to reflect the removed item
    this.filteredSpecialties = this.specialtiesList.filter(specialty =>
      specialty.SpecialtyCode.toLowerCase().includes(this.searchTerm?.toLowerCase() || '')
    );
  
    // Clear the search term and close the specialty input
    this.searchTerm = '';
    this.showSpecialtyInput = false;
  }
  
  private initializeForm(): void {
    this.rationalForm = this.fb.group({
      rationaleSummary: ['', Validators.required],
      rationaleText: ['', Validators.required],
      Module: ['', Validators.required],
      Enable: [true, Validators.required],
      Decision: ['', Validators.required],
      specialties: this.fb.array([]),
      procedures:this.fb.array([]),
      modifiers:['']
    });
  }

  specialitiesLoaded:boolean = false
  
   loadSpecialties(): void {
    this.rServe.getSpecialityList().subscribe({
      next: (res: any) => {
        const existingSpecialtyCode = this.rationaleData?.specialties.map((s: any) => s.SpecialtyCode ) || [];
        console.log(existingSpecialtyCode,'se')
  
        this.specialtiesList = res.data.filter((specialty: any) => 
          !existingSpecialtyCode.includes(specialty.SpecialtyCode)
        );
        this.specialitiesLoaded = true
      
      },
      error: (error) => console.error("Error fetching specialty list:", error)
    });
  }


  // loadProcedures(){
  //   // Add procedures to the formArray
  //   this.rationaleData?.procedures.forEach((procedure: any) => {
  //     const proceduresArray = this.rationalForm.get('procedures') as FormArray;
  //   });
  // }
  

  private loadDecisionList(): void {
    this.rServe.getDecisionList().subscribe({
      next: (res: any) => {
        this.DecisionsList = res.data.map((decision: any) => ({
          id: decision.id,
          DecisionText: decision.DecisionText,
        }));
      },
      error: (error) => console.error("Error fetching decision list:", error)
    });
  }

  private loadRationaleData(): void {
    this.rServe.getRationalData(this.id).subscribe({
      next: (res: any) => {
        this.rationaleData = res.data[0];
        console.log(this.rationaleData)
        this.patchFormValues();
      },
      error: (error) => console.error("Error fetching rationale data:", error)
    });
  }

  private patchFormValues(): void {
    // Patch basic form values
    this.rationalForm.patchValue({
      rationaleSummary: this.rationaleData?.RationaleSummary || '',
      rationaleText: this.rationaleData?.RationaleText || '',
      Module: this.rationaleData?.Module || '',
      Enable: this.rationaleData?.Enable || false,
      Decision: this.rationaleData.decision[0]?.DecisionText || '',
      modifiers: this.rationaleData?.Modifiers || ''
    });

    // Clear and rebuild specialties array
    const specialtiesArray = this.rationalForm.get('specialties') as FormArray;
    specialtiesArray.clear();

    // Add specialty form groups
    const specialties = this.rationaleData?.specialties || [];
    specialties.forEach((specialty: any) => {
      specialtiesArray.push(this.createSpecialtyFormGroup(specialty));
    });
  }

  private createSpecialtyFormGroup(specialty: any): FormGroup {
    return this.fb.group({
      // _id: [specialty._id || null],
      Enable: [specialty.Enable || false],
      SpecialtyCode: [specialty.SpecialtyCode || '', Validators.required]
    });
  }

  // Getter for easy access to specialties form array
  get specialties(): FormArray {
    return this.rationalForm.get('specialties') as FormArray;
  }

  

  toggleSpecialtyEnable(index: number): void {
    const specialty = this.specialties.at(index);
    const currentValue = specialty.get('Enable')?.value;
    specialty.patchValue({ Enable: !currentValue });
  }



  toggleEnable() {
    const currentValue = this.rationalForm.get('Enable')?.value;
    this.rationalForm.patchValue({
      Enable: !currentValue
    });
  }
  onSubmit(): void {
    console.log(this.rationalForm.value);
  }
}
