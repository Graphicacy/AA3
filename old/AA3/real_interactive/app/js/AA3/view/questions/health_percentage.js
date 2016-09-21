/*- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -*/
/*
/* The Health Special Reports Questions
/*
/* Author: [Reed](https://github.com/reedspool)
/*
/*- -~- -*/
var AA3 = _.extend({}, {SideBarQuestions: {}}, AA3);

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
      holder.call(AA3.d3.bigNumberAndDonutQuestion()
              .metaData(meta));
    }

    // Chart attributes
    return chart;
  }

  // Register each one in CardCharts, with a custom factory
  meowmix.forEach(function (d, i) { 
    var obj = {};

    obj[d] = factory.bind(null, d);

    _.extend(AA3.SideBarQuestions, obj)
  });
})()

