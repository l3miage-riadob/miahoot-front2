import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentateurComponent } from './presentateur.component';

describe('PresentateurComponent', () => {
  let component: PresentateurComponent;
  let fixture: ComponentFixture<PresentateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentateurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
