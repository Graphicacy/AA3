var AA3 = _.extend({}, {CardCharts: {}}, AA3)

_.extend(AA3.CardCharts, {
  ans_1_type_activity: function () { 
    // Static vars
  
    function factory() {
      // Bad globals!! - <3 Reed
      var meta = metaMap.get('ans_1_type_activity')[0];

      function chart(holder) {

        // This is the automatically generated one - traded for the pure text version from given text.
        // var reasonNumbers = [1, 2, 3, 4, 5];

        // if (which_state.match(/(hisp|african|nyc|allegheny)/i)) {
        //   reasonNumbers = [1, 2, 3]
        // }

        // holder.call(AA3.d3.basicListQuestion()
        //         .metaData(meta).reasonNumbers(reasonNumbers).enableMoreInfo(false));

        holder.call(AA3.d3.justText().centered(false))
      }
      
      // Chart attributes
      return chart;
    }
    
    return factory; 
  }()

});

