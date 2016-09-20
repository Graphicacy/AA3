var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
  pieChartQuestion: (function () {
    // Static vars
  
    function factory() {
      
      var national = barStateMap.get(which_state || 'National');

      function chart(holder) {
        var chart_slug = holder.data()[0];
        
        var chart = AA3.d3.pieChart()
                      .width(width || 100)
                      .height(height || 100);

        var boys_value = national.get(chart_slug)[0].answer;
        var girls_value = 100 - boys_value;

        var pie = holder.append('div');

        pie.datum(boys_value)

        if (!fillCard) {

          pie.call(chart)

          var pie_text = pie.append('div')  
              .attr('class', 'questionPieChartText');
          
          pie_text.append('span')
              .attr('class', 'boyValue title')
              .text(boys_value + '% BOYS');

          pie_text.append('span')
              .attr('class', 'girlValue subtitle')
              .text(girls_value + '% GIRLS');

          // Pass metadata and "expand more info" settings
          holder.call(AA3.d3.infoText()
                          .enableMoreInfo(enableMoreInfo)
                          .metaData(metaData))          
        } else {
          var parent_width = parseInt(holder.style('width'))
          pie.call(chart.width(width || parent_width)
                        .height(height || parent_width))
          holder.select('svg').selectAll('.arc')
            .append("text")
            .attr("transform", function(d) {
              return "translate(" + chart.arc.centroid(d) + ")"; 
            })
            .attr("dy", ".35em")
            .attr('class', 'pieBigText')
            .attr('style', "text-anchor:left;")
            .append('tspan')
              .attr('x', -35)
              .attr('y', -15)
              .text(function(d) { return d.value + '%'; })
            .append('tspan')
              .text(function(d) {
                return 50 === d.value ? $(this)
                .closest(".arc").is(":first-child") ? "BOYS" : "GIRLS" : d.value == Math.round(boys_value) ? "BOYS" : "GIRLS"
              })
              .attr('x', -35)
              .attr('dy', 26)
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
      var fillCard = false;
      chart.fillCard = function(value) {
        if (!arguments.length) return fillCard;
        fillCard = value;
        return chart;
      };

      var width;
      chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
      };

      var height;
      chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
      };

      return chart;
    }

    return factory
  })()
});
