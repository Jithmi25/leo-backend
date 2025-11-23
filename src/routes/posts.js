const express = require('express');
const { authenticate } = require('../middleware/auth');
const { 
  createPost, 
  getPosts, 
  getPostById, 
  updatePost, 
  deletePost,
  likePost,
  commentOnPost
} = require('../controllers/postController');

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', authenticate, createPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);
router.post('/:id/like', authenticate, likePost);
router.post('/:id/comment', authenticate, commentOnPost);

module.exports = router;