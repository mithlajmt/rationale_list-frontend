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
  filteredSpecialties: any[] = [];
  showSpecialtyInput = false;
  isEditMode = false;
  searchTerm: any;
  modifierInput = '';
  isEditingProcedure: any = {};

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
    if (this.isEditMode) this.loadRationaleData();
  }

  private initializeForm(): void {
    this.rationalForm = this.fb.group({
      rationaleSummary: ['', Validators.required],
      rationaleText: ['', Validators.required],
      Module: [''],
      Enable: [true],
      Decision: ['', Validators.required],
      specialties: this.fb.array([], [Validators.required, this.specialtyRequiredValidator()]),
      procedures: this.fb.array([]),
      modifiers: ['']
    });
  }
  
  private loadSpecialties(): void {
    this.rServe.getSpecialityList().subscribe({
      next: (res: any) => {
        const existingSpecialtyCodes = this.rationaleData?.specialties.map((s: any) => s.SpecialtyCode) || [];
        this.specialtiesList = res.data.filter((specialty: any) =>
          !existingSpecialtyCodes.includes(specialty.SpecialtyCode)
        );
      },
      error: (error) => console.error("Error fetching specialty list:", error)
    });
  }


  toggleSpecialtyInput() {
    this.showSpecialtyInput = !this.showSpecialtyInput;
    if (this.showSpecialtyInput) {
      this.loadSpecialties();
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
    specialtiesArray.push(this.createSpecialtyFormGroup({
      SpecialtyCode: specialty.SpecialtyCode,
      Enable: true
    }));
    this.specialtiesList = this.specialtiesList.filter(s => s.SpecialtyCode !== specialty.SpecialtyCode);
    this.filteredSpecialties = this.specialtiesList.filter(s =>
      s.SpecialtyCode.toLowerCase().includes(this.searchTerm?.toLowerCase() || '')
    );
    this.searchTerm = '';
    this.showSpecialtyInput = false;
  }


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
        this.patchFormValues();
      },
      error: (error) => console.error("Error fetching rationale data:", error)
    });
  }

  private patchFormValues(): void {
    this.rationalForm.patchValue({
      rationaleSummary: this.rationaleData?.RationaleSummary || '',
      rationaleText: this.rationaleData?.RationaleText || '',
      Module: this.rationaleData?.Module || '',
      Enable: this.rationaleData?.Enable || false,
      Decision: this.rationaleData.decision[0]?.DecisionText || '',
      modifiers: this.rationaleData?.modifiers[0]?.ModifierList || ''
    });

    const specialtiesArray = this.rationalForm.get('specialties') as FormArray;
    specialtiesArray.clear();
    (this.rationaleData?.specialties || []).forEach((specialty: any) => {
      specialtiesArray.push(this.createSpecialtyFormGroup(specialty));
    });

    const proceduresArray = this.rationalForm.get('procedures') as FormArray;
    proceduresArray.clear();
    (this.rationaleData?.procedures || []).forEach((procedure: any) => {
      proceduresArray.push(this.createProcedureFormGroup(procedure));
    });
  }

  private createSpecialtyFormGroup(specialty: any): FormGroup {
    return this.fb.group({
      Enable: [specialty.Enable || false],
      SpecialtyCode: [specialty.SpecialtyCode || '', Validators.required]
    });
  }

  addSingleServiceCode(): void {
    const proceduresArray = this.rationalForm.get('procedures') as FormArray;
    proceduresArray.push(this.createProcedureFormGroup({ serviceCode: '' }));
  }

  addServiceCodeRange(): void {
    const proceduresArray = this.rationalForm.get('procedures') as FormArray;
    proceduresArray.push(this.createProcedureFormGroup({ from: '', to: '' }));
  }

  removeProcedure(index: number): void {
    const proceduresArray = this.rationalForm.get('procedures') as FormArray;
    proceduresArray.removeAt(index);
  }

  private createProcedureFormGroup(procedure: any): FormGroup {
    if (procedure.serviceCodeList || procedure.serviceCode !== undefined) {
      return this.fb.group({
        serviceCode: [procedure.serviceCodeList, Validators.required]
      });
    } else {
      return this.fb.group({
        from: [procedure.serviceCodeFrom, Validators.required],
        to: [procedure.serviceCodeTo, Validators.required],
        _id: [procedure._id]
      });
    }
  }

  addProcedure(): void {
    const proceduresArray = this.procedures;
    proceduresArray.push(this.createProcedureFormGroup({}));
  }

  toggleEditProcedure(index: number): void {
    this.isEditingProcedure[index] = !this.isEditingProcedure[index];
  }

  get procedures(): FormArray {
    return this.rationalForm.get('procedures') as FormArray;
  }

  getProcedureFormGroup(index: number): FormGroup {
    return this.procedures.at(index) as FormGroup;
  }

  addModifier(): void {
    const currentModifiers = this.rationalForm.get('modifiers')?.value || '';
    const modifiersArray = currentModifiers ? currentModifiers.split(',') : [];
    if (this.modifierInput.length === 2 && !modifiersArray.includes(this.modifierInput.toUpperCase())) {
      modifiersArray.push(this.modifierInput.toUpperCase());
      this.rationalForm.patchValue({ modifiers: modifiersArray.join(',') });
      this.modifierInput = '';
    }
  }

  removeModifier(modifier: string): void {
    const modifiersArray = (this.rationalForm.get('modifiers')?.value || '').split(',');
    const updatedModifiers = modifiersArray.filter((mod: string) => mod !== modifier);
    this.rationalForm.patchValue({ modifiers: updatedModifiers.join(',') });
  }

  onSubmit(): void {
    if (this.rationalForm.invalid) {
      this.rationalForm.markAllAsTouched();
      console.error("Form is invalid. Please check the required fields.");
      return;
    }
    console.log(this.rationalForm.value);
  }

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
    this.rationalForm.patchValue({ Enable: !currentValue });
  }
  private specialtyRequiredValidator(): any {
    return (control: any): { [key: string]: boolean } | null => {
      // Check if the control is an instance of FormArray
      if (control instanceof FormArray) {
        return control.length > 0 ? null : { required: true };
      }
      return null;
    };
  }
  
}
