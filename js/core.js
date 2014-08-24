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
});