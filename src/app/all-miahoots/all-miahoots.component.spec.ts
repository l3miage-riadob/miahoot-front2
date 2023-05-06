import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMiahootsComponent } from './all-miahoots.component';

describe('AllMiahootsComponent', () => {
  let component: AllMiahootsComponent;
  let fixture: ComponentFixture<AllMiahootsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllMiahootsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllMiahootsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
