import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarInformeComponent } from './generar-informe.component';

describe('DialogGenerarInformeComponent', () => {
  let component: GenerarInformeComponent;
  let fixture: ComponentFixture<GenerarInformeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarInformeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
