/*- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -*/
/*
/* Setup Detail (i.e. State) Page
/*
/*
/* Author: [Reed](https://github.com/reedspool)
/*
/*- -~- -*/
var AA3 = _.extend({}, {page: {}}, AA3)

_.extend(AA3.page, {
  detail: {
    init: function () {
      /* All data ready and available in arguments */
      // ROUTER HAS NOT RUN YET
      var cardsView = new AA3.CardsView({
        getQuestions: getAllCurrentQuestions,
        getCategory: getCategory,
        getState: function () { return which_state },
        el: '#cardsWrapper'
      });

      AA3.fixDiv();

      footnoteView = {
        render: function () { 
          $('#footnoteHolder')
            .html(getCardText(which_state, 'FOOTNOTE', 'text'))
        }
      }

      introTextView = {
        render: function () {

          var text = barStateMap.get(which_state).get('intro_text')[0].answer;
          
          if ( ! text ) {
            console.error('Intro text not set')
            debugger;
          }

          $('.masthead .mainText').html(text)
        }
      }


      // Show the Back To National button
      $('#nation-nav-button').css('display', 'inherit');

      // Begin switch-category buttons
      $('.changeCategoryBtn').on('click', function () { 
        var $btn = $(this);
        var category = $btn.data('category');

        jumpToDetailPage(which_state, category, '',
          // If trigger: true, router events will be triggered, views will rerender
          {trigger: true});
      });

      bindDownloadDropdown();

      // Set the main title to be the state's name
      var titleView = {
        render: function () {
          var stateName = 'National';
          var pretty = AA3.CONFIG.PRETTY_TEXT.STATE_NAME[which_state];

          stateName = pretty || stateTopoMap.get(which_state)[0].properties.name;

          $("#mainTitle").html(stateName)
          $(".detail-download-link.section-label").html($("#mainTitle").html())
        }
      }

      var topTenView = {
        firstRender: true,
        render: function () {
          var isTopTen = (barStateMap.get(which_state).get("is_top_ten")[0].answer == 'TRUE') ?
                      true : false;

          $ribbon = $("#topTenRibbon");

          if ( ! isTopTen ) { 
            $ribbon.hide();
          } else {
            if (this.firstRender) {
              $ribbon.html("<img src='img/Top-10.png' alt=''>")
              this.firstRender = false;
            }

            $ribbon.show();
          } 

        }
      }

      $(window).on('scroll', function () {
        if (AA3.inScrollTransition) return;
        
        var jumpToCategory = false;

        _.each(AA3.CONFIG.CATEGORIES, function (category) {
          
          var d = AA3.scrollspy[category]

          var offset = d.offset;

          if ($(window).scrollTop() > offset - 500) {
            jumpToCategory = category;

          } 
        })

        jumpToDetailPage(which_state, jumpToCategory, '', {
          trigger: true
        });
      })

      allViews = [titleView, introTextView, topTenView, AA3.socialMediaView, cardsView, footnoteView];
    }
  }
});