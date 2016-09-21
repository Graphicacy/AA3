var AA3 = _.extend({}, {SideBarQuestions: {}}, AA3)

_.extend(AA3.SideBarQuestions, {
  avg_dolllars_spent_per_week_program: function () { 
    // Static vars
  
    function factory() {
      // Bad globals!! - <3 Reed
      var national = barStateMap.get('National'),
        meta = metaMap.get('avg_dolllars_spent_per_week_program')[0];

      function chart(holder) {
        holder.call(AA3.d3.bigDollarQuestion()
                .metaData(meta));
      }

      // Chart attributes
      return chart;
    }
    
    return factory; 
  }()

});

