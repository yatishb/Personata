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

function renderRanking(index, like, data){
  var time = data.created_time;
  var link = data.actions[0].link;
  var message = '';
  if (data.message) {
    message = data.message;
    $('.timeline #'+index+' .message').html(message);
  }
  $('#like-ranking-'+index).html(like+' likes');
  $("#read-more-"+index).attr("href", link);
}

function getRankingData(){
  var d = new Date();
  var start = d.getFullYear() + '-' + d.getMonth() + '-01';
  var end = d.getFullYear() + '-' + (d.getMonth() + 1) + '-31';
  $.getJSON('backend.php', {data: 'ranking', start: start, end: end}, function(data){
    for (var i = 0; i < data.length; i++) {
      getPost(data[i].id, data[i].likes, i, renderRanking);
    };
  });
}

function getPost(id, like, index, callback){
  FB.api(
    "/"+id+"?fields=message,type,actions,created_time",
    function (response) {
      if (response && !response.error) {
        callback(index, like, response);
      }
    }
);
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