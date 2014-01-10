var databaseUrl = 'clogdb';
var collections = ['posts'];
var db = require('mongojs').connect(databaseUrl, collections);

module.exports = function(req,res){
    res.render('test');
    db.posts.save({email: "srirangan@gmail.com", password: "iLoveMongo", sex: "male"}, function(err, saved) {
        if( err || !saved ) res.send("err: " + err);
        else res.send("saved: " + saved);
    });
};