/* LOGIN ROUTE CONTROLLER */
exports.login = (req, res) => {
  if(req.user) {
    res.json({email: req.user.emails[0].value, isLoggedIn: true});
  } else {
    res.json({email: null, isLoggedIn: false});
  }
};

/* LOGOUT ROUTE CONTROLLER */
exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};
