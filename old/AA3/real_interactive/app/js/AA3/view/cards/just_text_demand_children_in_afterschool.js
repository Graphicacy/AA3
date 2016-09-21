var AA3 = _.extend({}, {CardCharts: {}}, AA3)

_.extend(AA3.CardCharts, {
  just_text_demand_children_in_afterschool: function () { 
    // Static vars
  
    function factory() {
      function chart(holder) {
        holder.classed('justTextDemandParticipation', true)
          .call(AA3.d3.justText());
      }

      // Chart attributes
      return chart;
    }
    
    return factory; 
  }()

});

