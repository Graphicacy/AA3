var AA3 = _.extend({}, AA3, {

	// Adapted from: http://stackoverflow.com/questions/10789936/sticking-div-to-top-after-scrolling-past-it
	fixDiv: function() {
		var $div = $('.optionBar'),
			top = $div.first().offset().top,
			$wrap = $(window),
			offset = $('body > .navbar').height(), // Height of top nav
			$toClass = $div.add('stickyFill'),
			fixClass = 'stuckTop';

		// Watch out! This might trigger a lot. Consider throttling.
		$wrap.on('scroll', function () {
			if ($wrap.scrollTop() > top + offset) {
				$toClass.addClass(fixClass);
			} else {
				$toClass.removeClass(fixClass);
			}
		});
	}
});