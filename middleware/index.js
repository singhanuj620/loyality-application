var middlewareobj={};

//checking whether user is logged in or not ?
middlewareobj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		//req.flash("error","Please Login First !!");
		res.redirect("/login");
	}
}

module.exports=middlewareobj