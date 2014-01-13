var databaseUrl = 'clogdb';
var collections = ['posts'];
var db = require('mongojs').connect(databaseUrl, collections);
var cache = require('memory-cache');

function switchOrder(posts){
    var finalPosts = [];
    for(var x = posts.length -1; x >=0; x--){
        finalPosts.push(posts[x]);
    }
    return finalPosts;
}

module.exports = function(req,res){
    var posts = cache.get('posts');
    if(posts){
        console.log('Used Cache');
        res.render('posts', {posts:posts});
    }
    else{
        console.log('Using DB');
        db.posts.find().toArray(function(err, items){
            if (err) res.send(err);
            else{
                var switchedPosts = switchOrder(items);
                cache.put('posts', switchedPosts);
                res.render('posts', {posts: switchedPosts});
            }
        });
    }
};