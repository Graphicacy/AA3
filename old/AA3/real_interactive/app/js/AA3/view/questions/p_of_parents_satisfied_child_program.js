var AA3 = _.extend({}, {SideBarQuestions: {}}, AA3)

_.extend(AA3.SideBarQuestions, {
  p_of_parents_satisfied_child_program_: function () { 
    // Static vars
  
    function factory() {
      // Bad globals!! - <3 Reed
      var national = barStateMap.get('National'),
        meta = metaMap.get('p_of_parents_satisfied_child_program_2014')[0];

      function chart(holder) {
        holder.call(AA3.d3.ThreeBarChartQuestion()
                .metaData(meta).yearRange([2014, 2009, 2004])
                .onHighlight(onHighlight));
      } 

      // Chart attributes
      var onHighlight;
      chart.onHighlight = function(value) {
        if (!arguments.length) return onHighlight;
        onHighlight = value;
        return chart;
      };
      
      return chart;
    }

    return factory; 
  }()

});
