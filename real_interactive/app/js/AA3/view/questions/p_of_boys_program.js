var AA3 = _.extend({}, {SideBarQuestions: {}}, AA3)

_.extend(AA3.SideBarQuestions, {
  p_of_boys_program: function () { 
    // Static vars
    
    function factory() {
      // Bad globals!! - <3 Reed
      var national = barStateMap.get('National'),
        meta = metaMap.get('p_of_boys_program')[0];

      function chart(holder) {
        holder.call(AA3.d3.pieChartQuestion()
                .metaData(meta));
      }
      // Chart attributes
      return chart;
    }
    
    return factory; 
  }()

});

