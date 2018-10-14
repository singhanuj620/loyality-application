var mongoose	=	require("mongoose");

var productSchema = new mongoose.Schema({
	name:String,
	image:String,
	category:String,
	brand:String,
	warrenty:String,
	price:String
});

module.exports=mongoose.model("Product",productSchema);