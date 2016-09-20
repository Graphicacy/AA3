var AA3 = _.extend({}, {CardCharts: {}}, AA3)

_.extend(AA3.CardCharts, {
  reason_1_not_enrolling_child: function () { 
    // Static vars
  
    function factory() {
      // Bad globals!! - <3 Reed
      var national = barStateMap.get('National'),
        meta = metaMap.get('reason_1_not_enrolling_child')[0];


      function chart(holder) {
        holder.call(AA3.d3.multipleReasonQuestion()
                .metaData(meta).reasonNumbers([1,2,3]).enableMoreInfo(false));
      }
      
      // Chart attributes
      return chart;
    }
    
    return factory; 
  }()

});

