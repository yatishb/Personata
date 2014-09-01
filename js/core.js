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

  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      switchView('#front-page');
    } else {
      switchView('#login-page');
    }
 });
	
  $('#fb-login').click(function(){
    login(loginCallback);
  });

  $('#share').click(function () {
      var obj = {}, chart;
          
      chart = $('#monthly-container').highcharts();
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
});

function switchView(view) {
  if (view == '#front-page') {
    $('#login-page').hide();
    $('#main').show();
    $('.view').hide();
    $(view).show();
    
  } else if (view == '#login-page') {
    $('#main').hide();
    $('#login-page').show();
  } else {
    $('.view').hide();
    $(view).show();
  }
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