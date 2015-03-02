/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {



  /**
   * `ChatController.index()`
   */
  index: function (req, res, next) {
    User.find({online: true}, function (err, users) {
		if (err) return next(err);

		res.view({users: users});
	});
  }
};
