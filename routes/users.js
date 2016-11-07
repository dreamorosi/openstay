var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/userlist', function(req, res){
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{},function(e, docs){
    res.json(docs)
  });
});

router.delete('/deleteuser/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  var userToDelete = req.params.id;
  collection.remove({ '_id' : userToDelete }, function(err) {
      res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});

router.get('/search/:q', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({"fullname": new RegExp(req.params.q,'gi')},{},function(e, docs){
    res.json(docs);
  });
});

module.exports = router;
