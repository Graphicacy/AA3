var AA3 = _.extend({}, {SideBarQuestions: {}}, AA3)

_.extend(AA3.SideBarQuestions, {
  avg_hr_per_day_summer: function () { 
    // Static vars
  
    function factory() {
      // Bad globals!! - <3 Reed
      var slug = 'avg_hr_per_day_summer';
        national = barStateMap.get(which_state || 'National'),
        meta = metaMap.get(slug)[0];

      function chart(holder) {
        var value = national.get(slug)[0].answer;
        
        value = Math.round(value);

        var text_data = [{
          number: value,
          timeUnit: 'hr',
          slug: slug
        }];
        
        holder.datum(text_data)
          .call(AA3.d3.bigText()
            .onHighlight(onHighlight));

        // Pass metadata and "expand more info" settings
        holder.datum(slug).call(AA3.d3.infoText()
                        .enableMoreInfo(true)
                        .metaData(meta))
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

