(function(){
	angular
	.module('bird-info')
	.directive('birdGraph', [function() {	
		return {
			replace: true,
	     	restrict: 'E',
			scope: {
				csv: "="
			},
			template: '<div id="birdGraph"></div>',
			link: function (scope, element, attr){
				scope.render = function(){
					console.error("PRINT GRAPH");
					//TODO: don't go through this every re-render
					//TODO: change csv along with everything else
					//TODO: watch for changes to csv
				  	var margin = {top: 20, right: 150, bottom: 30, left: 40},
					    width = 960 - margin.left - margin.right,
					    height = 800 - margin.top - margin.bottom;

					var x = d3.scale.ordinal()
					    .rangeRoundBands([0, width], .1);

					var y = d3.scale.linear()
					    .rangeRound([height, 0]);

					var color = d3.scale.ordinal()
					    .range(["#3498db", "#95a5a6", "#34495e", "#c0392b", "Orange", "#16a085", "#f1c40f", "#e74c3c", "#7f8c8d", "#d35400","#8e44ad","#27ae60"]);

					var xAxis = d3.svg.axis()
					    .scale(x)
					    .orient("bottom");

					var yAxis = d3.svg.axis()
					    .scale(y)
					    .orient("left")
					    .tickFormat(d3.format(".0f"));

					var svg = d3.select("#birdGraph").append("svg")
					    .attr("width", width + margin.left + margin.right)
					    .attr("height", height + margin.top + margin.bottom)
					    .append("g")
					    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

					var data = d3.csv.parse(scope.csv);

					  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));

					  data.forEach(function(d) {
					    var y0 = 0;
					    d.month = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]||0}; });
					    d.total = d.month[d.month.length - 1].y1;
					  });

					  //data.sort(function(a, b) { return b.total - a.total; });

					  x.domain(data.map(function(d) { return d.Year; }));
					  y.domain([0, d3.max(data, function(d) { return d.total; })]);

					  svg.append("g")
					      .attr("class", "x axis")
					      .attr("transform", "translate(0," + height + ")")
					      .call(xAxis);

					  svg.append("g")
					      .attr("class", "y axis")
					      .call(yAxis)
					    .append("text")
					      .attr("transform", "rotate(-90)")
					      .attr("y", 6)
					      .attr("dy", "1em")
					      .style("text-anchor", "end")
					      .text("# of Birds");
					  
					  var tip = d3.tip()
					    .attr('class', 'd3-tip')
					    .offset([-10, 0])
					    .html(function(d) {
					      return "<strong>"+d.name+":</strong> <span style='color:white'>" + (d.y1-d.y0) + "</span>";
					    });

					  svg.call(tip);

					  var year = svg.selectAll(".year")
					      .data(data)
					    .enter().append("g")
					      .attr("class", "g")
					      .attr("transform", function(d) { return "translate(" + x(d.Year) + ",0)"; });

					  //this is how all the rectangles are made
					  year.selectAll("rect")
					      .data(function(d) { return d.month; })
					    .enter().append("rect")
					      .attr("width", x.rangeBand())
					      .attr("y", function(d) { return y(d.y1); })
					      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
					      .style("fill", function(d) { return color(d.name); })
					      .on('mouseover', tip.show)
					      .on('mouseout', tip.hide);

					  var legend = svg.selectAll(".legend")
					      .data(color.domain().slice().reverse())
					    .enter().append("g")
					      .attr("class", "legend")
					      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

					  legend.append("rect")
					      .attr("x", width - 18)
					      .attr("width", 18)
					      .attr("height", 18)
					      .style("fill", color);

					  legend.append("text")
					      .attr("x", width+5)
					      .attr("y", 9)
					      .attr("dy", ".35em")
					      // .style("text-anchor", "end")
					      .text(function(d) { return d; });					      
				}

				scope.rerender = function(){
				    // Get the data again
				    d3.csv.parse(scope.csv, function(error, data){
				    	// Scale the range of the data again 
				    	//.domain(d3.extent(data, function(d) { return d.date; }));
					    //y.domain([0, d3.max(data, function(d) { return d.close; })]);

					    // Select the section we want to apply our changes to
					    var svg = d3.select("#birdGraph").transition();

					    // // Make the changes
					     //    svg.select(".line")   // change the line
					     //        .duration(750)
					     //        .attr("d", valueline(data));
					     //    svg.select(".x.axis") // change the x axis
					     //        .duration(750)
					     //        .call(xAxis);
					     //    svg.select(".y.axis") // change the y axis
					     //        .duration(750)
					     //        .call(yAxis);
					});
				}

				scope.render();

				scope.$watch('csv', function(newVal, oldVal){
					scope.rerender();
				});
				
			}
		};
	}])
})();