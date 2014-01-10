var databaseUrl = 'clogdb';
var collections = ['posts'];
var db = require('mongojs').connect(databaseUrl, collections);
var cache = require('memory-cache');


module.exports = function(req,res){
    var posts = cache.get('posts');
    console.log('posts: ' + posts);
    if(posts){
        console.log('Used Cache');
        res.render('posts', {posts:posts});
    }
    else{
        console.log('Using DB');
        db.posts.find().toArray(function(err, items){
            if (err) res.send(err);
            else{
                cache.put('posts', items);
                res.render('posts', {posts: items});
            }
        });
    }
};