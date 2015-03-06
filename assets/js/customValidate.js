$(document).ready(function() {
	$('#sign-up-form').validate({
		rules: {
			login: {
				required: true
			},
			email: {
				required: true,
				email: true
			},
			password: {
				minlength: 6,
				required: true
			},
			confirm: {
				minlength: 6,
				equalTo: "#password"
			}
		},

		success: function(element) {
			element.text('OK!').addClass('valid');
		}
	});

	$('#birthDate').datepicker();

	$('send-message').click(functuin() {
		$('#messages').append('<div class="col-md-6">'+ '<div = class="popover left">'+'<div class="arrow">'+'<h3 class="popover-title"> Ромачка </h3>'+ '<div class="popover-content">' + $("#input-message").val() +
					'</div><div></div>'
		);
	});

	var socket = io.sails.connect();

	socket.on('connect', function socketConnected(message) {
		console.log('I connected');
		 // $('#chatAudio')[0].play();
		socket.on('user', function messageRecieved(message) {
			var userId = message.id;
			updateUserInDom(userId, message);
		});

		var resp = socket.get('/user/subscribe');
	});
});

function updateUserInDom(id, msg) {
	var page = document.location.pathname;
	page = page.replace(/(\/)$/, '');

	console.log('updateUserInDom');
	switch (page) {
		case '/user':
			if (msg.verb === 'updated') {
				UserIndexPage.updateUser(id, msg);
			}
			break;
	}
}

var UserIndexPage = {
	updateUser: function(id, message) {
		var $userRow = $('tr[data-id="' + id +'"] td i').first();
		if (message.data.loggedIn) {
			//var $userRow = $('tr[data-id="' + id +'"] td i').first();
			$userRow.removeClass('fa-sign-out');
			$userRow.addClass('fa-sign-in');
			console.log('Зашел');
		} else {
			//$userRow.switchClass('fa-sign-in', 'fa-sign-out', 500, 'easeInOutQuad');
			$userRow.removeClass('fa-sign-in');
			$userRow.addClass('fa-sign-out');
			console.log('Вышел');
		}
	}
};
