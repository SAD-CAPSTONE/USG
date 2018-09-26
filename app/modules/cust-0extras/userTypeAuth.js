function auth(authTypes, thisType){
  return authTypes.reduce((temp, data)=>{
    return temp = thisType == data ? true : temp
  }, false)
}

module.exports = {
  admin: (req,res,next)=>{
    if (req.user){
      if (auth([1], req.user.intUserTypeNo)) return next()
      else res.redirect('/extras/unAuth')
    }
    else res.redirect('/extras/unAuth')
  },
  cons: (req,res,next)=>{
    if (req.user){
      if (auth([2], req.user.intUserTypeNo)) return next()
      else res.redirect('/extras/unAuth')
    }
    else res.redirect('/extras/unAuth')
  },
  cust: (req,res,next)=>{
    if (req.user){
      if (auth([3], req.user.intUserTypeNo)) return next()
      else res.redirect('/extras/unAuth')
    }
    else res.redirect('/extras/unAuth')
  },
  admin_cons: (req,res,next)=>{
    if (req.user){
      if (auth([1,2], req.user.intUserTypeNo)) return next()
      else res.redirect('/extras/unAuth')
    }
    else res.redirect('/extras/unAuth')
  },
  admin_cust: (req,res,next)=>{
    if (req.user){
      if (auth([1,3], req.user.intUserTypeNo)) return next()
      else res.redirect('/extras/unAuth')
    }
    else res.redirect('/extras/unAuth')
  },
  cons_cust: (req,res,next)=>{
    if (req.user){
      if (auth([2,3], req.user.intUserTypeNo)) return next()
      else res.redirect('/extras/unAuth')
    }
    else res.redirect('/extras/unAuth')
  },
}
