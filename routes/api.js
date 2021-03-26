const express = require('express');
const router = express.Router();

const apiController = require('../controllers/ApiController');

// router.get('/posts',apiController.test);// lấy toàn bộ post
// router.get('/post/:postId',apiController.test);// lấy 1 post
router.post('/post',apiController.addPost);// thêm post
router.delete('/post/:postId',apiController.delPost)// xóa post

// router.get('/post/:postId/comments',apiController.test);// lấy toàn bộ comment của post
// router.get('/post/:postId/comment/:commentId',apiController.test);// lấy 1 comment của post
router.post('/post/:postId/comment',apiController.addComment);// thêm comment cho post
router.delete('/post/:postId/comment/:commentId',apiController.delComment);// xóa comment

module.exports = router