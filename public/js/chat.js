 var socket = io();

function scrollToBottom () {
    var messageslist = jQuery('#messageslist');
    var newMessage = messageslist.children('li:last-child');
    var clientHeight = messageslist.prop('clientHeight');
    var scrollTop = messageslist.prop('scrollTop');
    var scrollHeight = messageslist.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    if(scrollTop + clientHeight + newMessageHeight + lastMessageHeight >= scrollHeight){
        messageslist.scrollTop(scrollHeight);
    }
}
 socket.on('connect',function() {
      var param = jQuery.deparam(window.location.search);
      socket.emit('join',param,function(err){
        if(err){
            window.location.href = '/';
            alert(err);
        }else{
            console.log('no error found');
        }
      });
});
 socket.on('disconnect',function() {
      console.log('disconnected from server');
});

socket.on('updateUserList',function(users){
    var ol = jQuery('<ol></ol>');
    users.forEach(function(user){
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#users').html(ol);
});
 socket.on('newMsg', function(msg) {
     var formattedTime = moment(msg.createdAt).format('h:mm a');
     var template  = jQuery('#message-template').html();
     var html = Mustache.render(template, {
         text: msg.text,
         from: msg.from,
         createAt: formattedTime
    });
    jQuery('#messageslist').append(html);
    scrollToBottom ();
//       var li = jQuery('<li></li>');
//       li.text(`${msg.from} ${formattedTime}: ${msg.text}`);
//       jQuery('#messageslist').append(li)
});

 socket.on('newLocationMsg', function(msg){
    var formattedTime = moment(msg.createdAt).format('h:mm a');
    var template  = jQuery('#location-message-template').html();
     var html = Mustache.render(template, {
         url: msg.url,
         from: msg.from,
         createAt: formattedTime
    });
    jQuery('#messageslist').append(html);
    scrollToBottom ();
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My current Location</a>');
    // li.text(`${msg.from} ${formattedTime}:`);
    // a.attr('href',msg.url);
    // li.append(a);
    // jQuery('#messageslist').append(li);
 });
 
 jQuery('#messageform').on('submit',function(e){
    e.preventDefault();
    var messageTextBox = jQuery('[name=messagebox]');
    socket.emit('createMessages', {
        text: messageTextBox.val()
    }, function(){
        messageTextBox.val('');
    });
 });

 var userlocation = jQuery('#geolocation');
 userlocation.on('click', function(){
     if(!navigator.geolocation){
         return alert('Geolocation not supported by your browser');
     }
     userlocation.attr('disabled','disabled').text('Sending Location...');
     navigator.geolocation.getCurrentPosition(function(position){
         socket.emit('createLocationMessage',{
             longitude: position.coords.longitude,
             latitude: position.coords.latitude
         });
        userlocation.removeAttr('disabled').text('Send Location'); 
     }, function () {
         alert('Unable to fetch geolocation');
         userlocation.removeAttr('disabled').text('Send Location');
     });
 });

 