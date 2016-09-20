/*- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -*/
/*
/* Backbone view for supplemental data section (select charts below US map)
/*
/* This view selects its own questions, instead of being passed them
/*
/*- -~- -*/

var AA3 = _.extend({}, AA3, {
    SupplementalDataView: Backbone.View.extend({
		el: null,

		// The "Loading" chart, for example...
		placeholder: AA3.d3.placeholder(), 

		currentCategory: null,
		currentQuestion: null,

		initialize: function(options) {
	        // Bind this inexorably to functions
			_.bindAll(this, 'render');

			this.currentCategory = options.currentCategory;
			this.currentQuestion = options.currentQuestion;

			var templateHTML = $('#supplementalDataView-questionTemplate').text();

			this.questionTemplate = _.template(templateHTML);

		},
    renderPlaceholder: function() {
        this.chartSelection = d3.select(this.el)
            .datum([])
            .call(this.placeholder);

        return this;
    },
		render: function() {
			var view = this;

			var category = this.currentCategory();
			var lastCategory = this.lastCategory;
			var currentQuestion = this.currentQuestion();

			var afam = AA3.supplemental.DonutMoreInfo()
									.title('African-American')
									.moreInfo(function () { 
										jumpToDetailPage('African.American')
									})

			var afamValue = barStateMap.get('African.American')
								.get(currentQuestion)
								[0].answer;

			afamValue = Math.round(afamValue)

			var hisp = AA3.supplemental.DonutMoreInfo()
							.title('Hispanic')
							.moreInfo(function () { 
								jumpToDetailPage('Hispanic')
							})

			var hispValue = barStateMap.get('Hispanic')
								.get(currentQuestion)
								[0].answer;


			hispValue = Math.round(hispValue)


			var frpl = AA3.supplemental.DonutMoreInfo()
							.title('FRPL')
							.moreInfo(false)

			var frplValue = barStateMap.get('FRPL')
								.get(currentQuestion)
								[0].answer;


			hispValue = Math.round(hispValue)

			var $e = this.$el;

			var wrap = d3.select(this.el);

			// Don't do anything unless we're in stem
			if (lastCategory == category) {
				if (category == 'stem') {
					// Then update the charts with the correct numbers.
					// TODO:
					wrap.select('.afamDonutChart')
						.datum(afamValue)
						.call(afam)

					wrap.select('.hispDonutChart')
						.datum(hispValue)
						.call(hisp)

					wrap.select('.frplDonutChart')
						.datum(frplValue)
						.call(frpl)

				} else {

					return;
				}
			}




			// Destroy everything on each render
			$e.empty()

			var charts = [];

			switch (category) {
				case 'demand':
					var afam = AA3.supplemental.DonutMoreInfo()
									.title('African-American')
									.moreInfo(function () { 
										jumpToDetailPage('African.American')
									})

					var afamValue = barStateMap.get('African.American')
										.get('p_of_children_in_programs_2014')
										[0].answer;

					afamValue = Math.round(afamValue)

					var hisp = AA3.supplemental.DonutMoreInfo()
									.title('Hispanic')
									.moreInfo(function () { 
										jumpToDetailPage('Hispanic')
									})

					var hispValue = barStateMap.get('Hispanic')
										.get('p_of_children_in_programs_2014')
										[0].answer;


					hispValue = Math.round(hispValue)

					var boysPercent = barStateMap.get('National')
										.get('p_of_boys_program')
										[0].answer;

					boysPercent = Math.round(boysPercent)

					var boysNGirls = AA3.supplemental.Pie()
										.title(boysPercent + '% Boys')
										.subtitle((100 - boysPercent) + '% Girls')

					var listOfReasons = AA3.supplemental.reasonList()
										.title('Add title text')
										.reasonNumbers([1,2,3])
										.metaData(metaMap.get('reason_1_not_enrolling_child')[0])

					// African American demographics
					wrap.append('div')
						.attr('class', 'supplementalData donutChart')
						.datum(afamValue)
						.call(afam)

					// Hispanic demo
					wrap.append('div')
						.attr('class', 'supplementalData donutChart')
						.datum(hispValue)
						.call(hisp)

					// Boys and girls
					wrap.append('div')
						.attr('class', 'supplementalData pieChart')
						.datum(boysPercent)
						.call(boysNGirls)

					break;

				case 'benefits':
					var programProvider = AA3.supplemental.reasonList()
										.reasonNumbers([1,2,3,4])
										.halfWidth(true)
										.metaData(metaMap.get('ans_1_program_provider')[0])

					var publicBldgValue = barStateMap.get('National')
											.get('p_of_parents_program_public_school_bldg')
											[0].answer;

					publicBldgValue = Math.round(publicBldgValue)

					var publicSchoolBuilding = AA3.supplemental.bigCenteredText()
									.title('of Afterschool Programs are Located in a Public School Building')

					wrap.append('div')
						.attr('class', 'supplementalData reasonList leftSide halfWidth')
						.append('img')
						.attr('src', 'img/Top-5-benefits-left-final.png')
						

					wrap.append('div')
						.attr('class', 'supplementalData reasonList halfWidth')
						.append('img')
						.attr('src', 'img/Top-5-benefits-right-final.png')

					wrap.append('hr')
						.attr('class', 'supplementalData dottedHorizontalRule')

					wrap.append('div')
						.attr('class', 'supplementalData reasonList')
						.call(programProvider)

					wrap.append('div')
						.attr('class', 'supplementalData donutChart')
						.datum(publicBldgValue)
						.call(publicSchoolBuilding)


					break;

				case 'support':

					break;

				case 'health': 
					wrap.append('div')
						.attr('class', 'supplementalData healthSpecialReport')
						// .call(typeActivity)
						.append('img')
							.attr('src', 'img/supplemental-data-health.png')
					break;

				case 'summer':
					wrap.append('div')
						.attr('class', 'supplementalData summerSpecialReport')
						.append('img')
							.attr('src', 'img/supplemental-summer-demographics.png')
					break;

				case 'stem':
					

					// African American demographics
					wrap.append('div')
						.attr('class', 'supplementalData donutChart afamDonutChart')
						.datum(afamValue)
						.call(afam)

					// Hispanic demo
					wrap.append('div')
						.attr('class', 'supplementalData donutChart hispDonutChart')
						.datum(hispValue)
						.call(hisp)

					// Hispanic demo
					wrap.append('div')
						.attr('class', 'supplementalData donutChart frplDonutChart')
						.datum(frplValue)
						.call(frpl)

						
					var stemText = AA3.CONFIG.PRETTY_TEXT.STEM_DEMOGRAPHIC_TITLE[currentQuestion]

					$(".title.showByCategory.stemCategory")
						.html(stemText)

					break;

			}

			// Record
			this.lastCategory = category;
		}
	})
});