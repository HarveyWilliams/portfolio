import Post from '../interfaces/Pages/Post';

import app from '../app';
import logger from '../logger';
import Data from '../data';
import helpers from '../helpers';

var orderBlogPostsByYear = (posts: Array<Post>) => {
    var postsByYear = [];
    var group = null;
    var post = null;
    var years = [];

    for (var i = 0; i < posts.length; i++) {
        post = posts[i];

        years.push(new Date(post.postDate).getFullYear());
    }

    years = years.filter(helpers.onlyUnique);

    for (var i = 0; i < years.length; i++) {
        group = {
            year: years[i],
            posts: []
        };

        for (var x = 0; x < posts.length; x++) {
            post = posts[x];

            if (new Date(post.postDate).getFullYear() == years[i]) {
                group.posts.push(post);
            }
        }

        postsByYear.push(group);
    }

    return postsByYear;
};

export default function(page: Post) {
    app.get(page.path, (req, res) => {
        const tag = req.query.tag;

        let posts = Data.getPage('/blog').children as Array<Post>;
        const tagsWithQuantity = helpers.getBlogTags(posts);

        if (tag) {
            posts = posts.filter(post => {
                return post.tags.includes(tag);
            });
        }

        // Order posts by date.
        posts = posts.sort((a, b) => {
            return new Date(b.postDate).getTime() - new Date(a.postDate).getTime();
        });

        res.render('posts', {
            helpers: helpers,
            layout: '_common',
            relativeUrl: 'blog',
            metaDescription: page.metaDescription,
            pageGroup: page.pageGroup,
            pageTitle: page.pageTitle,
            postsByYear: orderBlogPostsByYear(posts),
            tags: tagsWithQuantity,
            currentTag: typeof tag === 'undefined' ? '' : tag,
            page: page
        });
    });
};
