var AA3 = _.extend({}, {CardCharts: {}}, AA3)

_.extend(AA3.CardCharts, {
  avg_dolllars_spent_per_week_program: function () { 
    // Static vars
  
    function factory() {
      // Bad globals!! - <3 Reed
      var meta = metaMap.get('avg_dolllars_spent_per_week_program')[0];

      function chart(holder) {

        holder.call(AA3.d3.bigDollarQuestion()
                .metaData(meta)
                .enableMoreInfo(false)
                .fillCard(false)
                .showYear(true));
      }

      // Chart attributes
      return chart;
    }
    
    return factory; 
  }()

});

