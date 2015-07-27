$(document).ready(function() {
	var bd = $('#dp').datepicker().on('changeDate', function(ev) {
		var dt = new Date(ev.date);
		//bd.datepicker("setValue", dt);
		bd.setValue(dt);
		//$("input[name='birthDate']").val(dt);
	}).data("datepicker");

	if($('form').is('#sign-up-form')) {
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
	}



	if($('button').is('#send-message'))	{
		$('#send-message').click(function(){
		var msg = $('#input-message').val();
		$('#input-message').val('');
		if (msg && msg !=='')
			$('#messages').append('<blockquote><p>'+msg+'</p><small>Ромачка<small></div></div>');
	});}

	// var csrf;
	// $.get('/csrfToken').done(function (resp) {
	// 	csrf = resp._csrf;
	// });

	// setTimeout(function(){
	// 	if ($('select').is('#city')){
	// 		console.log(csrf);
	// 		$.post('/city/index', {_csrf: csrf })
	// 		.done(function(resp){
	// 			$('#city').empty();
	// 			console.log(resp.cities);

	// 			$.each(resp.cities, function(i, city){
	// 				$('#city').append('<option value="' + city.id + '"> ' +city.name + '</option>');
	// 			});	
	// 		})
	// 		.fail(function() {
	// 			alert("error");
	// 		});
	// 	}
	// 	}, 0	
	// );
	

	var socket = io.sails.connect();

	socket.on('connect', function socketConnected(message) {
		// $('#chatAudio')[0].play();
		socket.on('user', function messageRecieved(message) {
			var userId = message.id;
			updateUserInDom(userId, message);
		});

		socket.get('/user/subscribe');
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
};

var UserIndexPage = {
	updateUser: function(id, message) {
		var $userRow = $('tr[data-id="' + id +'"] td i').first();
		if (message.data.loggedIn) {
			$userRow.removeClass('fa-sign-out');
			$userRow.addClass('fa-sign-in');
		} else {
			$userRow.removeClass('fa-sign-in');
			$userRow.addClass('fa-sign-out');
		}
	}
};