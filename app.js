
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
    res.status(404);
    res.render('error');
});


var databaseUrl = 'clogdb';
var collections = ['posts'];
var db = require('mongojs').connect(databaseUrl, collections);
db.posts.find(function(err, items){
    if (err) console.log('Error was: ' + err);
    var temp = [];
    items.forEach(function(post){
        temp.push(post.title);
    });
    var titles = switchOrder(temp);
    app.locals({archives:titles});
});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.all('/posts', routes.posts);
app.get('/me', routes.me);
app.get('/clog', routes.clog);
app.get('/projects', routes.projects);
app.all('/login', routes.login);
app.all('/test', routes.test);
app.get('/addpost', routes.addpost);
app.get('/post/:postname', routes.individualPosts);
console.log(app.get('port'));
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function getDate(){
    var unformatedDate = new Date();
    var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var formatedDate = '';
    formatedDate += dayNames[unformatedDate.getDay()] + ' ';
    formatedDate += (unformatedDate.getMonth() + 1) + '/';
    formatedDate += unformatedDate.getDate() + '/';
    formatedDate += unformatedDate.getFullYear() + ' ';
    formatedDate += (unformatedDate.getHours()%12) + ':';
    formatedDate += unformatedDate.getMinutes();
    if (unformatedDate.getHours() >=11) formatedDate += 'pm';
    else formatedDate += 'am';
    return formatedDate;
}

function switchOrder(posts){
    var finalPosts = [];
    for(var x = posts.length -1; x >=0; x--){
        finalPosts.push(posts[x]);
    }
    return finalPosts;
}

fs.watch('posts', function(event, filename){
    if(event){
        console.log('Event Watched!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        fs.readFile('posts/' + filename, function (err, data) {
            if (err) console.log('Error reading data: ' + err);
            else if (data){
                var dataString = data.toString();
                var marked = require('marked');
                var htmlString = marked(dataString);
                var databaseUrl = 'clogdb';
                var collections = ['posts'];
                var db = require('mongojs').connect(databaseUrl, collections);
                db.posts.find({title:filename}, function(err, found){
                    if (err) console.log('Erorr finding: ' + err);
                    if(found.length >0){
                        console.log('post found about to be updated');
                        db.posts.update({title:filename}, {post:htmlString, title:filename, date:getDate()}, function(err, updated){
                            if (err) console.log('Error Updating: ' + err);
                            db.posts.find(function(err, items){
                                if (err) console.log('Error was: ' + err);
                                var titles = [];
                                items.forEach(function(post){
                                    titles.push(post.title);
                                });
                                var postTitles = switchOrder(titles);
                                app.locals({archives:postTitles});
                            });
                        });
                    }
                    else{
                        console.log('post not found');
                        db.posts.save({title:filename, date:getDate(), post:htmlString, realDate:new Date()}, function(err, saved){
                            if (err) console.log('Error saving: ' + err);
                            db.posts.find(function(err, items){
                                if (err) console.log('Error was: ' + err);
                                var titles = [];
                                items.forEach(function(post){
                                    titles.push(post.title);
                                });
                                var postTitles = switchOrder(titles);
                                app.locals({archives:postTitles});
                            });
                        });
                    }
                    var cache = require('memory-cache');
                    db.posts.find(function(err, items){
                        if (err) console.log('Error was: ' + err);
                        var temp = [];
                        items.forEach(function(post){
                            temp.push(post);
                        });
                        var posts = switchOrder(temp);
                        var cache = require('memory-cache');
                        cache.put('posts', posts);
                        console.log('cache updated');
                    });
                });

                var cache = require('memory-cache');
                db.posts.find(function(err, items){
                    if (err) console.log('Error was: ' + err);
                    var temp = [];
                    var titles = [];
                    items.forEach(function(post){
                        temp.push(post);
                        titles.push(post.title);
                    });
                    var posts = switchOrder(temp);
                    var cache = require('memory-cache');
                    cache.put('posts', posts);
                    app.locals({archives:titles});
                });
            }
            else console.log('No error or data');
            
            console.log('File: ' + filename + ' changed! With event: ' + event);
        });
        
    }
    
});

