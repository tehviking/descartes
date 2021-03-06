
// Grab configuration blob and construct our graph urls
var renderGraphs = function() {
  var myUrl = window.location.pathname;
  if (myTags.length > 0) {
    myUrl += '?tags=' + encodeURI(myTags);
  }
  return $.ajax({
    accepts: {json: 'application/json'},
    cache: false,
    dataType: 'json',
    error: function(xhr, textStatus, errorThrown) { console.log(errorThrown); },
    url: myUrl
  }).done(function(d) {
    if (d.graphs.length === 0) {
      console.log('No graphs found');
      window.location.href = '/dashboards';
    }
    var row = 0;
    $('div.graphs').append('<div class="row"></div>');
    for (var i=0; i < d.graphs.length; i++) {
      var targets = [];
      for (var j in $.parseJSON(d.graphs[i].configuration).target) {
        targets.push({name: $.parseJSON(d.graphs[i].configuration).target[j]});
      }
      var c = $.extend($.parseJSON(d.graphs[i].configuration), $.parseJSON(d.graphs[i].overrides), {targets: targets});
      row = Math.floor( i / myColumns );
      var spanSize = ( 12 / myColumns );
      if (($('div.graphs div.row').length - 1) !== row) {
        $('div.graphs').append('<div class="row"></div>');
      }
      $($('div.graphs div.row')[row]).append('<span id="' + d.graphs[i].uuid + '" class="graph span' + spanSize + '"></div>');
      var myGraphWidth = $($('div.row span.graph')[0]).width();
      var graphCloseIcon = '<img class="close hidden" src="/img/close.png" />';
      $('div.graphs div.row span#' + d.graphs[i].uuid).append('<label for="' + d.graphs[i].uuid + '">' + d.graphs[i].name + '</label>');
      $('div.graphs div.row span#' + d.graphs[i].uuid).append('<a href="/graphs/' + d.graphs[i].uuid + '"><img src="' + constructGraphUrl(c) + '" alt="' + d.graphs[i].name + '" name="' + d.graphs[i].uuid + '" /></a>');
    }
    selectActiveColumnButton();
    selectActiveIntervalButton();
    setImageDestroyMode();
    renderTitle();
  });
};

// Not used in dashboards
var scrollNextPage = function() {
  return true;
}
