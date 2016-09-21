var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
  multipleReasonQuestion: (function () {
    // Static vars
  
    function factory() {
      
      var national = barStateMap.get('National');

      function chart(holder) {

        var chart_slug = holder.data()[0];

        var chart = AA3.d3.multipleReason().width(100).height(100);

        var reason_data = [];

        _.each(reasonNumbers, function buildChart(reason) {

          var question_text = chart_slug.split("reason_")[1].slice(1);

          var slug = 'reason_' + reason + question_text;
          var value = national.get(slug)[0].answer;

          if (value !== '') {
            reason_data.push(value);
          }

        });

        holder.datum(reason_data)
          .call(chart)

        // Pass metadata and "expand more info" settings
        holder.call(AA3.d3.infoText()
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
      var reasonNumbers;
      chart.reasonNumbers = function(value) {
        if (!arguments.length) return reasonNumbers;
        reasonNumbers = value;
        return chart;
      };

      return chart;
    }

    return factory
  })()
});
