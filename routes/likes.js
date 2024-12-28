const express = require('express');
const router = express.Router();
const { isLoggedInForLikes } = require('../middleware');
const likeController = require('../controllers/likes');

// Like a listing
router.post('/:id/like', isLoggedInForLikes, likeController.like);

// Unlike a listing
router.post('/:id/unlike', isLoggedInForLikes, likeController.unlike);

module.exports = router;
