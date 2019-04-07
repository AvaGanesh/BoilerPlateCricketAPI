// KA
var express = require('express')
var app = express()
var mongo = require('mongoose')
var bodyParser = require('body-parser')

console.log("Working")
app.set("view engine", "ejs");
var Schema = mongo.Schema;
var ObjectId = Schema.ObjectId;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))


// ​"1"​: {
// ​"team1_name"​: ​"RCB"​,
// ​"team2_name"​: ​"CSK"​,
// ​"team1_logourl"​:
// "https://boilerplate.in/private/logos/rcb.png"​,
// ​"team2_logourl"​:
// "https://boilerplate.in/private/logos/csk.png"​,
// ​"match_date"​: ​"06/4/2019"​,
// ​"match_location"​: ​"Chinnaswamy Stadium, Bangalore"
// }
var teamSchema = new Schema({
	  	  id : Number,
	  	  team1Name:String,
		  team2Name: String,
		  team1Logourl:String,
		  team2Logourl:String,
		  matchDate: Date,
		  matchLocation:String,
		  matchPrediction:String
});

var mongoConnection = mongo.connect('mongodb://localhost/cricketdb', {useNewUrlParser: true});
var team = mongo.model("team",teamSchema);


var db = mongo.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected");
});

var collection = db.collection('teams');
app.get("/",function(req,res){
	res.render("main");
})

app.get("/allteams",function(req,res) {
	collection.find({}).toArray(function(err,result){
		if(err){
			console.log(err);
		}else{
			 res.send(JSON.stringify(result));
		}
	})
});

app.get("/match/:id",function(req,res) {
	// body...
	var parId = req.params.id;
	collection.find({}).toArray(function(err,result){
	if(err){
			console.log(err);
	}else{
			var resultArray = Array.from(result);
			console.log(resultArray[parId]);
			res.send(resultArray[parId+1]);
	}
	});	
});


app.post("/matchDetails",function(req,res) {
	var team1 = req.body.team1;
	console.log(req.body.team1);
	console.log(team1);
    var team2 = req.body.team2;
	var team1_logourl = req.body.logo1;
	var team2_logourl = req.body.logo2;
	var date = req.body.date;
	var location = req.body.location;
	if(team1.length==0||team2.length==0||team1_logourl.length==0||team2_logourl.length==0||date.length==0||location.length==0){
		res.send("Enter all the details");
	}else{
		var myData = {team1: team1,team2: team2,team1_logourl:team1_logourl,team2_logourl:team2_logourl,date:date,location: location};
   		collection.insert(myData,function(err,result){
   		if(err){
   			console.log(err);
   		}else{
   			console.log(result);
   			res.send(result);	
   		}
   	});	
	}
	
});

app.listen(3000,()=>{
  console.log("Server started in port",process.env.port);
});

