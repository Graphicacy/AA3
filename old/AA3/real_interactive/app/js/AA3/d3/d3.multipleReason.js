var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
  multipleReason: (function () {
    // Static vars

    function factory() {
      // Instance vars
      var wContainer = 125, // w and h found in DOM (div) already in place
        hContainer = 125,
        margin = {top: 0, right: 0, bottom: 0, left: 0};

      var colors = ['#2A384B', '#BFCAC7'];
  
      function chart(holder) {


        var width = wContainer - margin.left - margin.right,
            height = hContainer - margin.top - margin.bottom,
            radius = Math.min(width, height) / 2;
       
        var reason_list = holder.data()[0];

        

        holder
          .append('div')
            .attr('class', 'questionReasonList')
          .append('ol')
          .selectAll('li')
            .data(reason_list)
            .enter()
          .append('li')
            .text(function(d) {return d;});
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

      return chart;
    }

    return factory;
  })()
});
