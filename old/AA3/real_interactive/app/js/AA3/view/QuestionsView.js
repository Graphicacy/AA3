/*- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -*/
/*
/* Backbone View Wrapper for d3 charts
/* 
/*- -~- -*/
var AA3 = _.extend({}, AA3, {
  QuestionsView: Backbone.View.extend({
  	PAGE_BREAK_INDEX: 3,
		el: null,

		// The "Loading" chart, for example...
		placeholder: AA3.d3.placeholder(), 

		getCategory: null,
		getHighlight: null,
		highlight: null,
		firstRender: true,

		initialize: function(options) {
	        // Bind this inexorably to functions
			_.bindAll(this, 'render');

			this.getCategory = options.getCategory;
			this.getHighlight = options.getHighlight;
			this.highlight = options.highlight;

			var templateHTML = $('#questionsView-questionTemplate').text();

			this.questionTemplate = _.template(templateHTML);

		},

		constructAllCharts: function () { 
			var view = this;

			var questions = metaMap.values();
			var highlight = this.getHighlight();
			var $highlight = $();

			questions = questions.sort(function (a, b) { 
				return a[0].priority - b[0].priority;
			});

			var $e = this.$el;

			var wrap = d3.select(this.el);

			// Destroy everything on each render
			wrap.selectAll('*').remove();

			_.each(questions, function (q, i) {
				var meta = q[0];
				var slug = meta.slug;
				var which = meta['question.chart'];
				var category = meta['category'];
				var isHighlight = slug == highlight;

				if (which == 'none') {
					console.log('No chart specified for ' + slug)
					return;
				}

				var html = view.questionTemplate({
					title: meta.questionViewTitle
				});

				var chartFactory = AA3.SideBarQuestions[which]

				if ( ! chartFactory ) {
					console.log('Chart not found for ' + slug)
					return;
				}

				var chart = chartFactory()

				if (chart.onHighlight) chart.onHighlight(highlightMe)

				function highlightMe(moreSpecificSlug) {
					if (this != window) {
						
						var $holder = $(this)

						if ( ! $holder.hasClass('questionHolder') ) {
							$holder = $holder.parents('.questionHolder');
						}

						if ( ! moreSpecificSlug && $holder.hasClass('highlightedQuestion')) {
							// Erroneous highlighting question already highlighted
							return;
						}

						$('.questionHolder').addClass('clickable')

						$holder.removeClass('clickable');
					}

					var highlight = slug;
					var meta = metaMap.get(moreSpecificSlug);

					if ( meta ) highlight = moreSpecificSlug;

					view.highlight(highlight)
				}

				var holder = wrap.append('div')
					.classed('questionHolder', true)
					.classed(category + 'CategoryVisible', true)
					.classed(category + 'Category', true)
					.classed('highlightedQuestion', isHighlight)
					.classed('slug_' + slug, true)
					.classed('clickable', true)
					.on('click', highlightMe)
					.html(html)

					// FOR PRINT
					.classed('pagebreakBefore', i > 0 && i % view.PAGE_BREAK_INDEX == 0)

				holder.select('.questionHeader')
					.classed('fillByCategory', isHighlight)
					.classed('colorByCategory', ! isHighlight)
					.classed( category + 'Category', true)
					.classed('clickable', true)

				holder.select('.questionChart')
					.append('div')
					.attr('class', 'question')
					.datum(which)
					.call(chart)
			})

		},

    renderPlaceholder: function() {
        this.chartSelection = d3.select(this.el)
            .datum([])
            .call(this.placeholder);

        return this;
    },

    lastCategory: null,
    lastHighlightedSlug: null,
    lastimgpath: null,

		render: function() {
			if (this.firstRender) {
				this.constructAllCharts();
			}

			var wrap = d3.select(this.el);
			var category = this.getCategory();
			var activeClass = category + 'CategoryVisible';
			var originalSlug = this.getHighlight();
			var highlightedSlug = originalSlug;

			// Display only the questions in this category...
			wrap.selectAll('.questionHolder')
				.attr('style', 'display:none;')

			wrap.selectAll('.questionHolder.' + activeClass)
				.attr('style', 'display:inherit;')

			// When the category is changed, scroll to top
			if (this.lastCategory != category) {
				$("#questionsWrapper")[0].scrollTop = 0;

				// If moving to or from health, need to update logo
				var $logo = $('#mainLogo');

				var $mainTexts = {
					original: $('.mainText .originalParagraphEnd'),
					health: $('.mainText .hepaParagraphEnd'),
					summer: $('.mainText .summerParagraphEnd'),
					stem: $('.mainText .stemParagraphEnd')
				}
				
				var imgPath = AA3.CONFIG.IMG.LOGO[category == 'health'
																					? 'HEALTH'
																					: category == 'summer'
																						? 'SUMMER'
																						: category == 'stem'
																							? 'STEM'
																							: 'NORMAL'];


				// We're transitioning to the original 3 And we just came from one of the orignal 3.
				if (['demand', 'benefits', 'support'].indexOf(category) != -1
					&& ['demand', 'benefits', 'support'].indexOf(this.lastCategory) != -1) {

					// Noop
					$enterText = $();
					$exitText = $();
				// We are transitioning to one of the weird ones, so we're definitely changing
				} else {
					$exitText = $mainTexts[this.lastCategory] || $mainTexts.original
					$enterText = $mainTexts[category] || $mainTexts.original
				}

				if ($exitText == $mainTexts.original && $enterText == $mainTexts.original) {
					 $exitText = $mainTexts.health
					 								.add($mainTexts.summer)
					 								.add($mainTexts.stem)
				}

				if (this.lastimgpath != imgPath) {
					$logo
					.animate({
						opacity: 0
					}, 250)
					.promise()
					.then(function () { 
						$logo.attr('src', imgPath)
							.animate({
								opacity: 1
							}, 250)
					})
				}

				// Record
				this.lastimgpath = imgPath
				

				$exitText
					.animate({
						opacity: 0
					})
					.promise()
					.then(function () {
						$exitText.css('display', 'none')
						$enterText.css('display', 'inline')
							.animate({
								opacity: 1
							})
					})
				
			}

			this.lastCategory = category; 

			// Now highlight the one that's highlighted
			wrap.selectAll('.highlightedQuestion')
				.classed('highlightedQuestion', false)

			function getHighlightedHolder() {
				return wrap.select('.questionHolder.slug_' + highlightedSlug)
			}


			// Try the 2013 version instead of 2008...
			if ( getHighlightedHolder().empty() && highlightedSlug.match(/2008/) ) {
				highlightedSlug = highlightedSlug.replace(/\d\d\d\d.*/, 2013)
			}

			// Try the 2014 version instead of 2009 or 2004...
			if ( getHighlightedHolder().empty() ) {
				highlightedSlug = highlightedSlug.replace(/\d\d\d\d.*/, 2014)
			}

			// Still nothing? try replacing days with hours
			if ( getHighlightedHolder().empty() ) {
				highlightedSlug = originalSlug.replace("day", "hr")
			}

			// Still nothing? These ones are for the HEPA double cards 1/2
			if ( getHighlightedHolder().empty() ) {
				highlightedSlug = originalSlug.replace('physical_variety', 'physical_amount')
			}

			// Still nothing? These ones are for the HEPA double cards 2/2
			if ( getHighlightedHolder().empty() ) {
				highlightedSlug = originalSlug.replace('healthy_snacks', 'programs_snacks')
			}

			var highlighted = getHighlightedHolder()

			// If we've changed questions, close all "More Info" panels
			if (this.lastHighlightedSlug != highlightedSlug) {
				d3.selectAll('.more').style('display', 'none'); 
				d3.selectAll('.more-info.clickable').style('display', 'inherit');
			}

			this.lastHighlightedSlug = highlightedSlug;

			highlighted.classed('highlightedQuestion', true)

			wrap.selectAll('.questionHeader')
				.classed('fillByCategory', false)
				.classed('colorByCategory', true)

			highlighted.select('.questionHeader')
				.classed('fillByCategory', true)
				.classed('colorByCategory', false)
				.classed('highlightedQuestion', true)

			wrap.selectAll('.subHighlightable')
				.classed('subHighlighted', false)
				.classed('fillByCategory', false)

			highlighted.select('.subHighlightable')
				.classed('subHighlighted', true)

			// If this is page loading, then scroll down to the current highlight
			// Switch to jQuery selection because I don't know how to do position() in d3
			var $highlight = $(highlighted.node());

			if (this.firstRender && $highlight.size() > 0) {
				var duration = 2000;

				this.$el.animate({
			        scrollTop: $highlight.position().top
			    }, duration);
			}

			this.firstRender = false;
		}
	})
});