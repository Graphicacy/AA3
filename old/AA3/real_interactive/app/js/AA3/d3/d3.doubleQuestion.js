var AA3 = _.extend({}, {d3: {}}, AA3)

_.extend(AA3.d3, {
  doubleQuestion: (function () {
    // Static vars

    var barChart = AA3.d3.questionSingleBarChart()
                .width(196);
  
    function factory() {

      function chart(holder) {
        
        holder.classed('doubleQuestionHolder', true)
 
        var contents = holder.append('div')
          .classed('doubleQuestionContents', true)

        contents.call(insertThing, top)

        contents.append('img')
          .classed('questionDottedLine', true)
          .attr('src', 'img/questionDottedLine.png')

        contents.call(insertThing, bottom)

        // Pass metadata and "expand more info" settings
        holder.call(AA3.d3.infoText()
                        .enableMoreInfo(enableMoreInfo)
                        .metaData(metaData))

      }

      // Util
      function insertThing(holder, pkg) {
        var national = barStateMap.get(which_state || 'National');
        var slug = pkg.slug
        var value = national.get(slug)[0].answer;

        var highlightable = Boolean(onHighlight);

        var bar = holder.append('div')
              .classed('clickable', highlightable)
              .classed('subHighlightable', highlightable)
              .on('click', function () {
                if ( ! onHighlight ) return;

                onHighlight(pkg.slug)
              
                holder.selectAll('.subHighlighted')
                  .classed('subHighlighted', false)

                bar.classed('subHighlighted', true)
              })
              .classed('subHighlighted', pkg.slug == which_question);
        
        bar.append('span')
          .html(pkg.title)

        bar.append('br')
        
        bar.datum(value)
          .call(barChart)
      }

      // Chart attributes

      var top;
      chart.top = function(value) {
        if (!arguments.length) return top;
        top = value;
        return chart;
      };

      var bottom;
      chart.bottom = function(value) {
        if (!arguments.length) return bottom;
        bottom = value;
        return chart;
      };

      // If false, always display more info
      var enableMoreInfo = true;
      chart.enableMoreInfo = function(value) {
        if (!arguments.length) return enableMoreInfo;
        enableMoreInfo = value;
        return chart;
      };
  
      var metaData;
      chart.metaData = function(value) {
        if (!arguments.length) return metaData;
        metaData = value;
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
