var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
  infoText: (function () {
    // Static vars
  
    function factory() {
      
      function chart(holder) {

        var chart_slug = holder.data()[0];

        if (location.href.match(/detail\.html|printHEPASpecialReport\.html/i)) {
          var actualText = getCardText(which_state, chart_slug, 'text') || metaData.cardViewMoreInfo
        } else {
          var actualText = metaData.questionViewMoreInfo; 
        }

        if ( ! actualText || actualText == '') return;

        if (enableMoreInfo) {
          var seeMoreButton = holder.append('p')
            .attr('class', 'more-info clickable')
            .text('More info +')
            .on('click', function() { 
              moreInfo.style('display', 'inherit'); 
              seeMoreButton.style('display', 'none');
            });         
        }

        var moreInfo = holder.append('div')
          .attr('class', 'more');
          
        moreInfo.append('p')
          .html(actualText);

        if (enableMoreInfo) {

          moreInfo.append('p')
            .attr('class', 'less-info clickable')
            .text('Less info -')
            .on('click', function() { 
              moreInfo.style('display', 'none'); 
              seeMoreButton.style('display', 'inherit');
            });

          $(document).ready(function() {
            $('.more').hide();
        });

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

      return chart;
    }

    return factory
  })()
});