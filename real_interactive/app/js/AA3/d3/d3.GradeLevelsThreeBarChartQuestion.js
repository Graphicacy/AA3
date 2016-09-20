var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
	GradeLevelsThreeBarChartQuestion: (function () {
		// Static vars
	
		function factory() {

			function chart(holder) {

				var national = barStateMap.get(which_state || 'National');
				
				var chart_slug = holder.data()[0];

				var grades = [
					{ 
						// Lolhack. This depends on the width of the font,
						// which has 2 spaces to a character
						slug: 'k_to_5',
						html: 'K-5&nbsp;&nbsp;'
					},
					{ 
						slug: '6_to_8',
						html: '6-8&nbsp;&nbsp;'
					},
					{ 
						slug: '9_to_12',
						html: '9-12'
					}
				];

				var combinedGrades = [
					{ 
						slug: '6_to_8',
						html: 'K-8&nbsp;&nbsp;'
					},
					{ 
						slug: '9_to_12',
						html: '9-12'
					}
				];

				var combinedStates = ['CT', 'DE', 'HI', 'KY', 'MI', 'NH'];
				
				var chart = AA3.d3.questionSingleBarChart()
									.width(196);

				var highlightable = false;

				var gradesToUse = grades;

				if (combineKTo8 && combinedStates.indexOf(which_state) != -1) {
					gradesToUse = combinedGrades
				}

				_.each(gradesToUse, function buildChart(g) {

					var slug = chart_slug + g.slug;
					var value = national.get(slug)[0].answer;

			        value = Math.round(value);

					var bar = holder.append('div')
								.classed('clickable', highlightable)
								.classed('subHighlightable', highlightable)
								.classed('subHighlighted', slug == which_question);
					
					bar.append('span')	
						.html(g.html)

					bar.datum(value)
						.call(chart)
				})


				// Pass metadata and "expand more info" settings
				holder.call(AA3.d3.infoText()
												.enableMoreInfo(enableMoreInfo)
												.metaData(metaData))

			}

			// If false, always display more info
			var enableMoreInfo = true;
			chart.enableMoreInfo = function(value) {
				if (!arguments.length) return enableMoreInfo;
				enableMoreInfo = value;
				return chart;
			};
	
			// Chart attributes
			var metaData;
			chart.metaData = function(value) {
				if (!arguments.length) return metaData;
				metaData = value;
				return chart;
			};

			var combineKTo8 = false;
			chart.combineKTo8 = function(value) {
				if (!arguments.length) return combineKTo8;
				combineKTo8 = value;
				return chart;
			};

			return chart;
		}

		return factory
	})()
});
