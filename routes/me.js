var cache = require('memory-cache');

module.exports = function(req, res){
    cache.put('posts', 'apples');
    res.render('me');
};