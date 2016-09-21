var AA3 = _.extend({}, {CardCharts: {}}, AA3)

_.extend(AA3.CardCharts, {
  avg_dollars_per_week_summer: function () { 
    // Static vars
  
    function factory() {
      // Bad globals!! - <3 Reed
      var meta = metaMap.get('avg_dollars_per_week_summer')[0];

      function chart(holder) {

        holder.call(AA3.d3.bigDollarQuestion()
                .metaData(meta)
                .enableMoreInfo(false)
                .fillCard(false)
                .showYear(false));
      }

      // Chart attributes
      return chart;
    }
    
    return factory; 
  }()

});

