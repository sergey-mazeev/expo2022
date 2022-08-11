var ghpages = require('gh-pages');

ghpages.publish('./built/',{
    branch: 'gh-pages',
}, function(err) {
    console.log(err)
});