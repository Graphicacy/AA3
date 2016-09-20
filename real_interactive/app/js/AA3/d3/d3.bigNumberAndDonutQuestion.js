var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
  bigNumberAndDonutQuestion: (function () {
    // Static vars
  
    function factory() {
      
      var national = barStateMap.get(which_state || 'National');

      function chart(holder) {
        var chart_slug = holder.data()[0];
        
        var chart = AA3.d3.bigNumberAndDonut();

        var value = national.get(chart_slug)[0].answer;
        
        value = Math.round(value);

        var donut = holder.append('div').attr('class', 'questionDonut')
          .append('div');

        donut.datum(value)

        // For some charts on the state page, we want
        // to fill the entire card with the graphics
        if (!fillCard) {

          if (location.href.match(/detail\.html|printHEPASpecialReport\.html/i)) {
            // Hijacking this method because it's midnight b4 delivery day...
            // Should have made a new d3.....js class
              chart = AA3.d3.bigCenteredText()
              donut.attr('class', 'bigCenteredText')
                .append('div').call(chart)
              // Pass metadata and "expand more info" settings
              holder.classed('centerMoreInfo', true).datum(chart_slug).call(AA3.d3.infoText()
                          .enableMoreInfo(enableMoreInfo)
                          .metaData(metaData))  
          } else {
            // Original
            donut.call(chart)
            // Pass metadata and "expand more info" settings
            holder.datum(chart_slug).call(AA3.d3.infoText()
                            .enableMoreInfo(enableMoreInfo)
                            .metaData(metaData))          
          }
        } else {
          // Class must be added before chart is called
          // to allow text bounding box to calculate correctly
          holder.classed('fillCard', true)
          var parent_width = 200;
          donut.call(chart.width(parent_width).height(parent_width))
        }

      }

      // If false, always display more info
      var enableMoreInfo = true;
      chart.enableMoreInfo = function(value) {
        if (!arguments.length) return enableMoreInfo;
        enableMoreInfo = value;
        return chart;
      };

      // Chart attributes
      var metaData;
      chart.metaData = function(value) {
        if (!arguments.length) return metaData;
        metaData = value;
        return chart;
      };

      var fillCard;
      chart.fillCard = function(value) {
        if (!arguments.length) return fillCard;
        fillCard = value;
        return chart;
      };



      return chart;
    }

    return factory
  })()
});
