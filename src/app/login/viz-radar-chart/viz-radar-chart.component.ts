import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
// import data handling service
// import testData from '../../testData.json'

@Component({
  selector: 'app-viz-radar-chart',
  templateUrl: './viz-radar-chart.component.html',
  styleUrls: ['./viz-radar-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class VizRadarChartComponent implements OnInit{
  @ViewChild('chart', {static: true}) private chartContainer: ElementRef;
  // @Input() private data: Array<any>;
  @Input() private options: any;
  private data = d3.csv('https://gist.githubusercontent.com/chrisrzhou/2421ac6541b68c1680f8/raw/e9fe262498c65161f13838d9fd08f87f895a7644/data_car_ratings.csv');
  private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
  private chart: any;
  // private width: number;
  // private height: number;
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
  // private this.params: any = { 
  //   levels: 5,
  //   levelScale: 0.85,
  //   labelScale: 1.0,
  //   axesRanges: {},
  //   radians: 2 * Math.PI,
  //   polygonAreaOpacity: 0.3,
  //   polygonStrokeOpacity: 1,
  //   polygonPointSize: 4,
  //   legendBoxSize: 10,
  //   translateX: this.width / 4,
  //   translateY: this.height / 4,
  //   colors: d3.scale.category10(),
  //   showLevels: true,
  //   showLevelsLabels: true,
  //   showAxes: true,
  //   showAxesLabels: true,
  //   showVertices: true,
  //   showPolygons: true,
  //   showLegend: true
  // };

  private w = 300;
  private h = 300;
  private params = {
    w: this.w,
    h: this.h,
    levels: 5,
    levelScale: 0.85,
    labelScale: 1.0,
    maxValue: 0,
    radians: 2 * Math.PI,
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


  constructor() { 
    // if ("undefined" !== typeof options) {
    //   for (var i in options) {
    //     if ("undefined" !== typeof options[i]) {
    //       this.params[i] = options[i];
    //     }
    //   }
    // }
  }

  ngOnInit() {
    console.log('On init!!');
    console.log(this.data);
    this.createChart();
    // if (this.chart) {
    //   this.updateChart();
    // }
  }

  // ngOnChanges() {
  //   if (this.chart) {
  //     this.updateChart();
  //   }
  // }

  createChart() {
    //
    const element = this.chartContainer.nativeElement;
    // this.width = element.offsetWidth - this.margin.left - this.margin.right;
    // this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    this.vis.svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight)
      .append('g')
      .attr('class', 'radar') // ? not sure what class does. May not be necessary
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // unsure if render is necessary here

    // update vis parameters
    this.vis.allAxis = this.data[0].axes.map(function(i, j) { return i.axis; });
    this.vis.totalAxes = this.vis.allAxis.length;
    this.vis.radius = Math.min(this.params.w / 2, this.params.h / 2);

    // create main vis svg
    // this.vis.svg = d3.select(id) // Here change to element (from createChart)
    //   .append("svg").classed("svg-vis", true)
    //   .attr("width", this.params.w + this.params.paddingX)
    //   .attr("height", this.params.h + this.params.paddingY)
    //   .append("svg:g")
    //   .attr("transform", "translate(" + this.params.translateX + "," + this.params.translateY + ")");;

    // create verticesTooltip
    this.vis.verticesTooltip = d3.select("body")
      .append("div").classed("verticesTooltip", true)
      .attr("opacity", 0)
      .style("position": "absolute")
      .style("color": "black")
      .style("font-size": "10px")
      .style("width": "100px")
      .style("height": "auto")
      .style("padding": "5px")
      .style("border": "2px solid gray")
      .style("border-radius": "5px")
      .style("pointer-events": "none")
      .style("opacity": "0")
      .style("background": "#f4f4f4");

      // .style({
      //   "position": "absolute",
      //   "color": "black",
      //   "font-size": "10px",
      //   "width": "100px",
      //   "height": "auto",
      //   "padding": "5px",
      //   "border": "2px solid gray",
      //   "border-radius": "5px",
      //   "pointer-events": "none",
      //   "opacity": "0",
      //   "background": "#f4f4f4"
      // });

    // create levels
    this.vis.levels = this.vis.svg.selectAll(".levels")
      .append("svg:g").classed("levels", true);

    // create axes
    this.vis.axes = this.vis.svg.selectAll(".axes")
      .append("svg:g").classed("axes", true);

    // create vertices
    this.vis.vertices = this.vis.svg.selectAll(".vertices");

    //Initiate Legend  
    this.vis.legend = this.vis.svg.append("svg:g").classed("legend", true)
      .attr("height", this.params.h / 2)
      .attr("width", this.params.w / 2)
      .attr("transform", "translate(" + 0 + ", " + 1.1 * this.params.h + ")");



    this.buildCoordinates(this.data);
    if (this.params.showLevels) this.buildLevels();
    if (this.params.showLevelsLabels) this.buildLevelsLabels();
    if (this.params.showAxes) this.buildAxes();
    if (this.params.showAxesLabels) this.buildAxesLabels();
    if (this.params.showVertices) this.buildVertices(this.data);
    if (this.params.showPolygons) this.buildPolygons(this.data);
    if (this.params.showLegend) this.buildLegend(this.data);

  }

  // updateChart() {

  // }

//-------------  HELPER FUNCTIONS ------------------------
  // build visulaization using the other build helper functions
  // buildVis(data) {
  //   this.buildVisComponents();

  // }

  // buildVisComponents() {

  // }

  // builds [x, y] coordinates of polygon vertices.
  buildCoordinates(data) {
    data.forEach(function(group) {
      group.axes.forEach(function(d, i) {
        d.coordinates = { // [x, y] coordinates
          x: this.params.w / 2 * (1 - (parseFloat(Math.max(d.value, 0)) / this.params.maxValue) * Math.sin(i * this.params.radians / this.vis.totalAxes)),
          y: this.params.h / 2 * (1 - (parseFloat(Math.max(d.v  alue, 0)) / this.params.maxValue) * Math.cos(i * this.params.radians / this.vis.totalAxes))
        };
      });
    });
  }

  // builds out the levels of the spiderweb
  buildLevels() {
    for (var level = 0; level < this.params.levels; level++) {
      var levelFactor = this.vis.radius * ((level + 1) / this.params.levels);

      // build level-lines
      this.vis.levels
        .data(this.vis.allAxis).enter()
        .append("svg:line").classed("level-lines", true)
        .attr("x1", function(d, i) { return levelFactor * (1 - Math.sin(i * this.params.radians / this.vis.totalAxes)); })
        .attr("y1", function(d, i) { return levelFactor * (1 - Math.cos(i * this.params.radians / this.vis.totalAxes)); })
        .attr("x2", function(d, i) { return levelFactor * (1 - Math.sin((i + 1) * this.params.radians / this.vis.totalAxes)); })
        .attr("y2", function(d, i) { return levelFactor * (1 - Math.cos((i + 1) * this.params.radians / this.vis.totalAxes)); })
        .attr("transform", "translate(" + (this.params.w / 2 - levelFactor) + ", " + (this.params.h / 2 - levelFactor) + ")")
        .attr("stroke", "gray")
        .attr("stroke-width", "0.5px");
    }
  }

  // builds out the levels labels
  buildLevelsLabels() {
    for (var level = 0; level < this.params.levels; level++) {
      var levelFactor = this.vis.radius * ((level + 1) / this.params.levels);

      // build level-labels
      this.vis.levels
        .data([1]).enter()
        .append("svg:text").classed("level-labels", true)
        .text((this.params.maxValue * (level + 1) / this.params.levels).toFixed(2))
        .attr("x", function(d) { return levelFactor * (1 - Math.sin(0)); })
        .attr("y", function(d) { return levelFactor * (1 - Math.cos(0)); })
        .attr("transform", "translate(" + (this.params.w / 2 - levelFactor + 5) + ", " + (this.params.h / 2 - levelFactor) + ")")
        .attr("fill", "gray")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10 * this.params.labelScale + "px");
    }
  }
  // builds out the axes
  buildAxes() {
    this.vis.axes
      .data(this.vis.allAxis).enter()
      .append("svg:line").classed("axis-lines", true)
      .attr("x1", this.params.w / 2)
      .attr("y1", this.params.h / 2)
      .attr("x2", function(d, i) { return this.params.w / 2 * (1 - Math.sin(i * this.params.radians / this.vis.totalAxes)); })
      .attr("y2", function(d, i) { return this.params.h / 2 * (1 - Math.cos(i * this.params.radians / this.vis.totalAxes)); })
      .attr("stroke", "grey")
      .attr("stroke-width", "1px");
  }

  // builds out the axes labels
  buildAxesLabels() {
    this.vis.axes
      .data(this.vis.allAxis).enter()
      .append("svg:text").classed("axis-labels", true)
      .text(function(d) { return d; })
      .attr("text-anchor", "middle")
      .attr("x", function(d, i) { return this.params.w / 2 * (1 - 1.3 * Math.sin(i * this.params.radians / this.vis.totalAxes)); })
      .attr("y", function(d, i) { return this.params.h / 2 * (1 - 1.1 * Math.cos(i * this.params.radians / this.vis.totalAxes)); })
      .attr("font-family", "sans-serif")
      .attr("font-size", 11 * this.params.labelScale + "px");
  }

  // builds out the polygon vertices of the dataset
  buildVertices(data) {
    data.forEach(function(group, g) {
      this.vis.vertices
        .data(group.axes).enter()
        .append("svg:circle").classed("polygon-vertices", true)
        .attr("r", this.params.polygonPointSize)
        .attr("cx", function(d, i) { return d.coordinates.x; })
        .attr("cy", function(d, i) { return d.coordinates.y; })
        .attr("fill", this.params.colors(g))
        .on(over, verticesTooltipShow)
        .on(out, verticesTooltipHide);
    });
  }

  // builds out the polygon areas of the dataset
  buildPolygons(data) {
    this.vis.vertices
      .data(data).enter()
      .append("svg:polygon").classed("polygon-areas", true)
      .attr("points", function(group) { // build verticesString for each group
        var verticesString = "";
        group.axes.forEach(function(d) { verticesString += d.coordinates.x + "," + d.coordinates.y + " "; });
        return verticesString;
      })
      .attr("stroke-width", "2px")
      .attr("stroke", function(d, i) { return this.params.colors(i); })
      .attr("fill", function(d, i) { return this.params.colors(i); })
      .attr("fill-opacity", this.params.polygonAreaOpacity)
      .attr("stroke-opacity", this.params.polygonStrokeOpacity)
      .on(over, function(d) {
        this.vis.svg.selectAll(".polygon-areas") // fade all other polygons out
        .transition(250)
          .attr("fill-opacity", 0.1)
          .attr("stroke-opacity", 0.1);
        d3.select(this) // focus on active polygon
        .transition(250)
          .attr("fill-opacity", 0.7)
          .attr("stroke-opacity", this.params.polygonStrokeOpacity);
      })
      .on(out, function() {
        d3.selectAll(".polygon-areas")
          .transition(250)
          .attr("fill-opacity", this.params.polygonAreaOpacity)
          .attr("stroke-opacity", 1);
      });
  }
  // builds out the legend
  buildLegend(data) {
    //Create legend squares
    this.vis.legend.selectAll(".legend-tiles")
      .data(data).enter()
      .append("svg:rect").classed("legend-tiles", true)
      .attr("x", this.params.w - this.params.paddingX / 2)
      .attr("y", function(d, i) { return i * 2 * this.params.legendBoxSize; })
      .attr("width", this.params.legendBoxSize)
      .attr("height", this.params.legendBoxSize)
      .attr("fill", function(d, g) { return this.params.colors(g); });

    //Create text next to squares
    this.vis.legend.selectAll(".legend-labels")
      .data(data).enter()
      .append("svg:text").classed("legend-labels", true)
      .attr("x", this.params.w - this.params.paddingX / 2 + (1.5 * this.params.legendBoxSize))
      .attr("y", function(d, i) { return i * 2 * this.params.legendBoxSize; })
      .attr("dy", 0.07 * this.params.legendBoxSize + "em")
      .attr("font-size", 11 * this.params.labelScale + "px")
      .attr("fill", "gray")
      .text(function(d) {
        return d.group;
      });
  }


  // show tooltip of vertices
  verticesTooltipShow(d) {
    this.vis.verticesTooltip.style("opacity", 0.9)
      .html("<strong>Value</strong>: " + d.value + "<br />" +
        "<strong>Description</strong>: " + d.description + "<br />")
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY) + "px");
  }

  // hide tooltip of vertices
  verticesTooltipHide() {
    this.vis.verticesTooltip.style("opacity", 0);
  }

}



