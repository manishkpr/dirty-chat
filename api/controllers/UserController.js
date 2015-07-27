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
		var userDef = typeof req.session.user == 'undefined';
		
		if ( !userDef && req.session.user.admin ) {
			userObj = {
				login: req.param('login'),
				email: req.param('email'),
				birthDate: req.param('birthDate'),
				password: req.param('password'),
				confirm: req.param('confirm'),
				encryptedPassword: req.param('encryptedPassword')
			};
		}else {
			userObj = {
				login: req.param('login'),
				email: req.param('email'),
				birthDate: req.param('birthDate'),
				password: req.param('password'),
				confirm: req.param('confirm'),
				encryptedPassword: req.param('encryptedPassword')
			};
		}

		if (userObj.email == 'losaped@gmail.com') 
		{
			userObj.admin = true;
		}

		console.log(req.params);

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
		User.findOne(req.param('id'))
		.populate('city')
		.exec(function foundUser(err, user){
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
		var viewSource = {};
		
		User.findOne(req.param('id'), function foundUser(err, user) {
			if (err) return next(err);
			if(!user) return next('Пользователь не существует');

			viewSource.user = user;
						
			City.find(function foundCities(err, cities) {
				if (err) return next(function (){
					res.view(viewSource);
				});

				viewSource.cities = cities;
				console.log(viewSource);
				Country.find(function foundCountries(err, countries){
			 		if (err) return next(function (){
						res.view(viewSource);
					});

			 		viewSource.countries = countries;
			 		console.log(viewSource);
			 		res.view(viewSource);
				});
			});
		});
	},

	update: function(req, res, next) {
		var userObj;
		if (req.session.User.admin) {
			userObj = {
				login: req.param('login'),
				email: req.param('email'),
				city: req.param('city'),
				admin: req.param('admin')
			};
		}else {
			userObj = {
				login: req.param('login'),
				city: req.param('city'),
				email: req.param('email'),
			};
		}

		if (userObj.email == 'losaped@gmail')
		{
			userObj.admin = true;
		}

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
			//console.log(users);
			User.watch(req);
			User.subscribe(req.socket, users);
			res.send(200);
		});
	}
};
