var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
	popover: function () {

		function chartFactory() {
			var hContainer = 180,
				wContainer = 200, // w and h found in DOM (parentSvg) already in place
				margin = {top: 0, right: 0, bottom: 0, left: 0},
				width = wContainer - margin.left - margin.right,
				height = hContainer - margin.top - margin.bottom,
				widthBar = width - 22;

			// D3 components
			var x = d3.scale.linear()
						.domain([0, 100.0])
						.range([0, widthBar])

			function chart(parentSvg) {
				var svg = parentSvg.select('g.popoverContainer');

				var background = parentSvg.select('rect.background')

				if (background.empty()) {
					parentSvg.append('svg:rect')
						.classed("background", true)
						.attr('x', 0)
						.attr('y', 0)
						.attr('width', width)
						.attr('height', height)					
				}

				var q = parentSvg.data();

				var meta = metaMap.get(q.slug);

				if ( ! svg.empty() ) {
					svg.remove();
				}

				svg = parentSvg.append('g')
					.attr('class', 'popoverContainer')

				/* BAD USE OF GLOBALS INCOMING */
				var state = q[0].properties.code;
				var stateName = q[0].properties.name;

				var questionForState = barStateMap.get(state)
											.get(which_question)[0];
				var answer = questionForState.answer;

				var natAvg = barStateMap.get('National').get(which_question)[0].answer;

		        natAvg = Math.round(natAvg);

				var metaForQ = metaMap.get(questionForState.slug)[0];

				var unitType = metaForQ["data.type"];

				var min = metaForQ.min;
				var max = metaForQ.max;

				if (unitType == 'percent') {
					min = 0;
					max = 100;
				} 

				x.domain([min, max])

				var valueBar = x(answer);
				var eightypercent = .8 * widthBar;


				var barText = AA3.utility.formatType(Math.round(answer), unitType);

				if (answer == 'NA') {
					valueBar = 0;
					barText = 'Not available'
				}

				svg.append('text')
					.text(stateName)
					.attr('y', 25)
					.attr('x', 10)
					.attr('class', 'popover-state-name');

				svg.append('text')
					.text('Click for more details')
					.attr('y', 40)
					.attr('x', 10)
					.attr('class', 'popover-sub-text')
				
				svg.append('rect')
					.attr('width', widthBar)
					.attr('height', 20)
					.attr('x', 10)
					.attr('y', 55)
					.attr('rx', 4)
					.attr('ry', 4)
					.attr('fill', '#D5D2CE')
					.attr('fill-opacity', 0.5);

				svg.append('rect')
					.attr('width', valueBar)
					.attr('height', 20)
					.attr('x', 10)
					.attr('y', 55)
					.attr('rx', 4)
					.attr('ry', 4)
					.attr('fill', '#707982')
					.attr('fill-opacity', 0.5);

				var insideAndInverted = valueBar >= eightypercent;

				svg.append('text')
					.attr('y', 70)
					.attr('class', function (d, i) { 
						return insideAndInverted ? 'invertColor' : 'none';
					})
					.attr("x", function (d) { 
						return insideAndInverted ? valueBar - 50 : valueBar + 15;
					})
					.text(barText)

				svg.append('text')
					.text('National average:')
					.attr('class', 'popover-national-average')
					.attr('y', 92)
					.attr('x', 10);

				var natAvgText = natAvg;

				natAvgText = AA3.utility.formatType(natAvgText, unitType);

				if (isNaN(natAvg)) {
					natAvgText = 'Not Available'
					natAvg = 0;
				}

				svg.append('text')
					.text(natAvgText)
					.attr('class', 'popover-national-average')
					.attr('y', 92)
					.attr('x', 110);

				svg.append('foreignObject')
					.attr('y', 102)
					.attr('x', 10)
					.attr('width', 150)
					.attr('height', 60)
					.append('xhtml:p')
					.attr('xmlns', 'http://www.w3.org/1999/xhtml')
					.text(metaForQ.popoverText);
			}

			return chart;
		}

		return chartFactory;
	}()
})