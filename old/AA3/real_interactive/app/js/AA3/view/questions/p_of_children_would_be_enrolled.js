var AA3 = _.extend({}, {SideBarQuestions: {}}, AA3)

_.extend(AA3.SideBarQuestions, {
  p_of_children_would_be_enrolled_: function () { 
    // Static vars
  
    function factory() {
      // Bad globals!! - <3 Reed
      var national = barStateMap.get('National'),
        meta = metaMap.get('p_of_children_would_be_enrolled_2014')[0];


      function chart(holder) {
        holder.call(AA3.d3.ThreeBarChartQuestion()
                .metaData(meta).yearRange([2014, 2009, 2004])
                .onHighlight(onHighlight)
                .gradeLevels(true));
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
