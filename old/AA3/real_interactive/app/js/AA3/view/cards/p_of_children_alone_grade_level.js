var AA3 = _.extend({}, {CardCharts: {}}, AA3)

_.extend(AA3.CardCharts, {
  p_of_children_alone_2014_: function () { 
    // Static vars 
    
    function factory() {

      function chart(holder) {
        // Bad globals!! - <3 Reed
        var meta = metaMap.get('p_of_children_in_programs_2014_k_to_5')[0];

        holder
          .datum('p_of_children_alone_2014_')
          .call(AA3.d3.GradeLevelsThreeBarChartQuestion()
                      .metaData(meta)
                      .enableMoreInfo(false)
                      .combineKTo8(true));
      }
  
      // Chart attributes
      return chart;
    }
    
    return factory;
  }()

});

