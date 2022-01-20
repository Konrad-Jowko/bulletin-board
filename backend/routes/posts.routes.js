const express = require('express');
const router = express.Router();
const PostsController = require('../controllers/posts.controller');

/* ROUTES FOR POSTS */

// Get all published Posts
router.get('/posts', PostsController.getAll);
// Get all owned Posts
router.get('/posts/owned/:user', PostsController.getOwned);
// Get all published Posts
router.get('/posts/:id', PostsController.getOne);
// Get one specific Post
router.put('/posts/:id', PostsController.edit);
// Delete photo saved in specific Post
router.put('/posts/:id/deletePhoto', PostsController.deleteSavedPhoto);
// Post new Post
router.post('/posts/', PostsController.post);
// Save photo to specfic Post
router.post('/posts/photo', PostsController.postPhoto);
// Delete photo not yet saved in specific Post
router.post('/posts/deletePhoto', PostsController.deletePhoto);

module.exports = router;
