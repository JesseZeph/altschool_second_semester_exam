const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../helpers/logger')


const adminLayout = '../views/layouts/admin';

const jwtSecret = process.env.JWT_SECRET;


// check login


const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        logger.info('Checks Authentication')


        return res.redirect('/admin');
        // return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        console.log(decoded.userId);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
        // res.render('error')
    }

}


router.get('/admin', async (req, res) => {
    try {
        logger.info('Authentication page accessed')


        const user = req.user;
        const appdesc = {
            name: "Admin",
            desc: "A place to share my thoughts and ideas."
        }
        res.render('admin/login', { appdesc, layout: adminLayout, user });
    } catch (error) {
        console.log(error);

    };
});

router.post('/register', async (req, res) => {
    logger.info('Registration accessed')

    try {
        const { email, username, password, firstname, lastname } = req.body;
        const hashedPassword = await bcrypt.hash(password, 13);

        try {
            const user = await User.create({ email, username, password: hashedPassword, firstname, lastname });
            req.session.firstname = user.firstname || 'Guest';
            res.redirect('/dashboard');
            console.log(user.firstname);
            // res.status(201).json({ message: 'User created successfully', user });
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: 'User already exists' });
            }
            res.status(500).json({ message: 'Internal server error' });
        }

    } catch (error) {
        console.log(error);

    }
});

router.post('/admin', async (req, res) => {
    logger.info('Login accessed')

    try {

        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            res.status(404).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(404).json({ message: 'Invalid credentials' });
        }

        // const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '21d' });
        const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });


        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');


    } catch (error) {
        console.log(error);
    }
});

router.get('/dashboard', authMiddleware, async (req, res) => {
    logger.info('Admin dashboard accessed')

    try {
        const appdesc = {
            name: "Admin",
            desc: "A place to share my thoughts and ideas."
        }

        let pages = 20;
        let page = req.query.page || 1;

        const paginate = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(pages * page - pages)
            .limit(pages)
            .exec();

        //query blog posts


        const count = await Post.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / pages);
        const firstname = req.session.firstname;

        const data = await Post.find();
        res.render('admin/dashboard', { appdesc, data, layout: adminLayout, paginate, current: page, nextPage: hasNextPage ? nextPage : null, firstname: firstname });
    } catch (error) {
        console.log(error);
    };
})



router.get('/add-post', authMiddleware, async (req, res) => {
    logger.info('Add new Post')

    try {
        const appdesc = {
            name: "Add Post",
            desc: "A place to share my thoughts and ideas."
        }

        const data = await Post.find();
        res.render('admin/add-post', { appdesc, layout: adminLayout });

    } catch (error) {
        console.log(error);
    }
});

router.post('/add-post', authMiddleware, async (req, res) => {
    logger.info('Adding post accessed')

    try {
        const appdesc = {
            name: "Add Post",
            desc: "A place to share my thoughts and ideas."
        }

        const { title, description, body, tags } = req.body;


        const wordCount = body.split(/\s+/).length;
        const reading_time = Math.ceil(wordCount / 200);

        try {
            const newPost = new Post({
                title,
                description,
                body,
                tags,
                reading_time,
            })

            await Post.create(newPost);
            res.redirect('/dashboard');
        } catch (error) {
            console.log(error);
        }

        const data = await Post.find();
        res.render('admin/add-post', { appdesc, data, layout: adminLayout });

    } catch (error) {
        console.log(error);
    }
});

//get post by id
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    logger.info('Getting post to edit')

    try {
        const appdesc = {
            name: "Edit Post",
            desc: "A place to share my thoughts and ideas."
        }
        const data = await Post.findOne({ _id: req.params.id });
        res.render('admin/edit-post', { appdesc, data, layout: adminLayout });

    } catch (error) {
        console.log(error);
    }
});

//update post
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    logger.info('Updating post')

    try {

        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            description: req.body.description,
            body: req.body.body,
            tags: req.body.tags,
            updatedAt: Date.now()
        })
        res.redirect(`/edit-post/${req.params.id}`);
    } catch (error) {
        console.log(error);
    }
});

router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    logger.info('Post deleted')

    try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});

router.post('/publish-post/:id', authMiddleware, async (req, res) => {
    logger.info('Post Published')

    try {
        const postId = req.params.id;

        const post = await Post.findByIdAndUpdate(postId, { state: 'published' }, { new: true });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/logout', (req, res) => {
    logger.info('Logged out')

    res.clearCookie('token');
    res.redirect('/');
});


module.exports = router;