var AA3 = _.extend({}, {SideBarQuestions: {}}, AA3)

_.extend(AA3.SideBarQuestions, {
  p_of_parents_support_public_funding_summer: function () { 
    // Static vars
  
    function factory() {
      // Bad globals!! - <3 Reed
      var meta = metaMap.get('p_of_parents_support_public_funding_summer')[0];

      function chart(holder) {
     
        holder.call(
          AA3.d3.doubleQuestion()
            .top({
              title: '2014',
              slug: 'p_of_parents_support_public_funding_summer'
            })
            .bottom({
              title: '2009',
              slug: 'p_of_parents_support_public_funding_summer_2009'
            })
            .onHighlight(onHighlight)
            .enableMoreInfo(false)
            .metaData(meta)
        );
      }
      var onHighlight;
      chart.onHighlight = function(value) {
        if (!arguments.length) return onHighlight;
        onHighlight = value;
        return chart;
      };
      // Chart attributes
      return chart;
    }
    
    return factory; 
  }()

});

