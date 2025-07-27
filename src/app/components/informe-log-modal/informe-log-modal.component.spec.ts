import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeLogModalComponent } from './informe-log-modal.component';

describe('InformeLogModalComponent', () => {
  let component: InformeLogModalComponent;
  let fixture: ComponentFixture<InformeLogModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformeLogModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformeLogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
