/*- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -*/
/*
/* America After 3PM
/*
/* V1.0, October, 2014
/*
/* Author: [Reed](https://github.com/reedspool)
/*
/*- -~- -*/

var which_category = "demand";
var which_question = "p_of_children_in_programs_2014";
var which_state = null;

var Workspace = Backbone.Router.extend({
  routes: {
    "c/:category": "category",
    "c/:category/:question": "category",
    "q/:question": "question",
    "s/:state": "detail",
    "s/:state/:category": "detail",
    "s/:state/:category/:question": "detail",

    "print/health/:state": "printHepa",
    "print/stem/:state": "printStem",

    "*path": "defaultRoute"
  }
});

var workspace = new Workspace();


workspace.on("route:printHepa", function(state) {
  which_state = state;
  category = "health";
  question = highestPriorityQuestion(category);

  renderAllViews();
});

workspace.on("route:printStem", function(state) {
  which_state = state;
  category = "stem";
  question = highestPriorityQuestion(category);

  renderAllViews();
});

workspace.on("route:category", function(category, question) {

  if (!question || !metaMap.get(question)) {
    question = highestPriorityQuestion(category);

    navigateToCategory(category, question, {
      // No trigger, no history entry
      replace: true
    });
  }

  which_category = category;
  which_question = question;

  renderAllViews();
});

workspace.on("route:question", switchQuestionAndRender);
workspace.on("route:defaultRoute", renderAllViews);

workspace.on("route:detail", function(state, category) {

  if (!category) {
    category = 'demand';
  }

  // / If no state, then jump to national page?
  if (!state) jumpToNationalPage('demand');

  if (("Rural" === state) && ("Rural" !== which_state)) {
    category = "demand";
  }

  if (("Poverty" === state) && ("Poverty" !== which_state)) {
    category = "demand";
  }

  which_state = state;
  which_category = category;

  renderAllViews();
});

function initCombobox() {
  $("select#dropdown").combobox({
    onOpen: function() {
      var list = $(".ui-autocomplete"),
        nationalItem = list.find("a").filter(
          function() {
            switch (this.innerHTML) {
              case "National":
                return true;
              case "African-American Participation":
                return true;
              case "Hispanic Participation":
                return true;
              case "Rural Communities":
                return true;
              case "Concentrated Poverty":
                return true;
            }
            return false;
          });
      nationalItem.each(function(item) {
        $(this).parent().addClass(
          "nationalItem");
        if ((item + 1) == nationalItem.length) {
          $(this).parent().addClass(
            "lastNationalItem");
        }
      });
    },
    onSelect: function(val) {
      if (val.match(/national/i)) {
        jumpToNationalPage(which_category);
        return;
      }
      jumpToDetailPage(val);
    },

    select: function(evt, ui) {
      evt.preventDefault();
      evt.stopPropagation();
      return false;
    },
    whenReady: function() {
      var $selections = $(".ui-autocomplete");
      $selections.css("visibility", "hidden");

      setTimeout(function() {
        THEES.input.autocomplete("close");
      }, 500);

      setTimeout(function() {
        $selections.css("visibility",
          "visible");
      }, 750);
    },

    initialPlaceholder: "Jump to..."
  });

  // When you focus on the input, select everything
  $(".custom-combobox-input").on("focus", function() {
    // $(this).select();
  });
}

function initRuralButton() {
  var btn = $("a.ruralButton");
  btn.on("click", function(a) {
    a.preventDefault();
    jumpToDetailPage("Rural");
    $(this).addClass("activeButton");
  });
}

function initPovertyButton() {
  var btn = $("a.povertyButton");
  btn.on("click", function(a) {
    a.preventDefault();
    jumpToDetailPage("Poverty");
    $(this).addClass("activeButton");
  });
}

function highestPriorityQuestion(category) {
  var slugs = metaMap.keys();


  var minSlug;
  var minPriority = Number.MAX_VALUE;

  _.each(slugs, function(slug) {
    var meta = metaMap.get(slug)[0];

    if (meta.priority < minPriority &&
      category == meta.category &&
      meta['question.chart'] &&
      meta['question.chart'] != 'none') {
      minPriority = meta.priority;
      minSlug = slug;
    }

  });

  return minSlug;
}

function switchQuestionAndRender(question) {
  var q = metaMap.get(question);

  if (!q) return;

  which_category = q[0].category;
  which_question = question;

  navigateToCategory(which_category, which_question, {
    // No trigger, no history entry
    replace: true
  });

  renderAllViews();
}

var STATES_AND_DC = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC',
  'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY',
  'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE',
  'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR',
  'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA',
  'WV', 'WI', 'WY'
];

var barStateMap;
var metaMap;
var cardMap;
var HEPASpecialReportMap;
var STEMNewsReleaseMap;
var cardText;
var stateTopo;
var stateTopoMap;
var stateMesh;

var questionsView;
var supplementalDataView;
var statesBarsView;
var mapView;
var questionHighlightView;
var allViews = [];

function getCardText(state, slug, place) {
  var which_one = _.select(cardText.get(state).get(slug), function(
    d) {
    return d.place === place;
  });

  if (!which_one || which_one.length === 0) return '';

  return which_one[0].text;
}

AA3.inScrollTransition = false;

var baseColorScale = d3.scale.quantize()
  .domain([0, 100]);

// TAKING OUT THE LIGHTEST - TOO LIGHT
// Darkest -> Lightest
// Purples
var demandColors = ['#CE4984', '#D35C91', '#D86F9E', '#DE83AB', '#E396B8',
  '#E8A9C5', '#EDBCD2', '#F3D0DF', '#F8E3EC' /*, '#FDF6F9'*/
];
// Light blues
var benefitsColors = ['#32AEC4', '#48B7CA', '#5DBFD0', '#73C8D7', '#89D0DD',
  '#9ED9E3', '#B4E1E9', '#CAEAF0', '#DFF2F6' /*, '#F5FBFC'*/
];
// Dark blues
var supportColors = ['#0A6AC2', '#247AC8', '#3E8ACF', '#5899D5', '#72A9DC',
  '#8BB9E2', '#A5C9E9', '#BFD8EF', '#D9E8F6' /*, '#F3F8FC'*/
];
// Oranges
var healthColors = ["#E78924", "#EA953B", "#ECA151", "#EFAE68", "#F2BA7F",
  "#F4C695", "#F7D2AC", "#FADFC3", "#FCEBD9" /*, "#FFF7F0"*/
];

// Sandy Yellows
var summerColors = ["#E6D23E", "#E8D64F", "#EADA60", "#EDDE71", "#EFE282",
  "#F1E692", "#F3EAA3", "#F6EEB4", "#F8F2C5" /*, "#FAF6D6"*/
];

var stemColors = ['#563B7F', '#654D8B', '#745E96', '#8470A2', '#9382AD',
  '#A293B9', '#B1A5C4', '#C1B7D0', '#D0C8DB' /*, '#DFDAE7'*/
];


var categoryColorScales = {
  demand: baseColorScale.copy()
    .range(demandColors.reverse()),

  benefits: baseColorScale.copy()
    .range(benefitsColors.reverse()),

  support: baseColorScale.copy()
    .range(supportColors.reverse()),

  health: baseColorScale.copy()
    .range(healthColors.reverse()),

  summer: baseColorScale.copy()
    .range(summerColors.reverse()),

  stem: baseColorScale.copy()
    .range(stemColors.reverse())
};

function getCategory() {
  return which_category;
}

function getState() {
  return which_state;
}

function getCategoryGradient() {
  return categoryColorScales[which_category];
}

var stateNester = d3.nest()
  .key(function(d) { return d.state; })
  .key(function(d) { return d.slug; });

var metaNester = d3.nest()
  .key(function(d) { return d.slug; });

var cardNester = d3.nest()
  .key(function(d) { return d.category; })
  .key(function(d) { return d['card.container']; })
  .key(function(d) { return d.slug; });

var HEPASpecialReportNester = d3.nest()
  .key(function(d) { return d.category; })
  .key(function(d) { return d['HEPASpecialReport.container']; })
  .key(function(d) { return d.slug; });

var STEMNewsReleaseNester = d3.nest()
  .key(function(d) { return d.category; })
  .key(function(d) { return d['STEMNewsRelease.container']; })
  .key(function(d) { return d.slug; });

var cardTextNester = d3.nest()
  .key(function(d) { return d.state; })
  .key(function(d) { return d.slug; });

var stateTopoNester = d3.nest().key(function(d) {
  return d.properties.code;
});

var mapChart = AA3.d3.usMap()
  .valueOfState(valueOfState)
  .gradient(getCategoryGradient)
  .hoverState(function() { /* noop */ });

function valueOfState(stateData) {
  var state = stateData.properties.code;
  var stateStuff = barStateMap.get(state);

  if (!stateStuff) {
    return 0;
  }

  var value = Number(stateStuff.get(which_question)[0].answer);

  if (isNaN(value) || value == -1) return 0;

  return value;
}

function promiseLoadAllDataAndOnReady() {
  var states_deferred = Q.defer();
  var topo_deferred = Q.defer();
  var on_ready_deferred = Q.defer();
  var meta_deferred = Q.defer();
  var state_text_deferred = Q.defer();

  d3.csv('data/All_states_TIDY.csv', function(d) {
    states_deferred.resolve(d);
  });

  d3.csv('data/question_metadata_TIDY.csv', function(d) {
    meta_deferred.resolve(d);
  });

  d3.json('data/us-named.json', function(d) {
    topo_deferred.resolve(d);
  });

  d3.csv('data/state_text.csv', function(d) {
    state_text_deferred.resolve(d);
  });

  $(function() {
    on_ready_deferred.resolve();
  });

  return Q.all([

    states_deferred.promise.then(function(d) {
      barStateMap = stateNester.map(d, d3.map);

      return d;
    }),

    topo_deferred.promise.then(function(US) {

      stateTopo = topojson.feature(US, US.objects.states)
        .features;

      stateTopo = _.select(stateTopo, function(d) {
        return STATES_AND_DC.indexOf(d.properties
          .code) != -1;
      });

      stateTopoMap = stateTopoNester.map(stateTopo,
        d3.map);

      stateMesh = topojson.mesh(US, US.objects.states,
        function(a, b) {
          return a !== b;
        });

      return US;
    }),

    meta_deferred.promise.then(function(d) {
      metaMap = metaNester.map(d, d3.map);

      cardMap = cardNester.map(d, d3.map);

      STEMNewsReleaseMap = STEMNewsReleaseNester.map(
        d, d3.map);

      HEPASpecialReportMap =
        HEPASpecialReportNester.map(d, d3.map);

      return d;
    }),

    state_text_deferred.promise.then(function(d) {
      cardText = cardTextNester.map(d, d3.map);

      return d;
    }),

    on_ready_deferred.promise
  ]);
}



promiseLoadAllDataAndOnReady()
  // All data's loaded. What do you do with it?
  .then(function(d) {
    initCombobox();
    initPovertyButton();
    initRuralButton();
  })
  // Everything's ready, actually render.
  .then(initializePage)

// Everything's rendered, now route
.then(function() {
    Backbone.history.start({
      pushState: false
    });
  })
  .done();


function initializePage() {

  var href = window.location.href;
  if (href.match(/detail\.html/)) {

    AA3.page.detail.init();

    return;
  }

  if (href.match(/national\.html/)) {

    AA3.page.national.init();

    return;
  }

  if (href.match(/printHEPASpecialReport\.html/i)) {
    AA3.page.print.special.health.init();
  }

  if (href.match(/printstem/i)) {
    AA3.page.printnamechangefixcollision.special.STEM.init();
  }

  // We're on the splash page, just do the social media links!
  $(AA3.socialMediaView.render);


}

function getAllCurrentQuestions() {
  var questions = _.select(metaMap, function(d) {
    d = d[0];

    var rightCategory = d.category == which_category;

    return rightCategory;
  });

  return questions;
}


function bindDownloadDropdown() {
  var dropdown = $(".download-dropdown");

  dropdown.on("mouseenter", function() {
    var ul = dropdown.find("ul");

    if (ul == ":visible") {
      ul.slideUp("fast");
    } else {
      ul.slideDown("fast");
    }
  });

  dropdown.on("mouseleave", function() {
    dropdown.find("ul").slideUp("fast");
  });

  dropdown.on("click", ".toggle", function() {
    dropdown.preventDefault();
  });
}

function renderAllViews() {

  function fillDownloadLink(selector, prefix, suffix) {
    var $a = $(selector);

    $a.attr('href', prefix + target + suffix)
      .show();
  }

  var grad = getCategoryGradient();
  var meta = metaMap.get(which_question);

  if (!meta) {
    console.log('No meta data for question...');
    return;
  }

  meta = meta[0];

  grad.domain([meta.min, meta.max]);

  var logo = $("#mainLogo");
  var logoNorm;
  
  switch (which_state || "National") {
    case "National":
        break;  
    case "Rural":
        $("a.ruralButton").addClass("activeButton");
        logoNorm = AA3.CONFIG.IMG.LOGO.RURAL;
        animateLogo();
        break;
    case "Poverty":
        $("a.povertyButton").addClass("activeButton");
        logoNorm = AA3.CONFIG.IMG.LOGO.POVERTY;
        animateLogo();
        break;    
    default:
        logoNorm = AA3.CONFIG.IMG.LOGO.NORMAL;
        animateLogo();
  }
  
  function animateLogo(){
    logo.animate({
      opacity: 0
    }, 250).promise().then(function() {
      logo.attr("src", logoNorm).animate({
        opacity: 1
      }, 250);
    });
  }

  $(".site").removeClass("demandActiveCategory")
    .removeClass("benefitsActiveCategory")
    .removeClass("supportActiveCategory")
    .removeClass("healthActiveCategory")
    .removeClass("summerActiveCategory")
    .removeClass("stemActiveCategory")
    .addClass(which_category + "ActiveCategory");

  try {
    var stateName;
    switch (which_state || "National") {
      case "African.American":
        stateName = "African-American Participation";
        break;
      case "Hispanic":
        stateName = "Hispanic Participation";
        break;
      case "NYC":
        stateName = "New York City";
        break;
      case "Allegheny":
        stateName = "PA - Allegheny County";
        break;
      case "National":
        stateName = "";
        break;
      case "Rural":
        stateName = "Rural Communities";
        break;
      case "Poverty":
        stateName = "Concentrated Poverty";
        break;
      default:
        stateName = stateTopoMap.get(which_state)[0].properties
          .name;
    }
    $(".custom-combobox-input").attr("placeholder", stateName ||
        "Jump to...")
      .val(stateName)
      .addClass(stateName ? "filled" : "")
      .removeClass(stateName ? "" : "filled");
  } catch (g) {
    $(".custom-combobox-input")
      .attr("placeholder", "Jump to...");
  }
  var target = which_state || "National";
  fillDownloadLink(".extra.fact-download.primary",
    "http://www.afterschoolalliance.org/documents/AA3PM-2014/",
    "-AA3PM-2014-Fact-Sheet.pdf");

  var $newsDownload = $(".extra.news-download.primary");
  var $keyFindings = $(
    ".secondaryOptionBar .extra.fact-download.secondary");
  var $hepaNewsRelease = $(".extra.news-download.secondary.hepa");
  var $summerNewsRelease = $(
    ".extra.news-download.secondary.summer");
  var $stemNewsRelease = $(
    '.extra.news-download.secondary.stemCategoryExtra');
  var $stemFactSheet = ($(
      '.extra.fact-download.secondary.stemCategoryExtra'),
    $(".download-dropdown"));

  if ("National" == target) {

    $newsDownload.hide();
    $hepaNewsRelease.hide();
    $summerNewsRelease.hide();
    $stemNewsRelease.hide();
    $("a.toggle span", $stemFactSheet).html("Fact Sheets &amp; Key Findings");
    $(".national-download-link", $stemFactSheet).show();
    $(".rural-download-link", $stemFactSheet).hide();
    $(".poverty-download-link", $stemFactSheet).hide();
    $(".detail-download-link", $stemFactSheet).hide();

  } else {

    $("a.toggle span", $stemFactSheet).html("Fact Sheets &amp; News Releases");
    $(".national-download-link", $stemFactSheet).hide();
    $(".rural-download-link", $stemFactSheet).hide();
    $(".poverty-download-link", $stemFactSheet).hide();
    $(".detail-download-link", $stemFactSheet).hide();

    if ("Rural" == target) {
      $(".rural-download-link", $stemFactSheet).show();
      $stemNewsRelease.hide();
    } else if ("Poverty" == target) {
      $(".poverty-download-link", $stemFactSheet).show();
      $stemNewsRelease.hide();
    } else {
      $(".detail-download-link", $stemFactSheet).show();
    }

    $("#nation-nav-button").attr("href", "national.html#c/" +
      categoryPath(which_category, null));

    $keyFindings.find("span").text("Fact sheet");

    fillDownloadLink($(
        ".detail-download-link.general-news-release-link a"
      ),
      "http://www.afterschoolalliance.org/press_archives/AA3PM-2014/",
      "-AA3PM-2014-NR.pdf");
    
    fillDownloadLink($(".detail-download-link.fact-sheet-link a"),
      "http://www.afterschoolalliance.org/documents/AA3PM-2014/",
      "-AA3PM-2014-Fact-Sheet.pdf");
    
    fillDownloadLink($(
        ".detail-download-link.health-focused-fact-sheet-link a"
      ),
      "http://www.afterschoolalliance.org/documents/AA3PM-2015/",
      "-Kids-on-the-Move-Fact-Sheet.pdf");
    
    fillDownloadLink($(
        ".detail-download-link.health-focused-news-link a"
      ),
      "http://www.afterschoolalliance.org/press_archives/AA3PM-2015/",
      "-Kids-on-the-Move-NR.pdf");
    
    fillDownloadLink($(
        ".detail-download-link.summer-news-release-link a"
      ),
      "http://www.afterschoolalliance.org/press_archives/AA3PM-2015/",
      "-Summer-NR.pdf");
    
    fillDownloadLink($(
        ".detail-download-link.stem-focused-fact-sheet-link a"
      ),
      "http://www.afterschoolalliance.org/documents/AA3PM-2015/",
      "-Full-STEM-Ahead-Fact-Sheet.pdf");
    
    fillDownloadLink($(
        ".detail-download-link.stem-focused-news-link a"),
      "http://www.afterschoolalliance.org/press_archives/AA3PM-2015/",
      "-Full-STEM-Ahead-NR.pdf");

    if ("African.American" === which_state || "Hispanic" === which_state) {
      $stemNewsRelease.hide();
      $(".detail-download-link.stem-focused-news-link a").hide();
    } else {
      $(".detail-download-link.stem-focused-news-link a").show();
    }

    if ("Rural" === which_state || "Poverty" === which_state) {
      $(".detail-download-link.stem-focused-fact-sheet-link").hide();
    } else {
      $(".detail-download-link.stem-focused-fact-sheet-link").show();
    }
  }
  _.invoke(allViews, "render");
}

function jumpToDetailPage(d, category, question) {
  if ("Rural" !== d) {
    $("a.ruralButton").removeClass("activeButton");
  }
  if ("Poverty" !== d) {
    $("a.povertyButton").removeClass("activeButton");
  }
  location.href = 'detail.html#s/' +
    d +
    '/' +
    categoryPath(category || which_category,
      question || which_question);
}

function jumpToNationalPage(category, question) {
  location.href = 'national.html#c/' +
    categoryPath(category, question);
}

function navigateToCategory(category, question, options) {
  workspace.navigate('c/' + categoryPath(category, question),
    options);
}

function categoryPath(category, question) {
  return category + (question ? '/' + question : '');
}

function prettyStateName(state) {
  var pretty = AA3.CONFIG.PRETTY_TEXT.STATE_NAME[which_state];
  return pretty || stateTopoMap.get(which_state)[0].properties.name;
}