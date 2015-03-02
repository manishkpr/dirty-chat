/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new': function (req, res) {
		res.view();
	},

	create: function (req, res, next) {
		var userObj;
		if (req.session.user.admin) {
			userObj = {
				login: req.param('login'),
				email: req.param('email'),
				admin: req.param('admin'),
				encryptedPassword: req.param('encryptedPassword')
			};
		}else {
			userObj = {
				login: req.param('login'),
				email: req.param('email'),
				encryptedPassword: req.param('encryptedPassword')
			};
		}

		User.create(userObj, function userCreated (err, user) {
			if (err) {
				console.log(err);
				req.session.flash = {
					err: err
				};

				return res.redirect('/user/new');
			}

			//User login
			req.session.authenticated = true;
			req.session.User = user;

			// Change online status
			user.online = true;
			user.save(function (err, user) {
				if (err) return next(err);

				res.redirect('/user/show/' + user.id);
			});
		});
	},

	show: function(req, res, next) {
		User.findOne(req.param('id'), function foundUser(err, user){
			if (err) return next(err);
			if (!user) return next();

			res.view({
				user: user
			});
		});
	},

	index: function(req, res, next) {
		User.find(function foundUsers(err, users) {
			if (err) return next(err);

			res.view({
				users: users
			});
		});
	},

	edit: function(req, res, next) {

		User.findOne(req.param('id'), function foundUser(err, user) {
			if (err) return next(err);
			if(!user) return next('Пользователь не существует');

			res.view({
				user: user
			});
		});
	},

	update: function(req, res, next) {
		var userObj;
		if (req.session.user.admin) {
			userObj = {
				login: req.param('login'),
				email: req.param('email'),
				admin: req.param('admin')
			};
		}else {
			userObj = {
				login: req.param('login'),
				email: req.param('email')
			};
		};


		User.update(req.param('id'), userObj, function userUpdated(err) {
			if (err) {
				req.session.flash = {
					err: err
				};

				res.redirect('/user/edit/' + req.param('id'));
			}
			else
				res.redirect('/user/show/' + req.param('id'));
		});
	},

	destroy: function(req, res, next) {
		User.findOne(req.param('id'), function foundUser(err, user) {
			if (err)
				return next(err);
			else if(!user)
				return next('Пользователь не существует');
			else {
				User.destroy(req.param('id'), function userDestroyed(err) {
					if (err) return next(err);
				});

				res.redirect('/user');
			}
		});
	},

	subscribe: function(req, res) {
		User.find(function foundUsers(err,users){
			if (err) return next(err);

			User.subscribe(req.socket);
			User.subscribe(req.socket, users);
			res.send(200);
		});
	}
};
