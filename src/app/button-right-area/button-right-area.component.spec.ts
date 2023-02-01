import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonRightAreaComponent } from './button-right-area.component';

describe('ButtonRightAreaComponent', () => {
  let component: ButtonRightAreaComponent;
  let fixture: ComponentFixture<ButtonRightAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonRightAreaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonRightAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
