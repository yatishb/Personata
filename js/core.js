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

  FB.Canvas.setSize();

	$('.ignore-default').click(function(e){
		e.preventDefault();
	});

	switchView('#front-page');
});

function FBInvite(){
    FB.ui({method:'apprequests',
      message:'Invite your FB friends to Join Personata!'
    },
    function(e){
      // if(e){
      //  dialog('<h2>Successfully Invited</h2><p>Thank you very very much.</p>',!0)
      // }else{
      //  dialog('<h2>Error</h2><p>Failed To Invite Persons</p>',!0)
      // }
    })
}

function switchView(view) {
  $('.view').hide();
  $(view).show();
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