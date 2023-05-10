import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiahootUploaderComponent } from './miahoot-uploader.component';

describe('MiahootUploaderComponent', () => {
  let component: MiahootUploaderComponent;
  let fixture: ComponentFixture<MiahootUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiahootUploaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiahootUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
