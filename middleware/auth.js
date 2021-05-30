exports.authCheck = (req, res, next) => {

  if (req.session.idUser) {
    next();
  } else {
    res.redirect("/login");
  }

}