const express = require('express');
const logger = require('../helpers/logger');


const router = express.Router();
const Post = require('../models/Post');

router.get('', async (req, res) => {


    try {

        const appdesc = {
            name: "Jesse's Thoughts",
            desc: "A place to share my thoughts and ideas."
        }

        logger.info('Homepage accessed')

        let pages = 20;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(pages * page - pages)
            .limit(pages)
            .exec();

        //query blog posts

        const count = await Post.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / pages);


        res.render('home', { appdesc, data, current: page, nextPage: hasNextPage ? nextPage : null, currentRoute: '/',  firstname: req.session.firstname, });

    } catch (error) {
        console.log(error);
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        logger.info('Post page accessed'); 

        let slug = req.params.id;

        const data = await Post.findById({ _id: slug })
        data.read_count += 1;
        await data.save();

        const appdesc = {
            name: data.title,
            desc: data.description
        }
        res.render('post', { appdesc, data, currentRoute: `/post/${slug}`, firstname: req.session.firstname,
    })
    } catch (error) {
        console.log(error);
    }
});


router.post('/search', async (req, res) => {

    try {
        logger.info('Searching'); 

        const appdesc = {
            name: "Search Results",
            desc: "What we found for you."
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
                { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
                { tags: { $regex: new RegExp(searchNoSpecialChar, "i") } }
            ]
        });

        res.render('search', { data, appdesc });
    } catch (error) {
        console.log(error);
    }

});


router.get('/about', (req, res) => {
    logger.info('About page accessed'); 

    try {
        const appdesc = {
            name: "Jesse's Thoughts",
            desc: "A place to share my thoughts and ideas."
        }
        res.render('about', { appdesc, currentRoute: '/about' })
    } catch (error) {

    };
});

router.get('/contact', (req, res) => {
    logger.info('Contact page accessed'); 

    try {
        const appdesc = {
            name: "Jesse's Thoughts",
            desc: "A place to share my thoughts and ideas."
        }
        res.render('contact', { appdesc, currentRoute: '/contact' })
    } catch (error) {

    };
});

module.exports = router;