import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanesAllComponent } from './planes-all.component';

describe('PlanesAllComponent', () => {
  let component: PlanesAllComponent;
  let fixture: ComponentFixture<PlanesAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanesAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanesAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
