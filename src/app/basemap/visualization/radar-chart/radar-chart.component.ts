import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import {HttpClient } from "@angular/common/http";
import { interval, of, Observable } from "rxjs";
import * as rxjs from "rxjs/index";

import { CityIOService } from "../../../services/cityio.service";

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class RadarChartComponent implements OnInit {

  //initialize default chart config
  @ViewChild('chart', {static: true}) private chartContainer: ElementRef;
  data: any;
  width: number;
  height: number;
  vis = {svg: null};

  private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;

  constructor( private cityio: CityIOService ) {}

  ngOnInit() {
    this.cityio.fetchCityIOdata().subscribe(data => {
      this.data = this.computeGraphData(data);
      this.createChart();
      this.updateChart();
    });
    interval(2000).subscribe(() => this.updateRealTime());
  }

  updateRealTime(): void {
    this.cityio.fetchCityIOdata().subscribe(data => {
      this.data = this.computeGraphData(data);
      this.updateChart();
    });
  }

  // takes cityio data and reformats to feed into d3 bar chart. This counts number of cells of each type
  computeGraphData(data) {
    const grid = data.grid;
    const mapping = data.header.mapping.type;
    var graphIt = []

    for (var type of mapping) {
      graphIt.push({ name: type, count: 0 });
    }
    for (var cell of grid) {
      graphIt[cell[1]].count += 1;
    }
    return graphIt;
  }


  /*
   * Bar Chart initialization and update logic
   */

  createChart() {
        // create umbrella svg
    const element = this.chartContainer.nativeElement;

    this.width = element.offsetWidth-this.margin.left-this.margin.right;
    this.height = element.offsetHeight-this.margin.top-this.margin.bottom;

    const svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);
    
    // chart plot area
    this.vis.svg = svg.append('g')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('transform', `translate(${this.margin.left}, ${(this.margin.top)})`)
      .attr('class', 'bars'); // ? not sure what class does. May not be necessary

    // define X & Y domains      
    const xDomain = this.data.map(d => d.name);
    const yDomain = [0, d3.max(this.data.map(d => d.count))]; 

    // create scales      
    this.xScale = d3.scaleBand().padding(0.1).domain(xDomain).rangeRound([0, this.width]);      
    this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);  

    // bar colors      
    this.colors = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>['red', 'blue']);  

    // x & y axis      
    this.xAxis = svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top+this.height})`)
      .call(d3.axisBottom(this.xScale));
    this.yAxis = svg.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yScale));
  }  

  updateChart() {      
    // update scales & axis      
    this.xScale.domain(this.data.map(d => d.name));      
    this.yScale.domain([0, d3.max(this.data.map(d => d.count))]);      
    this.colors.domain([0, this.data.length]);      
    this.xAxis.transition().call(d3.axisBottom(this.xScale));      
    this.yAxis.transition().call(d3.axisLeft(this.yScale));  
    const update = this.vis.svg.selectAll('.bar')        
      .data(this.data);  

    // remove exiting bars      
    update.exit().remove();  

    // update existing bars      
    this.vis.svg.selectAll('.bar').transition()
      .attr('x', d => this.xScale(d.name))
      .attr('y', d => this.yScale(d.count))
      .attr('width', d => this.xScale.bandwidth())
      .attr('height', d => this.height - this.yScale(d.count))
      .style('fill', (d, i) => this.colors(i));  

    // add new bars
    update.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.xScale(d.name))
      .attr('y', d => this.yScale(0))
      .attr('width', this.xScale.bandwidth())
      .attr('height', 0)
      .style('fill', (d, i) => this.colors(i))
      .transition()
      .delay((d, i) => i * 10)
      .attr('y', d => this.yScale(d.count))
      .attr('height', d => this.height - this.yScale(d.count));
  }

}
