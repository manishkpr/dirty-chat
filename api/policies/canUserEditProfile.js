module.exports = function(req, res, ok) {
	var sessionUserMatchesId = req.session.User.id === req.param('id');
	var isAdmin = req.session.User.admin;

	if (!(sessionUserMatchesId || isAdmin)) {
		var noRightsError = [{name: 'noRightsError', message: 'Нужны права админа!'}];
		req.session.flash = {
			err: noRightsError
		}
		res.redirect('/session/new');
		return;
	}

	ok();
}
