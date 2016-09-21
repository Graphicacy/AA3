var AA3 = _.extend({}, {CardCharts: {}}, AA3)

_.extend(AA3.CardCharts, {
  p_family_child_summer_2013: function () { 
    // Static vars  
    function factory() {
      // Bad globals!! - <3 Reed
      
      var national = barStateMap.get('National'),
        meta = metaMap.get('p_family_child_summer_2013')[0];

      function chart(holder) {
        holder.call(
          AA3.d3.doubleQuestion()
            .top({
              title: '2013',
              slug: 'p_family_child_summer_2013'
            })
            .bottom({
              title: '2008',
              slug: 'p_family_child_summer_2008'
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

