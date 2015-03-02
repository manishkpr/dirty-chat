setTimeout(function (io) {
 	var socket = io.connect();
 	if (typeof console !== 'undefined') {
 		log('Connecting to Sails.js...');
 	}

 	socket.on('connect', function socketConnected() {
 		console.log('I connected');
 		// $('#chatAudio')[0].play();
 		socket.on('message', function messageRecieved(message){
 			console.log('message recieved');
 		});
 	});

 	socket.get('/user/subscribe');
 }, 0);
