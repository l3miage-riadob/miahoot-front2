import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailConcepteurComponent } from './detail-concepteur.component';

describe('DetailConcepteurComponent', () => {
  let component: DetailConcepteurComponent;
  let fixture: ComponentFixture<DetailConcepteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailConcepteurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailConcepteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
