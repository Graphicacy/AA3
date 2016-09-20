var AA3 = _.extend({}, {CardCharts: {}}, AA3)

_.extend(AA3.CardCharts, {
  just_text_demand_unmet: function () { 
    // Static vars
  
    function factory() {
      function chart(holder) {
        holder.classed('barriersToEnrollment', true)
              .call(AA3.d3.justText().centered(false));
      }

      // Chart attributes
      return chart;
    }
    
    return factory; 
  }()

});

