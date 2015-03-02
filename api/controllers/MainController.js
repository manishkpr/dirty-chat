/**
 * MainController
 *
 * @description :: Server-side logic for managing mains
 * @help		:: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {



  /**
   * `MainController.index()`
   */
	index: function(req, res, next) {
		if (!req.session.authenticated) {
			res.redirect('/session/new');
		} else {
			res.redirect('/chat/index');
		}
	}
};
