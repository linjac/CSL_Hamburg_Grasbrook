import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VizRadarChartComponent } from './viz-radar-chart.component';

describe('VizRadarChartComponent', () => {
  let component: VizRadarChartComponent;
  let fixture: ComponentFixture<VizRadarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VizRadarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VizRadarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
