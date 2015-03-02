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

			req.session.flash = { err: loginPasswordRequiredError };
			res.redirect('session/new');
			return;
		}

		User.findOneByEmail(req.param('email'), function foundUser(err, user) {
			if (err) return next(err);

			if (!user) {
				var noAccountError = [{name: 'noAccount',
				message: 'Email ' + req.param('email') + 'не найден!'}];

				req.session.flash = { err: noAccountError};
				res.redirect('session/new');
				return;
			}

			//console.log('Нашли пользователя');
			bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid) {
				if (err) return next(err);

				if (!valid) {
					var loginPasswordMismatchError = [{ name: 'loginPasswordMismatch',
						message: 'Учетные данные указаны неверно'}];

					req.session.flash = { err: loginPasswordMismatchError };
					res.redirect('session/new');
					return;
				}

				req.session.authenticated = true;
				req.session.User = user;

				user.online = true;
				user.save(function (err, user) {
					if (err) return next(err);

					//Inform other sockets that this user is now logged in

					User.publishUpdate(user.id, {
						loggedIn: true,
						id: user.id});

					if (req.session.User.admin) {
						res.redirect('/user');
						return;
					}

					res.redirect('/user/show/' + user.id);
				});
			});
		});
	},

	destroy: function(req, res, next) {
		User.update(req.session.user, {online: false}, function (err) {
			if (err) return next(err);

			req.session.destroy();
			res.redirect('session/new');
		});
	}
};
