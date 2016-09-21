var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
  bigDollarQuestion: (function () {
    // Static vars
  
    function factory() {
      
      var national = barStateMap.get(which_state || 'National');

      function chart(holder) {

        var chart_slug = holder.data()[0];

        var chart = AA3.d3.bigText();

        var value = national.get(chart_slug)[0].answer;

        value = Math.round(value);

        if (!fillCard && showYear) {
          holder.append('div')
            .attr('class', 'questionBigTextYear')
            .text(2014)          
          }

        holder.datum([{number : value, dollar : true}])
          .call(chart)

        if (!fillCard) {
          // Pass metadata and "expand more info" settings
          holder.datum(chart_slug).call(AA3.d3.infoText()
                          .enableMoreInfo(enableMoreInfo)
                          .metaData(metaData))          
        } else {
          holder.classed('fillCard', true)
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

      // An Array of years the question was asked
      var timeUnits;
      chart.timeUnits = function(value) {
        if (!arguments.length) return timeUnits;
        timeUnits = value;
        return chart;
      };

      // An Array of years the question was asked
      var fillCard = false;
      chart.fillCard = function(value) {
        if (!arguments.length) return fillCard;
        fillCard = value;
        return chart;
      };

      var showYear = true;
      chart.showYear = function(value) {
        if (!arguments.length) return showYear;
        showYear = value;
        return chart;
      };

      return chart;
    }

    return factory
  })()
});
