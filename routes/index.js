
/*
 * GET home page.
 */
exports.posts = require('./posts');
exports.me = require('./me');
exports.clog = require('./clog');
exports.projects = require('./projects');
exports.login = require('./login');
exports.test = require('./test');
exports.addpost = require('./addpost');
exports.individualPosts = require('./individualPosts');
exports.index = function(req, res){
    res.redirect('/posts');
};
