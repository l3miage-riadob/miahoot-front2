import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffichageResultatsComponent } from './affichage-resultats.component';

describe('AffichageResultatsComponent', () => {
  let component: AffichageResultatsComponent;
  let fixture: ComponentFixture<AffichageResultatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffichageResultatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffichageResultatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
