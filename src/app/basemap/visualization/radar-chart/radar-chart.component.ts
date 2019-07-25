import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import {HttpClient } from "@angular/common/http";
import { interval, of, Observable } from "rxjs";
import * as rxjs from "rxjs/index";
import { catchError, tap } from "rxjs/operators";


@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class RadarChartComponent implements OnInit{
  //initialize default chart config
  @ViewChild('chart', {static: true}) private chartContainer: ElementRef;
  data: any;
  // fetch data properties: 
  url = 'https://gist.githubusercontent.com/chrisrzhou/2421ac6541b68c1680f8/raw/e9fe262498c65161f13838d9fd08f87f895a7644/data_car_ratings.csv';
  update: Observable<number>;
  // chart properties:
  margin: any = { top: 20, bottom: 20, left: 20, right: 20};
  width: number;
  height: number;
  coordinates: any;
  config: {};
  private vis = {
    svg: null,
    allAxis: null,
    totalAxes: null,
    radius: null,
    verticesTooltip: null,
    levels: null,
    axes: null,
    vertices: null,
    legend: null
  }; 
  w = 0;
  h = 0;
  private params = {
    w: this.w,
    h: this.h,
    maxValue: null,
    radians: 2 * Math.PI,
    levels: 5,
    levelScale: 0.85,
    labelScale: 1.0,
    facetPaddingScale: 2.5,
    polygonAreaOpacity: 0.3,
    polygonStrokeOpacity: 1,
    polygonPointSize: 4,
    legendBoxSize: 10,
    translateX: this.w / 4,
    translateY: this.h / 4,
    paddingX: this.w,
    paddingY: this.h,
    colors: d3.scaleOrdinal(d3.schemeCategory10),
    showLevels: true,
    showLevelsLabels: true,
    showAxesLabels: true,
    showAxes: true,
    showLegend: true,
    showVertices: true,
    showPolygons: true
  };
  

  constructor(private http: HttpClient) {
    this.update = interval(1000);
    this.update.subscribe(() => {
      this.data = this.fetchChartData().subscribe();
    });
  }

  ngOnInit() {
    // console.log('in ngOnInit');
    // // this.fetchChartData();
    // this.createChart();
    if (this.data == null) {
      this.fetchChartData().subscribe(data => {
        this.createChart();
      });
    } else {
      this.createChart();
    }
  }  

  /** initialize empty chart elements */
  createChart() {
    // create umbrella svg
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    this.params.w = this.width;
    this.params.h = this.height;
    this.params.translateX = this.params.w / 4;
    this.params.translateY = this.params.h / 4;
    this.params.paddingX = this.params.w;
    this.params.paddingY = this.params.h;
    this.params.maxValue = 10;

    console.log(this.params);

    this.vis.svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight)
      .append('g')
      .attr('class', 'radar') // ? not sure what class does. May not be necessary
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // this.vis.svg = d3.select(element).append('svg')
    //   .attr("width", 400)
    //   .attr("height", 200)
    //   .style("border-color", "black")
    //   .style("border-style", "solid")
    //   .style("border-width", "1px");

    // Draw the Rectangle
    var rectangle = this.vis.svg.append("rect")
      .attr("x", 50)
      .attr("y", 50)
      .attr("width", 50)
      .attr("height", 50);




    // // create vis parameters
    this.vis.allAxis = this.data[0].axes.map(function(i, j) { return i.axis; }); // an array of axis names
    this.vis.totalAxes = this.vis.allAxis.length; // number of axes

    // // create levels
    // this.vis.levels = this.vis.selectAll(".levels")
    //   .append("svg:g").classed("levels", true);

    // // create axes
    // this.vis.axes = this.vis.svg.selectAll(".axes")
    //   .append("svg:g").classed("axes", true);

    // create vertices
    // this.vis.vertices =this.vis.svg.selectAll(".vertices");
    
    // // initiate legend
    // this.vis.legend = this.vis.svg.append("svg:g").classed("legend", true)
    //   .attr("height", this.height / 2)
    //   .attr("width", this.width / 2)
    //   .attr("transform", "translate(" + 0 + ", " + 1.1 * this.height + ")");
    this.coordinates = this.buildCoordinates(this.data);
    this.buildVertices(this.coordinates);



    // build polygon coordinates
    // build levels
    // build levels labels
    // build axes
    // build axes labels
    // build verticies
    // build polygons
    // build legend

  }


  private buildCoordinates(data) {
    const params = this.params;
    const vis = this.vis;
    data.forEach(function(group) {
      group.axes.forEach(function(d, i) {
        d.coordinates = { // [x, y] coordinates
          x: params.w / 2 * (1 - (Math.max(7, 0) / params.maxValue) * Math.sin(i * params.radians / vis.totalAxes)),
          y: params.h / 2 * (1 - (Math.max(9, 0) / params.maxValue) * Math.cos(i * params.radians / vis.totalAxes))
        };
      });
    });
    console.log('here')
    return data;
  }

  // // builds out the levels of the spiderweb
  // buildLevels() {
  //   for (var level = 0; level < this.params.levels; level++) {
  //     var levelFactor = this.vis.radius * ((level + 1) / this.params.levels);

  //     // build level-lines
  //     this.vis.levels
  //       .data(this.vis.allAxis).enter()
  //       .append("svg:line").classed("level-lines", true)
  //       .attr("x1", function(d, i) { return levelFactor * (1 - Math.sin(i * this.params.radians / this.vis.totalAxes)); })
  //       .attr("y1", function(d, i) { return levelFactor * (1 - Math.cos(i * this.params.radians / this.vis.totalAxes)); })
  //       .attr("x2", function(d, i) { return levelFactor * (1 - Math.sin((i + 1) * this.params.radians / this.vis.totalAxes)); })
  //       .attr("y2", function(d, i) { return levelFactor * (1 - Math.cos((i + 1) * this.params.radians / this.vis.totalAxes)); })
  //       .attr("transform", "translate(" + (this.params.w / 2 - levelFactor) + ", " + (this.params.h / 2 - levelFactor) + ")")
  //       .attr("stroke", "gray")
  //       .attr("stroke-width", "0.5px");
  //   }
  // }

  // // builds out the levels labels
  // buildLevelsLabels() {
  //   for (var level = 0; level < this.params.levels; level++) {
  //     var levelFactor = this.vis.radius * ((level + 1) / this.params.levels);

  //     // build level-labels
  //     this.vis.levels
  //       .data([1]).enter()
  //       .append("svg:text").classed("level-labels", true)
  //       .text((this.params.maxValue * (level + 1) / this.params.levels).toFixed(2))
  //       .attr("x", function(d) { return levelFactor * (1 - Math.sin(0)); })
  //       .attr("y", function(d) { return levelFactor * (1 - Math.cos(0)); })
  //       .attr("transform", "translate(" + (this.params.w / 2 - levelFactor + 5) + ", " + (this.params.h / 2 - levelFactor) + ")")
  //       .attr("fill", "gray")
  //       .attr("font-family", "sans-serif")
  //       .attr("font-size", 10 * this.params.labelScale + "px");
  //   }
  // }
  // // builds out the axes
  // buildAxes() {
  //   this.vis.axes
  //     .data(this.vis.allAxis).enter()
  //     .append("svg:line").classed("axis-lines", true)
  //     .attr("x1", this.params.w / 2)
  //     .attr("y1", this.params.h / 2)
  //     .attr("x2", function(d, i) { return this.params.w / 2 * (1 - Math.sin(i * this.params.radians / this.vis.totalAxes)); })
  //     .attr("y2", function(d, i) { return this.params.h / 2 * (1 - Math.cos(i * this.params.radians / this.vis.totalAxes)); })
  //     .attr("stroke", "grey")
  //     .attr("stroke-width", "1px");
  // }

  // // builds out the axes labels
  // buildAxesLabels() {
  //   this.vis.axes
  //     .data(this.vis.allAxis).enter()
  //     .append("svg:text").classed("axis-labels", true)
  //     .text(function(d) { return d; })
  //     .attr("text-anchor", "middle")
  //     .attr("x", function(d, i) { return this.params.w / 2 * (1 - 1.3 * Math.sin(i * this.params.radians / this.vis.totalAxes)); })
  //     .attr("y", function(d, i) { return this.params.h / 2 * (1 - 1.1 * Math.cos(i * this.params.radians / this.vis.totalAxes)); })
  //     .attr("font-family", "sans-serif")
  //     .attr("font-size", 11 * this.params.labelScale + "px");
  // }

  // builds out the polygon vertices of the dataset
  buildVertices(data) {
    data.forEach(function(group, g) {
      this.vis.vertices
        .data(group.axes).enter()
        .append("svg:circle").classed("polygon-vertices", true)
        .attr("r", this.params.polygonPointSize)
        .attr("cx", function(d, i) { return d.coordinates.x; })
        .attr("cy", function(d, i) { return d.coordinates.y; })
        .attr("fill", this.params.colors(g));
        // .on(over, verticesTooltipShow)
        // .on(out, verticesTooltipHide);
    });
  }

  // // builds out the polygon areas of the dataset
  // buildPolygons(data) {
  //   this.vis.vertices
  //     .data(data).enter()
  //     .append("svg:polygon").classed("polygon-areas", true)
  //     .attr("points", function(group) { // build verticesString for each group
  //       var verticesString = "";
  //       group.axes.forEach(function(d) { verticesString += d.coordinates.x + "," + d.coordinates.y + " "; });
  //       return verticesString;
  //     })
  //     .attr("stroke-width", "2px")
  //     .attr("stroke", function(d, i) { return this.params.colors(i); })
  //     .attr("fill", function(d, i) { return this.params.colors(i); })
  //     .attr("fill-opacity", this.params.polygonAreaOpacity)
  //     .attr("stroke-opacity", this.params.polygonStrokeOpacity);
  //     // .on(over, function(d) {
  //     //   this.vis.svg.selectAll(".polygon-areas") // fade all other polygons out
  //     //   .transition(250)
  //     //     .attr("fill-opacity", 0.1)
  //     //     .attr("stroke-opacity", 0.1);
  //     //   d3.select(this) // focus on active polygon
  //     //   .transition(250)
  //     //     .attr("fill-opacity", 0.7)
  //     //     .attr("stroke-opacity", this.params.polygonStrokeOpacity);
  //     // })
  //     // .on(out, function() {
  //     //   d3.selectAll(".polygon-areas")
  //     //     .transition(250)
  //     //     .attr("fill-opacity", this.params.polygonAreaOpacity)
  //     //     .attr("stroke-opacity", 1);
  //     // });
  // }
  // // builds out the legend
  // buildLegend(data) {
  //   //Create legend squares
  //   this.vis.legend.selectAll(".legend-tiles")
  //     .data(data).enter()
  //     .append("svg:rect").classed("legend-tiles", true)
  //     .attr("x", this.params.w - this.params.paddingX / 2)
  //     .attr("y", function(d, i) { return i * 2 * this.params.legendBoxSize; })
  //     .attr("width", this.params.legendBoxSize)
  //     .attr("height", this.params.legendBoxSize)
  //     .attr("fill", function(d, g) { return this.params.colors(g); });

  //   //Create text next to squares
  //   this.vis.legend.selectAll(".legend-labels")
  //     .data(data).enter()
  //     .append("svg:text").classed("legend-labels", true)
  //     .attr("x", this.params.w - this.params.paddingX / 2 + (1.5 * this.params.legendBoxSize))
  //     .attr("y", function(d, i) { return i * 2 * this.params.legendBoxSize; })
  //     .attr("dy", 0.07 * this.params.legendBoxSize + "em")
  //     .attr("font-size", 11 * this.params.labelScale + "px")
  //     .attr("fill", "gray")
  //     .text(function(d) {
  //       return d.group;
  //     });
  // }


  // // show tooltip of vertices
  // verticesTooltipShow(d) {
  //   this.vis.verticesTooltip.style("opacity", 0.9)
  //     .html("<strong>Value</strong>: " + d.value + "<br />" +
  //       "<strong>Description</strong>: " + d.description + "<br />")
  //     .style("left", (d3.event.pageX) + "px")
  //     .style("top", (d3.event.pageY) + "px");
  // }

  // // hide tooltip of vertices
  // verticesTooltipHide() {
  //   this.vis.verticesTooltip.style("opacity", 0);
  // }










////////////// --------- DATA HANDLING ------ (Fetches and parses data. May move into its own seperate service)
  fetchChartData(): Observable<any> {
    return this.http.get(this.url, {responseType: 'text'}).pipe(
      tap( d => { this.data = this.csv2json(d); } ),
      catchError(this.handleError("getMetadata"))
    );
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`, error);
      // Let the app keep running by returning:
      return of(result as T);
    };
  }

  // helper function csv2json to return json data from csv
  private csv2json(csv) {
    csv = csv.replace(/, /g, ","); // trim leading whitespace in csv file
    var json = d3.csvParse(csv); // parse csv string into json
    // reshape json data
    var data = [];
    var groups = []; // track unique groups
    json.forEach(function(record) {
      var group = record.group;
      if (groups.indexOf(group) < 0) {
        groups.push(group); // push to unique groups tracking
        data.push({ // push group node in data
          group: group,
          axes: []
        });
      };
      data.forEach(function(d) {
        if (d.group === record.group) { // push record data into right group in data
          d.axes.push({
            axis: record.axis,
            value: parseInt(record.value),
            description: record.description
          });
        }
      });
    });
    console.log(data);
    return data;
  }
//////////// ------- (END) DATA HANDLING FUNCTIONS -------------

}
