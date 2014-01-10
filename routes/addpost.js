var databaseUrl = 'clogdb';
var collections = ['posts'];
var db = require('mongojs').connect(databaseUrl, collections);


module.exports = function(req,res){
    db.posts.save({post:'This is a post', title:'Post Title', date: getDate()}, function(err, saved){
        if (err) res.send(err);
        else{
            res.send(saved);
        }
    });
};

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