
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();
var fs = require('fs');
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

fs.watch('posts', function(event, filename){
    if(event){
        fs.readFile('posts/' + filename, function (err, data) {
            if (err) console.log('Error reading data: ' + err);
            else if (data){
                var dataString = data.toString();
                var marked = require('marked');
                var htmlString = marked(dataString);
                
                var databaseUrl = 'clogdb';
                var collections = ['posts'];
                var db = require('mongojs').connect(databaseUrl, collections);
                db.posts.save({title:filename, date:getDate(), post:htmlString}, function(err, saved){
                    if (err) console.log('Error saving: ' + err);
                    console.log('post saved');
                    var cache = require('memory-cache');
                    console.log('cache loaded');
                    db.posts.find().toArray(function(err, items){
                        if (err) console.log('Error was: ' + err);
                        console.log('WORKINGW ASLKDFJ ALSKDJF  OIAJWE FOIAJW EFFOKAJW EOFIJA SLDFKSLDKFJ ASLDKFJ ASLDKFJ ASLDKFJ ASLDKFJ');
                        console.log('post in app.js is: ' + cache.get('posts'));
                        cache.put('posts', 'asdf');
                    });
                });

                db.close();
            }
            else console.log('No error or data');
        });
        console.log('File: ' + filename + ' changed! With event: ' + event);
    }
    
});

