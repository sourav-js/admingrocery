require("dotenv").config();
var express				=require("express"),
	app                 =express(),
passport 				=require("passport"),
passportlocal 			=require("passport-local"),
passportlocalmongoose  	=require("passport-local-mongoose"),
method					=require("method-override"),
mongoose 	            =require("mongoose"),
body                    =require("body-parser"),
session                 =require("express-session"),
method                  =require("method-override"),
https = require("https"),
qs = require("querystring"),

pdf = require('pdf-parse'),
pdf2base64 = require('image-to-base64'),

flash                   =require("connect-flash"),
// flashs                  =require("express-flash"),
nodemailer              =require("nodemailer"),
 upload                 =require("express-fileupload"),
path					=require("path"),
fs                      =require("fs"),

// fetch					=require("node-fetch"),			
request                 =require("request"),
cheerio                 =require("cheerio"),
checksum_lib            =require("./Paytm/checksum"),
Razorpay                =require("razorpay"),
crypto                  = require("crypto"),
cron                    =require("node-cron"),
config                  =require("./Paytm/config"),
secret_key="sk_test_51HYDa6DEQHowOc9K5x2DAfrJ2a2hDQn4NbzTg0TdIfw4put9bnK8D4Lz3MESPLuKzMBbWmwOI76qm3up59H9t9Y500VIrk1GAI",
public_key="pk_test_51HYDa6DEQHowOc9KWUatQJTsMzgOTdRLgxsglppcuXrLpaXH6ZAeewv2MCn0ZpdD08e3YH2mUZMFrJs6BQTnc6AX00FsXjmk2E",
stripe=require("stripe")(secret_key),

port=process.env.PORT || 3005;

path.parse("D:/Backup/web-server/shop/public");
mongoose.connect("mongodb+srv://admin:29JUdssYvwFmOpKA@mongodb-tutorial.wvkvs.mongodb.net/alladmin?retryWrites=true&w=majority");
var marker="cant"
app.use(method("_method"));
app.use( body.json({limit: '100mb'}) );
app.use(body.urlencoded({
  limit: '100mb',
  extended: true,
  parameterLimit:100000
}));
// app.use(body.urlencoded({extended:true}));
// app.use(body.json()); 

app.use(express.json());

app.use(upload());
app.use(flash());
// app.use(flashs());

app.use(express.static("./public"));
var MongoStore=require("connect-mongo"); 



// var mongostore = MongoStore.create({
//     mongooseConnection:mongoose.connection,
//     collection:"sessions"
// });
app.use(session({
	secret:"Grocery",
	resave:false,
	saveUninitialized:false,
	store:MongoStore.create({
    mongoUrl: 'mongodb+srv://admin:29JUdssYvwFmOpKA@mongodb-tutorial.wvkvs.mongodb.net/alladmin?retryWrites=true&w=majority',
     // time period in seconds
    collection:"sessions"
  }),
    //new mongoDbStore({ mongooseConnection:mongoose.connection,collection:"sessions"}),
	cookie:{maxAge:1800*600*100}
}));
app.use(passport.initialize());
app.use(passport.session());
let instance = new Razorpay({
  key_id: 'rzp_test_fEiizHFA6gj75D', // your `KEY_ID`
  key_secret: 'S7HnMrnoaUOMcqqgQTTSt4mf' // your `KEY_SECRET`
});
 var cartSchema=new mongoose.Schema({
	Name:String,
	image:String,
	Price:Number,
	offer:Number,
	key:String,
	pid:String,
 	ratings:String,
    off:String,
    qty:Number,
    urls:String,
    leters:String,
    author:String,
    mainuser:String,
    size:String

})
 var carts=mongoose.model("carts",cartSchema)
var stockCSchema=new mongoose.Schema({
    Name:String,
    image:String,
    Price:Number,
    offer:Number,
    key:String,
    pid:String,
    ratings:String,
    off:String,
    qty:Number,
    urls:String,
    leters:String,
    author:String,
    mainuser:String

})
 var stockC=mongoose.model("stockC",stockCSchema)
var wishSchema=new mongoose.Schema({
	Name:String,
	image:String,
	Price:Number,
	offer:Number,
	key:String,
	pid:String,
 	ratings:String,
    off:String,
    qty:Number,
    username:String,
    urls:String,  
    leters:String

})
 var wishlist=mongoose.model("wish",wishSchema)



var popSchema=new mongoose.Schema({

    id:String,
    text:String,
    image:String,
    urls:String,
    api:String,
    view:String
})



var pop=mongoose.model("pop",popSchema)


var selectSchema=new mongoose.Schema({

    id:String,
    date:{type:Date,default:Date.now()}    
})



var selects=mongoose.model("selects",selectSchema)

var suggSchema=new mongoose.Schema({

    Name:String,
    image:String,
    urls:String,
    Price:Number,
    offer:Number,
    pid:String,
    uid:String,

    date:{type:Date,default:Date.now()}    
})



var sugg=mongoose.model("sugg",suggSchema)



var stockSchema=new mongoose.Schema({
	id:String,
	

})
 


 var stocks=mongoose.model("stocks",stockSchema)

var notiSchema=new mongoose.Schema({
	username:String,
	

})
 


 var noti=mongoose.model("noti",notiSchema)
var categorySchema=new mongoose.Schema({
 
  Name:String,
  id:String,
  quan:Number,
  image:String,


})	


var categ=mongoose.model("categ",categorySchema)

var oneSchema=new mongoose.Schema({
 
  id:String


})  


var one=mongoose.model("one",oneSchema)
var tokenSchema=new mongoose.Schema({
 
  code:String


})  


var token=mongoose.model("token",tokenSchema)
var twoSchema=new mongoose.Schema({
 
  id:String


})  


var two=mongoose.model("two",twoSchema)

var productSchema=new mongoose.Schema({
	Name:String,
	image:String,
	imagesec:String,
	urls:String,
	Price:Number,
	offer:Number,
	key:String,
	off:String,
	ratings:String,
    leters:String,
    empty:Boolean,
    emptyOne:Boolean,
    emptyTwo:Boolean,

    stocking:Number,
    totalOne:Number,
    totalTwo:Number,

     
        datetwo:{type:Date,default:Date.now},


    date:{type:Date,default:Date.now},
	ones:[{
           

           type: mongoose.Schema.Types.ObjectId,
            ref:"one"

    }],
    
twos:[{
           

           type: mongoose.Schema.Types.ObjectId,
            ref:"two"

    }],
    stock:[
          {

          	type: mongoose.Schema.Types.ObjectId,
			ref:"stocks"
          }
	],

    
   notify:[
       {
            type: mongoose.Schema.Types.ObjectId,
			ref:"noti"      
       }
   ]
})
 


 var product=mongoose.model("product",productSchema)
 var orderSchema=new mongoose.Schema({
	 
   first:String,
   image:String,
   locality:String,
   last:String,
   name:String,
   city:String,
   phone:Number,
   roadNumber:String,
   landmark:String,
   productD:String,
   Price:Number,
   qty:Number,
   pid:String,
   returnId:String,
   returnQ:Number,
   pay:String,
   ifsc:String,
   account:String,
   mainuser:String,
   cartId:String,
   date:{type:Date,default:Date.now},
   cDate:{type:Date,default:Date.now},
   ordered:String,
   dateone:{type:Date,default:Date.now},
   shipped:String,
   datetwo:{type:Date,default:Date.now},
   outfor:String,
   datethree:{type:Date,default:Date.now},
   update:String,
   datefour:{type:Date,default:Date.now},
   autoCancel:Boolean,
   lid:String,  
   urls:String,
   leters:String,
   author:{
   	username:String,
   	id:String
   },
   month:String,
   size:String




})
 


 var order=mongoose.model("order",orderSchema)
 var locationSchema=new mongoose.Schema({
	 
   first:String,
   image:String,
   locality:String,
   last:String,
   name:String,
   city:String,
   phone:Number,
   roadNumber:String,
   landmark:String,
   productD:String,
   Price:Number,
   qty:Number,
   pid:String,
   returnId:String,
   returnQ:Number,
   pay:String,
   ifsc:String,
   account:String,
   mainuser:String,
   cartId:String,
   date:{type:Date,default:Date.now},
   cDate:{type:Date,default:Date.now},
   ordered:String,
   dateone:{type:Date,default:Date.now},
   shipped:String,
   datetwo:{type:Date,default:Date.now},
   outfor:String,
   datethree:{type:Date,default:Date.now},
   update:String,
   datefour:{type:Date,default:Date.now},
   autoCancel:Boolean,  
   oid:String,


   author:{
   	username:String,
   	id:String
   }




})
 


 var location=mongoose.model("location",locationSchema)
 var coproductSchema=new mongoose.Schema({
	image:String,
	Price:Number,
	offer:Number,
	key:String,
	pid:String,
	ratings:String


})
 


var userSchema=new mongoose.Schema({
    first:String,
    last:String,
        email:String,

    username:String,
    passsword:String,
    name:String,
    notinum:Number,
    sum:Number,
    month:String,
    offerHold:Boolean,
    phone:Number,
    image:String,
    imagerear:String,
    token:String,
    approval:Boolean,
    locality:String,
    city:String,
    road:Number,
    age:Number,
    date:{type:Date,default:Date.now}
     
    
    
});



 var coproduct=mongoose.model("coproduct",coproductSchema)
 // var checksum_lib = require('./checksum.js'),
 userSchema.plugin(passportlocalmongoose)
 var user=mongoose.model("user",userSchema)
passport.use(new passportlocal(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
 
   


    res.locals.error=req.flash("error")
	res.locals.success=req.flash("success")
  if(req.user){
    res.locals.currentUser=req.user
   }
    else {
       res.locals.currentUser=""
  }
    
    next()
})
app.get("/time",function(req,res){

    var dates=new Date()
    res.send(dates.toString())
})


cron.schedule("*/5 * * * *",function(){

    request("https://grocery-ji.herokuapp.com/autoremove",function(error,response,data){


    })
})

app.get("/autoremove",function(req,res){

     console.log("autoremove hitting")
     user.find({},function(err,users){

          for(var i=0;i<users.length;i++){


              user.findById(users[i]._id).populate("pops").exec(function(err,found){

                 if(found.offerHold && found.offerHold==true){

                   if(found.pops.length>0){
                      for(var i=0;i<found.pops.length;i++){

                         if(found.pops[i].api=="vip"){

                             pop.findByIdAndDelete(found.pops[i]._id,function(err,info){


                             })
                         }
                      }
                    }  
                       found.offerHold=false
                      found.save()
                      console.log("changed")
                 }
              })
          }
     })
})




app.get("/login",function(req,res){

 user.find({},function(err,admins){
     var flag=true
     for(var i=0;i<admins.length;i++){

         if(admins[i].token==req.query.token){

              flag=false
              res.render("login.ejs",{token:req.query.token})
 
              break
         }
      }
     
     if(flag==true){

         req.flash("error","token is not approved,Please give a approved token") 
         res.redirect("/token")
     }

 })	
})






app.get("/api",function(req,res)
	{
  var array = [];
  var array2 = [];
  for (var i=0; i<50000; i++)
  {
    array.push("Item >>> "+i);
    
  }
  array2 = array;

  const finalRes = { status: true, arrayData: array, arrayData2: array2, arrayData3: array, arrayData4: array2, arrayData5: array, arrayData6: array2,
    arrayData7: array, arrayData8: array2, arrayData9: array, arrayData10: array2, arrayData11: array, arrayData12: array2,
    arrayData8: array, arrayData9: array2, arrayData10: array, arrayData11: array2, arrayData12: array, arrayData13: array2,
    arrayData14: array, arrayData15: array2, arrayData16: array, arrayData17: array2, arrayData18: array, arrayData19: array2,
    arrayData20: array, arrayData21: array2, arrayData22: array, arrayData23: array2, arrayData24: array, arrayData25: array2,
    arrayData26: array, arrayData27: array2, arrayData28: array, arrayData29: array2, arrayData30: array, arrayData31: array2,

    arrayData32: array, arrayData33: array2, arrayData34: array, arrayData35: array2, arrayData36: array, arrayData37: array2,
    arrayData38: array, arrayData39: array2, arrayData40: array, arrayData41: array2, arrayData42: array, arrayData43: array2,
    arrayData44: array, arrayData45: array2, arrayData46: array, arrayData47: array2, arrayData48: array, arrayData49: array2,
    arrayData50: array, arrayData51: array2, arrayData52: array, arrayData53: array2, arrayData54: array, arrayData55: array2,
    arrayData56: array, arrayData57: array2, arrayData58: array, arrayData59: array2, arrayData60: array, arrayData61: array2,
    arrayData62: array
    //, arrayData63: array2, arrayData64: array, arrayData65: array2, arrayData66: array, arrayData67: array2


  };
  res.json(finalRes);
});

app.get("/product",function(req,res){

  product.find({Name:{$regex:"eggs",$options:"$i"}},function(err,prod){
  	console.log(prod)
  })

})




app.get("/category",function(req,res){

	res.render("category.ejs")
})

app.get("/catproduct/:keys",function(req,res){
  
    product.find({key:{$regex:req.params.keys,$options:"$i"}},function(err,prod){
               
                         res.render("products.ejs",{prod:prod})
                    
                   }) 

})


app.get("/wishlist",isLoggedin,function(req,res){
 user.findById(req.user._id).populate("pops").exec(function(err,users){
	wishlist.find({username:req.user.username},function(err,prod){
       
       if (prod.length>0){
	  
		res.render("wish.ejs",{prod:prod,users:users})
	 }
	 else{

	 			res.render("nowish.ejs",{prod:prod})

	 }

	})
})
})
app.get("/deleteWish/:id/:aid",function(req,res){

if(req.params.aid=="off"){
	wishlist.findByIdAndDelete(req.params.id,function(err,wishs){

		  req.flash("success","Items is deleted from wishList")
		  res.redirect("/wishlist")
             
		
	})
}
else{

product.findById(req.params.aid,function(err,prod){
	wishlist.find({username:req.user.username},function(err,wishs){


		for(var i=0;i<wishs.length;i++){

			 if(wishs[i].pid==prod._id){

            	wishlist.findByIdAndDelete(wishs[i]._id,function(err,wishs){

			 	})
		       
                   req.flash("success","Items is deleted from wishList")
	           res.redirect("/moreinfo/"+prod._id) 
	            
	           break
                }
	     }
	})
 
	 

})
}
        

})
app.get("/wishlist/:id",isLoggedin,function(req,res){

 user.findById(req.user._id,function(err,users){ 


  product.findById(req.params.id,function(err,prod){
   

     wishlist.create({Name:prod.Name,image:prod.image,pid:prod._id,Price:prod.Price,username:req.user.username,urls:prod.urls,leters:prod.leters},function(err,wish){
          
    	req.flash("success","Item Added To The WishList")
        res.redirect("back")
    
    })   
  
  })
      

})
})


app.get("/allProduct",function(req,res){
 console.log("just testing")
 if(req.user){

    var primary=req.user._id
 } 
else{
    var primary="4444"
}
  
user.findById(primary).populate("pops").exec(function(err,users){
  if (!req.query.query){
   product.find({},function(err,prod){
   	  	res.render("products.ejs",{prod:prod,users:users})

   })
 }
 else{
    var prods=""
    var data=req.query.query
    var search=data.toLowerCase()
   	var flag=true
   	var C=[]
    product.find({},function(err,produ){
   	  	
          
   	   for (var p=0;p<produ.length;p++){	
   	  	  for (var i=0;i<search.length;i++){
   	  		var k=i
   	  		flag=true
             
             for (var j=0;j<produ[p].key.length-1;j++){
                 if (search[k]!==produ[p].key[j]){

                       flag=false
                       break
                 }
                 k++
             }
                  
             if (flag==true){

             	flag=false
             	C.push(0)
                product.find({key:{$regex:produ[p].key,$options:"$i"}},function(err,prod){
                         
                         res.render("products.ejs",{prod:prod,users:users})
                    
                   }) 
                var produ=[]
                break
           }        
          
           
     }
     
           
   } 
   if (C.length==0){

   	 res.render("NoProduct.ejs")
   } 

    
    })
    
   
 }

 
  })
})




app.get("/moreinfo/:id",function(req,res){
  var prods=[]
  var flag=true
  var flags=true
  var mark=""
  if (req.user){

    var primary=req.user._id
  }
  else{

    var primary="333"
  }
  user.findById(primary).populate("pops").populate("selection").populate("cart").populate("suggetions").exec(function(err,users){
  product.findOne({_id:req.params.id}).populate("stock").populate("notify").populate("ones").populate("twos").exec(function(err,prod){
        if(req.user){
         if(req.query.sugg){
        
          if(users.suggetions.length>0){ 
           var smark=true
           for (var x=0;x<users.suggetions.length;x++){

             if(users.suggetions[x].pid==prod._id){

                  smark=false
                  break
             }
           }

           if(smark==true){   
             sugg.create({Name:prod.Name,image:prod.image,urls:prod.urls,pid:prod._id,uid:users._id,Price:prod.Price,offer:prod.offer},function(err,sugs){

                  users.suggetions.push(sugs)
                  users.save()
             })
          }
         }
        

         }
       }
     



    if(req.user){
      if (users.offerHold==true){

          var actualPrice=prod.Price-20
          var calcs=parseInt((actualPrice*100)/prod.offer)
           var calc=calcs + "% off" 
         
      }
     else if(users.offerHold==false){


          var actualPrice=""
          var calc=""

    }
   } 
    else{
     

          var actualPrice=""
          var calc=""

    } 

     product.find({key:{$regex:prod.key,$options:"$i"}},function(err,prods){
      // prods.push(prods)      
      // console.log(prods)
            if(req.user){
           
                        var point=true
                        for (var i=0;i<users.selection.length;i++){
                       
                           if (users.selection[i].id==prod._id){

                             point=false
                             var added="yes"
                             break
                           }

                      }   
                      if (point==true){

                          var added="no"
                      }

              if(prod.key!=="mustards" && prod.key!=="soyabeans"){
               var points=true
                        for (var i=0;i<users.cart.length;i++){
                       
                           if (users.cart[i].pid==prod._id){
                            
                              
                               points=false
                               var cart="yes"
                               break
                              

                           }
                          

                      }   
                      if (points==true){

                          var cart="no"
                      }

                  }
                  else if(prod.key=="mustards" || prod.key=="soyabeans"){
                          
                           var points=true
                        for (var i=0;i<users.cart.length;i++){
                       
                           if (users.cart[i].pid==prod._id && users.cart[i].size=="1L"){
                            
                              
                               points=false
                               var cart="yes"
                               break
                              

                           }
                          

                      }   
                      if (points==true){

                          var cart="no"

                      }

                 
                    var pointstwo=true
                        for (var i=0;i<users.cart.length;i++){
                       
                           if (users.cart[i].pid==prod._id && users.cart[i].size=="2L"){
                            
                              
                               pointstwo=false
                               var carttwo="yes"
                               break
                              

                           }
                          

                      }   
                      if (pointstwo==true){

                          var carttwo="no"
                      }


                  }
            if(req.user){ 
             var flag=true
             for(var i=0;i<prod.notify.length;i++){
                 
             	 if(prod.notify[i].username==req.user.username){

             	 	  flag=false
             	 	  var mark="found"
             	 	  break
             	 }
             }
             
             if(flag==true){

             	   var mark="not"


             }
            }
            else{
                var mark=""
            }
             console.log(flags) 
             
           


               wishlist.find({username:req.user.username},function(err,wishd){
              
               for(var p=0;p<wishd.length;p++){  
              
                if(wishd[p].pid==prod._id){
                 console.log(mark)
                 res.render("moreInfoproduct.ejs",{prod:prod,prods:prods,mark:mark,wishes:wishd,users:users,added:added,cart:cart,calc:calc,actualPrice:actualPrice,carttwo:carttwo})
                
                 flags=false
                 break  
             }
            }
            
            if (flags==true){

            	                 res.render("moreInfoproduct.ejs",{prod:prod,prods:prods,mark:mark,wishes:"",users:users,added:added,cart:cart,calc:calc,actualPrice:actualPrice,carttwo:carttwo})

            }

            })
            }
       
      else{

                        res.render("moreInfoproduct.ejs",{prod:prod,prods:prods,mark:mark,wishes:"",users:users,added:"",cart:"no",calc:calc,actualPrice:actualPrice,carttwo:"no"})


      }
  
})
})
})
})


app.get("/notify/:id",isLoggedin,function(req,res){
    var flag=true
  	product.findById(req.params.id).populate("notify").exec(function(err,prods){
          if(req.user){
             for(var i=0;i<prods.notify.length;i++){

             	 if(prods.notify[i].username==req.user.username){

             	 	  flag=false
             	 	  break
             	 }
             }
             if(flag==true){

             	   noti.create({username:req.user.username},function(err,infos){

             	   	   prods.notify.push(infos)
             	   	   prods.save()
             	   	  
             	   })


             }
	                   req.flash("success","You will be notified, when this product will be restored in stock")
             	   	   res.redirect("back") 
	
	}
	else{

		req.flash("error","Do Log In First")
        res.redirect("/login")
	}
	})

})

app.get("/cart",isLoggedin,function(req,res){

	
    user.findById(req.user._id).populate("cart").populate("pops").exec(function(err,users){
           
     console.log("here is cart"+req.query.noti)       
     if(req.query.noti){

          if(users.notinum && users.notinum>0){
             users.notinum=users.notinum-1
             users.save()
          }
    }
       	 	
            if(users.cart.length>0){
       		 
               
              res.render("cart.ejs",{users:users})
       		
            }
       		else{

       			res.render("nocart.ejs")
       		}
	
	
    
    })
}) 


app.get("/carti/:cid/:pid",function(req,res){
  user.findById(req.user._id,function(err,users){
	carts.findById(req.params.cid,function(err,cart){
 
      product.findById(req.params.pid).populate("stock").populate("ones").populate("twos").exec(function(err,prod){

        if(cart.size){
          
            if(cart.size=="1L"){
                if(users.offerHold==true){

                     var amounts=prod.Price-20
                 }
                 else if(users.offerHold==false){
                     var amounts=prod.Price


                 }
                 
                 if(cart.qty<prod.ones.length){

                     cart.qty=cart.qty+1
                     cart.Price=cart.qty*amounts
                     cart.save()
                     req.flash("success","quantity updated")
                     res.redirect("back")
                 }
                 else{

                    req.flash("error","quantity can't updated more")
                    res.redirect("back") 
                 }
            }
           else if(cart.size=="2L"){

                 if(users.offerHold==true){

                     var amounts=(prod.Price*2)-20
                 }
                 else if(users.offerHold==false){
                     var amounts=prod.Price*2


                 }

                 if(cart.qty<prod.twos.length){

                     cart.qty=cart.qty+1
                     cart.Price=cart.qty*amounts
                     cart.save()
                     req.flash("success","quantity updated")
                     res.redirect("back")
                 }
                 else{

                    req.flash("error","quantity can't updated more")
                    res.redirect("back") 
                 }
            }

        }     
      
        else{   

             if(users.offerHold==true){

                     var amounts=prod.Price-20
                 }
                 else if(users.offerHold==false){
                     var amounts=prod.Price


                 }
          if (cart.qty<prod.stock.length){

          	 cart.qty=cart.qty+1
             cart.Price=cart.qty*amounts
          	 cart.save()
             req.flash("success","quantity updated")
             res.redirect("back")
          }                 
          else{

             req.flash("error","quantity can't updated more")
             res.redirect("back")          	
          }
     }
      })
    })
})
})

app.get("/cartd/:cid/:pid",function(req,res){
  user.findById(req.user._id).populate("cart").exec(function(err,users){ 
    product.findById(req.params.pid,function(err,prod){

  
   carts.findById(req.params.cid,function(err,cart){
  
   if(cart.qty>1){
   
      if(cart.size){ 	
           
            if(cart.size=="1L"){

                cart.updateOne({qty:cart.qty-1,Price:(cart.qty-1)*prod.Price},function(err,info){
       // req.user.sum=req.user.sum-(cart.qty-1)*prod.Price
                 console.log(req.user.sum-prod.Price)
              

        })
         users.updateOne({sum:req.user.sum-prod.Price},function(err,info){

                })
            
            }

            else if(cart.size=="2L"){

                

                 cart.updateOne({qty:cart.qty-1,Price:(cart.qty-1)*(prod.Price*2)},function(err,info){
       // req.user.sum=req.user.sum-(cart.qty-1)*prod.Price
                 console.log(req.user.sum-prod.Price)
              

             })
            users.updateOne({sum:req.user.sum-(prod.Price*2)},function(err,info){

                })



            }

        }

        else{
        cart.updateOne({qty:cart.qty-1,Price:(cart.qty-1)*prod.Price},function(err,info){
       // req.user.sum=req.user.sum-(cart.qty-1)*prod.Price
  	          console.log(req.user.sum-prod.Price)
              

  	})
    users.updateOne({sum:req.user.sum-prod.Price},function(err,info){

     	        })  
  
  }
  }
  else{
    
  	if (users.cart.length==1) 
              { 
                 users.updateOne({sum:0},function(err,info){

     	        })              
  	      }
  	      else{
  	      	
              users.updateOne({sum:req.user.sum-cart.Price},function(err,info){

     	        })   	        
  	      }  
  	carts.deleteOne({_id:cart._id},function(err,car){
           
  	}) 
    
   
  }
  req.flash("success","quantity reduced")
  res.redirect("back")
  })
})
})
})



app.post("/cart/:id",isLoggedin,function(req,res){
 user.findById(req.user._id).populate("cart").exec(function(err,users){	
  product.findById(req.params.id).populate("stock").populate("ones").populate("twos").exec(function(err,prod){
    

    var flag=true
    var pr=0
     // req.session.sum=0
     
     
     if (!req.user.sum){

     	console.log("sum nei too")
        users.sum=0
     	
     }  
  
     if(req.body.size){
     
           if(req.body.size=="one"){
            
                    if (users.offerHold==false){

                    var amounts=Number(req.body.qty)*prod.Price
                    var calc=parseInt((amounts*100)/prod.offer)
                    var calcs=calc + "% off"
                }
              
              else if(users.offerHold==true){

                 var amounts=Number(req.body.qty)*prod.Price
                 var money=amounts
                 for(var y=0;y<Number(req.body.qty);y++){
                     amounts=amounts-20
                 }
                 var calc=parseInt((amounts*100)/prod.offer)
                 var calcs=calc + "% off"
               }  
                     var flag=true
                     for (var i=0;i<users.cart.length;i++){
 

                        if(users.cart[i].pid==prod._id && users.cart[i].size=="1L"){

                                
                               req.flash("error","product in your cart already")
                               res.redirect("back")
                               flag=false
                               break

                        }


                  }
                  if(flag==true){
                    if(req.body.qty<=prod.ones.length){  
                   
                           carts.create({image:prod.image,Name:prod.Name,Price:amounts,offer:prod.offer,key:prod.key,pid:prod._id,off:calcs,qty:Number(req.body.qty),size:"1L",urls:prod.urls,leters:prod.leters},function(err,onecart){
                           users.cart.push(onecart)
                           users.save()
                           req.flash("success","Product Is Added To The Cart")
                               res.redirect("back")         
                   
                   })
                    }
                    else{

                         req.flash("error","quantity is out of stock")
                               res.redirect("back")
                    }

                  }
           

           } 
           else if(req.body.size=="two"){

                   

                    if (users.offerHold==false){

                    var amounts=Number(req.body.qty)*(prod.Price*2)
                    var calc=parseInt((amounts*100)/prod.offer)
                    var calcs=calc + "% off"
                }
              
              else if(users.offerHold==true){

                 var amounts=Number(req.body.qty)*(prod.Price*2)
                 var money=amounts
                 for(var y=0;y<Number(req.body.qty);y++){
                     amounts=amounts-20
                 }
                 var calc=parseInt((amounts*100)/prod.offer)
                 var calcs=calc + "% off"
               }  
                     var flag=true
                     for (var i=0;i<users.cart.length;i++){
 

                        if(users.cart[i].pid==prod._id && users.cart[i].size=="2L"){

                                
                               req.flash("error","product in your cart already")
                               res.redirect("back")
                               flag=false
                               break

                        }


                  }
                  if(flag==true){
                    if(req.body.qty<=prod.twos.length){  
                   
                           carts.create({image:prod.image,Name:prod.Name,Price:amounts,offer:prod.offer,key:prod.key,pid:prod._id,off:calcs,qty:Number(req.body.qty),size:"2L",urls:prod.urls,leters:prod.leters},function(err,twocart){
                           users.cart.push(twocart)
                           users.save()   

                              req.flash("success","Product Is Added To The Cart")
                               res.redirect("back")
                   
                   })
                    }
                    else{

                         req.flash("error","quantity is out of stock")
                               res.redirect("back")
                    }



           }
 
         }

     }
     else{
     
       for (var i=0;i<users.cart.length;i++){

     	if(users.cart[i].pid==prod._id){
            flag=false 
     		 
     		  
            break
      }
     }
     if(flag==true){
     if(users.offerHold==true){
        
         var amounts=Number(req.body.qty)*prod.Price
         var money=amounts
         for(var i=0;i<Number(req.body.qty);i++){

             amounts=amounts-20
         }
         var calc=parseInt((amounts*100)/prod.offer)
         var calcs=calc + "% off"
     
     }
     else if(users.offerHold==false){

         var amounts=Number(req.body.qty)*prod.Price
         var calcs=prod.off 
     }
     
     if(req.body.qty<=prod.stock.length){
      carts.create({image:prod.image,Name:prod.Name,Price:amounts,offer:prod.offer,key:prod.key,pid:prod._id,off:calcs,qty:Number(req.body.qty),urls:prod.urls,leters:prod.leters},function(err,onecart){

      	    users.cart.push(onecart)

            users.sum=users.sum+amounts
            users.save()
            req.flash("success","product added to the cart")
            res.redirect("/moreinfo/"+prod._id)
      })
     
     }
     else
     {

        req.flash("error","quantity is out of stock")
        res.redirect("back") 
     }
    }
  }
 
   
  
            
 })
})
})

app.get("/times",function(req,res){

const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

     console.log(month[date.getMonth()])
})


app.get("/month/:id",isLoggedin,function(req,res){
 


     var totalSum=0
if(req.user.approval==true){ 
 if (!req.query.search){
 request(`https://api-groceryji.herokuapp.com/month/${req.params.id}`,function(error,response,data){
    
    if(!error && response.statusCode==200){ 

      var orders=JSON.parse(data)
      if(orders.length>0){

       for (var i=0;i<orders.length;i++){

          if(orders[i].update!=="Canceled"){
            
             totalSum=totalSum+orders[i].Price

          }
       }
     
         res.render("monthOrder.ejs",{orders:orders,month:req.params.id,totalSum:totalSum,search:"",month:req.params.id})
      }
      else{

                         res.render("noOrders.ejs")


      }
        }
     })
  }

  else{

     
          var key=req.query.search
          var find=[]
request(`https://api.groceryji.com/month/${req.params.id}`,function(error,response,data){
    
        if(!error && response.statusCode==200){ 
              
              var orders=JSON.parse(data)
          
              for(var i=0;i<orders.length;i++){
             
              
                 for (var j=0;j<orders[i].name.length;j++){

                     var k=j
                     var flag=true
                     for (var p=0;p<key.length;p++){
                      
                         if(orders[i].name[k].toLowerCase()!==key[p].toLowerCase()){

                                      flag=false
                                      break

                  
                        }
                        k=k+1 
                       
                     
                    }
                    if (flag==true){
                        find.push(0)
                request(`https://api.groceryji.com/key/${orders[i].name}`,function(error,response,data){
    
                       if(!error && response.statusCode==200){ 
              
                           var orderf=JSON.parse(data)                         
                        for (var i=0;i<orderf.length;i++){

                          if(orderf[i].update!=="Canceled" && orderf[i].month==req.params.id){
                            
                             totalSum=totalSum+orderf[i].Price

                          }
                       }

                            
                                res.render("monthOrder.ejs",{orders:orderf,month:req.params.id,totalSum:totalSum,search:key})
                          }
                       })

                       var orders=[]

                       break
                    }

                 
                 }       

                      

              }
           

            if (find.length==0){

                               res.render("nocustomer.ejs")



            }       
         
         }

      })
        

  }
 }
 else{

    res.render("noaprove.ejs")
 }

})





app.get("/vip",isLoggedin,function(req,res){
    
 if(req.user.approval==true){
  if(!req.query.search){
  request("https://api-groceryji.herokuapp.com/vip",function(error,response,data){
         var items=[]
         if(!error && response.statusCode==200){
             
              var users=JSON.parse(data)
             

          }    
           
         

       if(users.length>0){ 
         res.render("vip.ejs",{users:users,search:""})
       }
       else{

        res.render("novip.ejs")
       }
         
  
  })
 }
 else{
    var key=req.query.search
    var find=[]
request("https://api-groceryji.herokuapp.com/users",function(error,response,data){
         var items=[]
         if(!error && response.statusCode==200){
             
              var users=JSON.parse(data)
             

          }       
     if(users.length>0){
      for(var i=0;i<users.length;i++){
       


             for (var j=0;j<users[i].name.length;j++){

                 var flag=true
                 var p=j
                 for (k=0;k<key.length;k++){

                     if(users[i].name[p].toLowerCase()!==key[k].toLowerCase()){

                         flag=false
                         break

                     }
                     p=p+1
                 }
                 if(flag==true){
     request(`https://api-groceryji.herokuapp.com/vip/${users[i].name}`,function(error,response,data){
         var items=[]
         if(!error && response.statusCode==200){
             
              var users=JSON.parse(data)
             

           
                                  res.render("vip.ejs",{users:users,search:req.query.search})
        }

                     })
                   find.push(0)

                   var users=[]
                   break
                 }
         
              }
           
         
        
        
     }
    
    if(find.length==0){

      res.render("novip.ejs")
              
    } 
 }
 else{

          res.render("novip.ejs")

 }
})
 }
}
else{

    res.render("noaprove.ejs")
}
})



app.get("/moreMonth/:id/:mon",isLoggedin,function(req,res){

  if(req.user.approval==true){   
     
     var total=0
 
       request(`https://api-groceryji.herokuapp.com/order/${req.params.id}`,function(error,response,data){
         if(!error && response.statusCode==200){
             
              var orders=JSON.parse(data)
       
       for (var i=0;i<orders.length;i++){

          if(orders[i].month==req.params.mon && orders[i].update!=="Canceled"){
            
             total=total+orders[i].Price

          }
       }
      
      request(`https://api-groceryji.herokuapp.com/user/${req.params.id}`,function(error,response,datas){
         if(!error && response.statusCode==200){
             
              var alluser=JSON.parse(datas) 


        if(alluser.offerHold==true){

             var vip=true
        }
        else{

            var vip=false
        }
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        
         var date=new Date()
         
         res.render("monthuser.ejs",{total:total,alluser:alluser,month:req.params.mon,vip:vip,secondmonth:months[date.getMonth()]})  
            }
              
           })
            }
        })
    
 
}
else{

    res.render("noaprove.ejs")
} 
})




app.get("/updateCustomersStatus/:id/:mon",function(req,res){
 const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                            var date=new Date()
request(`https://api-groceryji.herokuapp.com/userid/${req.params.id}`,function(error,response,data){
         if(!error && response.statusCode==200){
             
              var users=JSON.parse(data)
             

request(`https://api-groceryji.herokuapp.com/updateCustomersStatus/${req.params.id}/${req.params.mon}`,function(error,response,datas){
         if(!error && response.statusCode==200){        
                                       var date=new Date()

     if(users.offerHold==false){
         
        
      req.flash("success",users.name + " is now VIP Customer")
      res.redirect("back")  
   
 

     }
   else{

    
   
    req.flash("error",users.name + " is removed from VIP Customer")
    res.redirect("back")  

   }
  
      }
  })    

   }
})

})


app.post("/tokenfound",function(req,res){
 


     user.findOne({username:req.body.email},function(err,users){

         if(users){
              
               var transport=nodemailer.createTransport({
                                              service:"gmail",
                                              auth:{
                                               user:"grocery.ofc@gmail.com",
                                               pass:process.env.password
                                              }
                                               });  


                                         var mailoptions={
                                           from:"grocery.ofc@gmail.com",
                                           bcc:`${req.body.email}`,
                                           subject:"GroceryJi",
                                           html:`Hi,your token is <br>
                                               
                                           <br>
                                           <b>${users.token}</b>
                                            <br>
                                                       
                        
                        
                                            <a href=https://admin-groceryji.herokuapp.com/><button style=color:green>Verify</button></a>                        
                                                          
                                                          
                                                             `
                           } 
                               transport.sendMail(mailoptions,function(err,info){
                                    if(err)
                                    {
                                        console.log("error")
                                    }
                                        else{
                                            console.log("here")

                                        }


                                }) 
               
               req.flash("success","Mail sent,collect your token")
               res.redirect("back")                
 
         }
        else{
           
             req.flash("error","No user found with that username")
               res.redirect("back")
 
        }
     })
})


app.get("/buy/:pid",isLoggedin,function(req,res){

   var author={

   	username:req.user.username,
   	id:req.user._id
   }
  user.findById(req.user._id,function(err,users){ 

   product.findById(req.params.pid).populate("stock").populate("ones").populate("twos").exec(function(err,prod){
  if(req.query.size){
        
         if(req.query.size=="one"){ 
 
            if (users.offerHold==true){

     var amounts=(req.query.qty*prod.Price)
     for(var i=0;i<req.query.qty;i++){

         amounts=amounts-20
     }  
   }
   else if(users.offerHold==false){

          var amounts=req.query.qty*prod.Price

  

   }
 
 
 }

 else if(req.query.size=="two"){ 

     
         if (users.offerHold==true){

     var amounts=(req.query.qty*(prod.Price*2))
     for(var i=0;i<req.query.qty;i++){

         amounts=amounts-20
     }  
   }
   else if(users.offerHold==false){

          var amounts=req.query.qty*(prod.Price*2)

  

   }



 }

}
   

   if(req.query.size){
        
         if(req.query.size=="one"){

             if(req.query.qty<=prod.ones.length){
                

                if(!req.query.new){   
      location.find({mainuser:req.user.username},function(err,preord){
        console.log(preord)
        if (preord.length>0){
               
                         res.render("preorder.ejs",{prod:prod,qty:req.query.qty,key:public_key,preord:preord,amount:amounts,size:req.query.size})

            
         }
         else{
            

         res.render("order.ejs",{prod:prod,qty:req.query.qty,key:public_key,amount:amounts,size:req.query.size})
       }
     })
   }
   else{
              console.log(req.query.qty*prod.Price)
              res.render("order.ejs",{prod:prod,qty:req.query.qty,key:public_key,amount:amounts,size:req.query.size})

   }

             }

        else{  
          req.flash("error","Selected quantity is greater than the number of total stock of this product")
          res.redirect("back")
           }

         }
         else if(req.query.size=="two"){


               if(req.query.qty<=prod.twos.length){
                

                if(!req.query.new){   
      location.find({mainuser:req.user.username},function(err,preord){
        console.log(preord)
        if (preord.length>0){
               
                         res.render("preorder.ejs",{prod:prod,qty:req.query.qty,key:public_key,preord:preord,amount:amounts,size:req.query.size})

            
         }
         else{
            

         res.render("order.ejs",{prod:prod,qty:req.query.qty,key:public_key,amount:amounts,size:req.query.size})
       }
     })
   }
   else{
              console.log(req.query.qty*prod.Price)
              res.render("order.ejs",{prod:prod,qty:req.query.qty,key:public_key,amount:amounts,size:req.query.size})

   }

             }

        else{  
          req.flash("error","Selected quantity is greater than the number of total stock of this product")
          res.redirect("back")
           }

         }

   


   }
   else{
    if (users.offerHold==true){

        var amounts=(req.query.qty*prod.Price)
        for(var i=0;i<req.query.qty;i++){

             amounts=amounts-20
        }
   }
   else if(users.offerHold==false){

          var amounts=req.query.qty*prod.Price

  

   }
   if(prod.stock.length>=req.query.qty){ 
    if(!req.query.new){   
      location.find({mainuser:req.user.username},function(err,preord){
        console.log(preord)
        if (preord.length>0){
               
                         res.render("preorder.ejs",{prod:prod,qty:req.query.qty,key:public_key,preord:preord,amount:amounts,size:""})

            
         }
         else{
            

         res.render("order.ejs",{prod:prod,qty:req.query.qty,key:public_key,amount:amounts,size:""})
       }
     })
   }
   else{
              console.log(req.query.qty*prod.Price)
   	          res.render("order.ejs",{prod:prod,qty:req.query.qty,key:public_key,amount:amounts,size:""})

   }
   }
   else{

   	req.flash("error","Selected quantity is greater than the number of total stock of this product")
   	res.redirect("back")
   }
   }
   })


 })
})

app.get("/allbuy",function(req,res){

   location.find({mainuser:req.user.username},function(err,preord){
        console.log(preord)
        if(!req.query.new){


         if(preord.length>0){
               
                         res.render("preordercart.ejs",{prod:"3ert",qty:0,key:public_key,preord:preord})

            
         }
         else{
            

        res.render("allcartorder.ejs",{key:public_key,prod:"3ert"})
       }
     }
     else{

                     res.render("allcartorder.ejs",{key:public_key,prod:"3ert"})


     }
     })
   

   
})


app.post("/allbuy/:id",function(req,res){

  location.findById(req.params.id,function(err,loc){ 
   user.findById(req.user._id).populate("cart").exec(function(err,users){


   if (req.body.method=="Stripe"){


  	 stripe.customers.create({ 
					        email: req.body.stripeEmail, 
					        source: req.body.stripeToken, 
					        name: req.user.username, 
					        address: { 
					            line1: 'TC 9/4 Old MES colony', 
					            postal_code: '110092', 
					            city: 'Kolkata', 
					            state: 'India', 
					            country: 'India', 
					        } 
					    }) 
					    .then((customer) => { 

					    		return stripe.charges.create({ 
					            amount:req.user.sum,    // Charing Rs 25 
					            description:"All Products Of Your Cart", 
					            currency: 'INR', 
					            customer: customer.id 
					       	

					        })

					   })	
					    	.then((charge) => {
                           
                                 

                           })
					    	.catch((error)=>{

                           })


  }	
  
   
                        if(req.body.method=="Stripe"){

                              var pay="Paid"
                           }
                           
                           
                          else if(req.body.method=="razorpay"){

                            var pay="Paid"
                          }  


                           else if (req.body.method=="Cash-On-Delivery"){
 
                                 var pay="Cash-On-Delivery"


          

                           }
    	 var author={
    	 	username:req.user.username,
    	 	id:req.user._id
    	 }
    	 
                  
                            const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                            var d=new Date()

                                           order.find({mainuser:req.user.username},function(err,orders){
                                           var flag=true
                                   
                                           if(loc){ 
                                                for(var p=0;p<orders.length;p++){

                                                         if(orders[p].lid==loc._id){
                                                                 
                                                                  flag=false
                                                                    
                                                                 	 for (var i=0;i<users.cart.length;i++){
                                                                if(users.cart[i].size){ 
                                                                    if(users.cart[i].size=="1L"){
                                                                   
                                                                              

                                                                                  order.create({first:req.body.first,last:req.body.last,name:req.body.first +" "+req.body.last,city:req.body.city,phone:req.body.phone,roadNumber:req.body.road,landmark:req.body.landmark,Price:users.cart[i].Price,returnId:"",author:author,productD:users.cart[i].Name,qty:users.cart[i].qty,locality:req.body.locality,pay:pay,image:users.cart[i].image,returnQ:0,pid:users.cart[i].pid,ifsc:"",account:"",cartId:users.cart[i]._id,ordered:"Ordered",dateone:Date.now(),shipped:"",outfor:"",update:"",autoCancel:false,lid:loc._id,mainuser:req.user.username,urls:users.cart[i].urls,size:users.cart[i].size,month:months[d.getMonth()],},function(err,orders){
     
                                                                         product.findById(orders.pid).populate("stock").populate("ones").populate("twos").exec(function(err,pro){                                
                                                            pro.totalOne=pro.totalOne-orders.qty

                                                              pro.date=Date.now()
                                                              
                                                            for(var p=0;p<orders.qty;p++){
                                                               console.log("here inside") 
                                                               one.deleteOne({id:orders.pid},function(err,info){
                                
                                                          
                                                                          })
                                                     
                                                             }                 

                                                            carts.deleteOne({_id:orders.cartId},function(err,inf){

                                                                })
                               
                               
                                                if (pro.totalOne==0){
                                                      pro.emptyOne=true
                                                      pro.totalOne=0
                                                       pro.date=Date.now()
                                                       pop.find({},function(err,pup){

                                                            for (var i=0;i<pup.length;i++){

                                                               if (pup[i].id==pro._id){

                                                                    pop.findByIdAndDelete(pup[i]._id,function(err,info){

                                                                 })
                                                               }
                                                            }
                                                         })      
                                                  
                                                  carts.find({pid:pro._id},function(err,allcart){

                                                         for (var i=0;i<allcart.length;i++){
                                                           
                                                           if(allcart[i].size=="1L"){
                                                             carts.findByIdAndDelete(allcart[i]._id,function(err,info){


                                                             })
                                                           }
                                                         }

                                                     })  

                                                     wishlist.find({pid:pro._id},function(err,allwish){


                                                         for(var i=0;i<allwish.length;i++){

                                                             wishlist.findByIdAndDelete(allwish[i]._id,function(err,info){


                                                             })
                                                         }
                                                     })


                                                  }
                                                  pro.save()
                                                  carts.find({pid:pro._id},function(err,allcarts){
                                  
                                                     if(allcarts.length>0){ 
                                                      for(var i=0;i<allcarts.length;i++){
                                                           
                                                          carts.findById(allcarts[i]._id,function(err,cartinfo){
                                                             if(cartinfo && cartinfo.size=="1L"){ 
                                                              if(cartinfo.qty>pro.totalOne){

                                                                  carts.findByIdAndDelete(cartinfo._id,function(err,info){


                                                                  })
                                                              }
                                                            }
                                                          })
                                                        
                                                      }
                                                     }
                                               }) 

                               })
                         })





                                                    }
                                                    
                                                    else if(users.cart[i].size=="2L"){

                                                                       

                                                                           


                                                                           order.create({first:req.body.first,last:req.body.last,name:req.body.first +" "+req.body.last,city:req.body.city,phone:req.body.phone,roadNumber:req.body.road,landmark:req.body.landmark,Price:users.cart[i].Price,returnId:"",author:author,productD:users.cart[i].Name,qty:users.cart[i].qty,locality:req.body.locality,pay:pay,image:users.cart[i].image,returnQ:0,pid:users.cart[i].pid,ifsc:"",account:"",cartId:users.cart[i]._id,ordered:"Ordered",dateone:Date.now(),shipped:"",outfor:"",update:"",autoCancel:false,lid:loc._id,mainuser:req.user.username,urls:users.cart[i].urls,size:users.cart[i].size,month:months[d.getMonth()],},function(err,orders){
     
                                                                         product.findById(orders.pid).populate("stock").populate("ones").populate("twos").exec(function(err,pro){                                
                                                            pro.totalTwo=pro.totalTwo-orders.qty

                                                              pro.date=Date.now()
                                                              
                                                            for(var p=0;p<orders.qty;p++){
                                                               console.log("here inside") 
                                                               two.deleteOne({id:orders.pid},function(err,info){
                                
                                                          
                                                                          })
                                                     
                                                             }                 

                                                            carts.deleteOne({_id:orders.cartId},function(err,inf){

                                                                })
                               
                               
                                                if (pro.totalTwo==0){
                                                      pro.emptyTwo=true
                                                      pro.totalTwo=0
                                                       pro.date=Date.now()
                                                       pop.find({},function(err,pup){

                                                            for (var i=0;i<pup.length;i++){

                                                               if (pup[i].id==pro._id){

                                                                    pop.findByIdAndDelete(pup[i]._id,function(err,info){

                                                                 })
                                                               }
                                                            }
                                                         })      
                                                  
                                                  carts.find({pid:pro._id},function(err,allcart){

                                                         for (var i=0;i<allcart.length;i++){
                                                           
                                                           if(allcart[i].size=="2L"){
                                                             carts.findByIdAndDelete(allcart[i]._id,function(err,info){


                                                             })
                                                           }
                                                         }

                                                     })  

                                                     wishlist.find({pid:pro._id},function(err,allwish){


                                                         for(var i=0;i<allwish.length;i++){

                                                             wishlist.findByIdAndDelete(allwish[i]._id,function(err,info){


                                                             })
                                                         }
                                                     })


                                                  }
                                                  pro.save()
                                                  carts.find({pid:pro._id},function(err,allcarts){
                                  
                                                     if(allcarts.length>0){ 
                                                      for(var i=0;i<allcarts.length;i++){
                                                           
                                                          carts.findById(allcarts[i]._id,function(err,cartinfo){
                                                             if(cartinfo && cartinfo.size=="2L"){ 
                                                              if(cartinfo.qty>pro.totalTwo){

                                                                  carts.findByIdAndDelete(cartinfo._id,function(err,info){


                                                                  })
                                                              }
                                                            }
                                                          })
                                                        
                                                      }
                                                     }
                                               }) 

                               })
                         })


                                                            
 
                                                                    }
                                                                   } 
                                                                    else{  
                                                                           
                                                                           order.create({first:req.body.first,last:req.body.last,name:req.body.first +" "+req.body.last,city:req.body.city,phone:req.body.phone,roadNumber:req.body.road,landmark:req.body.landmark,Price:users.cart[i].Price,returnId:"",author:author,productD:users.cart[i].Name,qty:users.cart[i].qty,locality:req.body.locality,pay:pay,image:users.cart[i].image,returnQ:0,pid:users.cart[i].pid,ifsc:"",account:"",cartId:users.cart[i]._id,ordered:"Ordered",dateone:Date.now(),shipped:"",outfor:"",update:"",autoCancel:false,lid:loc._id,mainuser:req.user.username,urls:users.cart[i].urls,leters:users.cart[i].leters,month:months[d.getMonth()],offerHold:false},function(err,orders){
	 
	                                                                     product.findById(orders.pid).populate("stock").exec(function(err,pro){                                
	                                                        pro.stocking=pro.stocking-orders.qty

	                                                          pro.date=Date.now()
	                                         	              
	                                                        for(var p=0;p<orders.qty;p++){
	                                                           console.log("here inside") 
	                                        	               stocks.deleteOne({id:orders.pid},function(err,info){
	                            
	                                         	          
	                                         	                          })
	                                                 
	                                                         }                 

	                                                        carts.deleteOne({_id:orders.cartId},function(err,inf){

	                                                            })
	                           
	                           
		                                        if (pro.stocking==0){
		                           	                  pro.empty=true
		                           	                  pro.stocking=0
		                           	                   pro.date=Date.now()
		                                               pop.find({},function(err,pup){

                                                            for (var i=0;i<pup.length;i++){

                                                               if (pup[i].id==pro._id){

                                                                    pop.findByIdAndDelete(pup[i]._id,function(err,info){

                                                                 })
                                                               }
                                                            }
                                                         })  	 
		                                          
                                                  carts.find({pid:pro._id},function(err,allcart){

                                                         for (var i=0;i<allcart.length;i++){

                                                             carts.findByIdAndDelete(allcart[i]._id,function(err,info){


                                                             })
                                                         }
                                                     })  

                                                     wishlist.find({pid:pro._id},function(err,allwish){


                                                         for(var i=0;i<allwish.length;i++){

                                                             wishlist.findByIdAndDelete(allwish[i]._id,function(err,info){


                                                             })
                                                         }
                                                     })


                                                  }
                                                  pro.save()
                                                  carts.find({pid:pro._id},function(err,allcarts){
                                  
                                                     if(allcarts.length>0){ 
                                                      for(var i=0;i<allcarts.length;i++){

                                                          carts.findById(allcarts[i]._id,function(err,cartinfo){
                                                             if(cartinfo){ 
                                                              if(cartinfo.qty>pro.stocking){

                                                                  carts.findByIdAndDelete(cartinfo._id,function(err,info){


                                                                  })
                                                              }
                                                            }
                                                          })
                                                        
                                                      }
                                                     }
                                               }) 

	                           })
	                 })

                }
      
                                                               
                                                           }    
                                                               break
                                                               }  
                                                                
                                              // var ids=users.cart[i]._id
                                               }         
                                               }
                                               
                                              if(flag==true){
                                          location.create({first:req.body.first,last:req.body.last,name:req.body.first +" "+req.body.last,city:req.body.city,phone:req.body.phone,roadNumber:req.body.road,landmark:req.body.landmark,returnId:"",author:author,locality:req.body.locality,pay:pay,returnQ:0,ifsc:"",account:"",ordered:"Ordered",dateone:Date.now(),shipped:"",outfor:"",update:"",mainuser:req.user.username},function(err,loca){
 
                                                for (var j=0;j<users.cart.length;j++){

                                                if(users.cart[j].size){
                                                 
                                                 if(users.cart[j].size=="1L"){
                                                      

                                                        order.create({first:req.body.first,last:req.body.last,name:req.body.first +" "+req.body.last,city:req.body.city,phone:req.body.phone,roadNumber:req.body.road,landmark:req.body.landmark,Price:users.cart[j].Price,returnId:"",author:author,productD:users.cart[j].Name,qty:users.cart[j].qty,locality:req.body.locality,pay:pay,image:users.cart[j].image,returnQ:0,pid:users.cart[j].pid,ifsc:"",account:"",cartId:users.cart[j]._id,ordered:"Ordered",dateone:Date.now(),shipped:"",outfor:"",update:"",autoCancel:false,lid:loca._id,mainuser:req.user.username,urls:users.cart[j].urls,size:users.cart[j].size,month:months[d.getMonth()]},function(err,orders){
     
                                                       product.findById(orders.pid).populate("stock").populate("ones").populate("twos").exec(function(err,pro){                                
                                                            pro.totalOne=pro.totalOne-orders.qty

                                                              pro.date=Date.now()
                                                            for(var p=0;p<orders.qty;p++){
                                                               console.log("here inside") 
                                                               one.deleteOne({id:orders.pid},function(err,info){
                                
                                                          
                                                                          })
                                                     
                                                             }                 

                                                            carts.deleteOne({_id:orders.cartId},function(err,inf){

                                                                })
                               
                               
                                                if (pro.totalOne==0){
                                                      pro.emptyOne=true
                                                      pro.totalOne=0
                                                       pro.date=Date.now()
                                                    
                                                      pop.find({},function(err,pup){

                                                            for (var i=0;i<pup.length;i++){

                                                               if (pup[i].id==pro._id){

                                                                    pop.findByIdAndDelete(pup[i]._id,function(err,info){

                                                                 })
                                                               }
                                                            }
                                                         }) 

                                                    
                                                      carts.find({pid:pro._id},function(err,allcart){

                                                         for (var i=0;i<allcart.length;i++){
                                                             if(allcart[i].size=="1L"){    
                                                              carts.findByIdAndDelete(allcart[i]._id,function(err,info){

                                                                
                                                             })
                                                            
                                                            }
                                                         }
                                                     })  

                                                     wishlist.find({pid:pro._id},function(err,allwish){


                                                         for(var i=0;i<allwish.length;i++){

                                                             wishlist.findByIdAndDelete(allwish[i]._id,function(err,info){


                                                             })
                                                         }
                                                     })
                                                      

                                                  



                                                  }
                                                  pro.save()
                                                  carts.find({pid:pro._id},function(err,allcarts){
                                  
                                                     if(allcarts.length>0){ 
                                                      for(var i=0;i<allcarts.length;i++){

                                                          carts.findById(allcarts[i]._id,function(err,cartinfo){
                                                             if(cartinfo && cartinfo.size=="1L"){ 
                                                              if(cartinfo.qty>pro.totalOne){

                                                                  carts.findByIdAndDelete(cartinfo._id,function(err,info){


                                                                  })
                                                              }
                                                            }
                                                          })
                                                        
                                                      }
                                                     }
                                               }) 
                               })
                     })


                                                 }


                                                else if(users.cart[j].size=="2L"){


                                                     


                                                       order.create({first:req.body.first,last:req.body.last,name:req.body.first +" "+req.body.last,city:req.body.city,phone:req.body.phone,roadNumber:req.body.road,landmark:req.body.landmark,Price:users.cart[j].Price,returnId:"",author:author,productD:users.cart[j].Name,qty:users.cart[j].qty,locality:req.body.locality,pay:pay,image:users.cart[j].image,returnQ:0,pid:users.cart[j].pid,ifsc:"",account:"",cartId:users.cart[j]._id,ordered:"Ordered",dateone:Date.now(),shipped:"",outfor:"",update:"",autoCancel:false,lid:loca._id,mainuser:req.user.username,urls:users.cart[j].urls,size:users.cart[j].size,month:months[d.getMonth()]},function(err,orders){
     
                                                       product.findById(orders.pid).populate("stock").populate("ones").populate("twos").exec(function(err,pro){                                
                                                            pro.totalTwo=pro.totalTwo-orders.qty

                                                              pro.date=Date.now()
                                                            for(var p=0;p<orders.qty;p++){
                                                               console.log("here inside") 
                                                               two.deleteOne({id:orders.pid},function(err,info){
                                
                                                          
                                                                          })
                                                     
                                                             }                 

                                                            carts.deleteOne({_id:orders.cartId},function(err,inf){

                                                                })
                               
                               
                                                if (pro.totalTwo==0){
                                                      pro.emptyTwo=true
                                                      pro.totalTwo=0
                                                       pro.date=Date.now()
                                                    
                                                      pop.find({},function(err,pup){

                                                            for (var i=0;i<pup.length;i++){

                                                               if (pup[i].id==pro._id){

                                                                    pop.findByIdAndDelete(pup[i]._id,function(err,info){

                                                                 })
                                                               }
                                                            }
                                                         }) 

                                                    
                                                      carts.find({pid:pro._id},function(err,allcart){

                                                         for (var i=0;i<allcart.length;i++){
                                                             if(allcart[i].size=="2L"){    
                                                              carts.findByIdAndDelete(allcart[i]._id,function(err,info){

                                                                
                                                             })
                                                            
                                                            }
                                                         }
                                                     })  

                                                     wishlist.find({pid:pro._id},function(err,allwish){


                                                         for(var i=0;i<allwish.length;i++){

                                                             wishlist.findByIdAndDelete(allwish[i]._id,function(err,info){


                                                             })
                                                         }
                                                     })
                                                      

                                                  



                                                  }
                                                  pro.save()
                                                  carts.find({pid:pro._id},function(err,allcarts){
                                  
                                                     if(allcarts.length>0){ 
                                                      for(var i=0;i<allcarts.length;i++){

                                                          carts.findById(allcarts[i]._id,function(err,cartinfo){
                                                             if(cartinfo && cartinfo.size=="2L"){ 
                                                              if(cartinfo.qty>pro.totalTwo){

                                                                  carts.findByIdAndDelete(cartinfo._id,function(err,info){


                                                                  })
                                                              }
                                                            }
                                                          })
                                                        
                                                      }
                                                     }
                                               }) 
                               })
                     })
        




                                                }  
                                             
                                               }


                                                  else{   
                                       
	                                               order.create({first:req.body.first,last:req.body.last,name:req.body.first +" "+req.body.last,city:req.body.city,phone:req.body.phone,roadNumber:req.body.road,landmark:req.body.landmark,Price:users.cart[j].Price,returnId:"",author:author,productD:users.cart[j].Name,qty:users.cart[j].qty,locality:req.body.locality,pay:pay,image:users.cart[j].image,returnQ:0,pid:users.cart[j].pid,ifsc:"",account:"",cartId:users.cart[j]._id,ordered:"Ordered",dateone:Date.now(),shipped:"",outfor:"",update:"",autoCancel:false,lid:loca._id,mainuser:req.user.username,urls:users.cart[j].urls,leters:users.cart[j].leters,month:months[d.getMonth()],offerHold:false},function(err,orders){
	 
	                                                   product.findById(orders.pid).populate("stock").exec(function(err,pro){                                
	                                                        pro.stocking=pro.stocking-orders.qty

	                                                          pro.date=Date.now()
	                                                        for(var p=0;p<orders.qty;p++){
	                                                           console.log("here inside") 
	                                        	               stocks.deleteOne({id:orders.pid},function(err,info){
	                            
	                                         	          
	                                         	                          })
	                                                 
	                                                         }                 

	                                                        carts.deleteOne({_id:orders.cartId},function(err,inf){

	                                                            })
	                           
	                           
		                                        if (pro.stocking==0){
		                           	                  pro.empty=true
		                           	                  pro.stocking=0
		                           	                   pro.date=Date.now()
		                                         	
		                                              pop.find({},function(err,pup){

                                                            for (var i=0;i<pup.length;i++){

                                                               if (pup[i].id==pro._id){

                                                                    pop.findByIdAndDelete(pup[i]._id,function(err,info){

                                                                 })
                                                               }
                                                            }
                                                         }) 

                                                    
                                                      carts.find({pid:pro._id},function(err,allcart){

                                                         for (var i=0;i<allcart.length;i++){

                                                             carts.findByIdAndDelete(allcart[i]._id,function(err,info){


                                                             })
                                                         }
                                                     })  

                                                     wishlist.find({pid:pro._id},function(err,allwish){


                                                         for(var i=0;i<allwish.length;i++){

                                                             wishlist.findByIdAndDelete(allwish[i]._id,function(err,info){


                                                             })
                                                         }
                                                     })
                                                      

                                                  



                                                  }
                                                  pro.save()
                                                  carts.find({pid:pro._id},function(err,allcarts){
                                  
                                                     if(allcarts.length>0){ 
                                                      for(var i=0;i<allcarts.length;i++){

                                                          carts.findById(allcarts[i]._id,function(err,cartinfo){
                                                             if(cartinfo){ 
                                                              if(cartinfo.qty>pro.stocking){

                                                                  carts.findByIdAndDelete(cartinfo._id,function(err,info){


                                                                  })
                                                              }
                                                            }
                                                          })
                                                        
                                                      }
                                                     }
                                               }) 
	                           })
	                 })
	  	 }
	  	 }
         })
	  	 
                                
         }
           })                      


                                       
                               

                              var transport=nodemailer.createTransport({
			                                  service:"gmail",
			                                  auth:{
				                               user:"grocery.ofc@gmail.com",
				                               pass:process.env.password
			                                  }
		                                       });	


			                             var mailoptions={
				                           from:"grocery.ofc@gmail.com",
				                           bcc:`${req.user.username}`,
				                           subject:"GroceryJi",
				                           html:`Hi,${req.body.first},welcome to GroceryjI<br>
                                           All product of your cart is successfully
                                           perchased..
                                           <br>
                                           Amount ${pay}:${req.user.sum}
				                            <br>
						                               
						
						
					                        <a href="https://grocery-ji.herokuapp.com/Orders"<button style=color:green>Check Your Order</button></a>						
						                                  
						                                  </form>
						                                     `
		 	               } 
                              console.log("hmmmmm")
				               transport.sendMail(mailoptions,function(err,info){
									if(err)
									{
										console.log("error")
									}
										else{
											console.log("here")

										}


			                    })    
    
                  
                  users.sum=0
                  users.save()
                  req.flash("success","successfully perchased all product of your cart")
                  res.redirect("/orders") 


  })

   
})

})



app.post("/razor/:pid/:lid",function(req,res){
  location.findById(req.params.lid,function(err,loc){ 

        product.findById(req.params.pid).populate("stock").populate("ones").populate("twos").exec(function(err,prod){
    user.findById(req.user._id,function(err,users){
    

    if(req.body.size){

         
         if(req.body.size=="one"){
            
         if(users.offerHold==true){

                 var amounts=(req.body.qty*prod.Price)-20
                 
            }
            else if(users.offerHold==false){

                 var amounts=req.body.qty*prod.Price
            }

             
           if (loc){
 
        res.render("razor.ejs",{quantity:req.body.qty,first:req.body.first,last:req.body.last,landmark:req.body.landmark,locality:req.body.locality,road:req.body.road,phone:req.body.phone,city:req.body.city,method:req.body.method,loc:loc._id,prod:prod,amount:amounts,size:req.body.size})

 
     }       
    else{

     res.render("razor.ejs",{quantity:req.body.qty,first:req.body.first,last:req.body.last,landmark:req.body.landmark,locality:req.body.locality,road:req.body.road,phone:req.body.phone,city:req.body.city,method:req.body.method,loc:"tttt",prod:prod,amount:amounts,size:req.body.size})



    } 







         }
        else if(req.body.size=="two"){


                

                 if(users.offerHold==true){

                 var amounts=(req.body.qty*(prod.Price*2))-20
                 
            }
            else if(users.offerHold==false){

                 var amounts=req.body.qty*(prod.Price*2)
            }


        
                if (loc){
 
               res.render("razor.ejs",{quantity:req.body.qty,first:req.body.first,last:req.body.last,landmark:req.body.landmark,locality:req.body.locality,road:req.body.road,phone:req.body.phone,city:req.body.city,method:req.body.method,loc:loc._id,prod:prod,amount:amounts,size:req.body.size})

 
           }       
        else{

           res.render("razor.ejs",{quantity:req.body.qty,first:req.body.first,last:req.body.last,landmark:req.body.landmark,locality:req.body.locality,road:req.body.road,phone:req.body.phone,city:req.body.city,method:req.body.method,loc:"tttt",prod:prod,amount:amounts,size:req.body.size})



        }    



        }


    }
  else{
    if(users.offerHold==true){

         var amounts=(req.body.qty*prod.Price)-20
      }   
    else if(users.offerHold==false){

         var amounts=req.body.qty*prod.Price
    }
    if (loc){
 
        console.log("this template passed")
        res.render("razor.ejs",{quantity:req.body.qty,first:req.body.first,last:req.body.last,landmark:req.body.landmark,locality:req.body.locality,road:req.body.road,phone:req.body.phone,city:req.body.city,method:req.body.method,loc:loc._id,prod:prod,amount:amounts,size:""})

 
 }      
 else{

    res.render("razor.ejs",{quantity:req.body.qty,first:req.body.first,last:req.body.last,landmark:req.body.landmark,locality:req.body.locality,road:req.body.road,phone:req.body.phone,city:req.body.city,method:req.body.method,loc:"tttt",prod:prod,amount:amounts,size:""})



 } 
     
}    
 

})

})
})

})


app.post("/razorcart/:lid",function(req,res){
  location.findById(req.params.lid,function(err,loc){ 

    if (loc){
 
        res.render("razorcart.ejs",{quantity:req.body.qty,first:req.body.first,last:req.body.last,landmark:req.body.landmark,locality:req.body.locality,road:req.body.road,phone:req.body.phone,city:req.body.city,method:req.body.method,loc:loc._id,amount:req.user.sum})

 
 }      
 else{

    res.render("razorcart.ejs",{quantity:req.body.qty,first:req.body.first,last:req.body.last,landmark:req.body.landmark,locality:req.body.locality,road:req.body.road,phone:req.body.phone,city:req.body.city,method:req.body.method,loc:"tttt",amount:req.user.sum})



 } 
     
    
 




})

})


app.post("/api/payment/order",(req,res)=>{
params=req.body;
instance.orders.create(params).then((data) => {
       res.send({"sub":data,"status":"success"});
}).catch((error) => {
       res.send({"sub":error,"status":"failed"});
})
});

app.get("/deleteselection/:id",function(req,res){

     user.findById(req.user._id).populate("selection").exec(function(err,users){
    
       
         for (var i=0;i<users.selection.length;i++){

             if(users.selection[i].id==req.params.id){
                  
                   selects.deleteOne({_id:users.selection[i]._id},function(err,sele){
                      
                       req.flash("success","removed from future selects")
                       res.redirect("/moreinfo/"+req.params.id)

                   })
 
            
               break
             }
              
         
         }
     })
})

app.get("/selection/:id",function(req,res){
 user.findById(req.user._id).populate("selection").exec(function(err,users){
    

    product.findById(req.params.id,function(err,prods){
           
               var flag=true
               for (var i=0;i<users.selection.length;i++){

                   if(users.selection[i].id==prods._id){
                       
                        req.flash("error","already added")
                     res.redirect("back") 
                        flag=false
                        break
                   }
               }
              
               if (flag==true){

                  selects.create({id:prods._id},function(err,selec){

                     users.selection.push(selec)
                     users.save()
                     req.flash("success","you will be notified,when the product will be added")
                     res.redirect("back")

                  })
               }


    })
})

})

app.post("/buy/:pid/:lid",function(req,res){
 const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
 var d=new Date() 


 location.findById(req.params.lid,function(err,loc){ 
   user.findById(req.user._id).populate("cart").populate("pops").exec(function(err,users){
        
        product.findById(req.params.pid).populate("stock").exec(function(err,prod){
        
                      

        if(!users.offerHold){

             users.offerHold=false
             users.save()
        } 

            
            
        
      if(req.body.size){

        if(req.body.size=="one" && req.body.qty>prod.ones.length){
                    
                    req.flash("error","quantity is out of stock")
                    res.redirect("back")

        }  
        else if(req.body.size=="two" && req.body.qty>prod.twos.length)
        {

             req.flash("error","quantity is out of stock")
                    res.redirect("back")
        }
        
        else{

            

            if (req.body.method=="Stripe"){ 
             
           
           if(users.offerHold==true){

                 if(req.body.size=="one"){     
                 var amounts=(req.body.qty*prod.Price)-20
                }
                else if(req.body.size=="two"){

                     var amounts=(req.body.qty*(prod.Price*2))-20
                }
                


            }

            else if(users.offerHold==false){
                  
                  if(req.body.size=="one"){     
                    
                     var amounts=(req.body.qty*prod.Price)
                }
                else if(req.body.size=="two"){

                     var amounts=(req.body.qty*(prod.Price*2))
                }
 
                
            
            }


            stripe.customers.create({ 
                            email: req.body.stripeEmail, 
                            source: req.body.stripeToken, 
                            name: req.user.username, 
                            address: { 
                                line1: 'TC 9/4 Old MES colony', 
                                postal_code: '110092', 
                                city: 'Kolkata', 
                                state: 'India', 
                                country: 'India', 
                            } 
                        }) 
                        .then((customer) => { 

                                return stripe.charges.create({ 
                                amount:amounts,    // Charing Rs 25 
                                description:prod.Name, 
                                currency: 'INR', 
                                customer: customer.id 
                            

                            })

                       })   
                            .then((charge) => {
                           })
                            .catch((err) => { 
                              res.send(err)    
                            })


}
                           
      


                            if(users.offerHold==true){

                 if(req.body.size=="one"){     
                 var amounts=(req.body.qty*prod.Price)-20
                }
                else if(req.body.size=="two"){

                     var amounts=(req.body.qty*(prod.Price*2))-20
                }
              

            }

            else if(users.offerHold==false){
                  
                  if(req.body.size=="one"){     
                    
                     var amounts=(req.body.qty*prod.Price)
                }
                else if(req.body.size=="two"){

                     var amounts=(req.body.qty*(prod.Price*2))
                }
 
               
            
            }

                           

                            
                            
                           var flag=true 
                           for(var i=0;i<users.cart.length;i++){
                                  if(req.body.size=="one"){
                                     var sizes="1L"

                                  }else if(req.body.size=="two"){

                                     var sizes="2L"
                                  }
                                  if (users.cart[i].pid==prod._id && users.cart[i].size==sizes){
                                      
                                      carts.findById(users.cart[i]._id,function(err,car){
                                           
                                            if (car.qty==req.body.qty){
                                                
                                                car.deleteOne({_id:car._id},function(err,info){

                                                })
                                            }
                                           else if(car.qty<req.body.qty){
                                               
                                                car.deleteOne({_id:car._id},function(err,info){

                                                })

                                           }
                                           else{
                                                  
                                                  car.updateOne({qty:car.qty-req.body.qty,Price:car.Price-amounts},function(err,info){

                                                  })

                                           }
                                           
                                      })
                                       break
                                      }
                                  }
                                  
                             
                           var author={
                            username:req.user.username,
                            id:req.user._id
                           }
                           var p=0
                            if(req.body.size=="one"){ 
                             prod.totalOne=prod.totalOne-req.body.qty
                             prod.date=Date.now()
                            }
                            else if(req.body.size=="two"){

                                 prod.totalTwo=prod.totalTwo-req.body.qty
                                 prod.date=Date.now()
                            }
                           for (var i=0;i<req.body.qty;i++){
                                      if(req.body.size=="one") { 
                                        
                                        one.deleteOne({id:prod._id},function(err,info){
                                               
                                                   
                                         
                                        })
                                  }
                                  else if(req.body.size=="two"){
                                   
                                    
                                        
                                        two.deleteOne({id:prod._id},function(err,info){
                                               
                                                   
                                         
                                        })
                                    }    
                                   
                                 
                                  }
                           
                         if(req.body.size=="one"){ 
                           if(prod.totalOne==0){
                             prod.emptyOne=true
                             prod.totalOne=0
                             prod.date=Date.now()
                           
                             pop.find({pid:prod._id},function(err,pup){

                                for (var i=0;i<pup.length;i++){

                                   if (pup[i].id==prod._id){


                                            pop.findByIdAndDelete(pup[i]._id,function(err,info){

                                     })
                                   }
                                }
                             })                             
 
                             carts.find({pid:prod._id},function(err,allcart){
                                

                                 for (var i=0;i<allcart.length;i++){
                                    if(allcart[i].size=="1L"){
                                             
                                     carts.findByIdAndDelete(allcart[i]._id,function(err,info){
                                      

                                     })
                                   }
                                 }

                             })  

                             wishlist.find({pid:prod._id},function(err,allwish){


                                 for(var i=0;i<allwish.length;i++){

                                

                                     wishlist.findByIdAndDelete(allwish[i]._id,function(err,info){


                                     })
                                   
                                 }
                             })
                             }
                           }
                           else if(req.body.size=="two"){
                               
                               if(prod.totalTwo==0){
                             prod.emptyTwo=true
                             prod.totalTwo=0
                             prod.date=Date.now()
                           
                             pop.find({pid:prod._id},function(err,pup){

                                for (var i=0;i<pup.length;i++){

                                   if (pup[i].id==prod._id){


                                            pop.findByIdAndDelete(pup[i]._id,function(err,info){

                                     })
                                   }
                                }
                             })                             
 
                             carts.find({pid:prod._id},function(err,allcart){
                                

                                 for (var i=0;i<allcart.length;i++){
                                    if(allcart[i].size=="2L"){
                                             
                                     carts.findByIdAndDelete(allcart[i]._id,function(err,info){
                                      

                                     })
                                   }
                                 }

                             })  

                             wishlist.find({pid:prod._id},function(err,allwish){


                                 for(var i=0;i<allwish.length;i++){


                                     wishlist.findByIdAndDelete(allwish[i]._id,function(err,info){


                                     })
                                   
                                 }
                             })
                             }
 

                           }
                           prod.save()
                           if(req.body.size=="one"){
                            carts.find({pid:prod._id},function(err,allcarts){
                                  
                                 if(allcarts.length>0){ 
                                  for(var i=0;i<allcarts.length;i++){
                                     if(allcarts[i].size=="1L"){
                                      carts.findById(allcarts[i]._id,function(err,cartinfo){
                                         if(cartinfo){ 
                                          if(cartinfo.qty>prod.totalOne){

                                              carts.findByIdAndDelete(cartinfo._id,function(err,info){


                                              })
                                          }
                                        }
                                      })
                                    }
                                  }
                                 }
                                })
                              }        
                                else if(req.body.size=="two"){

                                      carts.find({pid:prod._id},function(err,allcarts){
                                  
                                 if(allcarts.length>0){ 
                                  for(var i=0;i<allcarts.length;i++){
                                     if(allcarts[i].size=="2L"){
                                      carts.findById(allcarts[i]._id,function(err,cartinfo){
                                         if(cartinfo){ 
                                          if(cartinfo.qty>prod.totalTwo){

                                              carts.findByIdAndDelete(cartinfo._id,function(err,info){


                                              })
                                          }
                                        }
                                      })
                                    }
                                  }
                                 }
                                })
                                }
                                    
                                   

                           if(req.body.method=="Stripe"){

                              var pay="Paid"
                           }
                           
                           
                          else if(req.body.method=="razorpay"){

                            var pay="Paid"
                          }  


                           else if (req.body.method=="Cash-On-Delivery"){
 
                                 var pay="Cash-On-Delivery"


          

                           }
                           
                            var id=""
     
                               if(users.offerHold==true){

                                 if(req.body.size=="one"){     
                                 var amounts=(req.body.qty*prod.Price)-20
                                }
                                else if(req.body.size=="two"){

                                     var amounts=(req.body.qty*(prod.Price*2))-20
                                }
                              

                        }

                        else if(users.offerHold==false){
                              
                              if(req.body.size=="one"){     
                                
                                 var amounts=(req.body.qty*prod.Price)
                            }
                            else if(req.body.size=="two"){

                                 var amounts=(req.body.qty*(prod.Price*2))
                            }
             
                           
                        
                        }
 
   
                            order.find({mainuser:req.user.username},function(err,orders){
                                  var flag=true
                                   
                                if(loc){ 
                                  for(var i=0;i<orders.length;i++){

                                           if(orders[i].lid==loc._id){

                                                 if(req.body.size=="one"){
                                                     var sizes="1L"
                                                 }
                                                 else if(req.body.size=="two"){

                                                     var sizes="2L"
                                                 }
                                                 order.create({first:req.body.first,last:req.body.last,name:req.body.first +" "+req.body.last,city:req.body.city,phone:req.body.phone,roadNumber:req.body.road,landmark:req.body.landmark,Price:amounts,returnId:"",author:author,productD:prod.Name,qty:Number(req.body.qty),locality:req.body.locality,pay:pay,image:prod.image,returnQ:0,pid:prod._id,ifsc:"",account:"",cartId:"",ordered:"Ordered",dateone:Date.now(),shipped:"",outfor:"",update:"",autoCancel:false,mainuser:req.user.username,lid:loc._id,urls:prod.urls,leters:prod.leters,month:months[d.getMonth()],size:sizes},function(err,order){
                            
                           
                                                      
                           
 
                                                     
                                         var transport=nodemailer.createTransport({
                                              service:"gmail",
                                              auth:{
                                               user:"grocery.ofc@gmail.com",
                                               pass:process.env.password
                                              }
                                               });  


                                         var mailoptions={
                                           from:"grocery.ofc@gmail.com",
                                           bcc:`${req.user.username}`,
                                           subject:"GroceryjI",
                                           html:`Hi,${req.user.first},welcome to GroceryjI<br>
                                           Your Order ${prod.Name}, Price: ${prod.Price},Qty:${req.body.qty} is successfully
                                           perchased..
                                           <br>
                                           size:${sizes}
                                           <br>
                                           Amount ${pay}:<b>${req.body.qty*prod.Price}</b>
                                            <br>
                                                       
                        
                        
                                            <a href="https://grocery-ji.herokuapp.com/Orders/${order._id}"<button style=color:green>Check Your Order</button></a>                       
                                                          
                                                          </form>
                                                             `
                           } 
                              console.log("hmmmmm")
                               transport.sendMail(mailoptions,function(err,info){
                                    if(err)
                                    {
                                        req.flash("error","something went wrong...");

                                    }
                                        else{
                                            console.log("here")

                                        }


                                                         


                                  })
                                 

                    })





                                                 console.log("here")
                                                 console.log(id)
                                                 flag=false
                                                 break        

                                           }

                               
                                 }                      
                                } 
                                 if(flag==true){
                                              if(req.body.size=="one"){
                                                     var sizes="1L"
                                                 }
                                                 else if(req.body.size=="two"){

                                                     var sizes="2L"
                                                 }

                                                        location.create({first:req.body.first,last:req.body.last,name:req.body.first +" "+req.body.last,city:req.body.city,phone:req.body.phone,roadNumber:req.body.road,landmark:req.body.landmark,Price:req.body.qty*prod.Price,returnId:"",author:author,productD:prod.Name,qty:Number(req.body.qty),locality:req.body.locality,pay:pay,image:prod.image,returnQ:0,pid:prod._id,ifsc:"",account:"",cartId:"",ordered:"Ordered",dateone:Date.now(),shipped:"",outfor:"",update:"",autoCancel:false,mainuser:req.user.username},function(err,loca){
                                                 
                                                    

                                                         order.create({first:req.body.first,last:req.body.last,name:req.body.first +" "+req.body.last,city:req.body.city,phone:req.body.phone,roadNumber:req.body.road,landmark:req.body.landmark,Price:amounts,returnId:"",author:author,productD:prod.Name,qty:Number(req.body.qty),locality:req.body.locality,pay:pay,image:prod.image,returnQ:0,pid:prod._id,ifsc:"",account:"",cartId:"",ordered:"Ordered",dateone:Date.now(),shipped:"",outfor:"",update:"",autoCancel:false,mainuser:req.user.username,lid:loca._id,urls:prod.urls,leters:prod.leters,month:months[d.getMonth()],size:sizes},function(err,order){
                            
                           
                                                      
                           
 
                                                     
                                         var transport=nodemailer.createTransport({
                                              service:"gmail",
                                              auth:{
                                               user:"grocery.ofc@gmail.com",
                                               pass:process.env.password
                                              }
                                               });  


                                         var mailoptions={
                                           from:"grocery.ofc@gmail.com",
                                           bcc:`${req.user.username}`,
                                           subject:"GroceryJi",
                                           html:`Hi,${req.user.first},welcome to GroceryJi<br>
                                           Your order ${prod.Name}, Price: ${prod.Price},Qty:${req.body.qty} is successfully
                                           perchased..
                                           <br>
                                           size:${sizes}
                                           <br>
                                           Amount ${pay}:${req.body.qty*prod.Price}
                                            <br>
                                                       
                        
                        
                                            <a href="https://grocery-ji.herokuapp.com/Orders/${order._id}"<button style=color:green>Check Your Order</button></a>                       
                                                          
                                                          </form>
                                                             `
                           } 
                              console.log("hmmmmm")
                               transport.sendMail(mailoptions,function(err,info){
                                    if(err)
                                    {
                                        req.flash("error","something went wrong...");

                                    }
                                        else{
                                            console.log("here")

                                        }


                                                         


                                  })
                                 

                    })
                                 
                  
               
           
              })  
         
             }
        
        })                  
                          
          req.flash("success","product purchased successfully")
           res.redirect("/moreinfo/"+prod._id)
     


      }
        

}
       else{  

        if (req.body.qty<=prod.stock.length){
        	if (req.body.method=="Stripe"){ 
        	 
           
            
             if(users.offerHold==true){

                 

                          var amounts=(req.body.qty*prod.Price)-20

                


            }

            else if(users.offerHold==false){
                  
                 
 
                     var amounts=(req.body.qty*prod.Price)


                
            
            }




            stripe.customers.create({ 
					        email: req.body.stripeEmail, 
					        source: req.body.stripeToken, 
					        name: req.user.username, 
					        address: { 
					            line1: 'TC 9/4 Old MES colony', 
					            postal_code: '110092', 
					            city: 'Kolkata', 
					            state: 'India', 
					            country: 'India', 
					        } 
					    }) 
					    .then((customer) => { 

					    		return stripe.charges.create({ 
					            amount:amounts,    // Charing Rs 25 
					            description:prod.Name, 
					            currency: 'INR', 
					            customer: customer.id 
					       	

					        })

					   })	
					    	.then((charge) => {
                           })
					    	.catch((err) => { 
        			          res.send(err)    
    				        })


}
                           
      


                            if(users.offerHold==true){

                 

                          var amounts=(req.body.qty*prod.Price)-20

                


            }

            else if(users.offerHold==false){
                  
                 
 
                     var amounts=(req.body.qty*prod.Price)


                
            
            }

                           

                            

                           var flag=true 
                           for(var i=0;i<users.cart.length;i++){
                                 
                                  if (users.cart[i].pid==prod._id){
                                      
                                      carts.findById(users.cart[i]._id,function(err,car){
                                           
                                            if (car.qty==req.body.qty){
                                                
                                            	car.deleteOne({_id:car._id},function(err,info){

                                            	})
                                            }
                                           else if(car.qty<req.body.qty){
                                               
                                                car.deleteOne({_id:car._id},function(err,info){

                                            	})

                                           }
                                           else{
                                                  
                                                  car.updateOne({qty:car.qty-req.body.qty,Price:car.Price-amounts},function(err,info){

                                                  })

                                           }
                                           
                                      })
                                       break
                                      }
                                  }
                                  
                             
                           var author={
                           	username:req.user.username,
                           	id:req.user._id
                           }
                           var p=0
                            prod.stocking=prod.stocking-req.body.qty
                            prod.date=Date.now()
                            
                           for (var i=0;i<req.body.qty;i++){
                                     	
                                     	
                                     	stocks.deleteOne({id:prod._id},function(err,info){
                                               
                                                   
                                     	 
                                     	})

                                      
                                   
                            	 }
                           

                           if(prod.stocking==0){
                           	 prod.empty=true
                           	 prod.stocking=0
                           	 prod.date=Date.now()
                           
                             pop.find({pid:prod._id},function(err,pup){

                                for (var i=0;i<pup.length;i++){

                                   if (pup[i].id==prod._id){


                                            pop.findByIdAndDelete(pup[i]._id,function(err,info){

                                     })
                                   }
                                }
                             })                             
 
                             carts.find({pid:prod._id},function(err,allcart){

                                 for (var i=0;i<allcart.length;i++){

                                     carts.findByIdAndDelete(allcart[i]._id,function(err,info){


                                     })
                                 }
                             })  

                             wishlist.find({pid:prod._id},function(err,allwish){


                                 for(var i=0;i<allwish.length;i++){

                                     wishlist.findByIdAndDelete(allwish[i]._id,function(err,info){


                                     })
                                 }
                             })

                           }
                           prod.save()
                           
                           carts.find({pid:prod._id},function(err,allcarts){
                                  
                                 if(allcarts.length>0){ 
                                  for(var i=0;i<allcarts.lengthl;i++){

                                      carts.findById(allcarts[i]._id,function(err,cartinfo){
                                         if(cartinfo){ 
                                          if(cartinfo.qty>prod.stocking){

                                              carts.findByIdAndDelete(cartinfo._id,function(err,info){


                                              })
                                          }
                                        }
                                      })
                                    
                                  }
                                 }
                           })

                           if(req.body.method=="Stripe"){

                           	  var pay="Paid"
                           }
                           
                           
                          else if(req.body.method=="razorpay"){

                            var pay="Paid"
                          }  


                           else if (req.body.method=="Cash-On-Delivery"){
 
                                 var pay="Cash-On-Delivery"


          

                           }
                           
                            var id=""
     
                            if(users.offerHold==true){

                                     var amounts=(req.body.qty*prod.Price)-20
                                }
                                else if(users.offerHold==false){

                                        var amounts=req.body.qty*prod.Price


                                }
 
   
                            order.find({mainuser:req.user.username},function(err,orders){
                                  var flag=true
                                   
                                if(loc){ 
                                  for(var i=0;i<orders.length;i++){

                                           if(orders[i].lid==loc._id){

                                                 order.create({first:req.body.first,last:req.body.last,name:req.body.first +" "+req.body.last,city:req.body.city,phone:req.body.phone,roadNumber:req.body.road,landmark:req.body.landmark,Price:amounts,returnId:"",author:author,productD:prod.Name,qty:Number(req.body.qty),locality:req.body.locality,pay:pay,image:prod.image,returnQ:0,pid:prod._id,ifsc:"",account:"",cartId:"",ordered:"Ordered",dateone:Date.now(),shipped:"",outfor:"",update:"",autoCancel:false,mainuser:req.user.username,lid:loc._id,urls:prod.urls,leters:prod.leters,month:months[d.getMonth()]},function(err,order){
                            
                           
                                                      
                           
 
                                                     
                                         var transport=nodemailer.createTransport({
			                                  service:"gmail",
			                                  auth:{
				                               user:"grocery.ofc@gmail.com",
				                               pass:process.env.password
			                                  }
		                                       });	


			                             var mailoptions={
				                           from:"grocery.ofc@gmail.com",
				                           bcc:`${req.user.username}`,
				                           subject:"GroceryjI",
				                           html:`Hi,${req.user.first},welcome to GroceryjI<br>
                                           Your Order ${prod.Name}, Price: ${prod.Price},Qty:${req.body.qty} is successfully
                                           perchased..
                                           <br>
                                           Amount ${pay}:<b>${req.body.qty*prod.Price}</b>
				                            <br>
						                               
						
						
					                        <a href="https://grocery-ji.herokuapp.com/Orders/${order._id}"<button style=color:green>Check Your Order</button></a>						
						                                  
						                                  </form>
						                                     `
		 	               } 
                              console.log("hmmmmm")
				               transport.sendMail(mailoptions,function(err,info){
									if(err)
									{
										req.flash("error","something went wrong...");

									}
										else{
											console.log("here")

										}


			                                             


                                  })
                                 

                    })





                                                 console.log("here")
                                                 console.log(id)
                                                 flag=false
                                                 break        

                                           }

                               
                                 }                      
                                } 
                                 if(flag==true){

                                                        location.create({first:req.body.first,last:req.body.last,name:req.body.first +" "+req.body.last,city:req.body.city,phone:req.body.phone,roadNumber:req.body.road,landmark:req.body.landmark,Price:req.body.qty*prod.Price,returnId:"",author:author,productD:prod.Name,qty:Number(req.body.qty),locality:req.body.locality,pay:pay,image:prod.image,returnQ:0,pid:prod._id,ifsc:"",account:"",cartId:"",ordered:"Ordered",dateone:Date.now(),shipped:"",outfor:"",update:"",autoCancel:false,mainuser:req.user.username},function(err,loca){
                                                 
                                                    

                                                         order.create({first:req.body.first,last:req.body.last,name:req.body.first +" "+req.body.last,city:req.body.city,phone:req.body.phone,roadNumber:req.body.road,landmark:req.body.landmark,Price:amounts,returnId:"",author:author,productD:prod.Name,qty:Number(req.body.qty),locality:req.body.locality,pay:pay,image:prod.image,returnQ:0,pid:prod._id,ifsc:"",account:"",cartId:"",ordered:"Ordered",dateone:Date.now(),shipped:"",outfor:"",update:"",autoCancel:false,mainuser:req.user.username,lid:loca._id,urls:prod.urls,leters:prod.leters,month:months[d.getMonth()],offerHold:false},function(err,order){
                            
                           
                                                      
                           
 
                                                     
                                         var transport=nodemailer.createTransport({
			                                  service:"gmail",
			                                  auth:{
				                               user:"grocery.ofc@gmail.com",
				                               pass:process.env.password
			                                  }
		                                       });	


			                             var mailoptions={
				                           from:"grocery.ofc@gmail.com",
				                           bcc:`${req.user.username}`,
				                           subject:"GroceryJi",
				                           html:`Hi,${req.user.first},welcome to GroceryJi<br>
                                           Your order ${prod.Name}, Price: ${prod.Price},Qty:${req.body.qty} is successfully
                                           perchased..
                                           <br>
                                           Amount ${pay}:${req.body.qty*prod.Price}
				                            <br>
						                               
						
						
					                        <a href="https://grocery-ji.herokuapp.com/Orders/${order._id}"<button style=color:green>Check Your Order</button></a>						
						                                  
						                                  </form>
						                                     `
		 	               } 
                              console.log("hmmmmm")
				               transport.sendMail(mailoptions,function(err,info){
									if(err)
									{
										req.flash("error","something went wrong...");

									}
										else{
											console.log("here")

										}


			                                             


                                  })
                                 

                    })
                                 
                  
               
           
              })  
         
             }
        
        })                  
                          
          req.flash("success","product purchased successfully")
           res.redirect("/moreinfo/"+prod._id)
     }
      else{

          	req.flash("error","quantity is out of stock")
          	  res.redirect("back")
       } 	
   
   }
})
   })
})
})
app.get("/orders",isLoggedin,function(req,res){

	order.find({mainuser:req.user.username},function(err,orders){
	  if (orders.length>0){


		res.render("orders.ejs",{orders:orders})
	}
    else{
    	res.render("nomyorders.ejs")
    } 	
	})
})



app.get("/notifications/:id",function(req,res){

     pop.findById(req.params.id,function(err,popup){

         if(popup.api=="cart"){

             res.redirect("/cart")

         }
         else if(popup.api!=="vip"){

             res.redirect("/moreinfo/"+popup.id)
         }

         popup.updateOne({view:"viewed"},function(err,pp){


         })
     })
}) 



app.get("/orders/:id",function(req,res){

 user.findById(req.user._id).populate("pops").exec(function(err,users){
 	order.findById(req.params.id,function(err,orders){
		res.render("ordersmore.ejs",{orders:orders,users:users})
	})
})
})

app.get("/updateOrders/:id",function(req,res){

     	 location.findById(req.params.id,function(err,loc){

         res.render("updateOrder.ejs",{loc:loc})
   })

})

app.post("/updateOrders/:id",function(req,res){

	 location.findById(req.params.id,function(err,loc){

	 	            if(req.body.first){


                       loc.first=req.body.first
                       
                     }
                     if (req.body.last){

                        loc.last=req.body.last
                     } 
                        
                       loc.name=loc.first +" "+ loc.last 
                       if (req.body.phone){


                          loc.phone=req.body.phone
                        }
                       if (req.body.roadNumber){


                        loc.roadNumber=req.body.road
                      }
                       
                       if(req.body.city){


                        loc.city=req.body.city
                      }
                       
                       if(req.body.landmark){


                        loc.landmark=req.body.landmark
                      }
                      
                       if(req.body.locality){


                         loc.locality=req.body.locality
                       }
                   
                     loc.save()

	 	 order.find({lid:loc._id},function(err,orders){

	 	 	 orders.forEach(function(data){
                     
                     if(req.body.first){


                       data.first=req.body.first
                       
                     }
                     if (req.body.last){

                        data.last=req.body.last
                     } 
                        
                       data.name=data.first +" "+ data.last 
                       if (req.body.phone){


                          data.phone=req.body.phone
                        }
                       if (req.body.roadNumber){


                        data.roadNumber=req.body.road
                      }
                       
                       if(req.body.city){


                        data.city=req.body.city
                      }
                       
                       if(req.body.landmark){


                        data.landmark=req.body.landmark
                      }
                      
                       if(req.body.locality){


                         data.locality=req.body.locality
                       }
                   
                     data.save()	 	 	 
	 	 	 

	 	 	 })
	 	            req.flash("success","Updated,Go Back To Previous Page")
                   res.redirect("back")
	 	 })
	 })
})



app.get("/cancel/:id",function(req,res){

	order.findById(req.params.id,function(err,orders){
		
              

		res.render("cancel.ejs",{orders:orders})
	})
})


app.post("/cancel/:id",function(req,res){
 var flag=true
	order.findById(req.params.id,function(err,orders){
		product.findById(orders.pid).populate("stock").populate("ones").populate("twos").populate("notify").exec(function(err,prods){

		    
			
			if(orders.pay=="Cash-On-Delivery"){
			  var ifsc=""
			  var account=""
              var phone=orders.phone 
		   }
		   else{

		   	
		   	    var ifsc=req.body.ifsc
			  var account=req.body.account
			  var phone=req.body.number


		   	  }

		   	   orders.updateOne({returnId:orders._id,ifsc:ifsc,account:account,phone:phone,cDate:Date.now(),update:"Canceled",datefour:Date.now()},function(err,info){
  
              
                
			  console.log("total stock before cancel")
			  console.log(prods.stock.length)
		
  		
		
  })
	   
        if(orders.size){

            if(orders.size=="1L"){

                 if(prods.ones.length==0){
                      
                       prods.totalOne=0
            prods.save()
                user.find({},function(err,alluser){

                   for (var i=0;i<alluser.length;i++){
                      
                     user.findById(alluser[i]._id,function(err,infos){ 
                      for(var j=0;j<prods.notify.length;j++){

                          if (infos.username==prods.notify[j].username){


                                      pop.create({id:prods._id,text:prods.Name + "1L",image:prods.image,urls:prods.urls,view:""},function(err,pups){
                                         infos.pops.push(pups)
                                         infos.save()
                                       
                                       })
                                      
                                   
                              break
                          }
                           {

                           }
                      }

                    
                 
                  })
                 }                    
                }) 

            for( var n=0;n<prods.notify.length;n++){


                    var transport=nodemailer.createTransport({
                                              service:"gmail",
                                              auth:{
                                               user:"grocery.ofc@gmail.com",
                                               pass:process.env.password
                                              }
                                               });  

                                         var mailoptions={
                                           from:"grocery.ofc@gmail.com",
                                           bcc:`${prods.notify[n].username}`,
                                           subject:"GroceryJi",
                                           html:`Hi,welcome to GroceryJi<br>
                                           Your requested  product ${prods.Name}, Price: ${prods.Price},Size:${orders.size} is available
                                           in stock..
                                           <br>
                                           
                                            <br>
                                                       
                        
                        
                                            <a href="https://groceryji.herokuapp.com/moreinfo/${prods._id}"<button style=color:green>Check Your product Details</button></a>                       
                                                          
                                                          </form>`
                                    } 
                              
                             
                                   
 
                                      
                              console.log("hmmmmm")
                               transport.sendMail(mailoptions,function(err,info){
                                    if(err)
                                    {
                                        req.flash("error","something went wrong...");

                                        res.redirect("/login");
                                    }
                                        else{
                                            console.log("here")

                                        }


                                })


            }

                 }
          }  
           else if(orders.size=="2L"){

                if(prods.twos.length==0){
                      
                       prods.totalTwo=0
            prods.save()
                user.find({},function(err,alluser){

                   for (var i=0;i<alluser.length;i++){
                      
                     user.findById(alluser[i]._id,function(err,infos){ 
                      for(var j=0;j<prods.notify.length;j++){

                          if (infos.username==prods.notify[j].username){


                                      pop.create({id:prods._id,text:prods.Name + "2L",image:prods.image,urls:prods.urls,view:""},function(err,pups){
                                         infos.pops.push(pups)
                                         infos.save()
                                       
                                       })
                                      
                                   
                              break
                          }
                           {

                           }
                      }

                    
                 
                  })
                 }                    
                }) 

            for( var n=0;n<prods.notify.length;n++){


                    var transport=nodemailer.createTransport({
                                              service:"gmail",
                                              auth:{
                                               user:"grocery.ofc@gmail.com",
                                               pass:process.env.password
                                              }
                                               });  

                                         var mailoptions={
                                           from:"grocery.ofc@gmail.com",
                                           bcc:`${prods.notify[n].username}`,
                                           subject:"GroceryJi",
                                           html:`Hi,welcome to GroceryJi<br>
                                           Your requested  product ${prods.Name}, Price: ${prods.Price},Size:${orders.size} is available
                                           in stock..
                                           <br>
                                           
                                            <br>
                                                       
                        
                        
                                            <a href="https://groceryji.herokuapp.com/moreinfo/${prods._id}"<button style=color:green>Check Your product Details</button></a>                       
                                                          
                                                          </form>`
                                    } 
                              
                             
                                   
 
                                      
                              console.log("hmmmmm")
                               transport.sendMail(mailoptions,function(err,info){
                                    if(err)
                                    {
                                        req.flash("error","something went wrong...");

                                        res.redirect("/login");
                                    }
                                        else{
                                            console.log("here")

                                        }


                                })


            }


           }


        }         
      }  
      else{
         if(prods.stock.length==0){

            prods.stocking=0
            prods.save()
                user.find({},function(err,alluser){

                   for (var i=0;i<alluser.length;i++){
                      
                     user.findById(alluser[i]._id,function(err,infos){ 
                      for(var j=0;j<prods.notify.length;j++){

                          if (infos.username==prods.notify[j].username){


                                      pop.create({id:prods._id,text:prods.Name,image:prods.image,urls:prods.urls,view:""},function(err,pups){
                                         infos.pops.push(pups)
                                         infos.save()
                                       
                                       })
                                      
                                   
                              break
                          }
                           {

                           }
                      }

                    
                 
                  })
                 }                    
                }) 

            for( var n=0;n<prods.notify.length;n++){


                    var transport=nodemailer.createTransport({
			                                  service:"gmail",
			                                  auth:{
				                               user:"grocery.ofc@gmail.com",
				                               pass:process.env.password
			                                  }
		                                       });	

			                             var mailoptions={
				                           from:"grocery.ofc@gmail.com",
				                           bcc:`${prods.notify[n].username}`,
				                           subject:"GroceryJi",
				                           html:`Hi,welcome to GroceryJi<br>
                                           Your requested  product ${prods.Name}, Price: ${prods.Price} is available
                                           in stock..
                                           <br>
                                           
				                            <br>
						                               
						
						
					                        <a href="https://groceryji.herokuapp.com/moreinfo/${prods._id}"<button style=color:green>Check Your product Details</button></a>						
						                                  
						                                  </form>`
						            } 
                              
                             
                                   
 
                                      
                              console.log("hmmmmm")
				               transport.sendMail(mailoptions,function(err,info){
									if(err)
									{
										req.flash("error","something went wrong...");

										res.redirect("/login");
									}
										else{
											console.log("here")

										}


			                    })


            }
}

}


    if(orders.size){


          if(orders.size=="1L"){


              var i=0; 
                 var p=0; 
                 prods.totalOne=prods.totalOne+orders.qty
                 prods.emptyOne=false
                 prods.date=Date.now()

                 for ( i=0;i<orders.qty;i++){

                      console.log("hitted")
                    
                    one.create({id:prods._id},function(err,sto){
                        console.log(sto)
                        prods.ones.push(sto)
                        console.log(i)
                        if(p==orders.qty-1){
                         console.log("total stock after cancel")
                          console.log(prods.stock.length)   
                            prods.save()
                        
                        }   
                        p=p+1

                    })
                 
                 
                 }


          }

       if(orders.size=="2L"){


              var i=0; 
                 var p=0; 
                 prods.totalTwo=prods.totalTwo+orders.qty
                 prods.emptyTwo=false
                 prods.date=Date.now()

                 for ( i=0;i<orders.qty;i++){

                      console.log("hitted")
                    
                    two.create({id:prods._id},function(err,sto){
                        console.log(sto)
                        prods.twos.push(sto)
                        console.log(i)
                        if(p==orders.qty-1){
                         console.log("total stock after cancel")
                          console.log(prods.stock.length)   
                            prods.save()
                        
                        }   
                        p=p+1

                    })
                 
                 
                 }


          }



    } 
        

     else{

         var i=0; 
         var p=0; 
		 prods.stocking=prods.stocking+orders.qty
		 prods.empty=false
		 prods.date=Date.now()

		 for ( i=0;i<orders.qty;i++){

              console.log("hitted")
		 	
		 	stocks.create({id:prods._id},function(err,sto){
		 		console.log(sto)
		 		prods.stock.push(sto)
		 		console.log(i)
		 	    if(p==orders.qty-1){
		 	     console.log("total stock after cancel")
			      console.log(prods.stock.length)	
		 	    	prods.save()
		 	    
		 	    }	
		 	    p=p+1

		 	})
		 
		 
		 }
          
            
         
   }






            if(orders.pay=="Cash-On-Delivery"){

            	var status=""
            }
            else{

            	var status="Refundable"
            }

            var transport=nodemailer.createTransport({
			                                  service:"gmail",
			                                  auth:{
				                               user:"grocery.ofc@gmail.com",
				                               pass:process.env.password
			                                  }
		                                       });	

			                             var mailoptions={
				                           from:"grocery.ofc@gmail.com",
				                           bcc:`${req.user.username}`,
				                           subject:"GroceryJi",
				                           html:`Hi,${req.user.first},welcome to GroceryJi<br>
                                           Your Cancellation request ${prods.Name}, Price: ${prods.Price},Qty:${orders.qty} is successfully
                                           submitted..
                                           <br>
                                           Amount ${status}:${orders.Price}
				                            <br>
						                               
						
						
					                        <a href="https://groceryji.herokuapp.com/Orders/${orders._id}"<button style=color:green>Check Your Order</button></a>						
						                                  
						                                  </form>`
						            } 
                              
                             
                                   
 
                                      
                              console.log("hmmmmm")
				               transport.sendMail(mailoptions,function(err,info){
									if(err)
									{
										req.flash("error","something went wrong...");

										res.redirect("/login");
									}
										else{
											console.log("here")

										}


			                    })	  
                                
                                req.flash("success","Request submitted successfully")
                                res.redirect("/orders/"+orders._id)  

	})

})

})


app.get("/mydata",function(req,res){

   product.find({},function(err,data){
         
         var mains=JSON.stringify(data,null,2)
         fs.writeFile("./grocery.json",mains,finished)
         function finished(){

             fs.readFile("./grocery.json","utf-8",function(err,all){

             	var finallys=JSON.parse(all)
                res.send(finallys)   
             })         	
         }
   })
})

app.get("/review",function(req,res){

     product.find({key:"jeeras"},function(err,allpr){

         for(var i=0;i<allpr.length;i++){

             product.findById(allpr[i]._id,function(err,foundp){

                 foundp.updateOne({stocking:5},function(err,info){

                 })
             })
         }
     })
     res.send("all updated")
})

app.get("/data/:product",function(req,res){
	request(`https://www.flipkart.com/search?q=${req.params.product}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`,function(error,response,html){
	if(!error && response.statusCode==200)
	{
		const $=cheerio.load(html)
		// console.log(html)
		$("._4ddWXP").each(function(i,el){
			var datas=$(el)
			console.log(datas.find(".s1Q9rs").attr("title"))
			var val=datas.find("._30jeq3").text()
			var final=""
			var lets=""
			console.log(".........................................")
			// if(datas.find("._3Djpdu").text()){
			//  lets=datas.find("._3Djpdu").text()
			// }
			// else{

               
  	// 		}
			console.log(".........................................")
			for(var i=1;i<val.length;i++){
							final=final+val[i]

			}
			if (final==""){
				console.log("here")
                var final=Math.floor(Math.random()*123)

			    console.log(final)
			 }
			console.log(".............")
			console.log(Number(final))
			console.log(".............")
			console.log(datas.find("._396cs4").attr("src"))	
		    var vals=datas.find("._3I9_wc").text()
		    var finals=""
		    for (var i=1;i<vals.length;i++){

		    	finals=finals+vals[i]
		    }
		    if (Number(finals)==0){
 
                    console.log("here")

				    var finals=Math.floor(Math.random()*123)
			        console.log(finals)		    
			  }
		    console.log(final)
		    var info=""
		    info=datas.find("._3Ay6Sb").text()
		    if (info==""){
		       if (finals && final){
                 info=`${parseInt((Number(final)*100)/Number(finals))} % off`
		       }
		       else{

		       	 info="28 % off"
		       }
		    }
			// product.deleteOne({key:"buiscuits"},function(err,info){

			// })
			product.create({image:datas.find("._396cs4").attr("src"),Name:datas.find(".s1Q9rs").attr("title"),Price:Number(final),offer:Number(finals),off:info,key:`${req.params.product}`,ratings:datas.find("._3LWZlK").text(),empty:false,stocking:5,date:Date.now(),urls:"URL",leters:""},function(err,products){
			if (products!==undefined){
 	
		      // coproduct.create({image:datas.find("._396cs4").attr("src"),Price:Number(final),offer:Number(finals),key:`${req.params.product}s`,ratings:datas.find("._3LWZlK").text(),pid:products._id},function(err,cos){
		                var p=0



		                  stocks.create({id:products._id},function(err,stoOne){
		                  stocks.create({id:products._id},function(err,stotwo){
		                  stocks.create({id:products._id},function(err,stothree){
		                  stocks.create({id:products._id},function(err,stofour){
		                  stocks.create({id:products._id},function(err,stofive){
                         
                          
                           
                           
                           
                           products.stock.push(stoOne)
                           products.stock.push(stotwo)
                           products.stock.push(stothree)
                           products.stock.push(stofour)
                           products.stock.push(stofive)
                           

                          

                           products.save()
                            
                           
		                  

                          }) 
                          })
                          })
                          })
                          })
                    
              console.log(products)
		// })	
          }  
		})	
		// 	if(datas.find(".FHCV02u6Cp2zYL0fhQPsO").text()!==""){


		// 	console.log("comments.....")

		// 	console.log(datas.find(".FHCV02u6Cp2zYL0fhQPsO").text())
		// }
		})
	 
   }
   res.send("Done")

})	
})




app.get("/increaseStockOne/:id/:stock",isLoggedin,function(req,res){
  
  if(req.user.approval==true){
   request(`https://api-groceryji.herokuapp.com/increaseStockOne/${req.params.id}/${req.params.stock}`,function(error,response,data){
         var items=[]
         if(!error && response.statusCode==200){
             
                          
       req.flash("success","Stock is Increased")
            res.redirect("back")     
              
           
         }
     }) 
   }
   else{

    res.render("noaprove.ejs")
   }
})


app.get("/increaseStockTwo/:id/:stock",isLoggedin,function(req,res){
  
  if(req.user.approval==true){
      request(`https://api-groceryji.herokuapp.com/increaseStockTwo/${req.params.id}/${req.params.stock}`,function(error,response,data){
         var items=[]
         if(!error && response.statusCode==200){
             
                          
            req.flash("success","Stock is Increased")
            res.redirect("back")     
              
           
         }
     })    
    }
    else{

        res.render("noaprove.ejs")
    }
})

app.get("/increaseStock/:id/:stock",isLoggedin,function(req,res){
  
  if(req.user.approval==true){
	 request(`https://api-groceryji.herokuapp.com/increaseStock/${req.params.id}/${req.params.stock}`,function(error,response,data){
         var items=[]
         if(!error && response.statusCode==200){
             
                          
            req.flash("success","Stock is Increased")
            res.redirect("back")     
              
           
         }
     }) 
   }
   else{
    res.render("noaprove.ejs")
   }
})


app.get("/addProduct",function(req,res){

	res.render("addProduct.ejs")
})

app.get("/deleteProduct/:id",function(req,res){

  request(`https://api-groceryji.herokuapp.com/deleteProduct/${req.params.id}`,function(error,response,data){
         if(!error && response.statusCode==200){
             
              
             
              req.flash("success","product is deleted")
              res.redirect("back")
           

        }



})
})


// app.get("/addProduct/2we34rre43",isLoggedin,function(req,res){
 
// if(req.user.approval==true){
//  if(parseInt(req.body.actual)>parseInt(req.body.offer)){  


//    if (req.files){

//   	 var file=req.files.filename,
//   	 filesname=file.name;
//   	 file.mv("./public/"+filesname)
// }
  
 




  
 
  
//    if (req.body.image){

//   	 var filesname=req.body.image
//   }
    

 
//    var calc=parseInt((req.body.offer*100)/req.body.actual) 
//    var total=`${calc} % off`
   
//    product.create({Name:req.body.name,Price:parseInt(req.body.offer),offer:parseInt(req.body.actual),off:total,image:filesname,stocking:req.body.stock,empty:false,date:Date.now(),key:req.body.keys,urls:req.body.urls},function(err,prod){
//         var p=0
//         for (var i=0;i<parseInt(req.body.stock);i++){

//         	 console.log(i)
//         	 stocks.create({id:prod._id},function(err,stoc){

//         	 	prod.stock.push(stoc)
//         	    console.log(prod)
//         	  p=p+1
//               if(p==parseInt(req.body.stock)){
//                 console.log(p)
//              	prod.save()
//                }
//         })
            
//         }
   
//     user.find({},function(err,users){

//       var p=0
//        for (var i=0;i<users.length;i++){
      

//         user.findById(users[i]._id,function(err,us){
//           pop.create({id:prod._id,image:prod.image,urls:prod.urls,text:prod.Name,view:""},function(err,pup){
//             if(!us.notinum){
//                  us.notinum=0
//             } 
//             us.pops.push(pup)
//             us.notinum=us.notinum+1
               
//             us.save()  
              
          
             

//           }) 
//         })   
//          var transport=nodemailer.createTransport({
//             service:"gmail",
//             auth:{
//                 user:"grocery.ofc@gmail.com",
//                 pass:process.env.password
//             }
//         }); 


//             var mailoptions={
//                 from:"grocery.ofc@gmail.com",
//                 bcc:`${users[i].username}`,
//                 subject:"GroceryJi",
//                 html:`<div align=center><b>Hi,${users[i].first}</b><br><b>${prod.Name} New Product Added<br></b>
//                         <a href=https://grocery-ji.herokuapp.com/moreinfo/${prod._id}><b>Check It Out</b></b></a></div>
                        
                        
                       
//                         `
//             }
//                 console.log("hmmmmm")
//                 transport.sendMail(mailoptions,function(err,info){
//                     if(err)
//                     {
//                         res.redirect("/moreinfo/"+prod._id)
//                     }
//                         else{
//                             console.log("here")

//                         }


                

// })


//        }

    
//     })  
  
//    })

//    req.flash("success","product added successfully")
//    res.redirect("/groceryProduct")
// }
// else{

// 	console.log("here")
// 	req.flash("error","Actual price of product should be greater than offer price of product")
// 	res.redirect("back")
// }
// }
// else{

//     res.render("noaprove.ejs")
// }
// })


app.get("/groceryProduct",isLoggedin,function(req,res){
 
 if(req.user.approval==true){  
 
   if(!req.query.search){


request("https://api-groceryji.herokuapp.com/groceryProduct",function(error,response,data){
	 	 
if(!error && response.statusCode==200){
             
              var prods=JSON.parse(data)
             

                        res.render("allproducts.ejs",{prods:prods})

           
         }            	 	  
  

	 })
}

else{

	var searches=req.query.search
    var search=searches.toLowerCase()
request("https://api-groceryji.herokuapp.com/groceryProduct",function(error,response,data){
         
      if(!error && response.statusCode==200){
              
              var prods=JSON.parse(data)
             


           
          


        var C=[]
        
        for (var i=0;i<prods.length;i++){

        	 for (var p=0;p<search.length;p++){

        	 	 k=p
        	 	 var flag=true
        	 	 for (var j=0;j<prods[i].key.length-1;j++){

        	 	 	  if(prods[i].key[j]!==search[k]){

        	 	 	  	  flag=false
        	 	 	  	  break
        	 	 	  }
        	 	     k++
        	 	 }
        	   
        	     if (flag==true){
                    
     request(`https://api-groceryji.herokuapp.com/groceryProduct/${prods[i].key}`,function(error,response,datas){
	 	 
	 	             if(!error && response.statusCode==200){
              
                         var allprods=JSON.parse(datas)
             
 



                       res.render("allproducts.ejs",{prods:allprods})
                    }	         

             })
                 
                  C.push(0)
                  prods=[]
                  break
        	     
        	     }
        	 }
        }
  
     if(C.length==0){

         res.render("allproducts.ejs",{prods:0})


     }
}
})

}
}
else{

    res.render("noaprove.ejs")
}
})

app.get("/outof",isLoggedin,function(req,res){
 
  if(req.user.approval==true){
	 

request("https://api-groceryji.herokuapp.com/groceryProduct",function(error,response,data){
         
if(!error && response.statusCode==200){
             
              var prods=JSON.parse(data)
             


           
      var data=0 	  
      for(var i=0;i<prods.length;i++){
           
            if(prods[i].empty && prods[i].empty==true || prods[i].emptyOne && prods[i].emptyOne==true || prods[i].emptyTwo && prods[i].emptyTwo==true){
        
            data=data+1

        }
      
      }
	 
     	if(data>0){


	 	  res.render("out.ejs",{prods:prods})
	 }
	 else{

	 	  	res.render("noout.ejs")

	 }
	 }
     })
 }
 else{

    res.render("noaprove.ejs")

 }
})

app.post("/picture/:id/:key",function(req,res){
  
token.findOne({code:req.body.token},function(err,tokens){
  if(tokens){ 
   user.findById(req.params.id,function(err,users){ 
     res.render("picture.ejs",{users:users,key:req.params.key})
  
    
  })
   }
   else{
     
     res.redirect("https://userverify-groceryji.herokuapp.com/")
   }
  })
})




app.post("/registering",function(req,res){
 user.findOne({username:req.body.username},function(err,users){
  if (users!==null){
    req.flash("error","Admin already exists")
    res.redirect("back")	
  }
  else{
     if (req.files){

     var file=req.files.filename,
     secondfile=req.files.filenameone,

     filesname=file.name,
     filesnamesecond=secondfile.name;
     file.mv("./public/"+filesname)
     secondfile.mv("./public/"+filesnamesecond)
     
}
  
   



    console.log("here")
    var code=Math.floor(Math.random()*11223)
    var transport=nodemailer.createTransport({
			service:"gmail",
			auth:{
				user:"grocery.ofc@gmail.com",
				pass:process.env.password
			}
		});	


			var mailoptions={
				from:"grocery.ofc@gmail.com",
				bcc:`${req.body.username}`,
				subject:"AdminGroceryJi",
				html:`Hi,${req.body.first},welcome to Admin panel of GroceryJi<br>please activate your adminAccount<br>
						Your activation code is <b>${code}</b>
						
						
						</form>
						`
			}
                console.log("hmmmmm")
				transport.sendMail(mailoptions,function(err,info){
					if(err)
					{
						req.flash("error","something went wrong...");

						res.redirect("/login");
					}
						else{
							console.log("here")
                      if(req.body.token){
						    
                            user.find({},function(err,admins){
                            var flag=true
                            for(var i=0;i<admins.length;i++){

                                 if(admins[i].token==req.body.token){

                                    

                                     flag=false
                                  
                                                    
                                               
                                     res.render("active.ejs",{first:req.body.first,username:req.body.username,last:req.body.last,password:req.body.password,number:code,image:filesname,imagerear:filesnamesecond,token:req.body.token})
                                              
                                                   
                                                
                                     
                                     break
                                 }
                            }
                           
                        if(flag==true){
                            req.flash("error","No approved token is provided")
                           res.redirect("/token")
                        }
                        })
                      }
                      else{
                        req.flash("error","No approved token is provided")
                        res.redirect("/token")
					}	
                     
                        }


				

})

}
})
})

app.get("/forgot",function(req,res){
	res.render("forget.ejs")
})



app.post("/forgot",function(req,res){
user.findOne({username:req.body.username},function(err,users){
  
 if(users.approval==true){ 
  if (users){	
	var transport=nodemailer.createTransport({
		service:"gmail",
		auth:{
			user:"grocery.ofc@gmail.com",
			pass:process.env.password
		}
	})
 
    var mailoptions={
				from:"grocery.ofc@gmail.com",
				bcc:`${req.body.username}`,
				subject:"GroceryJi",
				html:`Hi,${users.first},welcome to admin panel of GroceryJi<br>Reset Your Password<br>
						<a href="https://admin-groceryji.herokuapp.com/set/${users._id}">Change Password</a>
						
						
						</form>
						`
			} 

 
             transport.sendMail(mailoptions,function(err,info){
  	              if(err){
                     req.flash("error","cant send the mail")
  		             res.redirect("back")
  	            }
                else{

    	             req.flash("success","mail sent")
    	             res.redirect("back")
                 }
  })
}
else{
	req.flash("error","No adminUser found")
	res.redirect("back")
}
}
else{

    
    res.render("noaprove.ejs")
}
})
})



app.get("/set/:id",function(req,res){

 
	user.findById(req.params.id,function(err,user){
		res.render("set.ejs",{user:user})
	})
})






app.post("/setPassword",function(req,res){
	user.findOne({username:req.body.username},function(err,users){
      if(users.approval==true){
        if (req.body.password==req.body.confirm){

		users.setPassword(req.body.password,function(err,users){
			users.save()
			req.flash("success","Password changed")
			res.redirect("/")
		})
	
	}
    else{
        req.flash("error","Password not matched") 
    	res.redirect("back")
    }

	  }
      else{

        res.render("noaprove.ejs")
      }
 
	})
})


app.get("/settoken/:id",function(req,res){

  
    user.findById(req.params.id,function(err,users){
    if(users.approval==true){
        res.render("setToken.ejs",{users:users})
    }
    else{

        res.render("noaprove.ejs")
    }
    })
})



app.post("/setTokenPassword",function(req,res){
    user.findOne({email:req.body.username},function(err,users){
    user.findOne({token:req.body.token},function(err,infotoken){
  if(infotoken){
     
      req.flash("error","provided token already exist!")
      res.redirect("back")
  }
    else{
      if(users.approval==true){
  

     users.updateOne({token:req.body.token},function(err,info){
            
            req.flash("success","Token changed")
            res.redirect("/")
        })
    
    
    
     }
      
      else{

        res.render("noaprove.ejs")
      }
 
       }
       })  
     
  })
  
})




app.post("/setToken",function(req,res){
user.findOne({email:req.body.email},function(err,users){
  
 if(users.approval==true){ 
  if (users){   
    var transport=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"grocery.ofc@gmail.com",
            pass:process.env.password
        }
    })
 
    var mailoptions={
                from:"grocery.ofc@gmail.com",
                bcc:`${req.body.email}`,
                subject:"GroceryJi",
                html:`Hi,${users.first},welcome to admin panel of GroceryJi<br>Reset Your Token<br>
                        <a href="https://admin-groceryji.herokuapp.com/settoken/${users._id}">Change Token</a>
                        
                        
                        </form>
                        `
            } 

 
             transport.sendMail(mailoptions,function(err,info){
                  if(err){
                     req.flash("error","cant send the mail")
                     res.redirect("back")
                }
                else{

                     req.flash("success","mail sent")
                     res.redirect("back")
                 }
  })
}
else{
    req.flash("error","No adminUser found")
    res.redirect("back")
}
}
else{

    
    res.render("noaprove.ejs")
}
})
})



app.post("/registered",function(req,res){
			// if(req.files)
			// {
			// 	var file=req.files.filename,
			// 		filesname=file.name;
			// 		file.mv("./public/"+filesname);
			// }
			if(req.body.two)
			{
			if(req.body.one!==req.body.two)
			{
				 req.flash("error","Your code was wrong,it's destroyed,try again...")
				 res.redirect("/login")
			}
			
		   	
			
			else{
			
              user.find({},function(err,admins){
             var flag=true
             for(var i=0;i<admins.length;i++){

                 if(admins[i].token==req.body.token){

                      flag=false
                     user.findByIdAndDelete(admins[i]._id,function(err,info){

                     })         
                    
                    break
                 }
              }
  
         if(flag==false){  
            user.register(new user({first:req.body.first,last:req.body.last,email:req.body.username,name:req.body.first + " " + req.body.last,username:req.body.username,image:req.body.files,imagerear:req.body.filesrear,offerHold:false,token:req.body.token,approval:false,date:Date.now()}),req.body.password,function(err,users){
					
		
        if(err)
		{
			
				console.log(err);
			return res.redirect("/login");	
		}
	
			
			
			passport.authenticate("local")(req,res,function(){

                    req.flash("success","successfully Registered...");
                res.redirect("/");
                
               
				
			});
		

});	
}
})

}

}
else{
		req.flash("error","Please give the code as input...")
		res.redirect("back")

}
});

app.get("/token",function(req,res){

     res.render("token.ejs")
})



app.get("/logout",function(req,res){

	req.logout()
   req.flash("success","We Have Logged You Out!")
   res.redirect("/token")

})



app.get("/myprofile/:id",isLoggedin,function(req,res){
 
 if(req.user.approval==true){
  user.findById(req.params.id,function(err,users){
     res.render("profileadmin.ejs",{users:users})
    
  })
 }
 else{
    res.render("noaprove.ejs")
 } 
})


app.post("/updateprofile/:id",isLoggedin,function(req,res){

 if(req.user.approval==true){
     user.findById(req.params.id,function(err,users){
         if (req.body.username==users.username){       
  
          users.updateOne({first:req.body.first,last:req.body.last,name:req.body.first + " " +req.body.last,phone:req.body.phone,username:req.body.username,locality:req.body.local,city:req.body.city,age:req.body.age,road:req.body.road},function(err,info){

              
         req.flash("success","successfully Updated")
         res.redirect("back") 
       

          })
         }
         else{

       user.findOne({username:req.body.username},function(err,foundu){ 
      if(foundu==null){
          users.updateOne({first:req.body.first,last:req.body.last,name:req.body.first + " " +req.body.last,phone:req.body.phone,username:req.body.username,locality:req.body.local,city:req.body.city,age:req.body.age,road:req.body.road},function(err,info){

              req.flash("success","you are logged out,for changing the email id")
              res.redirect("/logout")
       

          })

      }
      else{

         res.send("<h1 align=center>User Already Exist With That Username</h2>")
      }
    })
         } 
     
 
   })
 }
 else{

     res.render("noaprove.ejs")
 }
})






app.post("/login",passport.authenticate("local",{
successRedirect:"/", 
failureRedirect:"/login"
}),function(req,res){

});



app.get("/",isLoggedin,function(req,res){
 
 
request(`https://api-groceryji.herokuapp.com/orders`,function(error,response,data){
         var items=[]
         if(!error && response.statusCode==200){
             
              var orders=JSON.parse(data)
             

              
           
         


 var totalSum=0
if(req.user.approval==true){  
 if(!req.query.search){

   if (orders.length>0){

  	 for (var i=0;i<orders.length;i++){

  	 	if (orders[i].returnId==""){

  	 		 totalSum=totalSum+orders[i].Price
  	 	}
  	 } 

  	 res.render("adminOrders.ejs",{orders:orders,totalSum:totalSum,search:""})
   }
   
   else{

   	    	 res.render("noOrders.ejs")

   }
  
}
else{

	var key=req.query.search
    var find=[]

       
       for (var i=0;i<orders.length;i++){


           for (var j=0;j<orders[i].name.length;j++){

              var k=j
              var flag=true
              for (var p=0;p<key.length;p++){

                  if(orders[i].name[k].toLowerCase()!==key[p].toLowerCase()){

                      flag=false
                      break

                  
                    
              

                  }
                  k=k+1 

              
              }
            
              if (flag==true){
                 find.push(0)
            request(`https://api-groceryji.herokuapp.com/key/${orders[i].name}`,function(error,response,data){
                     var items=[]
                     if(!error && response.statusCode==200){
                         
                          var orderf=JSON.parse(data)
                         

                          
                       
                     }

                      var totals=0
                      for (var x=0;x<orderf.length;x++){

                         if(orderf[x].returnId==""){

                             totals=totals+orderf[x].Price

                         }
                      }
                   

                           res.render("adminOrders.ejs",{orders:orderf,totalSum:totals,search:key})
     })       


                 
                 
                 var orders=[]
                 break
               }

           }
       }

       if(find.length==0){

                res.render("nocustomer.ejs")

       }
    

 
}
}
else{

     res.render("noaprove.ejs")
}
}
})
})
app.get("/statusChange/:id/:key",function(req,res){

 request(`https://api-groceryji.herokuapp.com/statusChange/${req.params.id}/${req.params.key}`,function(error,response,data){
         var items=[]
         if(!error && response.statusCode==200){
             
                          
       req.flash("success","Order Is Updated")
            res.redirect("back")     
              
           
         }
     })    
   

})

app.get("/allcancelOrders/:key",isLoggedin,function(req,res){

 if(req.user.approval==true){
	
request(`https://api-groceryji.herokuapp.com/allcancelOrders/${req.params.key}`,function(error,response,data){
         var items=[]
         if(!error && response.statusCode==200){
             
       var orders=JSON.parse(data)                   
      if (orders.length>0){

         res.render("cancels.ejs",{orders:orders,key:req.params.key})
      }
      else{
                 res.render("noOrders.ejs")

      } 
              
           
         }
     }) 

      
      
	 
 }
 else{

     res.render("noaprove.ejs")
 }
})





function isLoggedin(req,res,next){



    if(req.isAuthenticated())
     {
        return next();
     }

      
          
         res.redirect("/token")
         
    

   
 
 	
}  
    
	


app.listen(port,function(){

	console.log("server 4 has started")
})
