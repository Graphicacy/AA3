var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
	mapLegend: function () {
		
		function chartFactory() {
			var wContainer = 270, // w and h found in DOM (div) already in place
				hContainer = 104,
				margin = {top: 2, right: 2, bottom: 2, left: 2},
				width = wContainer - margin.left - margin.right,
				height = hContainer - margin.top - margin.bottom,
				wGradientBar = 142, // w and h found in DOM (div) already in place
				hGradientBar = 21,
				x = d3.scale.ordinal()
							.rangeBands([wGradientBar, 0], 0, 0);
				xLinear = d3.scale.linear()
							.range([0, wGradientBar])
			
			// Utilities to move 
			d3.selection.prototype.moveToFront = function() {
			  return this.each(function(){
				  this.parentNode.appendChild(this);
			  });
			};

			d3.selection.prototype.moveToBack = function() { 
			    return this.each(function() { 
			        var firstChild = this.parentNode.firstChild; 
			        if (firstChild) { 
			            this.parentNode.insertBefore(this, firstChild); 
			        } 
			    }); 
			};

			function chart(holder) {
				var legendGroup = holder.select('.legendGroup');
				var data = holder.data()[0];
				var slug = data.slug;
				var meta = metaMap.get(data.slug)[0];
				var gradient = data.gradient;
				var colorRange = gradient.range();
				var natAvg = barStateMap.get('National').get(slug)[0].answer;
				var type = meta["data.type"];
				var duration = 1000;
				var setup = false;

				x.domain(d3.range(colorRange.length).reverse())

				xLinear.domain([meta.min, meta.max])

				if (legendGroup.empty()) {
					setup = true;

					legendGroup = holder.append('svg:g')
							.classed('legendGroup', true)
							.attr('transform', 'translate(95,60)')
				}

				var up = legendGroup.selectAll('.gradientSection')
							.data(colorRange),
					en = up.enter();

				en.append('svg:rect')
					.classed('gradientSection', true)
					.attr('x', function (d, i) { return x(i) + 1 })
					.attr('y', 1)
					.attr('height', hGradientBar)
					.attr('width', x.rangeBand())
					.attr('fill', colorRange[0])
					
				up.transition()
					.duration(duration)
					.attr('fill', function (d) { return d; })

				var upNatAvg = legendGroup.selectAll('.nationalAverage')
									.data([natAvg]);
				var enNatAvg = upNatAvg.enter();

				enNatAvg.append('svg:rect')
					.classed('nationalAverage', true)
					.attr('height', hGradientBar - 1)
					.attr('width', 3)
					.attr('x', 0)
					.attr('y', 1)
					.attr('stroke-width', 0)
					.attr('fill', 'black')
					
				upNatAvg.transition()
					.duration(duration)
					.attr('x', xLinear(natAvg))
					
				if (setup) {
					// Make sure this is above all the color tiles
					legendGroup.append('svg:rect')
						.classed('border', true)
						.attr('stroke-width', 2)
						.attr('stroke', 'rgba(0, 0, 0, .25)')
						.attr('fill', 'none')
						.attr('x', 1)
						.attr('y', 1)
						.attr('height', hGradientBar)
						.attr('width', wGradientBar)
						.attr('rx', 5)
						.attr('ry', 5)

					var posedText = d3.select('.site .content.centeredContent')
										.append('p')
											.classed('posedText', true)

					var maxText = holder.append('text')
									.classed('maxText', true)
									.attr('x', 251)
									.attr('y', 71)
									
					holder.append('text')
						.attr('class', 'symbol')
						.attr('x', 251)
						.attr('y', 81)
						.text('max')

					var minText = holder.append('text')
									.classed('minText', true)
									.attr('x', 66)
									.attr('y', 71)
									
					holder.append('text')
						.attr('class', 'symbol')
						.attr('x', 66)
						.attr('y', 81)
						.html('min')
				} else {
					posedText = d3.select('.site .content.centeredContent').select('.posedText')
					maxText = holder.select('.maxText')
					minText = holder.select('.minText')
				}

				posedText.html(_.template(meta.templated)({ value: Math.round(natAvg) }))
				maxText.text(AA3.utility.formatType(Math.round(meta.max), type, 'short'))
				minText.text(AA3.utility.formatType(Math.round(meta.min), type, 'short'))
			}

			return chart;
		}

		return chartFactory;
	}()
})