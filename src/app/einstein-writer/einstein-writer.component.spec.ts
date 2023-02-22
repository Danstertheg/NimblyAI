import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EinsteinWriterComponent } from './einstein-writer.component';

describe('EinsteinWriterComponent', () => {
  let component: EinsteinWriterComponent;
  let fixture: ComponentFixture<EinsteinWriterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EinsteinWriterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EinsteinWriterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
