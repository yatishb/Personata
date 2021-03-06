var currentView;
var currentUser;
var dataType;
var rankingBuffer = new Array();
var postsBuffer = new Array();

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

  /* button for sharing */
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

  /* button for viewing friends */
  $("#view-friends-button").popover({
    html : true, 
    content: function() {
      return $('#view-friends-content').html();
    },
    title: function() {
      return $('#view-friends-title').html();
    },
    placement: 'left',
    container: 'body'
  });

  /* button for logout */
  $('.logout').click(function() {
    console.log('in here');
    FB.logout(function(response) {
     var userInfo = document.getElementById('user-info');
   });
    $.ajax({
     url: '/dev/logout.php',
     success: function () {}	
   });
    window.location = "/dev/login.html";
  });

  /* loading indicator */
  $body = $("body");
  $(document).ajaxStart(function () {
    $body.addClass("loading");
  });

  $(document).ajaxComplete(function () {
    $body.removeClass("loading");
  });

  /* dismiss friends list view when clicking outside */
  $('html').on('click', function(e) {
    if (typeof $(e.target).data('original-title') == 'undefined') {
      $('[data-original-title]').popover('hide');
    }
  });

});

function switchView(view) {
  $('#share').show();

  /* update sub page info */
  if (view == '.front-page') {
    $('#default-info').html("is an app created for you to view and evaluate your facebook usage. You could know your monthly comments, likes and posts, view your friends' as well as share and invite them to use the app.");
  } else if (view == '.monthly-data') {
    $('#default-info').html('This allows you to see your monthly usage of Facebook — How many posts, likes and comments do you have for a consecutive two months? Have you noticed an outstanding date?');
  } else if (view == '.daily-data') {
    $('#default-info').html('Come and observe your daily routine of Facebook usage — Which is your peak period of posting? Which type of post is your favorite accumulatively?');
  } else if (view == '.events-data') {
    $('#default-info').html('What events have you had for the past 30 days? Can you still remember all of them? Let us help you arrange them, and see which day was on fire!');
  } else if (view == '.ranking-data') {
    $('#default-info').html('You could see the top-listed posts from yourself, ranked according to the amount of likes and comments you had from your friends — Come and find out what they’ve liked you for.');
    $('#share').hide();
  }

  $('.view').hide();
  $(view).show();
  var temp = view.split("-");
  currentView = '#' + temp[0].substring(1) + '-container';
}

function renderRanking(name, type, index, like, data){
  var time = data.created_time;
  var link = data.actions[0].link;
  var message = '';
  
  /* display ranking-data */
  $('#'+index).show();

  if (data.message) {
    message = data.message;
    $('#'+index+' .message').html(message);
  } else {
    $('#'+index+' .message').html(message);
  }
  $('#ranking-title').html(type+ ' - '+name);
  $('#like-ranking-'+index).html(like+' likes');
  $("#read-more-"+index).attr("href", link);
}

function getRankingData(uid, name, type){
  var d = new Date();
  var start = d.getFullYear() + '-' + pad(d.getMonth()) + '-01';
  var end = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-31';

  /* make ranking-data as display:none */
  for (var i = 0; i < 8; i++) {
    $('#'+i).hide();
  };

  if (rankingBuffer[uid]) {
    var tempData = rankingBuffer[uid];

    for (var i = 0; i < tempData.length; i++) {
      getPost(name, type, tempData[i].id, tempData[i].likes, i, renderRanking);
    };
  } else {
    $.getJSON('backend.php', {data: 'ranking', start: start, end: end, uid: uid}, function(data){
      rankingBuffer[uid] = data;
      for (var i = 0; i < data.length; i++) {
        getPost(name, type, data[i].id, data[i].likes, i, renderRanking);
      };
    });
  }
}

function getPost(name, type, id, like, index, callback){
  if (postsBuffer[id]) {
      callback(name, type, index, like, postsBuffer[id]);
  } else {
    FB.api(
      "/"+id+"?fields=message,type,actions,created_time",
      function (response) {
        if (response && !response.error) {
          postsBuffer[id] = response;
          callback(name, type, index, like, response);
        }
      }
    );
  }
}

function renderMe() {
  var user = $('#user');
  user.find('#name').html(friendCache.me.first_name);
  user.find('#photo').attr('src',friendCache.me.picture.data.url);
}

function renderFriendsList() {
  var list = $('#view-friends-content');
  var template = $('.template');
  for( var i = 0; i < friendCache.friends.length; i++ ) {
    var item = template.clone().removeClass('template').addClass('friend');
    item.attr('data-id',friendCache.friends[i].id);
    item.attr('data-name', friendCache.friends[i].first_name);
    item.find('.profile').attr('src',friendCache.friends[i].picture.data.url);
    list.append(item);
  }
}

function updateDataType (type) {
  dataType = type;
}

function renderFriendsGraph(param) {
  var uid = $(param).attr('data-id');
  var name = $(param).attr('data-name');
  if (dataType == 'monthly-post') {
    renderMonthPostGraph(uid, name, 'Monthly Posts');
  } else if (dataType == 'monthly-like') {
    renderMonthLikeGraph(uid, name, 'Monthly Likes');
  } else if (dataType == 'monthly-comment') {
    renderMonthCommentGraph(uid, name, 'Monthly Comments');
  } else if (dataType == 'post-type') {
    renderDailyDataGraph(uid, name, 'Post Type Composition');
  } else if (dataType == 'active-time') {
    renderActiveDistribution(uid, name, 'Daily Active Time');
  } else if (dataType == 'event') {
    processEventGraph(uid, name, 'Events For Past 30 Days');
  } else if (dataType == 'ranking') {
    getRankingData(uid, name, 'Top Liked Posts');
  } else {

  }
}
