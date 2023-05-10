import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPresentateurComponent } from './detail-presentateur.component';

describe('DetailPresentateurComponent', () => {
  let component: DetailPresentateurComponent;
  let fixture: ComponentFixture<DetailPresentateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPresentateurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPresentateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
