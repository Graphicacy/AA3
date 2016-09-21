/*- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -*/
/*
/* Backbone View Wrapper for d3 charts
/*
/*- -~- -*/
var AA3 = _.extend({}, AA3, {
  STEMCardsView: Backbone.View.extend({
    el: null,

    // The "Loading" chart, for example...
    placeholder: AA3.d3.placeholder(), 

    getQuestions: null,
    getCategory: null,

    containerTitleTemplates: {
      children_in_afterschool: '<span class="colorByCategory">Demand</span> for afterschool programs in <%= state_name %>',
      stem_b: 'Parents think afterschool programs <span class="colorByCategory">should offer STEM learning opportunities</span> in <%= state_name %>',
      stem_a: 'Parents are <span class="colorByCategory">noticing the STEM offerings</span> in their child&rsquo;s afterschool program in <%= state_name %>'
    },

    initialize: function(options) {
      // Bind *this* inexorably to functions
      _.bindAll(this, 'render');

      this.getQuestions = options.getQuestions;
      this.getCategory = options.getCategory;
      this.keys = options.keys;

      var sectionTemplateHTML = $('#cardsView-sectionTemplate').text();
      var cardTemplateHTML = $('#cardsView-cardTemplate').text();

      this.sectionTemplate = _.template(sectionTemplateHTML);
      this.cardTemplate = _.template(cardTemplateHTML);
    },

    constructAllContainersAndCards: function () { 
      var view = this;

      var wrap = d3.select(this.el);

      // Destroy everything on each render
      wrap.selectAll('*').remove();

      // Then move the scroll to top
      document.body.scrollTop = 0

      // Notate which container this is
      var containerCount = 1;

      var questions = view.getQuestions();
      var category = view.getCategory();

      _.each(['stem', 'demand'], function (category) {

        var containers = STEMNewsReleaseMap.get(category);

        _.each(containers, function (container, key) { 
          // Things with no container are disregarded
          if (key.length < 2) return;

          container = _.map(container, function (d) { return d }).sort(function (a, b) { 
            return a[0].statePriority - b[0].statePriority;
          });

          // Don't know why there  is a leading blank on these keys
          if ( ! (key in view.containerTitleTemplates)) key = key.substring(1)

          // If key is not one of the ones I'm responsible for, disregard
          if ( view.keys.indexOf(key) == -1 ) return;

          var titleTemplate = _.template(view.containerTitleTemplates[key])

          var html = view.sectionTemplate({
                  title: titleTemplate({ state_name: prettyStateName(which_state) }),
                  category: category,
                  index: containerCount++
                })

          var section = wrap.append('div')
            .html(html)

          var sectionBody = section.select('.cardSectionBody')

          var endSpacer = section.select('.end-spacer')

          var shown = true;

          var $sectionBody = $(sectionBody.node());
          var $endSpacer = $(endSpacer.node());

          _.each(container, function (meta, slug) { 
            
            meta = meta[0];

            // Don't do this one if we're on a demo and it's not available
            if ((which_state == 'African.American' || 
               which_state == 'Hispanic') && 
              meta['is.on.demographics'] == 'no'
              ) return;

            // Ditto for city/county pages
            if ((which_state.match(/(nyc|allegheny)/i)
              && meta['is.on.city.county'] == 'no')) {
              return;
            }

            var which = meta['STEMNewsRelease.chart'];
            var category = meta['category'];

            if (meta.slug.match(/p_of_parents_report_stem_learning_opp/i)) {
              var hacked_title = "Parents who report that their child&rsquo;s afterschool program offers STEM learning opportunities";
            }

            if (meta.slug.match(/p_of_parents_satisfied_stem_program/i)) {
              var hacked_title = "Parents satisfied with the STEM learning opportunities offered in their child&rsquo;s afterschool program";

            }

            if (meta.slug.match(/p_of_parents_consider_stem_as_factor/i)) {
              var hacked_title = "Parents who consider STEM as a factor when selecting their child&rsquo;s afterschool program";

            }

            if (meta.slug.match(/p_of_parents_agree_children_gain_stem/i)) {
              var hacked_title = "Parents who agree that children can gain STEM skills from afterschool programs";

            }

            if (meta.slug.match(/p_of_parents_agree_should_provide_stem/i)) {
              var hacked_title = "Parents who think afterschool programs should provide opportunities to explore and engage in hands-on STEM learning";
            }

            if (meta.slug.match(/p_of_children_in_programs_/i)) {
              var hacked_title = "Afterschool program participation in <%= state_name %>";
              var hacked_text = "In 2014, <%= percentagez %>% of <%= state_name %>&rsquo;s children participated in an afterschool program."


            }

            if (meta.slug.match(/p_of_children_would_be_enrolled_/i)) {
              var hacked_title = "Children who would participate if an afterschool program were available";
              var hacked_text = "In 2014, <%= percentagez %>% of <%= state_name %>&rsquo;s children would have participated in an afterschool program if one was available.";

            }

            if (which == 'none') return;

            var factory = AA3.CardCharts[which]

            if ( ! factory ) return;

            var chart = factory();

            var cardTitle = meta.cardTitle;

            try {
              cardTitle = getCardText(which_state, which, 'title') || cardTitle

            } catch (e) {
              console.log('Card title never set because of error: ', e)
            }

            if (hacked_title) {
              cardTitle = _.template(hacked_title)({
                state_name: prettyStateName(which_state)
              })
            }
            

            var html = view.cardTemplate({
              title: cardTitle
            });

            var cardBodyHolder = sectionBody.append('div')
            var cardBody = cardBodyHolder.html(html)

            cardBody.classed(category + 'Category', true);


            if (meta.slug.match(/p_of_parents_agree_should_provide_stem/i)) {
              meta.cardViewMoreInfo = false;
            }

            cardBody.select('.cardBody')
              .append('div')
              .attr('class', 'cardChart')
              .datum(which)
              .call(chart)

            if (hacked_text) {
              // Only works for the 2 which are 2014'ers
              hackedCardText = _.template(hacked_text)({
                state_name: prettyStateName(which_state),
                percentagez: Math.round(parseFloat(barStateMap.get(which_state).get(which+'2014')[0].answer, 10))
              });
              
              cardBody.select('.more > p')
                .html(hackedCardText);
            }

          })

        })
      })

      wrap.append('div')
        .classed('background-extender', true)

      $('.back-to-top').css('visibility', 'visible')
          .hide();

    },
    
    firstRender: true,

    lastState: null,

    render: function() {
      if (this.firstRender || this.lastState != which_state) {
        this.constructAllContainersAndCards();
        this.lastState = which_state
      }

      this.firstRender = false;

    }
  })
});