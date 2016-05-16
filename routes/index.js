var express = require('express');
var router = express.Router();

var User = require("../models/user");
var passport = require("passport");
var mongoose = require("mongoose");

var Strategy = require("passport-local").Strategy;
var config = require("../config");
var yelp = require("yelp");

mongoose.connect(config.url, function(err,db){
    if(err){
        return console.log("failed to connect to database", err);
    }
    console.log('connected to database');
});


//configure passport
router.use(passport.initialize());
passport.use(new Strategy(User.authenticate()));

//configure yelp
var yelp = new yelp({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  token: config.token,
  token_secret: config.token_secret,
});


router.get('/', function(req,res){
    res.render("index");
});

router.get("/register", function(req,res){
    res.render("register");
});


router.get('/search/bars/:area', function(req,res){
    
    yelp.search({ term:'bars', location:req.params.area, limit:10 }, function(err, business){
        if(err){
            return console.log(err);
        }
        res.json(business.businesses);
    });
});


router.post('/register', function(req,res,next){
  var user = new User();
  
  user.username = req.body.username;

  user.setPassword(req.body.password);

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()});
  });
});


router.post('/login', function(req, res, next){

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});



module.exports = router;
