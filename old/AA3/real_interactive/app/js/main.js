/*- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -*/
/*
/* America After 3PM
/*
/* V1.0, October, 2014
/*
/* Author: [Reed](https://github.com/reedspool)
/*
/*- -~- -*/
var which_category = 'demand';
var which_question = 'p_of_children_in_programs_2014';
var which_state = null;

var Workspace = Backbone.Router.extend({
	routes: {
		'c/:category': 'category',
		'c/:category/:question': 'category',
		'q/:question': 'question',
		's/:state': 'detail',
		's/:state/:category': 'detail',
		's/:state/:category/:question': 'detail',

		// Printing
		'print/health/:state': 'printHepa',
		'print/stem/:state': 'printStem',

		'*path': 'defaultRoute'
	}
});

var workspace = new Workspace()

workspace.on('route:printHepa', function (state) {
	which_state = state;
	category = 'health';
	question = highestPriorityQuestion(category);

	renderAllViews();
});

workspace.on('route:printStem', function (state) {
	which_state = state;
	category = 'stem';
	question = highestPriorityQuestion(category);

	renderAllViews();
});

workspace.on('route:category', function (category, question) {

	if (! question || ! metaMap.get(question)) {
		question = highestPriorityQuestion(category)

		navigateToCategory(category, question, {
			// No trigger, no history entry
			replace: true
		})
	}

	which_category = category;
	which_question = question;
	
	renderAllViews();
})

workspace.on('route:question', switchQuestionAndRender)

workspace.on('route:defaultRoute', renderAllViews);

workspace.on('route:detail', function (state, category) { 

	if ( ! category ) {
		category = 'demand';
	}

	// If no state, then jump to national page?
	if ( ! state ) jumpToNationalPage('demand')

	which_state = state;
	which_category = category

	renderAllViews();

})

function initCombobox() {
    // Setup combobox to replace select
    
    $('select#dropdown')
    	.combobox({ 
	        onSelect: function (val) {
	        	if (val.match(/national/i)) {
	        		jumpToNationalPage(which_category)
	        		return;
	        	};

	        	jumpToDetailPage(val);
	        },
	        select: function (evt, ui) {
	            // Trying to suppress Enter button triggering submission
	            evt.preventDefault();
	            evt.stopPropagation();
	            return false;
	        },
	        whenReady: function () { 
		        	// Fix IE11 showing the UL after page loaded for some reason...
				    var $selections = $('.ui-autocomplete')

				    $selections.css('visibility', 'hidden')

				    setTimeout(function () { THEES.input.autocomplete("close"); }, 500)

				    setTimeout(function () { 
				    	$selections.css('visibility', 'visible')
				    }, 750)
					},
	        initialPlaceholder: 'Jump to...'
	    })


    // When you focus on the input, select erything
    $('.custom-combobox-input').on('focus', function () {
        // $(this).select();
    })
}

function highestPriorityQuestion(category) {
	var slugs = metaMap.keys();


	var minSlug;
	var minPriority = Number.MAX_VALUE;

	_.each(slugs, function (slug) {
		var meta = metaMap.get(slug)[0];

		if (meta.priority < minPriority 
			&& category == meta.category 
			&& meta['question.chart']
			&& meta['question.chart'] != 'none') {
			minPriority = meta.priority;
			minSlug = slug;
		}

	});

	return minSlug;
}

function switchQuestionAndRender(question) {
	var q = metaMap.get(question);

	if ( ! q ) return;
	
	which_category = q[0].category;
	which_question = question;

	navigateToCategory(which_category, which_question, {
		// No trigger, no history entry
		replace: true
	})

	renderAllViews();
}

var STATES_AND_DC = ['AL','AK','AZ','AR','CA','CO','CT', 'DC', 'DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

var barStateMap;
var metaMap;
var cardMap;
var HEPASpecialReportMap;
var STEMNewsReleaseMap;
var cardText;
var stateTopo;
var stateTopoMap;
var stateMesh;

var questionsView;
var supplementalDataView;
var statesBarsView;
var mapView;
var questionHighlightView;
var allViews = [];

function getCardText(state, slug, place) {
	var which_one = _.select(cardText.get(state).get(slug), function (d) { 
			return d.place == place
		});

	if (! which_one || which_one.length == 0) return '';

	return which_one[0].text
}

AA3.inScrollTransition = false;

var baseColorScale = d3.scale.quantize()
						.domain([0, 100])

// TAKING OUT THE LIGHTEST - TOO LIGHT
// Darkest -> Lightest
// Purples
var demandColors = ['#CE4984', '#D35C91', '#D86F9E', '#DE83AB', '#E396B8',
					'#E8A9C5', '#EDBCD2', '#F3D0DF', '#F8E3EC'/*, '#FDF6F9'*/];
// Light blues
var benefitsColors = ['#32AEC4', '#48B7CA', '#5DBFD0', '#73C8D7', '#89D0DD',
						'#9ED9E3', '#B4E1E9', '#CAEAF0', '#DFF2F6'/*, '#F5FBFC'*/];
// Dark blues
var supportColors = ['#0A6AC2', '#247AC8', '#3E8ACF', '#5899D5', '#72A9DC',
						'#8BB9E2', '#A5C9E9', '#BFD8EF', '#D9E8F6'/*, '#F3F8FC'*/];
// Oranges
var healthColors = ["#E78924", "#EA953B", "#ECA151", "#EFAE68", "#F2BA7F",
						"#F4C695", "#F7D2AC", "#FADFC3", "#FCEBD9"/*, "#FFF7F0"*/];

// Sandy Yellows
var summerColors = ["#E6D23E", "#E8D64F", "#EADA60", "#EDDE71", "#EFE282",
						"#F1E692", "#F3EAA3", "#F6EEB4", "#F8F2C5"/*, "#FAF6D6"*/];

var stemColors = ['#563B7F', '#654D8B', '#745E96', '#8470A2', '#9382AD',
						'#A293B9', '#B1A5C4', '#C1B7D0', '#D0C8DB'/*, '#DFDAE7'*/];


var categoryColorScales = {
	demand: baseColorScale.copy()
				.range(demandColors.reverse()),

	benefits: baseColorScale.copy()
				.range(benefitsColors.reverse()),

	support: baseColorScale.copy()
				.range(supportColors.reverse()),

	health: baseColorScale.copy()
				.range(healthColors.reverse()),

	summer: baseColorScale.copy()
				.range(summerColors.reverse()),

	stem: baseColorScale.copy()
				.range(stemColors.reverse())
};

function getCategory() { 
	return which_category;
}

function getState() {
	return which_state
}

function getCategoryGradient() {
	return categoryColorScales[which_category];
}

var stateNester = d3.nest()
	.key(function (d) { return d.state; })
	.key(function (d) { return d.slug; });

var metaNester = d3.nest()
	.key(function (d) { return d.slug; })

var cardNester = d3.nest()
	.key(function (d) { return d.category; })
	.key(function (d) { return d['card.container']; })
	.key(function (d) { return d.slug; })

var HEPASpecialReportNester = d3.nest()
	.key(function (d) { return d.category; })
	.key(function (d) { return d['HEPASpecialReport.container']; })
	.key(function (d) { return d.slug; })

var STEMNewsReleaseNester = d3.nest()
	.key(function (d) { return d.category; })
	.key(function (d) { return d['STEMNewsRelease.container']; })
	.key(function (d) { return d.slug; })

var cardTextNester = d3.nest()
	.key(function (d) { return d.state })
	.key(function (d) { return d.slug })

var stateTopoNester = d3.nest().key(function (d) { 
		return d.properties.code 
	})

var mapChart = AA3.d3.usMap()
				.valueOfState(valueOfState)
				.gradient(getCategoryGradient)
				.hoverState(function () { /* noop */ })

function valueOfState(stateData) {
	var state = stateData.properties.code;
	var stateStuff = barStateMap.get(state);

	if (! stateStuff ) {
		return 0;
	}

	var value =  Number(stateStuff.get(which_question)[0].answer);

	if (isNaN(value) || value == -1) return 0;

	return value;
}

function promiseLoadAllDataAndOnReady() {
	var states_deferred = Q.defer();
	var topo_deferred = Q.defer();
	var on_ready_deferred = Q.defer();
	var meta_deferred = Q.defer();
	var state_text_deferred = Q.defer();

	d3.csv('data/All_states_TIDY.csv', function (d) {
		states_deferred.resolve(d)
	});

	d3.csv('data/question_metadata_TIDY.csv', function (d) {
		meta_deferred.resolve(d);
	})

	d3.json('data/us-named.json', function (d) {
		topo_deferred.resolve(d)
	});

	d3.csv('data/state_text.csv', function (d) { 
		state_text_deferred.resolve(d)
	})

	$(function () { 
		on_ready_deferred.resolve()
	});

	return Q.all([

			states_deferred.promise.then(function (d) { 
				barStateMap = stateNester.map(d, d3.map);

				return d
			}),

			topo_deferred.promise.then(function (US) {

				stateTopo = topojson.feature(US, US.objects.states).features;

				stateTopo = _.select(stateTopo, function (d) { 
					return STATES_AND_DC.indexOf(d.properties.code) != -1
				})

				stateTopoMap = stateTopoNester.map(stateTopo, d3.map)

				stateMesh = topojson.mesh(US, US.objects.states, function(a, b) { return a !== b; });

				return US;
			}),

			meta_deferred.promise.then(function (d) { 
				metaMap = metaNester.map(d, d3.map)

				cardMap = cardNester.map(d, d3.map)

				STEMNewsReleaseMap = STEMNewsReleaseNester.map(d, d3.map);
				
				HEPASpecialReportMap = HEPASpecialReportNester.map(d, d3.map)

				return d;
			}),

			state_text_deferred.promise.then(function (d) { 
				cardText = cardTextNester.map(d, d3.map)

				return d
			}),

			on_ready_deferred.promise
		])
}


promiseLoadAllDataAndOnReady()
	// All data's loaded. What do you do with it?
	.then(function (d) {
		initCombobox();
	})
	// Everything's ready, actually render.
	.then(initializePage)

	// Everything's rendered, now route
	.then(function () {
		Backbone.history.start({pushState: false})
	})
	.done();

function initializePage() { 

	var href = window.location.href;
	if (href.match(/detail\.html/)) {

		AA3.page.detail.init();

		return;
	}

	if (href.match(/national\.html/)) {

		AA3.page.national.init();

		return;
	}

	if (href.match(/printHEPASpecialReport\.html/i)) {
		AA3.page.print.special.health.init();
	}

	if (href.match(/printstem/i)) {
		AA3.page.printnamechangefixcollision.special.STEM.init();
	}

	// We're on the splash page, just do the social media links!
	$(AA3.socialMediaView.render)

	
}

function getAllCurrentQuestions() { 			
	var questions = _.select(metaMap, function (d) { 
			d = d[0];

			var rightCategory = d.category == which_category;

			return rightCategory;
		})

	return questions;
}

function renderAllViews() {
	// Update color gradients with max/min from metadata
	var grad = getCategoryGradient();
	var meta = metaMap.get(which_question);

	if ( ! meta ) {
		console.log('No meta data for question...')
		return;
	}

	meta = meta[0]

	grad.domain([meta.min, meta.max])

	// To render css properly, set the highest level element to have the category class
	$('.site').removeClass('demandActiveCategory')
			.removeClass('benefitsActiveCategory')
			.removeClass('supportActiveCategory')			
			.removeClass('healthActiveCategory')
			.removeClass('summerActiveCategory')
			.removeClass('stemActiveCategory')
			.addClass(which_category + 'ActiveCategory');

	// If we're on the detail page, replace the dropdown placeholder with the statename
	try {
		var stateName;

		switch(which_state || 'National') {
		case 'African.American':
			stateName = 'African-American Participation'
			break;
		case 'Hispanic':
			stateName = 'Hispanic Participation'
			break;
		case 'NYC': 
			stateName = 'New York City'
			break;
		case 'Allegheny':
			stateName = 'PA - Allegheny County'
			break;
		case 'National':
			stateName = '';
			break;
		default:
			stateName = stateTopoMap.get(which_state)[0].properties.name;
		}

		$('.custom-combobox-input')
			.attr('placeholder', stateName || "Jump to...")
			.val(stateName)
			// Stupid hacks - read very carefully before modifying...
			.addClass((stateName) ? 'filled' : '')
			.removeClass((stateName) ? '' : 'filled')
	} catch (e) {
		$('.custom-combobox-input')
			.attr('placeholder', "Jump to...")
	}

	// Fill in the download links
	var target = which_state || 'National';
	function fillDownloadLink(selector, prefix, suffix) {
		var $a = $(selector)

		$a.attr('href', prefix + target + suffix)
			.show();
	}

	fillDownloadLink('.extra.fact-download.primary',
						'http://www.afterschoolalliance.org/documents/AA3PM-2014/',
						'-AA3PM-2014-Fact-Sheet.pdf');

	var $newsDownload = $('.extra.news-download.primary')

	var $keyFindings = $('.secondaryOptionBar .extra.fact-download.secondary');
	var $hepaNewsRelease = $('.extra.news-download.secondary.hepa')
	var $summerNewsRelease = $('.extra.news-download.secondary.summer')
	var $stemNewsRelease = $('.extra.news-download.secondary.stemCategoryExtra')
	var $stemFactSheet = $('.extra.fact-download.secondary.stemCategoryExtra');

	if (target == 'National') {
		$newsDownload.hide();
		$hepaNewsRelease.hide();
		$summerNewsRelease.hide();
		$stemNewsRelease.hide();
	} else {

		// Fill in the back to national link
    $('#nation-nav-button').attr('href', 'national.html#c/' + categoryPath(which_category, null));

		$keyFindings.find('span').text('Fact sheet');

		fillDownloadLink($newsDownload,
			'http://www.afterschoolalliance.org/press_archives/AA3PM-2014/',
			'-AA3PM-2014-NR.pdf');

		fillDownloadLink($keyFindings,
			'http://www.afterschoolalliance.org/documents/AA3PM-2015/',
			'-Kids-on-the-Move-Fact-Sheet.pdf')

		fillDownloadLink($hepaNewsRelease,
			'http://www.afterschoolalliance.org/press_archives/AA3PM-2015/',
			'-Kids-on-the-Move-NR.pdf')

		fillDownloadLink($summerNewsRelease,
			'http://www.afterschoolalliance.org/press_archives/AA3PM-2015/',
			'-Summer-NR.pdf');

		fillDownloadLink($stemFactSheet,
						'http://www.afterschoolalliance.org/press_archives/AA3PM-2015/',
						'-Full-STEM-Ahead-Fact-Sheet.pdf');

		fillDownloadLink($stemNewsRelease,
						'http://www.afterschoolalliance.org/press_archives/AA3PM-2015/',
						'-Full-STEM-Ahead-NR.pdf');

		if ((which_state == 'African.American' || which_state == 'Hispanic')) {
			$stemNewsRelease.hide();
		}
	}

	_.invoke(allViews, 'render');
}

function jumpToDetailPage(d, category, question) {
	location.href = 'detail.html#s/' 
					+ d 
					+ '/' 
					+ categoryPath(category || which_category,
						question || which_question)
}

function jumpToNationalPage(category, question) {
	location.href = 'national.html#c/'
					+ categoryPath(category, question)
}

function navigateToCategory(category, question, options) { 
	workspace.navigate('c/' + categoryPath(category, question), options)
}

function categoryPath(category, question) {
	return category + (question ? '/' + question : '');
}

function prettyStateName(state) {
	var pretty = AA3.CONFIG.PRETTY_TEXT.STATE_NAME[which_state];

	return pretty || stateTopoMap.get(which_state)[0].properties.name;
}