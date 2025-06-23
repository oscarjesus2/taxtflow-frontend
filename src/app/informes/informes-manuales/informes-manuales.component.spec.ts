import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformesManualesComponent } from './informes-manuales.component';

describe('InformesManualesComponent', () => {
  let component: InformesManualesComponent;
  let fixture: ComponentFixture<InformesManualesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformesManualesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformesManualesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
