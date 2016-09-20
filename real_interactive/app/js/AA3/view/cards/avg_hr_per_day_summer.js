var AA3 = _.extend({}, {CardCharts: {}}, AA3)

_.extend(AA3.CardCharts, {
  avg_hr_per_day_summer: function () { 
    // Static vars
  
    function factory() {
      // Bad globals!! - <3 Reed
      var slug = 'avg_hr_per_day_summer',
        weeks_slug = 'avg_weeks_per_summer',
        national = barStateMap.get(which_state || 'National'),
        meta = metaMap.get(slug)[0];

      function chart(holder) {
        var value = national.get(slug)[0].answer;
        
        value = Math.round(value);

        var hours_text_data = [{
          number: value,
          timeUnit: 'hr_per_day',
          slug: slug
        }];

        var weeks_value = national.get(weeks_slug)[0].answer;
        
        weeks_value = Math.round(weeks_value);

        var weeks_text_data = [{
          number: weeks_value,
          timeUnit: 'week',
          slug: weeks_slug
        }];

        holder.datum(hours_text_data)
          .call(AA3.d3.bigText()
            .onHighlight(onHighlight));

        holder.datum(weeks_text_data)
          .call(AA3.d3.bigText()
            .onHighlight(onHighlight));

        // Pass metadata and "expand more info" settings
        holder.datum(slug).call(AA3.d3.infoText()
                        .enableMoreInfo(false)
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

