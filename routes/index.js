var express = require('express');
var router = express.Router();

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Hello World page */
router.get('/hello', function(req, res) {
  res.render('helloworld', { title: 'Hello, World!'});
});

/* GET Userlist page */
router.get('/userlist', function(req, res) {
  // Select db from req (request)
  var db = req.db;
  // Select collection
  var collection = db.get('usercollection');
  // Find in collection and feed results (docs) to render
  collection.find({},{},function(e, docs){
    res.render('userlist', {
      "userlist" : docs
    });
  });
});

/* GET New User page */
router.get('/newuser', function(req, res) {
  res.render('newUser', { title: 'Add New User' });
});

/* POST to add user service */
router.post('/adduser', function(req, res) {
  var db = req.db;
  // Get form values, rely on "name" attribute
  var userName = req.body.username;
  var userEmail = req.body.useremail;
  var fullName = req.body.fullName;
  var age = req.body.age;
  var gender = req.body.gender;
  var location = req.body.location;

  // If empty render the form again with errors
  if(userName.isEmpty() || userEmail.isEmpty()){
    res.render('newUser', { title: 'Add New User', error: { mail : 1 , user : 1}});
    return
  }
  var collection = db.get('usercollection');
  // Submit to DB
  collection.insert({
    "username" : userName,
    "email" : userEmail,
    "fullname" : fullName,
    "age" : age,
    "gender" : gender,
    "location" : location
  }, function (err, doc){
    if(err){
      res.send("There was a problem adding the record");
    }else{
      // Forward to success page
      res.redirect('/');
    }
  });
});

module.exports = router;
