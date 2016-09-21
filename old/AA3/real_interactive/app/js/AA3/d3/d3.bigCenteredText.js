var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
	bigCenteredText: (function () {
	
		function factory() {
			
			function chart(holder) {
				holder.append('span')
					.text(function (d) { return Math.round(d) + '%'; });
			}

			return chart;
		}

		return factory;
	})()
});
