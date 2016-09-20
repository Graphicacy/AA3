var AA3 = _.extend({}, {CardCharts: {}}, AA3)

_.extend(AA3.CardCharts, {
  p_of_parents_satisfied_child_program_: function () { 
    // Static vars
  
    function factory() {
      // Bad globals!! - <3 Reed
      var meta = metaMap.get('p_of_parents_satisfied_child_program_2014')[0];

      function chart(holder) {
        holder.call(AA3.d3.ThreeBarChartQuestion()
                .metaData(meta).yearRange([2014, 2009, 2004]).enableMoreInfo(false));
      }
      // Chart attributes
      return chart;
    }

    return factory; 
  }()

});
