import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceuilParticipantComponent } from './acceuil-participant.component';

describe('AcceuilParticipantComponent', () => {
  let component: AcceuilParticipantComponent;
  let fixture: ComponentFixture<AcceuilParticipantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceuilParticipantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceuilParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
