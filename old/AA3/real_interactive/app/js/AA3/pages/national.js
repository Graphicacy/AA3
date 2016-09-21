/*- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -*/
/*
/* Setup National Page
/*
/*
/* Author: [Reed](https://github.com/reedspool)
/*
/*- -~- -*/
var AA3 = _.extend({}, {page: {}}, AA3)

_.extend(AA3.page, {
  national: {
    init: function () {
      /* All data ready and available in arguments */

      mapChart.topoFeatures(stateTopo)
        .topoMesh(stateMesh)
        .clickState(function (d) { 
          if (d) jumpToDetailPage(d.properties.code);
        })

      // changePopover = $.throttle(250, changePopover)

      function changePopover(d) {
        mapChart.showPopover(d3.select('#mapWrapper svg'), d);
      }

      mapView = new AA3.D3View({
        getData: function () { /* No need for updating data */ },
        chart: mapChart,
        el: '#mapWrapper > .chart'
      });

      statesBarsView = new AA3.D3View({
        getData: function () { /* No need for updating data */ },
        chart: AA3.d3.barCharts()
          .stateTopo(function () { return stateTopo })
          .barValue(valueOfState)
          .gradient(getCategoryGradient)
          .hoverState(changePopover)
          .clickState(function (d) { 
            if (d) jumpToDetailPage(d.properties.code);
          }),
        el: '#statesBarsWrapper > .chart'
      });

      questionsView = new AA3.QuestionsView({
        getCategory: getCategory,
        getHighlight: function () { return which_question; },
        highlight: switchQuestionAndRender,
        el: '#questionsWrapper'
      });

      supplementalDataView = new AA3.SupplementalDataView({
        currentCategory: function () { return which_category; },
        currentQuestion: function () { return which_question; },
        el: '#supplementalDataWrapper'
      })

      allViews = [questionsView, statesBarsView, mapView, supplementalDataView, AA3.socialMediaView];


      // Begin switch-category buttons
      $('.changeCategoryBtn').on('click', function () { 
        var $btn = $(this);
        var category = $btn.data('category');

        navigateToCategory(category, '',
          // If trigger: true, router events will be triggered, views will rerender
          {trigger: true});
      })
    }
  }
});