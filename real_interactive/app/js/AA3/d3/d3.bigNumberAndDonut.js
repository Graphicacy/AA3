var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
	bigNumberAndDonut: (function () {
		// Static vars

		var pie = d3.layout.pie()
		    .sort(null);

		var arc = d3.svg.arc()
	
		function factory() {
			// Instance vars
			var wContainer = 90, // w and h found in DOM (div) already in place
				hContainer = 90,
				margin = {top: 0, right: 0, bottom: 0, left: 0};

			var colors = ['#2A384B', '#BFCAC7'];
	
			function chart(holder) {
				var width = wContainer - margin.left - margin.right,
					height = hContainer - margin.top - margin.bottom,
					radius = Math.min(width, height) / 2;

				arc.innerRadius((30/45)*radius)
		    		.outerRadius(radius);

				var svg = holder.append('svg:svg')
					.attr('class', 'bigNumberAndDonut')
					.attr('height', hContainer)
					.attr('width', wContainer)
					    .append("g")
						    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				var percent = holder.data()[0];
				
		        percent = Math.round(percent);

				var text = svg.append('svg:text')
							.attr('class', 'bigNumber')
							.text(percent + '%');

				var textBox = text.node().getBBox();

				// Center text
				text.attr('x', radius - ( textBox.width / 2 ) )
					.attr('y', Math.min(radius + ( textBox.height / 4 ), 118) )

				svg.append('g')
					.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
						.selectAll("path.donut")
						    .data(pie([percent, 100 - percent]))
						  .enter().append("path")
						  	.attr('class', function(d, i) { return 'donut donutPart' + i })
						    .attr("fill", function(d, i) { return colors[i]; })
						    .attr("d", arc);
			}
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
