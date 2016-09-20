var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
	placeholder: function () {
		/*- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -*/
		/*
		/* A Placeholder for d3.js components
		/*
		/* When you don't know what you're doing, but you know it's going to be 
		/* 530 x 32px and that you're going to make it in d3.
		/*
		/* Author: [Reed](https://github.com/reedspool)
		/* 			& [Graphicacy](www.graphicacy.com)
		/*
		/* Useage:
		/* 
		/* var fakeChart = placeholder();
		/* 
		/* d3.select('.realChartContainer')
		/*   .datum(['some', 'bogus', 'or', 'real', 'data'])
		/*   .call(fakeChart)
		/*   
		/* 
		/*- -~- -*/
		
		// Static vars
		var maxId = 1;
	
		function factory() {
			// Instance vars
			var id = maxId++;
			var updateId = 1;
	
			function chart(holder) {
				var hHolder = parseInt(holder.style('height'), 10);
				var wHolder = parseInt(holder.style('width'), 10);
				var margin = {top: 0, right: 0, bottom: 0, left: 0};
				var width = wHolder - margin.left - margin.right;
				var height = hHolder - margin.top - margin.bottom;

				// First, remove all existing children
				holder.select('*').remove()

				var dataMaybe = holder.data();

				var title = dataMaybe.title || 'Placeholder d3 chart #' + id + ', Update #' + updateId++;

				var svg = holder.append('svg:svg')
					.attr('class', 'placeholder')
					.attr('width', width)
					.attr('height', height)

				svg.on('click', chart.bind(chart, holder))
				
				svg.append('svg:rect')
					.attr('width', width)
					.attr('height', height)
					.attr('fill', 'rgb(48, 48, ' + Math.floor(Math.random() * 255) + ')')
				
				var titleText = svg.append('svg:text')
						.attr('y', height / 2)
						.text(title)

				// Center title
				titleText.attr('x', (width - titleText.node().getBBox().width) / 2)
			}
	
			// Chart attributes
	
			return chart;
		}
	
	
		return factory;		
	}()
})