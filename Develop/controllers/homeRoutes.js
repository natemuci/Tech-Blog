const router = require('express').Router();
const { Post, User, Comment } = require('../models');


router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const postData = await Post.findAll({
      attributes: ["id", "title", "post_content", "created_at"],
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'comment_body',
            'post_id',
            'user_id',
            'created_at'
        ],
        include: {
          model: User,
          attributes: ["username"]
        },
      },
      {
        model: User,
        attributes: ['username'],
      },
      ],
    });

    // Serialize data so the template can read it
    const post = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      post, 
      username: req.session.username,
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      where: {
        id: req.params.id
      },
      attributes: ["id", "post_content", "title", "created_at"],
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'comment_body',
            'post_id',
            'user_id',
            'created_at',
          ],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
        {
          model: User,
          attributes: ['username'],
        }
      ],
    });

    const post = postData.get({ plain: true });

    res.render('post_comment', {
      post,
      logged_in: req.session.logged_in,
      username: req.session.username
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/login', async (req, res) => {
  try {
    if (req.session.loggedIn){
      res.redirect('/');
      return;
    }
    
    res.render('login', {
      username: req.session.username,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/signup', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('signup', {
    username: req.session.username,
  });
});

module.exports = router;
