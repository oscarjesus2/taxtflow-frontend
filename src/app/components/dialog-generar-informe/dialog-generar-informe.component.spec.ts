import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGenerarInformeComponent } from './dialog-generar-informe.component';

describe('DialogGenerarInformeComponent', () => {
  let component: DialogGenerarInformeComponent;
  let fixture: ComponentFixture<DialogGenerarInformeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogGenerarInformeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGenerarInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
