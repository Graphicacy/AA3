var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
  avgTimeQuestion: (function () {
    // Static vars
  
    function factory() {
      
      var national = barStateMap.get(which_state || 'National');

      function chart(holder) {

        var chart_slug = holder.data()[0];

        var chart = AA3.d3.bigText();

        if (chart.onHighlight) chart.onHighlight(onHighlight)

        var text_data = [];

        _.each(timeUnits, function buildChart(unit) {

          //super hackish - sorry (get the text surrounding time unit)
          var question_text = (
            "_per" + chart_slug.split("avg_")[1].split("_per")[1]
          );

          var slug = 'avg_' + unit + question_text;
          var value = national.get(slug)[0].answer;
          value = Math.round(value);

          if (value) {
            text_data.push({
              number : value,
              timeUnit : unit,
              slug: slug
            });
          }

        });

        holder.append('div')
          .attr('class', 'questionBigTextYear')
          .text(2014)

        holder.datum(text_data)
          .call(chart)

        // Pass metadata and "expand more info" settings
        holder.datum(chart_slug).call(AA3.d3.infoText()
                        .enableMoreInfo(enableMoreInfo)
                        .metaData(metaData))

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

      var onHighlight;
      chart.onHighlight = function(value) {
        if (!arguments.length) return onHighlight;
        onHighlight = value;
        return chart;
      };

      return chart;
    }

    return factory
  })()
});
