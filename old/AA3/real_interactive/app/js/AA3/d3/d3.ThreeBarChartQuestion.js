var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
	ThreeBarChartQuestion: (function () {
		// Static vars
	
		function factory() {

			function chart(holder) {

				var national = barStateMap.get(which_state || 'National');
				
				var chart_slug = holder.data()[0];
				
				var chart = AA3.d3.questionSingleBarChart()
									.width(196);

				var highlightable = Boolean(onHighlight);

				_.each(yearRange, function buildChart(year) {

					var slug = chart_slug + year;
					var value = national.get(slug)[0].answer;

					var bar = holder.append('div')
								.classed('clickable', highlightable)
								.classed('subHighlightable', highlightable)
								.on('click', function () {
									if ( ! onHighlight ) return;
									
									onHighlight(slug)

									holder.selectAll('.subHighlighted')
										.classed('subHighlighted', false)

									bar.classed('subHighlighted', true)

									// Hide the grade level filters if this isn't 2014
									var gradeFilters = holder.select('.gradeLevelSelectors')

									if (slug.match(/(2014)/)) {
										gradeFilters.attr('style', 'visibility:visible;')
									} else {
										gradeFilters.attr('style', 'visibility:hidden;')
									}

								})
								.classed('subHighlighted', slug == which_question);
					
					bar.append('span')	
						.text(year)

					bar.datum(value)
						.call(chart)
				})

				if (gradeLevels) {
					var baseSlug = chart_slug + '2014';

					var gradeWrap = holder.append('div')
						.classed("gradeLevelSelectors", true)

						gradeWrap.append('text')
							.text('filter')

					var grades = [
						{	
							slug: '',
							html: 'All'
						},
						{ 
							slug: '_k_to_5',
							html: 'K-5'
						},
						{ 
							slug: '_6_to_8',
							html: '6-8'
						},
						{ 
							slug: '_9_to_12',
							html: '9-12'
						}
								
					]

					_.each(grades, function (g) {
						var button = gradeWrap.append('a')
										.classed('clickable', true)
										.classed('gradeCategory', true)
										.classed('subHighlightable', true)
										.classed(which_category + 'Category', true)
										.on('click', function () {
											
											onHighlight(baseSlug + g.slug)

											holder.selectAll('.subHighlighted')
												.classed('subHighlighted', false)
												.classed('fillByCategory', false)

											holder.select('.subHighlightable')
												.classed('subHighlighted', true)

											button.classed('subHighlighted', true)
												.classed('fillByCategory', true)

										})
										.html(g.html)
					})

				}

				if (projection && ! which_state.match(/(african|hispanic|allegheny)/i)) {
					var projectionVal = national.get(projection)[0].answer
					holder.append('p')
						.classed('projection', true)
						.text(projectionVal + ' children in 2014')
				}



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

			// An Array of years the question was asked
			var yearRange;
			chart.yearRange = function(value) {
				if (!arguments.length) return yearRange;
				yearRange = value;
				return chart;
			};

			var onHighlight;
			chart.onHighlight = function(value) {
				if (!arguments.length) return onHighlight;
				onHighlight = value;
				return chart;
			};

			var gradeLevels;
			chart.gradeLevels = function(value) {
				if (!arguments.length) return gradeLevels;
				gradeLevels = value;
				return chart;
			};

			var projection;
			chart.projection = function(value) {
				if (!arguments.length) return projection;
				projection = value;
				return chart;
			};


			return chart;
		}

		return factory
	})()
});
