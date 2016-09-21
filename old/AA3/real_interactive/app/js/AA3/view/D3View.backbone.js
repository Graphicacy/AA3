/*- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -*/
/*
/* Backbone View Wrapper for d3 charts
/*
/*- -~- -*/
var AA3 = _.extend({}, AA3, {
    D3View: Backbone.View.extend({
		el: null,
		chart: AA3.d3.placeholder(),

		// The "Loading" chart, for example...
		placeholder: AA3.d3.placeholder(), 

		chartSelection: null,
		getData: null,

		initialize: function(options) {
	        // Bind this inexorably to functions
			_.bindAll(this, 'render');
	    	
			this.getData = options.getData || this.model.get.bind(this.model, 'data')

			this.chart = options.chart || this.placeholder

	    	// Auto-update
	    	// this.model.bind('change:data', this.render);

	        this.renderPlaceholder();
		},
	    renderPlaceholder: function() {
	        this.chartSelection = d3.select(this.el)
	            .datum([])
	            .call(this.placeholder);

	        return this;
	    },
		render: function() {
			this.$('.placeholder').remove();

			this.chartSelection = d3.select(this.el)
			    .datum(this.getData())
			    .call(this.chart);

			return this;
		}
	})
});