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
});
