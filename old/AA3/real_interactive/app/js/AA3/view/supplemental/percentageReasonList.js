var AA3 = _.extend({}, {supplemental: {}}, AA3)

_.extend(AA3.supplemental, {
  percentageReasonList: function () { 
    // Static vars

    function factory() {

      var national = barStateMap.get('National');

      function chart(holder) {

        var reason_data = [];

        var splitter = metaData.slug.indexOf("reason_") !== -1 ? "reason_" : "ans_";

        _.each(reasonNumbers, function buildChart(reason) {

          var d = {};

          var question_text = metaData.slug.split(splitter)[1].slice(1);

          var slug = splitter + reason + question_text;

          var nat_data = national.get(slug);

          var p_slug = 'p_for_' + slug;

          var p_nat_data = national.get(p_slug)

          if (nat_data)  {
            var value = nat_data[0].answer;
            var p_value = p_nat_data[0].answer;

            if (value !== '') {
              d.value = value;
              d.percent = p_value;
              d.slug = slug;

              reason_data.push(d)
            }            
          }



        });

        holder
          .classed('notFirst', !firstSupplemental)
          .classed('borderRight', borderRight)
          .classed('halfWidth', halfWidth)

        holder
          .append('div')
          .attr('class', 'reasonListTitle')
          .text(metaData.questionViewTitle)

        list_width = Math.max(250,
            holder.select('.reasonListTitle')
              .node()
              .getBoundingClientRect()
              .width,
            requestedWidth
          ) + 'px';

        var up = holder
                  .append('div')
                    .attr('class', 'questionReasonList')
                    .style('width', list_width)
                  .append('div')
                    .selectAll('div')
                      .data(reason_data, function (d) { return d.slug })
            

        var enter = up.enter();

        var enterWrap = enter.append('div')


        enterWrap.append('span')
          .text(function (d, i) { 
            return Math.round(d.percent) + '% - ';
          })

        enterWrap.append('span')
          .classed('entryText', true)
          .text(function (d) { 
            return d.value;
          })
      }
      // Chart attributes
      var title;
      chart.title = function(value) {
        if (!arguments.length) return title;
        title = value;
        return chart;
      };

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

      /*
        Toggle CSS properties for lists
      */

      // An Array of years the question was asked
      var borderRight = false;
      chart.borderRight = function(value) {
        if (!arguments.length) return borderRight;
        borderRight = value;
        return chart;
      };  

      // An Array of years the question was asked
      var halfWidth = false;
      chart.halfWidth = function(value) {
        if (!arguments.length) return halfWidth;
        halfWidth = value;
        return chart;
      };

      var requestedWidth;
      chart.width = function(value) {
        if (!arguments.length) return requestedWidth;
        requestedWidth = value;
        return chart;
      };

      // An Array of years the question was asked
      var firstSupplemental = false;
      chart.firstSupplemental = function(value) {
        if (!arguments.length) return firstSupplemental;
        firstSupplemental = value;
        return chart;
      };  


      return chart;
    }
  
    return factory; 
  }()
});