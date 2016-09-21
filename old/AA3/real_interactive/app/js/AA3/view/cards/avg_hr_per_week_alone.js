var AA3 = _.extend({}, {CardCharts: {}}, AA3)

_.extend(AA3.CardCharts, {
  avg_hr_per_week_alone: function () { 
    // Static vars
  
    function factory() {
      // Bad globals!! - <3 Reed
      var national = barStateMap.get('National'),
        meta = metaMap.get('avg_hr_per_week_alone')[0];

      function chart(holder) {

        holder.call(AA3.d3.avgTimeQuestion()
                .metaData(meta).timeUnits(["hr"]).enableMoreInfo(false));
      }

      // Chart attributes
      return chart;
    }
    
    return factory; 
  }()

});

