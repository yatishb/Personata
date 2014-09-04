var friendCache = {};
var eventCache = {};

function onStatusChange(response) {
  if( response.status == 'connected' ) {
    switchView('.front-page');
    getFriends(function(){
      renderFriendsList();
    });
    getMe(function(){
      getPermissions(function(){
        renderMe();
      });
    });
  }
}

function onAuthResponseChange(response) {
  //console.log('onAuthResponseChange', response);
}

function getMe(callback) {
  FB.api('/me', {fields: 'id,first_name,picture.width(120).height(120)'}, function(response){
    if( !response.error ) {
      friendCache.me = response;
      callback();
    } else {
      console.error('/me', response);
    }
  });
}

function getFriends(callback) {
  FB.api('/me/friends', {fields: 'id,first_name,picture.width(80).height(80)'}, function(response){
    if( !response.error ) {
      friendCache.friends = response.data;
      //console.log(response);
      callback();
    } else {
      console.error('/me/friends', response);
    }
  });
}

function getEvents(uid, name, type, startDate, endDate, callback) {
  FB.api("/"+uid+"/events?fields=id,start_time,end_time&since="+startDate+"&until="+endDate,
    function (response) {
      if (response && !response.error) {
        eventCache.event = response.data;
        callback(constructEventsDataAarray(startDate, endDate), startDate, name, type);
      } else {
        console.log(response);
      }
    }
  );
}

function constructEventsDataAarray(startDate, endDate) {
  data = new initDataArray();

  for (var i = 0; i < eventCache.event.length; i++) {
    startTime = new Date(getDate(eventCache.event[i].start_time));
    endTime = new Date(getDate(eventCache.event[i].end_time));
    temp = new Date(startDate);
    temp.setDate(temp.getDate()-1);
    for (var j = 0; j < 30; j++) {
      temp.setDate(temp.getDate()+1);
      if (startTime >= temp && endTime <= temp) {
        data[j] ++;
      }
    } 
  }

  result = new Array();
  for (var i = 0; i < 30; i++) {
    result.push(new Array(i-Math.floor(i/6)*6, Math.floor(i/6), data[i]));   
  } 

  return result;
}

function initDataArray() {
  data = new Array();
  for (var i = 0; i < 30; i++) {
    data.push(0);
  }

  return data;
}

function getDate(time) {
  return time.substring(0, 10);
}

function getPermissions(callback) {
  FB.api('/me/permissions', function(response){
    if(!response.error) {
      friendCache.permissions = response.data;
      callback();
    } else {
      console.error('/me/permissions', response);
    }
  });
}

function hasPermission(permission) {
  for( var i in friendCache.permissions ) {
    console.log(friendCache.permissions[i].permission);
    if( 
      friendCache.permissions[i].permission == permission 
      && friendCache.permissions[i].status == 'granted' ) 
      return true;
  }
  return false;
}

function getNumberOfLikesOnDay(uid, startTime, endTime, index, callback) {
  var numberOfLikes = 0;

  FB.api(
    "/"+uid+"/posts?fields=likes.limit(1).summary(true)&since="+startTime+"&until="+endTime,
    function (response) {
      if (response && !response.error) {
        for (var i = response.data.length - 1; i >= 0; i--) {
          if (response.data[i].likes) {
            numberOfLikes += response.data[i].likes.summary.total_count;
          }
        };

        callback(numberOfLikes, index);
      }
    }
  );
}

function getNumberOfLikesInMonth(uid, month, callback) {
  var today = new Date();
  month = typeof month !== 'undefined' ? month : today.getMonth()+1;
  var likesInMonth = new Array();
  var countOfCallBacks = 0;
  var number = 0;

  var numberOfDays = new Date(today.getFullYear(), month, 0).getDate();

  for (var i = 1; i < new Date(today.getFullYear(), month, 0).getDate()+1; i++, number++) {
    var startOfDay = new Date(today.getFullYear(), month-1, i);
    var endOfDay = new Date(today.getFullYear(), month-1, i, 23, 59, 59);

    getNumberOfLikesOnDay(uid, startOfDay.getTime()/1000, endOfDay.getTime()/1000, number, function(likes, index){
      countOfCallBacks++;
      likesInMonth[index] = likes;
      if (countOfCallBacks == numberOfDays) {
        callback(likesInMonth);
      };
    });
  };
}

function getNumberOfCommentsOnDay(uid, startTime, endTime, index, callback) {
  var numberOfComments = 0;

  FB.api(
    "/"+uid+"/posts?fields=comments.limit(1).summary(true)&since="+startTime+"&until="+endTime,
    function (response) {
      if (response && !response.error) {
        for (var i = response.data.length - 1; i >= 0; i--) {
          if (response.data[i].comments) {
            numberOfComments += response.data[i].comments.summary.total_count;
          };
        };

        callback(numberOfComments, index);
      }
    }
  );
}

function getNumberOfCommentsInMonth(uid, month, callback) {
  var today = new Date();
  month = typeof month !== 'undefined' ? month : today.getMonth()+1;
  var commentsInMonth = new Array();
  var countOfCallBacks = 0;
  var number = 0;

  var numberOfDays = new Date(today.getFullYear(), month, 0).getDate();

  for (var i = 1; i < new Date(today.getFullYear(), month, 0).getDate()+1; i++, number++) {
    var startOfDay = new Date(today.getFullYear(), month-1, i);
    var endOfDay = new Date(today.getFullYear(), month-1, i, 23, 59, 59);

    getNumberOfCommentsOnDay(uid, startOfDay.getTime()/1000, endOfDay.getTime()/1000, number, function(comments, index){
      countOfCallBacks++;
      commentsInMonth[index] = comments;
      if (countOfCallBacks == numberOfDays) {
        callback(commentsInMonth);
      };
    });
  };
}


function FBSharePhoto(url){
  FB.ui(
    {
      method: 'feed',
      name: 'Personata',
      link: 'http://54.254.165.1/dev/',
      picture: url,//'http://54.254.165.1/dev/images/' + friendCache.me.id + '.png',
      caption: 'Facebook Usage Analytics',
      description: 'Personata is an app created for you to view and evaluate your facebook usage. You could know your monthly comments, likes and posts, view your friends as well.'
    },
    function(response) {
      if (response && response.post_id) {
        alert('Post was published.');
      }
    }
  );
}

function FBInvite(){
    FB.ui({method:'apprequests',
      message:'Invite your FB friends to Join Personata!'
    },
    function(e){
      
    });
}

