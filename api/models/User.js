/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

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
		//console.log("i\'m here!");
		if (values.birdDate && _.isNaN(Date.parse(values.birdDate))) {
			console.log(values.birdDate);
			return next({err: ["Дата указана неверно!"]});	
		}

		values.birdDate = Date.parse(values.birdDate);
		next();
	}
};

