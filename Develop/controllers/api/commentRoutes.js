const {Comment} = require('../../models');
const router = require('express').Router();
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
    try {
        if (req.session) {
            const commentData =  await Comment.create({
                comment_body: req.body.comment_body,
                post_id: req.body.post_id,
                user_id: req.session.user_id,
            });
            res.json(commentData);
        };
    } catch(err) {
        console.log(err);
        res.status(400).json(err);
        };
});


module.exports = router;
