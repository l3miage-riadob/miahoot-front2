import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiahootComponent } from './miahoot.component';

describe('QuestionnaireComponent', () => {
  let component: MiahootComponent;
  let fixture: ComponentFixture<MiahootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiahootComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiahootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
