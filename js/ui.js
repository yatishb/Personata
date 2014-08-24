function renderWelcome() {
  var welcome = $('#personal_info');
  welcome.find('.name').html(friendCache.me.name);
  welcome.find('.photo').attr('src',friendCache.me.picture.data.url);
}

function renderFriends() {
  var list = $('.scrollable_list');
  list.children().remove('.item');
  var template = list.find('.template');
  // console.log("TEST " + friendCache.friends.length);
  for( var i = 0; i < friendCache.friends.length; i++ ) {
    var item = template.clone().removeClass('template').addClass('item');
    item.attr('data-id',friendCache.friends[i].id);
    item.find('.name').html(friendCache.friends[i].name);
    item.find('.profile').attr('src',friendCache.friends[i].picture.data.url);
    list.append(item);
  }
}