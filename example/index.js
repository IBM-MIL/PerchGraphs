/*
 *  Licensed Materials - Property of IBM
 *  © Copyright IBM Corporation 2015. All Rights Reserved.
 *  This sample program is provided AS IS and may be used, executed, copied and modified without royalty
 *  payment by customer (a) for its own instruction and study, (b) in order to develop applications designed to
 *  run with an IBM product, either for customer's own internal use or for redistribution by customer, as part
 *  of such an application, in customer's own products.
 */

var exampleMod = angular.module('PerchGraphsExample', ['mil.PerchGraphs']);

exampleMod.factory('LineGraphStrategy', function() {

  function LineGraphStrategy(data, threshold, delta, units) {
    var vm = this;

    this._data = data;
    this._x = d3.scale.linear();
    this._y = d3.scale.linear();
    this._threshold = threshold;
    this._delta = delta;
    this._units = units;
  }

  // Inherit
  LineGraphStrategy.prototype = new PerchGraphStrategy();

  LineGraphStrategy.prototype.x = function() {
    return this._x;
  }

  LineGraphStrategy.prototype.y = function() {
    return this._y;
  }

  LineGraphStrategy.prototype.data = function() {
    return this._data;
  }

  LineGraphStrategy.prototype.delta = function() {
    return this._delta;
  }

  LineGraphStrategy.prototype.threshold = function() {
    return this._threshold;
  }

  LineGraphStrategy.prototype.units = function() {
    return this._units;
  }

  LineGraphStrategy.prototype.onMeasure = function(measurements) {
    this._width = measurements.width;
    this._height = measurements.height;
  }

  LineGraphStrategy.prototype.onDrawHud = function(hudGroup) {

    var vm = this;

    hudGroup.selectAll('path').remove();
    hudGroup.selectAll('text').remove();

    hudGroup.append('text')
             .attr('y', vm._y(this._threshold) + 18)
             .attr('x', 18)
             .attr('class', 'threshold-text')
             .text('Surge Ridership');

    hudGroup.append('text')
             .attr('y', vm._y(vm._threshold) + 18)
             .attr('x', 125)
             .attr('class', 'threshold-text')
             .style({'font-weight': 700})
             .text(this._threshold + ' ' + this._units);

    hudGroup.selectAll('path')
             .data([[{'x': 0, 'y': vm._threshold}, {'x': Math.ceil(vm._x.invert(vm._width)), 'y': vm._threshold}]])
             .enter().append('path')
             .attr('d', d3.svg.line()
               .x(function(d) { return vm._x(d.x); })
               .y(function(d) { return vm._y(d.y); })
             )
             .attr('class', 'threshold');
  }

  LineGraphStrategy.prototype.onDrawGraph = function(dataGroup) {

    var vm = this;

    dataGroup.selectAll('path').remove();
    dataGroup.selectAll('circle').remove();

    dataGroup.selectAll('path')
              .data([vm._data])
              .enter().append('path')
              .attr('d', d3.svg.line()
                .x(function(d) { return vm._x(d.x); })
                .y(function(d) { return vm._y(d.y); })
              )
              .attr('class', 'data');

    dataGroup.selectAll('circle')
              .data(vm._data)
              .enter().append('circle')
              .attr('cx', function(d) { return vm._x(d.x); })
              .attr('cy', function(d) { return vm._y(d.y); })
              .attr('r', 6)
              .attr('class', function(d) {
                if (d.y >= vm._threshold) {
                  return 'warning';
                }
                return 'ok';
              });
  }

  return LineGraphStrategy;

});

exampleMod.factory('BarGraphStrategy', function() {

  function BarGraphStrategy(data, threshold, delta, units, barWidth) {
    this._data = data;
    this._x = d3.scale.linear();
    this._y = d3.scale.linear();
    this._threshold = threshold;
    this._delta = delta;
    this._units = units;
    this._barWidth = barWidth;
  }

  BarGraphStrategy.prototype = new PerchGraphStrategy();

  BarGraphStrategy.prototype.x = function() {
    return this._x;
  }

  BarGraphStrategy.prototype.y = function() {
    return this._y;
  }

  BarGraphStrategy.prototype.data = function() {
    return this._data;
  }

  BarGraphStrategy.prototype.delta = function() {
    return this._delta;
  }

  BarGraphStrategy.prototype.threshold = function() {
    return this._threshold;
  }

  BarGraphStrategy.prototype.units = function() {
    return this._units;
  }

  BarGraphStrategy.prototype.onMeasure = function(measurements) {
    this._width = measurements.width;
    this._height = measurements.height;
  }

  BarGraphStrategy.prototype.onDrawHud = function(hudGroup) {
    // Nothing to do..
  }

  BarGraphStrategy.prototype.onDrawGraph = function(dataGroup) {

    var vm = this;

    dataGroup.selectAll('rect').remove();

    dataGroup.selectAll('.bar')
             .data(vm._data)
             .enter().append('rect')
             .attr('x', function(d) { return vm._x(d.x) - (vm._barWidth / 2); })
             .attr('width', vm._barWidth)
             .attr('y', function(d) { return vm._y(d.y); })
             .attr('height', function(d) { return vm._height - vm._y(d.y) - 45; })  // 45 is _axisGutter
             .attr('class', function(d) {
               if (d.y >= vm._threshold) {
                 return 'warning';
               }
               return 'ok';
             });
  }

  return BarGraphStrategy;

});

exampleMod.controller('PerchGraphsExampleController', function(LineGraphStrategy, BarGraphStrategy, $scope) {

  var line = new LineGraphStrategy([{'x': 0, 'y': 43.5, 't': 'Jan'}, {'x': 1, 'y': 63.9, 't': 'Feb'},
    {'x': 2, 'y': 109.5, 't': 'Mar'}, {'x': 3, 'y': 52.7, 't': 'Apr'}, {'x': 4, 'y': 62.4, 't': 'May'},
    {'x': 5, 'y': 74.9, 't': 'Jun'}, {'x': 6, 'y': 58.7, 't': 'Jul'}, {'x': 7, 'y': 62.8, 't': 'Aug'},
    {'x': 8, 'y': 73.0, 't': 'Sep'}, {'x': 9, 'y': 81.9, 't': 'Oct'}, {'x': 10, 'y': 61.7, 't': 'Nov'},
    {'x': 11, 'y': 49.9, 't': 'Dec'}], 75.0, 85, 'k');
  var bar = new BarGraphStrategy([{'x': 0, 'y': 8.69, 't': '1990'}, {'x': 1, 'y': 8.42, 't': '1991'},
    {'x': 2, 'y': 8.34, 't': '1992'}, {'x': 3, 'y': 8.28, 't': '1993'}, {'x': 4, 'y': 8.32, 't': '1994'},
    {'x': 5, 'y': 8.08, 't': '1995'}, {'x': 6, 'y': 7.96, 't': '1996'}, {'x': 7, 'y': 8.3, 't': '1997'},
    {'x': 8, 'y': 8.68, 't': '1998'}, {'x': 9, 'y': 9.08, 't': '1999'}, {'x': 10, 'y': 9.32, 't': '2000'},
    {'x': 11, 'y': 9.51, 't': '2001'}, {'x': 12, 'y': 9.39, 't': '2002'}, {'x': 13, 'y': 9.32, 't': '2003'},
    {'x': 14, 'y': 9.58, 't': '2004'}, {'x': 15, 'y': 9.81, 't': '2005'}, {'x': 16, 'y': 10.28, 't': '2006'},
    {'x': 17, 'y': 10.3, 't': '2007'}, {'x': 18, 'y': 10.61, 't': '2008'}, {'x': 19, 'y': 10.28, 't': '2009'},
    {'x': 20, 'y': 10.21, 't': '2010'}, {'x': 21, 'y': 10.4, 't': '2011'}, {'x': 22, 'y': 10.54, 't': '2012'},
    {'x': 23, 'y': 10.65, 't': '2013'}, {'x': 24, 'y': 10.75, 't': '2014'}], 0, 65, 'M', 35);

  var lineTitle = '2014 Austin MetroRail Ridership (thousands)';
  var barTitle = 'US Public Transit Usage 1990-2014 (millions)';

  this.currentStrategy = line;
  this.currentTitle = lineTitle;

  this.toggleGraphs = function() {
    if (this.currentStrategy === line) {
      this.currentStrategy = bar;
      this.currentTitle = barTitle;
      $scope.$broadcast('newPerchGraphStrategy');
    } else {
      this.currentStrategy = line;
      this.currentTitle = lineTitle;
      $scope.$broadcast('newPerchGraphStrategy');
    }
  }

});
