var mongoose	=	require("mongoose");

var cartSchema = new mongoose.Schema({
	name:String,
	price:String,
	buyer:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"user"
		},
		username:String
	}
});

module.exports=mongoose.model("Cart",cartSchema);