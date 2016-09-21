/*- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -*/
/*
/* The Health Special Reports Cards
/*
/* Author: [Reed](https://github.com/reedspool)
/*
/*- -~- -*/
var AA3 = _.extend({}, {CardCharts: {}}, AA3);

// Doing this a little differently to avoid repeating code
(function () {
  var meowmix = [
    'p_of_parents_agree_should_provide_snacks',
    'p_of_parents_programs_offers_snacks', 
    'p_of_parents_satisfied_programs_snacks', 
    'p_of_parents_satisfied_healthy_snacks', 
    'p_of_parents_snacks_important', 
    'p_of_parents_healthy_snacks_important', 
    'p_of_parents_agree_should_provide_physical', 
    'p_of_parents_programs_offers_physical', 
    'p_of_parents_satisfied_programs_physical_amount', 
    'p_of_parents_satisfied_programs_physical_variety', 
    'p_of_parents_physical_important'
  ];

  function factory(tag) {
    // Bad globals!! - <3 Reed
    var meta = metaMap.get(tag)[0];

    function chart(holder) {

      // Last minute changes from Nikki 3/6/14
      if (meta.slug.match(/p_of_parents_satisfied_programs_physical_amount/i)) {
        meta.cardViewMoreInfo = '';
      }

      holder.call(AA3.d3.bigNumberAndDonutQuestion()
              .metaData(meta)
              .enableMoreInfo(false)
              .fillCard(!!!(meta.cardViewMoreInfo)));
    }

    // Chart attributes
    return chart;
  }

  // Register each one in CardCharts, with a custom factory
  meowmix.forEach(function (d, i) { 
    var obj = {};

    obj[d] = factory.bind(null, d);

    _.extend(AA3.CardCharts, obj)
  });
})()

