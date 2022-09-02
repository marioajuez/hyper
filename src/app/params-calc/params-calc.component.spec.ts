import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamsCalcComponent } from './params-calc.component';

describe('ParamsCalcComponent', () => {
  let component: ParamsCalcComponent;
  let fixture: ComponentFixture<ParamsCalcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamsCalcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamsCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
