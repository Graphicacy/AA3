/*- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -*/
/*
/* Backbone View Wrapper for d3 charts
/*
/*- -~- -*/
var AA3 = _.extend({}, AA3, {
  CardsView: Backbone.View.extend({
    el: null,

    // The "Loading" chart, for example...
    placeholder: AA3.d3.placeholder(),

    getQuestions: null,
    getCategory: null,

    containerTitles: {
      parent_satisfaction: 'Parent Satisfaction with Afterschool Programs',
      public_support: 'Public Support for Afterschool Programs',
      unmet_demand: 'Children Unsupervised After School & Unmet Demand',
      children_in_afterschool: 'Children in Afterschool',
      physical_activity: 'Physical Activity and Afterschool Programs',
      healthy_eating: 'Healthy Eating and Afterschool Programs',
      summer_general: 'Summer Learning Programs',
      stem_a: 'STEM Learning in Afterschool Programs'
    },

    initialize: function(options) {
      // Bind *this* inexorably to functions
      _.bindAll(this, 'render');

      this.getQuestions = options.getQuestions;
      this.getCategory = options.getCategory;

      var sectionTemplateHTML = $('#cardsView-sectionTemplate').text();
      var cardTemplateHTML = $('#cardsView-cardTemplate').text();

      this.sectionTemplate = _.template(sectionTemplateHTML);
      this.cardTemplate = _.template(cardTemplateHTML);
    },

    constructAllContainersAndCards: function() {
      var view = this;

      var wrap = d3.select(this.el);

      // Destroy everything on each render
      wrap.selectAll('*').remove();

      // Then move the scroll to top
      document.body.scrollTop = 0

      var questions = view.getQuestions();
      var category = view.getCategory();

      _.each(AA3.CONFIG.CATEGORIES, function(category) {

        var containers = cardMap.get(category);

        AA3.scrollspy = AA3.scrollspy || {};
        AA3.scrollspy[category] = AA3.scrollspy[category] || {}

        AA3.scrollspy[category].el = wrap.append('a')
          .classed('clearfix', true)

        _.each(containers, function(container, key) {
          // Things with no container are disregarded
          if (key.length < 2) return;

          container = _.map(container, function(d) {
            return d
          }).sort(function(a, b) {
            return a[0].statePriority - b[0].statePriority;
          });

          // Don't know why there  is a leading blank on these keys
          if (!(key in view.containerTitles)) key = key.substring(1)

          var html = view.sectionTemplate({
            title: view.containerTitles[key],
            category: category
          })

          var section = wrap.append('div')
            .html(html)

          var sectionBody = section.select('.cardSectionBody')

          var sectionAccordionButton = section.select('.section-accordion')

          var endSpacer = section.select('.end-spacer')

          var shown = true;

          var $sectionBody = $(sectionBody.node());
          var $endSpacer = $(endSpacer.node());

          sectionAccordionButton.on('click', function() {
            if (shown) {
              $sectionBody.hide("medium");
              sectionAccordionButton.text('+');
              $endSpacer.hide("medium");
            } else {
              $sectionBody.show("medium");
              sectionAccordionButton.text('-');
              $endSpacer.show("medium");
            }
            shown = !shown;
          })

          _.each(container, function(meta, slug) {

            meta = meta[0];

            // Don't do this one if we're on a demo and it's not available
            if ((which_state == 'African.American' ||
                which_state == 'Hispanic' || which_state == 'Rural' || which_state == 'Poverty') &&
              meta['is.on.demographics'] == 'no') {

              if (("Rural" != which_state) && ("Poverty" != which_state))
                return;
              switch (meta.slug) {
                case "p_of_children_would_be_enrolled_2014_k_to_5":
                  break;
                case "p_of_children_would_be_enrolled_2014_6_to_8":
                  break;
                case "p_of_children_would_be_enrolled_2014_9_to_12":
                  break;
                case "just_text_demand_unmet":
                  break;
                default:
                  return;
              }
            }
            // Ditto for city/county pages
            if ((which_state.match(/(nyc|allegheny)/i) &&
                meta['is.on.city.county'] == 'no')
              // LAST MINUTE HACK INCOMING - 
              // REMOVE Gender card for allegheny
              ||
              (which_state.match(/(allegheny)/i) &&
                meta.slug.match(/p_of_boys/i))) {
              return;
            }

            var which = meta['card.chart'];
            var category = meta['category'];

            if (which == 'none') return;

            var factory = AA3.CardCharts[which]

            if (!factory) return;

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

            var cardBody = sectionBody.append('div')
              .html(html)

            cardBody.classed(category + 'Category', true);
            cardBody.classed('cardCategory', true);

            cardBody.select('.cardBody')
              .append('div')
              .attr('class', 'cardChart')
              .datum(which)
              .call(chart)

            if ("Rural" === which_state) {
              cardBody.classed("ruralCard", true);
              $("<div />", {
                "class": "ruralTag"
              }).appendTo(cardBody)
            }

            if ("Poverty" === which_state) {
              cardBody.classed("povertyCard", true);
              $("<div />", {
                "class": "povertyTag"
              }).appendTo(cardBody)
            }

          })
        })
      })

      wrap.append('div')
        .classed('background-extender', true)

      _.each(AA3.scrollspy, function(d, category) {
        d.offset = $(d.el.node()).offset().top
      });

      $('.changeCategoryBtn').on('click', function() {
        var $btn = $(this),
          category = $btn.data('category');

        view.scrollToContainer(category)
      })

      $('.back-to-top').css('visibility', 'visible')
        .hide();

      view.toggleBackToTopVisible();

      $(window).on('scroll', view.toggleBackToTopVisible);


      $('.back-to-top').on('click', function() {
        view.scrollToContainer('top');
      });

      wrap.append('div')
        .classed('background-extender', true)

    },


    toggleBackToTopVisible: function() {
      if ($(window).scrollTop() > 400) {
        $('.back-to-top').fadeIn();
      } else {
        $('.back-to-top').fadeOut();
      }
    },

    scrollToContainer: function(category) {
      var view = this;
      var divTop;

      if (category == 'top' || category == 'demand') {
        divTop = 0
      } else {
        divTop = AA3.scrollspy[category].offset;
      }

      AA3.inScrollTransition = true;

      $('html, body').stop().animate({
          scrollTop: divTop - 256
        },
        750,
        function(argument) {

          AA3.inScrollTransition = false;

          view.toggleBackToTopVisible();
        })
    },

    firstRender: true,

    lastState: null,

    render: function() {
      if (this.firstRender || this.lastState != which_state) {
        this.constructAllContainersAndCards();
        this.scrollToContainer(which_category)
        this.lastState = which_state
      }

      this.firstRender = false;

    }
  })
});