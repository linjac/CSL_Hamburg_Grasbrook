import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import {HttpClient } from "@angular/common/http";
import { interval, of, Observable } from "rxjs";
import * as rxjs from "rxjs/index";
import { catchError, tap } from "rxjs/operators";

import { ChartMathService } from "../chart-math.service";
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
  xScale: any;
  yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;

  constructor( private chartMath: ChartMathService,
    private cityio: CityIOService
    ) {}

  ngOnInit() {
    this.cityio.fetchCityIOdata().subscribe(data => {
      this.data = this.chartMath.computeRadar(data);
      // this.data = this.chartMath.computeNumRotated(data);
      this.createChart();
      this.updateChart();
    });
    interval(2000).subscribe(() => this.updateRealTime());

  }

  updateRealTime(): void {
    this.cityio.fetchCityIOdata().subscribe(data => {
      this.data = this.chartMath.computeRadar(data);
      // this.data = this.chartMath.computeNumRotated(data);
      this.updateChart();
    });
  }

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
    const yDomain = [0, d3.max(this.data, d => d.count)];  

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
    this.yScale.domain([0, d3.max(this.data, d => d.count)]);      
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









  // createChart() {
  //   // create umbrella svg
  //   const element = this.chartContainer.nativeElement;
  //   // this.width = Math.min( (element.offsetWidth - this.margin.left - this.margin.right), ( element.offsetHeight - this.margin.top - this.margin.bottom) );
  //   // this.width = Math.min( 150, 150 );
  //   console.log(element);
  //   console.log(element.offsetHeight);
  //   this.width = Math.min( element.offsetWidth, element.offsetHeight );

  //   // this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
  //   this.height = this.width;
  //   // this.params.w = this.width;
  //   // this.params.h = this.height;
  //   // this.params.translateX = this.params.w / 4;
  //   // this.params.translateY = this.params.h / 4;
  //   // this.params.paddingX = this.params.w;
  //   // this.params.paddingY = this.params.h;
  //   // this.params.maxValue = 10; // make a function here later

  //   console.log(this.data)

  //   const svgContainer = d3.select(element).append('svg')
  //     .attr('width', element.offsetWidth)
  //     .attr('height', element.offsetHeight);

  //   this.vis.svg = svgContainer.append('g')
  //     .attr('width', this.width)
  //     .attr('height', this.height)
  //     .attr('class', 'radar'); // ? not sure what class does. May not be necessary
  //     // .attr('transform', `translate(${(element.offsetWidth-this.params.w)/2}, ${this.margin.top})`);

  //   // // Draw the Rectangle
  //   // var rectangle = this.vis.svg.append("rect")
  //   //   .attr("x", 0)
  //   //   .attr("y", 0)
  //   //   .attr("width", this.width)
  //   //   .attr("height", this.height);

  //   // // create vis parameters
  //   // this.vis.allAxis = this.data[0].axes.map(function(i, j) { return i.axis; }); // an array of axis names
  //   // this.vis.totalAxes = this.vis.allAxis.length; // number of axes
  //   // this.vis.radius = Math.min(this.params.w / 2, this.params.h / 2);

  //   // // // create levels
  //   // this.vis.levels = this.vis.svg.selectAll(".levels")
  //   //   .append("svg:g").classed("levels", true);

  //   // // // create axes
  //   // this.vis.axes = this.vis.svg.selectAll(".axes")
  //   //   .append("svg:g").classed("axes", true);

  //   // // create vertices
  //   // this.vis.vertices = this.vis.svg.selectAll(".vertices");
    
  //   // // // initiate legend
  //   // this.vis.legend = this.vis.svg.append("svg:g").classed("legend", true)
  //   //   .attr("height", this.height / 2)
  //   //   .attr("width", this.width / 2)
  //   //   .attr("transform", "translate(" + 0 + ", " + 0.9 * this.height + ")");
  // }



}


// export class RadarChartComponent implements OnInit {
//   //initialize default chart config
//   @ViewChild('chart', {static: true}) private chartContainer: ElementRef;
//   data: any;
//   // fetch data properties: 
//   url = 'https://gist.githubusercontent.com/chrisrzhou/2421ac6541b68c1680f8/raw/e9fe262498c65161f13838d9fd08f87f895a7644/data_car_ratings.csv';
//   update: Observable<number>;
//   // chart properties:
//   margin: any = { top: 60, bottom: 60, left: 80, right: 80};
//   width: number;
//   height: number;
//   coordinates: any;
//   config: {};
//   private vis = {
//     svg: null,
//     allAxis: null,
//     totalAxes: null,
//     radius: null,
//     verticesTooltip: null,
//     levels: null,
//     axes: null,
//     vertices: null,
//     legend: null
//   }; 
//   w = 0;
//   h = 0;
//   private params = {
//     w: this.w,
//     h: this.h,
//     maxValue: null,
//     radians: 2 * Math.PI,
//     levels: 5,
//     levelScale: 0.85,
//     labelScale: 1.0,
//     facetPaddingScale: 2.5,
//     polygonAreaOpacity: 0.3,
//     polygonStrokeOpacity: 1,
//     polygonPointSize: 4,
//     legendBoxSize: 10,
//     translateX: this.w / 4,
//     translateY: this.h / 4,
//     paddingX: this.w,
//     paddingY: this.h,
//     colors: d3.scaleOrdinal(d3.schemeSet2),
//     showLevels: true,
//     showLevelsLabels: true,
//     showAxesLabels: true,
//     showAxes: true,
//     showLegend: true,
//     showVertices: true,
//     showPolygons: true
//   };
  
//   over = "ontouchstart" in window ? "touchstart" : "mouseover";
//   out = "ontouchstart" in window ? "touchend" : "mouseout";


//   constructor(private http: HttpClient) {
//     this.update = interval(1000);
//     this.update.subscribe(() => {
//       this.data = this.fetchChartData().subscribe();
//     });
//   }

//   ngOnInit() {
//     // console.log('in ngOnInit');
//     // // this.fetchChartData();
//     // this.createChart();
//     if (this.data == null) {
//       this.fetchChartData().subscribe(data => {
//         this.createChart();
//       });
//     } else {
//       this.createChart();
//     }
//   }  

//   /** initialize empty chart elements */
//   createChart() {
//     // create umbrella svg
//     const element = this.chartContainer.nativeElement;
//     // this.width = Math.min( (element.offsetWidth - this.margin.left - this.margin.right), ( element.offsetHeight - this.margin.top - this.margin.bottom) );
//     this.width = Math.min( 150, 150 );

//     // this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
//     this.height = this.width;
//     this.params.w = this.width;
//     this.params.h = this.height;
//     this.params.translateX = this.params.w / 4;
//     this.params.translateY = this.params.h / 4;
//     this.params.paddingX = this.params.w;
//     this.params.paddingY = this.params.h;
//     this.params.maxValue = 10; // make a function here later

//     console.log([this.params.h, this.params.w])

//     // const svgContainer = d3.select(element).append('svg')
//     //   .attr('width', element.offsetWidth)
//     //   .attr('height', element.offsetHeight);

//     // this.vis.svg = svgContainer
//     //   .append('g')
//     //   .attr('width', this.params.w)
//     //   .attr('height', this.params.h)
//     //   .attr('class', 'radar') // ? not sure what class does. May not be necessary
//     //   .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

//     const svgContainer = d3.select(element).append('svg')
//       .attr('width', element.offsetWidth)
//       .attr('height', element.offsetHeight);

//     this.vis.svg = svgContainer.append('g')
//       .attr('width', this.params.w)
//       .attr('height', this.params.h)
//       .attr('class', 'radar'); // ? not sure what class does. May not be necessary
//       // .attr('transform', `translate(${(element.offsetWidth-this.params.w)/2}, ${this.margin.top})`);



//     // Draw the Rectangle
//     // var rectangle = this.vis.svg.append("rect")
//     //   .attr("x", 50)
//     //   .attr("y", 50)
//     //   .attr("width", 50)
//     //   .attr("height", 50);

//     // // create vis parameters
//     this.vis.allAxis = this.data[0].axes.map(function(i, j) { return i.axis; }); // an array of axis names
//     this.vis.totalAxes = this.vis.allAxis.length; // number of axes
//     this.vis.radius = Math.min(this.params.w / 2, this.params.h / 2);

//     // // create levels
//     this.vis.levels = this.vis.svg.selectAll(".levels")
//       .append("svg:g").classed("levels", true);

//     // // create axes
//     this.vis.axes = this.vis.svg.selectAll(".axes")
//       .append("svg:g").classed("axes", true);

//     // create vertices
//     this.vis.vertices = this.vis.svg.selectAll(".vertices");
    
//     // // initiate legend
//     this.vis.legend = this.vis.svg.append("svg:g").classed("legend", true)
//       .attr("height", this.height / 2)
//       .attr("width", this.width / 2)
//       .attr("transform", "translate(" + 0 + ", " + 0.9 * this.height + ")");


//     this.coordinates = this.buildCoordinates(this.data);

//     if (this.params.showLevels) this.buildLevels();
//     if (this.params.showLevelsLabels) this.buildLevelsLabels();
//     if (this.params.showAxes) this.buildAxes();
//     if (this.params.showAxesLabels) this.buildAxesLabels();
//     if (this.params.showVertices) this.buildVertices(this.coordinates);
//     if (this.params.showPolygons) this.buildPolygons(this.coordinates);
//     if (this.params.showLegend) this.buildLegend(this.coordinates);


//     // build polygon coordinates
//     // build levels
//     // build levels labels
//     // build axes
//     // build axes labels
//     // build verticies
//     // build polygons
//     // build legend

//   }


//   private buildCoordinates(data) {
//     const params = this.params;
//     const vis = this.vis;
//     data.forEach(function(group) {
//       group.axes.forEach(function(d, i) {
//         d.coordinates = { // [x, y] coordinates
//           x: params.w / 2 * (1 - (Math.max(d.value, 0) / params.maxValue) * Math.sin(i * params.radians / vis.totalAxes)),
//           y: params.h / 2 * (1 - (Math.max(d.value, 0) / params.maxValue) * Math.cos(i * params.radians / vis.totalAxes))
//         };
//       });
//     });
//     return data;
//   }

//   // builds out the levels of the spiderweb
//   buildLevels() {
//     const params = this.params;
//     const vis = this.vis;
//     for (var level = 0; level < this.params.levels; level++) {
//       var levelFactor = this.vis.radius * ((level + 1) / this.params.levels);
//       console.log(this.params.levels)
//       console.log(levelFactor);
//       // build level-lines
//       this.vis.levels
//         .data(vis.allAxis).enter()
//         .append("svg:line").classed("level-lines", true)
//         .attr("x1", function(d, i) { return levelFactor * (1 - Math.sin(i * params.radians / vis.totalAxes)); })
//         .attr("y1", function(d, i) { return levelFactor * (1 - Math.cos(i * params.radians / vis.totalAxes)); })
//         .attr("x2", function(d, i) { return levelFactor * (1 - Math.sin((i + 1) * params.radians / vis.totalAxes)); })
//         .attr("y2", function(d, i) { return levelFactor * (1 - Math.cos((i + 1) * params.radians / vis.totalAxes)); })
//         .attr("transform", "translate(" + (params.w / 2 - levelFactor) + ", " + (params.h / 2 - levelFactor) + ")")
//         .attr("stroke", "#606060")
//         .attr("stroke-width", "0.5px");
//     }
//   }

//   // builds out the levels labels
//   buildLevelsLabels() {
//     for (var level = 0; level < this.params.levels; level++) {
//       var levelFactor = this.vis.radius * ((level + 1) / this.params.levels);

//       // build level-labels
//       this.vis.levels
//         .data([1]).enter()
//         .append("svg:text").classed("level-labels", true)
//         .text((this.params.maxValue * (level + 1) / this.params.levels).toFixed(2))
//         .attr("x", function(d) { return levelFactor * (1 - Math.sin(0)); })
//         .attr("y", function(d) { return levelFactor * (1 - Math.cos(0)); })
//         .attr("transform", "translate(" + (this.params.w / 2 - levelFactor + 5) + ", " + (this.params.h / 2 - levelFactor) + ")")
//         .attr("fill", "gray") 
//         .attr("font-family", "sans-serif")
//         .attr("font-size", 10 * this.params.labelScale + "px");
//     }
//   }

//   // builds out the axes
//   buildAxes() {
//     const params = this.params;
//     const vis = this.vis;
//     this.vis.axes
//       .data(this.vis.allAxis).enter()
//       .append("svg:line").classed("axis-lines", true)
//       .attr("x1", params.w / 2)
//       .attr("y1", params.h / 2)
//       .attr("x2", function(d, i) { return params.w / 2 * (1 - Math.sin(i * params.radians / vis.totalAxes)); })
//       .attr("y2", function(d, i) { return params.h / 2 * (1 - Math.cos(i * params.radians / vis.totalAxes)); })
//       .attr("stroke", "#606060")
//       .attr("stroke-width", "1px");
//   }

//   // builds out the axes labels
//   buildAxesLabels() {
//     const params = this.params;
//     const vis = this.vis;
//     this.vis.axes
//       .data(this.vis.allAxis).enter()
//       .append("svg:text").classed("axis-labels", true)
//       .text(function(d) { return d; })
//       .attr("text-anchor", "middle")
//       .attr("x", function(d, i) { return params.w / 2 * (1 - 1.3 * Math.sin(i * params.radians / vis.totalAxes)); })
//       .attr("y", function(d, i) { return params.h / 2 * (1 - 1.1 * Math.cos(i * params.radians / vis.totalAxes)); })
//       .attr("font-family", "sans-serif")
//       .attr("font-size", 11 * params.labelScale + "px")
//       .style("fill", "white");
//   }

//   // builds out the polygon vertices of the dataset
//   buildVertices(data) {
//     console.log('in buildVertices');
//     const params = this.params;
//     const colors = params.colors;
//     for (var g = 0; g < data.length; g++) {
//       const group = data[g];
//       this.vis.vertices
//         .data(group.axes).enter()
//         .append("svg:circle").classed("polygon-vertices", true)
//         .attr("r", this.params.polygonPointSize)
//         .attr("cx", function(d, i) { return d.coordinates.x; })
//         .attr("cy", function(d, i) { return d.coordinates.y; })
//         .attr("fill", colors(g));
//     };
//   }

//   // builds out the polygon areas of the dataset
//   buildPolygons(data) {
//     const params = this.params;
//     var over = "ontouchstart" in window ? "touchstart" : "mouseover";
//     var out = "ontouchstart" in window ? "touchend" : "mouseout";
//     var svg = this.vis.svg;
//     this.vis.vertices
//       .data(data).enter()
//       .append("svg:polygon").classed("polygon-areas", true)
//       .attr("points", function(group) { // build verticesString for each group
//         var verticesString = "";
//         group.axes.forEach(function(d) { verticesString += d.coordinates.x + "," + d.coordinates.y + " "; });
//         return verticesString;
//       })
//       .attr("stroke-width", "2px")
//       .attr("stroke", function(d, i) { return params.colors(i); })
//       .attr("fill", function(d, i) { return params.colors(i); })
//       .attr("fill-opacity", params.polygonAreaOpacity)
//       .attr("stroke-opacity", params.polygonStrokeOpacity)
//       .on(over, function(d) {
//         svg.selectAll(".polygon-areas") // fade all other polygons out
//         .transition(250)
//           .attr("fill-opacity", 0.2)
//           .attr("stroke-opacity", 0.2);
//         d3.select(this) // focus on active polygon
//         .transition(250)
//           .attr("fill-opacity", 0.7)
//           .attr("stroke-opacity", params.polygonStrokeOpacity);
//       })
//       .on(out, function() {
//         d3.selectAll(".polygon-areas")
//           .transition(250)
//           .attr("fill-opacity", params.polygonAreaOpacity)
//           .attr("stroke-opacity", 1);
//       });
//   }

//   // builds out the legend
//   buildLegend(data) {
//     const params = this.params;
//     //Create legend squares
//     this.vis.legend.selectAll(".legend-tiles")
//       .data(data).enter()
//       .append("svg:rect").classed("legend-tiles", true)
//       .attr("x", params.w - params.paddingX)
//       .attr("y", function(d, i) { return i * 2 * params.legendBoxSize; })
//       .attr("width", params.legendBoxSize)
//       .attr("height", params.legendBoxSize)
//       .attr("fill", function(d, g) { return params.colors(g); });

//     //Create text next to squares
//     this.vis.legend.selectAll(".legend-labels")
//       .data(data).enter()
//       .append("svg:text").classed("legend-labels", true)
//       .attr("x", params.w - params.paddingX + (1.5 * params.legendBoxSize))
//       .attr("y", function(d, i) { return i * 2 * params.legendBoxSize; })
//       .attr("dy", 0.07 * params.legendBoxSize + "em")
//       .attr("font-size", 11 * params.labelScale + "px")
//       .attr("fill", "gray")
//       .text(function(d) {
//         return d.group;
//       });
//   }


//   // // show tooltip of vertices
//   // verticesTooltipShow(d) {
//   //   this.vis.verticesTooltip.style("opacity", 0.9)
//   //     .html("<strong>Value</strong>: " + d.value + "<br />" +
//   //       "<strong>Description</strong>: " + d.description + "<br />")
//   //     .style("left", (d3.event.pageX) + "px")
//   //     .style("top", (d3.event.pageY) + "px");
//   // }

//   // // hide tooltip of vertices
//   // verticesTooltipHide() {
//   //   this.vis.verticesTooltip.style("opacity", 0);
//   // }










// ////////////// --------- DATA HANDLING ------ (Fetches and parses data. May move into its own seperate service)
//   fetchChartData(): Observable<any> {
//     return this.http.get(this.url, {responseType: 'text'}).pipe(
//       tap( d => { this.data = this.csv2json(d); } ),
//       catchError(this.handleError("getMetadata"))
//     );
//   }

//   private handleError<T>(operation = "operation", result?: T) {
//     return (error: any): Observable<T> => {
//       console.error(`${operation} failed: ${error.message}`, error);
//       // Let the app keep running by returning:
//       return of(result as T);
//     };
//   }

//   // helper function csv2json to return json data from csv
//   private csv2json(csv) {
//     csv = csv.replace(/, /g, ","); // trim leading whitespace in csv file
//     var json = d3.csvParse(csv); // parse csv string into json
//     // reshape json data
//     var data = [];
//     var groups = []; // track unique groups
//     json.forEach(function(record) {
//       var group = record.group;
//       if (groups.indexOf(group) < 0) {
//         groups.push(group); // push to unique groups tracking
//         data.push({ // push group node in data
//           group: group,
//           axes: []
//         });
//       };
//       data.forEach(function(d) {
//         if (d.group === record.group) { // push record data into right group in data
//           d.axes.push({
//             axis: record.axis,
//             value: parseInt(record.value),
//             description: record.description
//           });
//         }
//       });
//     });
//     console.log(data);
//     return data;
//   }
// //////////// ------- (END) DATA HANDLING FUNCTIONS -------------

// }
