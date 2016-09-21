var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
	justText: (function () {
		// Static vars

		function factory() {

			function chart(holder) {

				var chart_slug = holder.data()[0];

				var html = getCardText(which_state, chart_slug, 'text');

				holder.append('p')
					.classed('justTextCardText', true)
					.classed('justTextCentered', centered)
					.html(html)
			}

			var centered = true;
			chart.centered = function(value) {
				if (!arguments.length) return centered;
				centered = value;
				return chart;
			};

			return chart;
		}

		return factory;
	})()
});
