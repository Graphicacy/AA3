var AA3 = _.extend({}, AA3, {

	socialMediaView : {
		render: (function () {

			function makeWebIntentLink(baseURL, selector, query) {

				var queryString = [];

				_.each(query, function (value, key) {
					queryString.push(key + '=' + value);
				});

				var urlContent = baseURL + queryString.join('&')

				$(selector).attr('href', urlContent);


			}

			function updateTwitter() {
				makeWebIntentLink("https://twitter.com/intent/tweet?",
									'.twitter-intent',
									{
										url: encodeURIComponent(window.location.href),
										text: encodeURIComponent('How are kids spending their time after school? New study has the answers #AmericaAfter3PM')
									});

			}

			function updateFacebook() {

				var facebookIntentUrl = 

				makeWebIntentLink("http://www.facebook.com/sharer/sharer.php?",
						'.facebook-intent',
						{
							u: window.location.href,
							'p[summary]': 'How are kids spending their time after school? New study has the answers #AmericaAfter3PM'
						});

			}

			function updateMailTo() {

				var subject = 'America After 3PM: How are kids spending their time after school?';

				var body = 'The new America After 3PM study from the Afterschool Alliance has found that afterschool program participation has hit a record high—more than 10 million kids head to an afterschool program after the school bell rings. But demand for these programs has also reach a new high. For every child who participates, there are two more who would like to be—if a program were available.'
							+ '\n\nCheck out the more of the findings, plus in-depth data on your state and special demographic reports, from the Afterschool Alliance:'
							+ '\n\n' + window.location.href;

				var emailURL = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

				$('.email-intent').attr('href', emailURL);

			}

			return function () {
				updateTwitter();
				updateFacebook();
				updateMailTo();
			}


		})()

	}

});