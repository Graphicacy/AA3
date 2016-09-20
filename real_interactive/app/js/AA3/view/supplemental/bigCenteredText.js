var AA3 = _.extend({}, {supplemental: {}}, AA3)

_.extend(AA3.supplemental, {
	bigCenteredText: function () { 
		// Static vars
	
		function factory() {
			
			function chart(holder) {
				var data = holder.data()[0];

				var textChart = AA3.d3.bigCenteredText()

				holder.call(textChart)

				holder.append('span')
					.attr('class', 'title')
					.text(title)

			}
	
			// Chart attributes
			var title;
			chart.title = function(value) {
				if (!arguments.length) return title;
				title = value;
				return chart;
			};
	
			return chart;
		}
	
		return factory;	
	}()
});