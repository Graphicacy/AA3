/*- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -*/
/*
/* The STEM Special Reports Questions
/*
/* Author: [Reed](https://github.com/reedspool)
/*
/*- -~- -*/
var AA3 = _.extend({}, {SideBarQuestions: {}}, AA3);

// Doing this a little differently to avoid repeating code
(function () {
  var stem_questions = [
    'p_of_parents_report_stem_learning_opp',
    'p_of_parents_satisfied_stem_program',
    'p_of_parents_consider_stem_as_factor',
    'p_of_parents_agree_children_gain_stem',
    'p_of_parents_agree_should_provide_stem'
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
  stem_questions.forEach(function (d, i) { 
    var obj = {};

    obj[d] = factory.bind(null, d);

    _.extend(AA3.SideBarQuestions, obj)
  });
})()

