var AA3 = _.extend({}, {SideBarQuestions: {}}, AA3)

_.extend(AA3.SideBarQuestions, {
  health_activity_double: function () { 
    // Static vars  
    function factory() {
      // Bad globals!! - <3 Reed
      
      var national = barStateMap.get('National'),
        meta = metaMap.get('p_of_parents_satisfied_programs_physical_amount')[0];

      function chart(holder) {
        holder.call(
          AA3.d3.doubleQuestion()
            .top({
              title: '<strong>Amount</strong> of physical <br />activity',
              slug: 'p_of_parents_satisfied_programs_physical_amount'
            })
            .bottom({
              title: '<strong>Variety</strong> of physical <br />activity',
              slug: 'p_of_parents_satisfied_programs_physical_variety'
            })
            .onHighlight(onHighlight)
            .enableMoreInfo(true)
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

