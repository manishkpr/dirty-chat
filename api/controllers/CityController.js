/**
 * CityController
 *
 * @description :: Server-side logic for managing cities
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	new: function(req, res) {
		if (req.session.User.admin) {
			res.view();
		} else {
			res.forbidden();
		}
	},

	create: function(req, res, next) {
		var cityObj = {
			name: req.param('name')
		};

		if (!req.session.User.admin) {
			return res.forbidden();
		}

		City.create(cityObj).exec(function cityCreated(err, city) {
			if (err) {
				console.log(err);
				req.session.flash = {
					err: err
				};

				return res.redirect('/city/new');
			}

			res.redirect('/city/index/');
		});
	},

	index: function(req, res, next) {
		City.find().exec(function findCities(err, cities) {
			if (err) return next(err);

			res.view({ cities: cities });
		});
	},

	edit: function(req, res, next) {

		City.findOne(req.param('id'), function foundCity(err, city) {
			if (err) return next(err);
			if(!city) return next('Город не найден');

			res.view({
				city: city
			});
		});
	}
};
