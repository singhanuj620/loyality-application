// adding essential npm packages
const 	express 		=	require("express"),
		bodyParser  	=	require("body-parser"),
		mongoose		=	require("mongoose"),
		flash 			=	require("connect-flash"),
		passport		=	require("passport"),
		LocalStrategy 	=	require("passport-local"),
		methodOverride  =	require("method-override"),
		stripe 			= 	require("stripe")("sk_test_y130QZPTp6DTDcXfM1Lhmhk5");


// configuring the packages

var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/loyal");
app.use(require("express-session")({
	secret: "this is a loyality application",
	resave: false,
	saveUninitialized: false
}));
app.use(flash());
app.use(methodOverride("_method"));

var User 	=	require("./models/user");
var Cart 	=	require("./models/cart");
var Product =	require("./models/product");

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});

//adding middelware for routing security
var middleware=require("./middleware");

// adding sedds file
var seedDB=require("./seeds");
seedDB();

//ROUTES

//Landing Page
app.get("/",function(req,res){
	res.render("index");
});

//Login
app.get("/login",function(req,res){
	res.render("login");
});

app.post("/login",passport.authenticate("local",{
	successRedirect:"/",
	failureRedirect:"/login"
}),function(req,res){

});

//Register
app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
	User.register(new User({fullname:req.body.fullname,
							contact:req.body.contact,
							username:req.body.username,
							address:req.body.address,
							state:req.body.state,
							pincode:req.body.pincode,
							image:req.body.image,
							email:req.body.email}),req.body.password,function(err,user){
		if(err){
			res.render("register");
		}
		else{
			passport.authenticate("local")(req,res,function(){
				res.redirect("/");
			});
		}
	});
});

//Logout
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});

//Product Index
app.get("/product",function(req,res){
	Product.find({},function(err,allProduct){
		if(err)
		{
			console.log(err);
		}
		else{
			res.render("productindex",{product:allProduct});
		}
	});
});

//Product Profile Page
app.get("/product/:id",function(req,res){
	Product.findById(req.params.id,function(err,foundProduct){
		if(err)
		{
			console.log(err);
		}
		else{
			res.render("productprofile",{pprofile:foundProduct});
		}
	});
});

//Process to add product in cart collection
app.get("/tocart",middleware.isLoggedIn,function(req,res){
	var tocartt_name=req.query.name;
	var tocartt_price=req.query.price;
	var temp={name:tocartt_name,price:tocartt_price}
	res.render("tocart",{cartdetail:temp});
});

//Adding to Users[Cart] collection
app.get("/profile/:id/mycart",middleware.isLoggedIn,function(req,res){
	User.findById(req.params.id).populate("carts").exec(function(err,users){
		if(err){
			res.redirect("/product");
		}
		else{
			res.render("mycart",{profile:users});
		}
	});
});

app.post("/profile/:id/mycart",middleware.isLoggedIn,function(req,res){
	var t={name:req.body.name,price:req.body.price};
	User.findById(req.params.id,function(err,user){
		if(err){
			res.redirect("/product");
		}
		else{
			Cart.create(t,function(err,cart){
				if(err){
					console.log(err);
				}
				else{
					user.carts.push(cart);
					user.save();
					res.redirect("/profile/" + user._id+"/mycart");
				}
			});
		}
	});
});

//Deleting the items from cart
app.delete("/profile/:id/mycart/:cart_id",middleware.isLoggedIn,function(req,res){
	Cart.findByIdAndRemove(req.params.cart_id,function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.redirect("/profile/"+req.params.id+"/mycart");
		}
	});
});


//Profile Page
app.get("/profile/:id",middleware.isLoggedIn,function(req,res){
	User.findById(req.params.id,function(err,foundUser){
		if(err)
		{
			console.log(err);
		}
		else{
			res.render("profile",{profile:foundUser});
		}
	});
});

//Stripe Api
app.post("/profile/:id/success",middleware.isLoggedIn,function(req,res){
	const amount=50;
	stripe.customers.create({
		email:req.body.stripeEmail,
		source:req.body.stripeToken
	})
	.then(customer=>stripe.charges.create({
		amount,
		description:"Products Checkout",
		currency:'usd',
		customer:customer.id
	}))
	.then(charge=>res.redirect("/profile/"+req.params.id+"/success"));
});

app.get("/profile/:id/success",middleware.isLoggedIn,function(req,res){
	User.findById(req.params.id).populate("carts").exec(function(err,users){
		if(err){
			res.redirect("/login");
		}
		else{
			res.render("success",{invoice:users});
		}
	});
});

//Updating user profile
app.get("/profile/:id/edit",middleware.isLoggedIn,function(req,res){
	User.findById(req.params.id,function(err,foundUser){
		res.render("edituser",{user:foundUser});
	});
});

app.put("/profile/:id",middleware.isLoggedIn,function(req,res){
	User.findByIdAndUpdate(req.params.id,req.body.user,function(err,updateUser){
		if(err){
			res.redirect("/profile");
		}
		else{
			res.redirect("/profile/"+req.params.id);
		}
	})
});


//Page Not Found Route
app.get("*",function(req,res){
	res.render("error");
});

// Server Starting
var port = process.env.PORT || 3000
app.listen(port,()=>{
	console.log("Loyality Application has been started !");
});