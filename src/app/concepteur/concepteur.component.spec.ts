import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcepteurComponent } from './concepteur.component';

describe('ConcepteurComponent', () => {
  let component: ConcepteurComponent;
  let fixture: ComponentFixture<ConcepteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConcepteurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConcepteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
