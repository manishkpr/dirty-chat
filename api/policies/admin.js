module.exports = function (req, res, ok) {
	if (req.session.User && req.session.User.admin) {
		return ok();
	}
	else {
		var requireAdminError = [{name: 'requireAdminError', message: 'Необходимы права администратора!'}];
		req.session.flash = {
			err: requireAdminError
		}

		res.redirect('session/new');
	}
};
