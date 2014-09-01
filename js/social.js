var friendCache = {};

function onStatusChange(response) {
  if( response.status == 'connected' ) {
    switchView('#front-page'); 
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

function FBSharePhoto(url){
  FB.ui(
    {
      method: 'feed',
      name: 'Facebook Dialogs',
      link: 'http://54.254.165.1/dev/',
      picture: url,//'http://54.254.165.1/dev/images/' + friendCache.me.id + '.png',
      caption: 'Reference Documentation',
      description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
    },
    function(response) {
      if (response && response.post_id) {
        alert('Post was published.');
      } else {
        alert('Post was not published.');
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

