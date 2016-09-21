var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
	barCharts: function () {
		
		function chartFactory() {
			var wContainer = 940, // w and h found in DOM (div) already in place
				hContainer = 65,
				margin = {top: 10, right: 0, bottom: 10, left: 0},
				width = wContainer - margin.left - margin.right,
				height = hContainer - margin.top - margin.bottom,
				textSpace = 11,
				textMargin = 5,
				barHeight = height - textSpace - textMargin,
				duration = 1000,
				minDelay = 100,


				// d3 component(s)
				x = d3.scale.ordinal()
							.rangeRoundBands([width, 0], .1, 1),
				y = d3.scale.linear()
							.domain([0, 100])
							.range([0, barHeight - 5]),
				delayScale = d3.scale.pow()
							.exponent(.8)
							.range([duration, minDelay])

				formatPercent = d3.format(".0%");


			function chart(div) {
				var meta = metaMap.get(which_question)[0];
				var min = Number(meta.min);
				var max = Number(meta.max);

				y.domain([min, max])

				var svg = div.select('svg.barChartContainer > g');

				if (svg.empty()) {
					svg = div.append('svg:svg')
							.attr('class', 'barChartContainer')
							.attr('height', hContainer)
							.attr('width', wContainer)
						.append('svg:g')
							.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				}

				function stateMouseover(d) {
					hoverState(d);
				}

				stateMouseover = $.throttle(60, stateMouseover)

				var statesData = stateTopo();
				var numStates = statesData.length;

				delayScale.domain([0, numStates])

				function sorter(a, b) {
					a = barValue(a);
					b = barValue(b);

					return b - a;
				}

				x.domain(statesData.sort(sorter)
					.map(function (d) { return d.properties.code }))

				var up = svg.selectAll('.state')
							.data(statesData,
								function (d) { return d.properties.code; }),
					en = up.enter(),
					ex = up.exit();

				svg.on('mouseleave', stateMouseover);

				var gEnter = en.append('svg:g')
								.on('mousemove', stateMouseover)
								.on('click', clickState)
								.attr('class', 'state')

				gEnter.append('svg:rect')
					.attr('class', 'backgroundRect clickable')
					.attr('fill', 'none')
					.attr('width', x.rangeBand())
					.attr('height', height)
					.attr('x', 0)
					.attr('y', 0)

				var grad = gradient();

				gEnter.append('svg:rect')
					.attr('class', 'bar clickable')
					.attr('width', x.rangeBand())
					.attr('fill', function (d, i) {
						return grad(barValue(d))
					})

				gEnter.append('svg:text')
					.attr('x', 1)
					.attr('y', barHeight + textMargin + textSpace)
					.attr('class', 'clickable')
					.text(function (d) { return d.properties.code })
				
				var upTransition = up
								.on('mousemove', stateMouseover)
								.transition()
									.duration(duration)
									.delay(function(d, i) { return delayScale(numStates - i) })
									.attr('transform', function (d) {
										return 'translate(' + x(d.properties.code) + ', 0)';
									})

				upTransition.selectAll('.bar')
					.attr('height', function (d, i) {
						return barHeight - y(max - (barValue(d) - min))
					})
					.attr('y', function (d, i) {
						return y(max - (barValue(d) - min))
					})
					.delay(0)
					.attr('fill', function (d, i) { 
						return grad(barValue(d)) 
					})
					
				// No exit. They enter once, and they never leave.
			}

			var barValue;
			chart.barValue = function(value) {
				if (!arguments.length) return barValue;
				barValue = value;
				return chart;
			};

			var stateTopo;
			chart.stateTopo = function(value) {
				if (!arguments.length) return stateTopo;
				stateTopo = value;
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

			var gradient;
			chart.gradient = function(value) {
				if (!arguments.length) return gradient;
				gradient = value;
				return chart;
			};

			return chart;
		}

		return chartFactory;
	}()
})