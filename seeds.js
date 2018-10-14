var mongoose 	= 	require("mongoose"),
	User 		=	require("./models/user"),
	Product		=	require("./models/product");
	Cart 		=	require("./models/cart");

var data=[
	{name:"Oppo Realme 2",
	 image:"https://static.digit.in/default/2bd0c7c9514ad1c5f0f133afd03cbf4c5ae2f757.jpeg",
	 category:"Mobile Phone",
	 brand:"Oppo",
	 warrenty:"3 year",
	 price:"10990"
	},
	{name:"Huawei Honor Play 6GB",
	 image:"https://static.digit.in/default/4f2588a7b4e6bba52ae133a5609a4550d83f4987.jpeg",
	 category:"Mobile Phone",
	 brand:"Huawei",
	 warrenty:"3 year",
	 price:"23999"
	},
	{name:"Canon PowerShot G1X",
	 image:"https://static.digit.in/default/artImg198x166_9479.jpg",
	 category:"Camera",
	 brand:"Canon",
	 warrenty:"7 year",
	 price:"47995"
	},
	{name:"Acer Swift 3 SF315-41-R8PP",
	 image:"https://static.digit.in/default/1a096c74c71e2cdb8ce0fde7b1fe94113c02e498.jpeg",
	 category:"Laptop",
	 brand:"Acer",
	 warrenty:"4 year",
	 price:"42990"
	},
	{name:"Lenovo Yoga 730 (13IKB)",
	 image:"https://static.digit.in/default/74aca9660d20107ee891556f01ea0a1b8bab2e15.jpeg",
	 category:"Laptop",
	 brand:"Lenovo",
	 warrenty:"3 year",
	 price:"114990"
	},
	{name:"Redmi Y2 64GB",
	 image:"https://images-eu.ssl-images-amazon.com/images/G/31/img18/Wireless/Wave1/MI/Redmiy232GB/D6319129_Wave1_RedmiY264GB_Hindi_dashboard_260x260._CB482944767_SY260_.jpg",
	 category:"Mobile Phone",
	 brand:"Xiaomi",
	 warrenty:"4 year",
	 price:"10999"
	},
	{name:"Dell XPS 13 9370",
	 image:"https://static.digit.in/default/81cebdb3dde9ddce404ace83ee147af9d1eca1f4.jpeg",
	 category:"Laptop",
	 brand:"Dell",
	 warrenty:"3 year",
	 price:"155990"
	},
	{name:"Fujifilm X100S",
	 image:"https://static.digit.in/default/artImg198x166_14381.jpg",
	 category:"Camera",
	 brand:"Fujifilm",
	 warrenty:"8 year",
	 price:"74999"
	}
];

function seedDB(){
	Product.remove({},function(err){
		if(err)
		{
			console.log(err);
		}
		console.log("All Products Deleted from Database");
		data.forEach(function(seed){
			Product.create(seed,function(err,product){
				if(err)
				{
					console.log(err);
				}
				else{
					console.log("Product Added");
				}
			});
		});
	});
};

module.exports = seedDB;