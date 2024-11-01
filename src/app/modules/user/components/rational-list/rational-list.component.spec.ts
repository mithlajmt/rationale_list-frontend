import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RationalListComponent } from './rational-list.component';

describe('RationalListComponent', () => {
  let component: RationalListComponent;
  let fixture: ComponentFixture<RationalListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RationalListComponent]
    });
    fixture = TestBed.createComponent(RationalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
