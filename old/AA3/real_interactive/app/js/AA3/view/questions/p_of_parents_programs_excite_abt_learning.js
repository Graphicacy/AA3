var AA3 = _.extend({}, {SideBarQuestions: {}}, AA3)

_.extend(AA3.SideBarQuestions, {
  p_of_parents_programs_excite_abt_learning: function () { 
    // Static vars
  
    function factory() {
      // Bad globals!! - <3 Reed
      var meta = metaMap.get('p_of_parents_programs_excite_abt_learning')[0];

      function chart(holder) {

        holder.call(AA3.d3.bigNumberAndDonutQuestion()
                .metaData(meta));
      }

      // Chart attributes
      return chart;
    }
    
    return factory; 
  }()

});

