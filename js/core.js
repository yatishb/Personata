var currentView;

$(function(){
	FB.init({
	  appId: 752376788138741,
	  frictionlessRequests: true,
	  status: true,
	  cookie: true,
    xfbml: true,
    oauth: true,
	  version: 'v2.0'
	});

	FB.Event.subscribe('auth.authResponseChange', onAuthResponseChange);
	FB.Event.subscribe('auth.statusChange', onStatusChange);

	$('.ignore-default').click(function(e){
		e.preventDefault();
	});
	
  $('#fb-login').click(function(){
    login(loginCallback);
  });

  $('#share').click(function () {
      var obj = {}, chart;
          
      chart = $(currentView).highcharts();
      obj.svg = chart.getSVG();
      obj.type = 'image/png';
      obj.width = 450; 
      obj.async = true;
      
      $.ajax({
          type: 'post',
          url: chart.options.exporting.url,        
          data: obj, 
          success: function (data) {            
              var exportUrl = this.url;
              FBSharePhoto(exportUrl+data);
          }        
      });
  });

  $body = $("body");
  $(document).ajaxStart(function () {
    $body.addClass("loading");
    // $('.modal').show();
  });

  $(document).ajaxComplete(function () {
    $body.removeClass("loading");
  });

});

function switchView(view) {
  $('.view').hide();
  $(view).show();
  var temp = view.split("-");
  currentView = '#' + temp[0].substring(1) + '-container';
}

function renderRanking(data){
  var output = '<ul>';
  for (var i = 0; i < data.length; i++) {
    output += '<li>'+data[i].id+' '+data[i].likes+'</li>';
  }
  $('.ranking-data p').html(output+'</li>');
}

function getRankingData(){
  var start = '2014-7-20';
  var end = '2014-09-03';
  $.getJSON('backend.php', {data: 'ranking', start: start, end: end}, function(data){
    renderRanking(data);
  });
}

function renderMe() {
  var user = $('#user');
  user.find('#photo').attr('src',friendCache.me.picture.data.url);
}

function renderFriends() {
  var list = $('.scrollable_list');
  list.children().remove('.item');
  var template = list.find('.template'); 
  for( var i = 0; i < friendCache.friends.length; i++ ) {
    var item = template.clone().removeClass('template').addClass('item');
    item.attr('data-id',friendCache.friends[i].id);
    item.find('.name').html(friendCache.friends[i].name);
    item.find('.profile').attr('src',friendCache.friends[i].picture.data.url);
    list.append(item);
  }
}