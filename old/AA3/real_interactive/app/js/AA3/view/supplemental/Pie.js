var AA3 = _.extend({}, {supplemental: {}}, AA3)

_.extend(AA3.supplemental, {
	Pie: function () { 
		// Static vars
	
		function factory() {
			
			function chart(holder) {
				var data = holder.data()[0];

				var pie = AA3.d3.pieChart()
									.height(90)
									.width(90)

				holder.call(pie)

				holder.append('span')
					.attr('class', 'boys title')
					.text(title)

				holder.append('span')
					.attr('class', 'girls subtitle')
					.text(subtitle)
			}
	
			// Chart attributes
			var title;
			chart.title = function(value) {
				if (!arguments.length) return title;
				title = value;
				return chart;
			};

			var subtitle;
			chart.subtitle = function(value) {
				if (!arguments.length) return subtitle;
				subtitle = value;
				return chart;
			};
	
			return chart;
		}
	
		return factory;	
	}()
});