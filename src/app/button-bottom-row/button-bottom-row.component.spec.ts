import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonBottomRowComponent } from './button-bottom-row.component';

describe('ButtonBottomRowComponent', () => {
  let component: ButtonBottomRowComponent;
  let fixture: ComponentFixture<ButtonBottomRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonBottomRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonBottomRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
