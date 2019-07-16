import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisRadarChartComponent } from './vis-radar-chart.component';

describe('VisRadarChartComponent', () => {
  let component: VisRadarChartComponent;
  let fixture: ComponentFixture<VisRadarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisRadarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisRadarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
