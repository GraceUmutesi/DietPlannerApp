import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMealPlanComponent } from './new-meal-plan.component';

describe('NewMealPlanComponent', () => {
  let component: NewMealPlanComponent;
  let fixture: ComponentFixture<NewMealPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMealPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMealPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
