const express = require('express');
const router = express.Router();
const {upload} = require('../util/middlewares/fileUpload')

const apiController = require('../src/controllers/ApiController');

router.get('/posts', apiController.getPosts);// lấy nhiều post
router.get('/post/:postId',apiController.getOnePost);// lấy 1 post
router.post('/post', upload.fields([{name:"attachmentFile"}]), apiController.addPost);// thêm post
router.post('/post/:postId', upload.fields([{name:"attachmentFile"}]), apiController.editPost);// sửa post
router.delete('/post/:postId',apiController.delPost)// xóa post

router.get('/post/:postId/comments',apiController.getComments);// lấy nhiều comment của một post
router.post('/post/:postId/comment',upload.none(),apiController.addComment);// thêm comment cho post
router.post('/comment/:commentId',upload.none(),apiController.editComment);// sửa comment
router.delete('/comment/:commentId',apiController.delComment);// xóa comment

router.get('/user/:userId',apiController.getOneUser);
router.post('/user/:userId',apiController.editUser);
router.delete('/user/:userId',apiController.delUser);

module.exports = router