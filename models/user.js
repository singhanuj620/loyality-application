var mongoose				=	require("mongoose");
var passportLocalMongoose	=	require("passport-local-mongoose");

var UserSchema	=	new mongoose.Schema({
			fullname:String,
			image:String,
			email:String,
			username:String,
			contact:String,
			password:String,
			address:String,
			state:String,
			pincode:String,
			carts:[{
				type:mongoose.Schema.Types.ObjectId,
				ref:"Cart"
			}]
});

UserSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",UserSchema);