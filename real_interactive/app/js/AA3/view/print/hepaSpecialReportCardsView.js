/*- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -*/
/*
/* Backbone View Wrapper for d3 charts
/*
/*- -~- -*/
var AA3 = _.extend({}, AA3, {
  HEPASpecialReportCardsView: Backbone.View.extend({
    el: null,

    // The "Loading" chart, for example...
    placeholder: AA3.d3.placeholder(), 

    getQuestions: null,
    getCategory: null,

    containerTitleTemplates: {
      public_support: '<%= state_name %> parents <span class="colorByCategory">support</span> public funding for afterschool programs',
      children_in_afterschool: '<span class="colorByCategory">Demand</span> for afterschool programs in <%= state_name %>',
      physical_activity: '<%= state_name %> parents <span class="colorByCategory">satisfied</span> with their child&rsquo;s afterschool program',
      healthy_eating: '<%= state_name %>&rsquo;s afterschool programs support <span class="colorByCategory">Health and Wellness</span>'
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

      _.each(['demand', 'health', 'support'], function (category) {

        var containers = HEPASpecialReportMap.get(category);

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
               which_state == 'Hispanic' || which_state == 'Rural' || which_state == 'Poverty') && 
              meta['is.on.demographics'] == 'no'
              ) return;

            // Ditto for city/county pages
            if ((which_state.match(/(nyc|allegheny)/i)
              && meta['is.on.city.county'] == 'no')
              // LAST MINUTE HACK INCOMING - 
              // REMOVE Gender card for allegheny
              || (which_state.match(/(allegheny)/i)
                && meta.slug.match(/p_of_boys/i))) {
              return;
            }

            var which = meta['HEPASpecialReport.chart'];
            var category = meta['category'];

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

            var html = view.cardTemplate({
              title: cardTitle
            });

            var cardBodyHolder = sectionBody.append('div')
            var cardBody = cardBodyHolder.html(html)

            cardBody.classed(category + 'Category', true);

            cardBody.select('.cardBody')
              .append('div')
              .attr('class', 'cardChart')
              .datum(which)
              .call(chart)
            
            // Last minute changes from Nikki 3/6/14
            if (meta.slug.match(/p_of_parents_satisfied_programs_physical_amount/i)) {
              cardBody.select('.cardHeader').text("Parents satisfied with the amount of physical activity in their child's afterschool program")
            }

            if (meta.slug.match(/p_of_parents_satisfied_healthy_snacks/i)) {
              $(sectionBody.node()).prepend(cardBodyHolder.node())
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