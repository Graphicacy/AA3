var AA3 = _.extend({}, {CardCharts: {}}, AA3)

_.extend(AA3.CardCharts, {
  p_of_parents_support_public_funding_: function () { 
    // Static vars
  
    function factory() {
      // Bad globals!! - <3 Reed
      var national = barStateMap.get('National'),
        meta = metaMap.get('p_of_parents_support_public_funding_2014')[0];

      function chart(holder) {
        holder.datum('p_of_parents_support_public_funding_2014').call(AA3.d3.bigNumberAndDonutQuestion()
                .metaData(meta)
                .enableMoreInfo(false)
                .fillCard(false));
      }
      // Chart attributes
      return chart;
    }
    
    return factory; 
  }()

});

