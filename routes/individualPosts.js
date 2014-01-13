var databaseUrl = 'clogdb';
var collections = ['posts'];
var db = require('mongojs').connect(databaseUrl, collections);
var cache = require('memory-cache');

module.exports = function(req,res){
    var posts = cache.get('posts');
    if(posts){
        var post = getPost(posts, req.params.postname);
        if (post) res.render('posts', {posts:post});
        else{
            res.status(404);
            res.render('error');
        }
    }
    else{
        console.log('Using DB');
        db.posts.find().toArray(function(err, items){
            if (err) res.send(err);
            else{
                var post = getPost(items, req.params.postname);
                if (post) res.render('posts', {posts:post});
                else{
                    res.status(404);
                    res.render('error');
                }
            }
        });
    }
}

function getPost(posts, title){
    for(var x = 0; x < posts.length; x++){
        var post = posts[x];
        if(post.title == title){
            console.log('post: ' + post.title + 'chosen');
            return new Array(post);
        }
    }
    return null;
}