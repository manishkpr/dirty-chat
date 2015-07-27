/**
 * CountryController
 *
 * @description :: Server-side logic for managing countries
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
		var countryObj = {
			name: req.param('name')
		};

		if (!req.session.User.admin) {
			return res.forbidden();
		}

		Country.create(countryObj).exec(function countryCreated(err, country) {
			if (err) {
				console.log(err);
				req.session.flash = {
					err: err
				};

				return res.redirect('/country/new');
			}

			res.redirect('/country/index/');
		});
	},

	index: function(req, res, next) {
		Country.find().exec( function findCountries(err, countries){
			if (err) return next(err);

			res.view({ countries: countries });
		});
	},

	edit: function(req, res, next) {

		Country.findOne(req.param('id'), function foundcountry(err, country) {
			if (err) return next(err);
			if(!country) return next('Страна не найдена');

			res.view({
				country: country
			});
		});
	}
};

