var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
	pieChart: (function () {
		// Static vars

		var pie = d3.layout.pie()
		    .sort(null);

		var arc = d3.svg.arc()
	
		function factory() {
			// Instance vars
			var wContainer = 125, // w and h found in DOM (div) already in place
				hContainer = 125,
				margin = {top: 0, right: 0, bottom: 0, left: 0};

			var colors = ['#2A384B', '#BFCAC7'];
	
			function chart(holder) {
				var width = wContainer - margin.left - margin.right,
					height = hContainer - margin.top - margin.bottom,
					radius = Math.min(width, height) / 2;

				arc.innerRadius(0)
		    		.outerRadius(radius);

				var svg = holder.append('svg:svg')
					.attr('class', 'pieChart')
					.attr('height', hContainer)
					.attr('width', wContainer)
					    .append("g")
						    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				var percent = holder.data()[0];


		        percent = Math.round(percent);

				svg.append('g')
					.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
						.selectAll("path.pie")
						    .data(pie([percent, 100 - percent]))
						  .enter()
						  	.append('g')
						  		.attr('class', 'arc')
						  	.append("path")
						  	.attr('class', function (d, i) { return 'pie piePart' + i })
						    .attr("fill", function(d, i) { return colors[i]; })
						    .attr("d", arc);
				
			}
	
			chart.arc = arc

			// Chart attributes
			chart.width = function(value) {
				if (!arguments.length) return wContainer;
				wContainer = value;
				return chart;
			};
			chart.height = function(value) {
				if (!arguments.length) return hContainer;
				hContainer = value;
				return chart;
			};
			chart.colors = function(value) {
				if (!arguments.length) return colors;
				colors = value;
				return chart;
			};

			return chart;
		}

		return factory;
	})()
});
