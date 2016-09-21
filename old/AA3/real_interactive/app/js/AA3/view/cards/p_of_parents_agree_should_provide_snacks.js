
// copied this from p_of_children, don't know what to do with it -JS

// var AA3 = _.extend({}, {CardCharts: {}}, AA3)

// _.extend(AA3.CardCharts, {
//   p_of_parents_agree_should_provide_snacks: function () { 
//     // Static vars 
    
//     function factory() {

//       function chart(holder) {
//         // Bad globals!! - <3 Reed
//         var meta = metaMap.get("p_of_parents_agree_should_provide_snacks")[0];

//         holder.call(AA3.d3.questionSingleBarChart()
//                       .metaData(meta)
//                       .yearRange([2014, 2009, 2004]).enableMoreInfo(false)
//                       .projection('p_of_parents_agree_should_provide_snacks'));
//       }
  
//       // Chart attributes
//       return chart;
//     }
    
//     return factory; 
//   }()

// });