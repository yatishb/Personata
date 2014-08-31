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

  $('#share').click(function () {
    console.log("come in to share");
    var chart = $('#monthly-container').highcharts(),
    svg = chart.getSVG();

    var canvas = document.createElement( "canvas" );
    var ctx = canvas.getContext( "2d" );
    var img = document.createElement( "img" );
    img.setAttribute( "src", "data:image/svg+xml;base64," + btoa(svg));
    ctx.canvas.width  = img.width;
    ctx.canvas.height = img.height;
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
      var photo = canvas.toDataURL();
      // window.open( canvas.toDataURL( "image/png" ) );
      console.log("come to call share to facebook function");
      $.ajax({
        type: "POST",
        url: "saveImage.php",
        data: {
          uid: friendCache.me.id,
          imgBase64: photo
        }
      }).done(function(o) {
        console.log(o);
        FBSharePhoto();
        // If you want the file to be visible in the browser 
        // - please modify the callback in javascript. All you
        // need is to return the url to the file, you just saved 
        // and than put the image in your browser.
      });
    };
  });
});

function FBSharePhoto(){
  FB.ui(
    {
      method: 'feed',
      name: 'Facebook Dialogs',
      link: 'http://54.254.165.1/dev/',
      picture: 'http://54.254.165.1/dev/img/' + friendCache.me.id + '.png',
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