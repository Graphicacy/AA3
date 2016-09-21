var AA3 = _.extend({}, {CardCharts: {}}, AA3)

_.extend(AA3.CardCharts, {
  health_snacks_double: function () { 
    // Static vars  
    function factory() {
      // Bad globals!! - <3 Reed
      
      var national = barStateMap.get('National'),
        meta = metaMap.get('p_of_parents_satisfied_programs_snacks')[0];

      function chart(holder) {
        holder.call(
          AA3.d3.doubleQuestion()
            .top({
              title: 'Snacks and/or meals',
              slug: 'p_of_parents_satisfied_programs_snacks'
            })
            .bottom({
              title: 'Snacks and/or meals that are <strong>healthy</strong>',
              slug: 'p_of_parents_satisfied_healthy_snacks'
            })
            .onHighlight(onHighlight)
            .enableMoreInfo(false)
            .metaData(meta)
        );
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

