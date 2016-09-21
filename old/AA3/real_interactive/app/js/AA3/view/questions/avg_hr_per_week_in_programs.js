var AA3 = _.extend({}, {SideBarQuestions: {}}, AA3)

_.extend(AA3.SideBarQuestions, {
  avg_hr_per_week_in_programs: function () { 
    // Static vars
  
    function factory() {
      // Bad globals!! - <3 Reed
      var national = barStateMap.get('National'),
        meta = metaMap.get('avg_hr_per_week_in_programs')[0];

      function chart(holder) {

        holder.call(AA3.d3.avgTimeQuestion()
                .metaData(meta)
                .timeUnits(["hr", "day"])
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

