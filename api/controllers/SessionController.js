/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var bcrypt = require('bcrypt');

module.exports = {
	'new': function(req, res) {
		res.view('session/new');
	},

	create: function(req, res, next) {
		if (!req.param('email') || !req.param('password')) {
			var loginPasswordRequiredError = [{name: 'loginPasswordRequiredError', 
				message: 'Введите логин и пароль!'}];

			req.session.flash = { err: loginPasswordRequiredError }
			res.redirect('session/new');
			return;
		}

		User.findOneByEmail(req.param('email'), function foundUser(err, user) {
			if (err) return next(err);

			if (!user) {
				var noAccountError = [{name: 'noAccount', 
				message: 'Email ' + req.param('email') + 'не найден!'}];

				req.session.flash = { err: noAccountError}
				res.redirect('session/new');
				return;
			}


			bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid) {
				if (err) return next(err);

				if (!valid) {
					var loginPasswordMismatchError = [{ name: 'loginPasswordMismatch',
						message: 'Учетные данные указаны неверно'}];

					req.session.flash = { err: loginPasswordMismatchError }
					res.redirect('session/new');
					return;
				}

				req.session.authenticated = true;
				req.session.User = user;
				res.redirect('/user/show/' + user.id)
			});
		});
	},

	destroy: function(req, res, next) {
		req.session.destroy();
		res.redirect('session/new');
	}
};
