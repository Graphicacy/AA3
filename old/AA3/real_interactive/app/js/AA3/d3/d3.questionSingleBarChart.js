var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
	questionSingleBarChart: (function () {
		// Static vars
	
		function factory() {

			// Instance vars	
			var wContainer = 276,
				hContainer = 20,
				margin = {top: 2, right: 2, bottom: 2, left: 2};

			var widthScale = d3.scale.linear()
								.domain([0, 100]);
	
			function chart(holder) {
				var width = wContainer - margin.left - margin.right,
					height = hContainer - margin.top - margin.bottom;

				var svgContainer = holder.append("svg")
					.attr('class', 'questionSingleBarChart')
					.attr("height", hContainer)
					.attr("width", wContainer)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

				widthScale.range([0, width])

				svgContainer.append("rect")
					.attr("width", width)
					.attr("height", height)
					.attr("rx", 3)
					.attr("ry", 3)
					.attr("class", "cardChartBackgroundBar");
		
				svgContainer.each(function (d, i) {
					if (d == 'NA' || isNaN(d)) { 
						svgContainer.append("text")
							.attr("x", 6)
							.attr("y", 12)
							.attr("fill", "#6B7885")
							.text("Not available");
					} else {
						svgContainer.append("rect")
							.attr("width", widthScale)
							.attr("height", height)
							.attr("rx", 3)
							.attr("ry", 3)
							.attr("class", "cardChartValueBar");

						svgContainer.append("text")
							.attr('class', function (d, i) { return (d <= 80) ? 'none' : 'invertColor' })
							.attr("x", function (d) { 
								var w = widthScale(d);
								return (d <= 80) ? w + 10 : w - 40;
							})
							.attr("y", 12)
							.text(function (d) { return Math.round(d) + '%' })
							.attr('fill', '#707982');	
					}
				})

			}
	
			// Chart attributes
			chart.width = function(value) {
				if (!arguments.length) return wContainer;
				wContainer = value;
				return chart;
			};


			return chart;
		}
	
	
		return factory;	
	})()
});