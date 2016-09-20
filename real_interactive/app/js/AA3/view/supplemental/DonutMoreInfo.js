var AA3 = _.extend({}, {supplemental: {}}, AA3)

_.extend(AA3.supplemental, {
	DonutMoreInfo: function () { 
		// Static vars
	
		function factory() {
			
			function chart(holder) {
				var data = holder.data()[0];

				var donutChart = AA3.d3.bigNumberAndDonut()
									.height(90)
									.width(90)

				holder.call(donutChart)

				holder.append('span')
					.attr('class', 'title')
					.text(title)

				if ( ! moreInfo ) return;

				holder.append('span')
					.attr('class', 'moreInfoBtn clickable')
					.html('More Info ')
					.on('click', moreInfo)
						.append('span')
							.classed('right-arrow-chevron', true)
							.html('&#8250;')
			}
	
			// Chart attributes
			var title;
			chart.title = function(value) {
				if (!arguments.length) return title;
				title = value;
				return chart;
			};

			var moreInfo;
			chart.moreInfo = function(value) {
				if (!arguments.length) return moreInfo;
				moreInfo = value;
				return chart;
			};
	
			return chart;
		}
	
		return factory;	
	}()
});