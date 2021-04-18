const express = require('express');
const router = express.Router();
const {upload} = require('../util/middlewares/fileUpload')

const apiController = require('../src/controllers/ApiController');

router.get('/posts', apiController.getPosts);// lấy nhiều post
router.get('/post/:postId',apiController.getOnePost);// lấy 1 post
router.post('/post', upload.fields([{name:"attachmentFile"}]), apiController.addPost);// thêm post
router.post('/post/:postId', upload.fields([{name:"attachmentFile"}]), apiController.editPost);// thêm post
router.delete('/post/:postId',apiController.delPost)// xóa post

router.get('/post/:postId/comments',apiController.getComments);// lấy nhiều comment của một post
// router.get('/post/:postId/comment/:commentId',apiController.test);// lấy 1 comment của post
router.post('/post/:postId/comment',apiController.addComment);// thêm comment cho post
router.delete('/post/:postId/comment/:commentId',apiController.delComment);// xóa comment

module.exports = router