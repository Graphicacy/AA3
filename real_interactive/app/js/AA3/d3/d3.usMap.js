var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
	usMap: function () {

		function chartFactory() {
			var wContainer = 640, // w and h found in DOM (div) already in place
				hContainer = 460,
				mapScale = 800; // 1070 original blocks size
				margin = {top: 50, right: 0, bottom: 0, left: 0},
				width = wContainer - margin.left - margin.right,
				height = hContainer - margin.top - margin.bottom;

			var firstRender = true;

			// D3 components
			var projection = d3.geo.albersUsa()
			    .scale(mapScale)
			    .translate([width / 2, height / 2]);

			var popoverChart = AA3.d3.popover();			

		   	var path = d3.geo.path()
			    .projection(projection);



			function chart(div) {			

				var container = div.select('svg.mapContainer')
				var svg = container.select('g');

				if (svg.empty()) {
					container = div.append('svg:svg')
							.attr('class', 'mapContainer')
							.attr('height', hContainer)
							.attr('width', wContainer)
					svg = container.append('svg:g')
							.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
				}

				// Utility
				function stateClick(d) {
					var x, y, k, clicked;

					var statesGroup = svg.select("g.statesGroup");

					if (d) {
						var centroid = path.centroid(d);
						x = centroid[0];
						y = centroid[1];
						clicked = d
					}

					statesGroup.selectAll("path")
						.classed("clicked", clicked && function(d) { return d === clicked; })	
						
					clickState(d);
				}

				function stateMouseover(d) {
					var statesGroup = svg.select("g.statesGroup");

					var coords = d3.mouse(this);

					renderPopover(statesGroup, d, coords);
					hoverState(d);
				}
				
				// Render
				var eventCatcher = svg.select('rect.eventCatcher')

				if (eventCatcher.empty()) {
					eventCatcher = svg.append("rect")
					    .attr("class", "background eventCatcher")
					    .attr("width", width)
					    .attr("height", height)
				}

				eventCatcher
				    .on("click", stateClick)
				    .on('mousemove', stateMouseover)
					.on('mouseleave', stateMouseover);

				var statesData = div.data()[0];

				var statesGroup = svg.select("g.statesGroup");

				if (statesGroup.empty()) {
					var first = true;
					statesGroup = svg.append('svg:g')
						.attr('class', 'statesGroup');
				}

				var up = statesGroup.selectAll('path.feature')
							.data(topoFeatures,
								function (d) { return d.properties.code; });
				var en = up.enter();

				var lightOrange = '#fefcf2';

				en.append("path")
					.attr("d", path)
					.attr('class', 'feature clickable')
					// Give a default color that's not ugly black
					.attr('fill', lightOrange)

				var grad = gradient();

				up.on('mousemove', stateMouseover)
					.on("click", stateClick)
					.on('touchstart', stateClick)
					.transition()
					.duration(1000)
					.attr('fill', function (d, i) { 
						return grad(valueOfState(d))
					})

				statesGroup.select('#state-borders')
					.remove();

				statesGroup.append("path")
					.datum(topoMesh)
					.attr("id", "state-borders")
					.attr("d", path);

				if (firstRender) {
					var legendWrap = container.append('svg:g')
										.classed('legend', true)
										.attr('transform', 'translate(150, 0)');
				} else {
					legendWrap = container.select('.legend')
				}

				renderLegend(legendWrap, {
					gradient: grad,
					slug: which_question
				})

				firstRender = false;

				// FOR TESTING - DELETEME
				// debugger;
				// renderPopover(statesGroup, statesGroup.select('path.feature').data()[0])
			}

			var renderLegend = function (svg, data) { 
				svg.datum(data).call(AA3.d3.mapLegend())
			};

			var renderPopover = function (svg, d, coords) {
				var height = 180;
				var width = 200;

				var popover = svg.selectAll('.popover')

				if (popover.empty()) {
					popover = svg.append('g')
								.classed('popover', true)
								.attr('height', height)
								.attr('width', width)
				}

				if ( ! d ) {
					// No data, no popover
					popover.remove();
					return;
				}
				
				if ( ! coords ) {
					coords = path.centroid(d)
				}

				var x = coords[0],
					y = coords[1];

				if ( x > 430 ) {
					x -= 210;
				}

				if ( y > 220 ) {
					y -= 170;
				}

				popover.attr('transform', 'translate(' +
					x + ',' + y +
					')' );

				popover
					.datum(d)
					.call(popoverChart)
			};

			var topoFeatures;
			chart.topoFeatures = function(value) {
				if (!arguments.length) return topoFeatures;
				topoFeatures = value;
				return chart;
			};

			var topoMesh;
			chart.topoMesh = function(value) {
				if (!arguments.length) return topoMesh;
				topoMesh = value;
				return chart;
			};

			var clickState;
			chart.clickState = function(value) {
				if (!arguments.length) return clickState;
				clickState = value;
				return chart;
			};

			var hoverState;
			chart.hoverState = function(value) {
				if (!arguments.length) return hoverState;
				hoverState = value;
				return chart;
			};

			var valueOfState;
			chart.valueOfState = function(value) {
				if (!arguments.length) return valueOfState;
				valueOfState = value;
				return chart;
			};

			var gradient;
			chart.gradient = function(value) {
				if (!arguments.length) return gradient;
				gradient = value;
				return chart;
			};

			chart.centroid = function(d) {
				return path.centroid(d);
			};

			chart.showPopover = function(svg, d) {
				renderPopover(svg, d);
			};

			return chart;
		}

		return chartFactory;
	}()
})