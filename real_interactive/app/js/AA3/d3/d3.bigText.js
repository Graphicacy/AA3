var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
  bigText: (function () {
    // Static vars

    function factory() {
      // Instance vars
      var wContainer = 125, // w and h found in DOM (div) already in place
        hContainer = 125,
        margin = {top: 0, right: 0, bottom: 0, left: 0};

      var colors = ['#2A384B', '#BFCAC7'];
      var unitFull = {
        "hr" : "HOURS",
        'hr_per_day': "HOURS PER DAY",
        "day" : "DAYS",
        "week": 'WEEKS'
      };

      function chart(holder) {

        var width = wContainer - margin.left - margin.right,
          height = hContainer - margin.top - margin.bottom,
          radius = Math.min(width, height) / 2;
       
        text_data = holder.data()[0];

        var highlightable = Boolean(onHighlight)

        holder.append('div')
          .attr('class', 'questionBigText')

        _.each(text_data, function(value) {
          
          var container = holder.append('div')
                              .classed('clickable', highlightable)
                              .classed('subHighlightable', highlightable)
                              .on('click', function () {
                                if ( ! onHighlight ) return;
                                
                                onHighlight(value.slug)

                                holder.selectAll('.subHighlighted')
                                  .classed('subHighlighted', false)

                                container.classed('subHighlighted', true)
                              })
                              .classed('subHighlighted', value.slug == which_question);


          if (value.timeUnit) {
            container
              .append('span')
              .attr('class', 'questionBigTextNumber')
              .text(Math.round(value.number))            
            container
              .append('span')
              .attr('class', 'questionBigTextUnit')
              .text(unitFull[value.timeUnit])
          }
          else {
            container
              .append('span')
              .attr('class', 'questionBigTextNumber')
              .text((value.dollar ? "$" : "") + d3.format(",.0f")(value.number))    
          }


        })
      }

      // Chart attributes
      chart.width = function(value) {
        if (!arguments.length) return wContainer;
        wContainer = value;
        return chart;
      };
      chart.height = function(value) {
        if (!arguments.length) return hContainer;
        hContainer = value;
        return chart;
      };
      chart.colors = function(value) {
        if (!arguments.length) return colors;
        colors = value;
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

    return factory;
  })()
});
