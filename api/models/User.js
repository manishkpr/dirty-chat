/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs				:: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	shema: true,

	attributes: {

		login: {
			type: 'string',
			unique: true,
			required: true
		},

		encryptedPassword: {
			type: 'string',
			required: true
		},

		email: {
			type: 'email',
			email: true,
			unique: true,
			required: true
		},

		admin: {
			type: "boolean",
			defaultsTo: false
		},

		birthDate: {
			type: 'date',
		},

		sex: {
			model: 'sex'
		},

		country: {
			model: 'country'
		},

		city: {
			model: 'city'
		},

		position: {
			model:'positioning'
		},

		toJSON: function() {
			var obj = this.toObject();
			delete obj.password;
			delete obj.confirm;
			delete obj.encryptedPassword;
			delete obj._csrf;
			return obj;
		}
	},

	beforeCreate: function(values, next) {
		console.log("from CREATE");
			if (!values.password || values.password != values.confirm) {
				return next({err: ["Пароль должен совпадать с подтверждением!"]});
			}

			require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword) {
				if (err) return next(err);
				values.encryptedPassword = encryptedPassword;
				//values.online = true;
				next();
			});
	},

	beforeValidate: function(values, next) {
		var splitDate = values.birthDate.split('.');
		values.birthDate = new Date(splitDate[2], splitDate[1] - 1, splitDate[0]);
		next();
	}
};
