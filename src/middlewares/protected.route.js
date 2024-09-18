export function isAuth(req, res, next){
  if(req.session.user)
    return next()
  else
    return res.redirect("/login")
}

export function isLog(req, res, next){
  if(!req.session.user)
    return next()
  else
    return res.redirect("/perfil")
}

