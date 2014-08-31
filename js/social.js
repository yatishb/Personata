var friendCache = {};

function login(callback) {
  FB.login(callback, {scope: 'user_friends, user_status, user_events, read_stream'});
}

function loginCallback(response) {
  console.log('loginCallback',response);
  if(response.status != 'connected') {
    top.location.href = 'https://www.facebook.com/appcenter/personata-app';
  }
}

function onStatusChange(response) {
  if( response.status != 'connected' ) {
    login(loginCallback);
  } else {
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
  FB.api('/me', {fields: 'id,name,picture.width(120).height(120)'}, function(response){
    if( !response.error ) {
      friendCache.me = response;
      callback();
    } else {
      console.error('/me', response);
    }
  });
}

function getFriends(callback) {
  // FB.api('/me/friends', {fields: 'id,name,first_name,picture.width(120).height(120)'}, function(response){
  //   if( !response.error ) {
  //     friendCache.friends = response.data;
  //     console.log(response);
  //     callback();
  //   } else {
  //     console.error('/me/friends', response);
  //   }
  // });
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

