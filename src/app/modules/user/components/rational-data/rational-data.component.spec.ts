import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RationalDataComponent } from './rational-data.component';

describe('RationalDataComponent', () => {
  let component: RationalDataComponent;
  let fixture: ComponentFixture<RationalDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RationalDataComponent]
    });
    fixture = TestBed.createComponent(RationalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
