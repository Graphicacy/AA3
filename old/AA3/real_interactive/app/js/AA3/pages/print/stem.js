/*- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -*/
/*
/* Setup Print Page for Health Special Report
/*
/*
/* Author: [Reed](https://github.com/reedspool)
/*
/*- -~- -*/
var AA3 = _.extend({}, {page: {}}, AA3)

_.extend(AA3.page, {
  printnamechangefixcollision: {
    special: { // Extra abstractions, looking to future (easier to rewrite this file than every call to it)
      STEM: {
        init: function () {

          var firstHalfCardsView = new AA3.STEMCardsView({
            getQuestions: getAllCurrentQuestions,
            getCategory: getCategory,
            getState: getState,
            keys: ['stem_a', 'stem_b' ],
            el: '.cardsWrapper.firstHalfCards'
          });

          var secondHalfCardsView = new AA3.STEMCardsView({
            getQuestions: getAllCurrentQuestions,
            getCategory: getCategory,
            getState: getState,
            keys: ['children_in_afterschool'],
            el: '.cardsWrapper.secondHalfCards'
          });

          footnoteView = {
            render: function () {
              var tmp = _.template($('#print-footnoteTemplate').text());

              $('.secondPageFooter')
                .html(tmp({
                  state_footnote: getCardText(which_state, 'FOOTNOTE', 'text')
                }))
            }
          }

          introTextView = {
            render: function () {
              var tmp = _.template($('#print-introTemplate').text());

              var national = barStateMap.get(which_state || 'National');

              var participate = national.get('real_of_children_in_programs_2014');
              var would = national.get('real_of_children_would_be_enrolled_2014');

              var data = {
                state_name: prettyStateName(which_state),
                projection_do_participate: participate && participate[0].answer || 'UNAVAILABLE',
                projection_would_participate: would && would[0].answer || 'UNAVAILABLE'
              };

              var text = tmp(data);

              $('.masthead .mainIntroText').html(text)
            }
          }

          // Set the main title to be the state's name
          var titleView = {
            render: function () {
              $(".mainTitle .stateName").html(prettyStateName(which_state))
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

          allViews = [titleView, introTextView, firstHalfCardsView, secondHalfCardsView, footnoteView]
        }
      }
    }
  }
});
