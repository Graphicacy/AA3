var AA3 = _.extend({}, {CardCharts: {}}, AA3)

_.extend(AA3.CardCharts, {
  ans_1_program_provider: function () { 
    // Static vars
  
    function factory() {
      // Bad globals!! - <3 Reed
      var meta = metaMap.get('ans_1_program_provider')[0];

      function chart(holder) {
        holder.call(AA3.d3.justText().centered(false));
      }
      
      // Chart attributes
      return chart;
    }
    
    return factory; 
  }()

});

