const express = require('express');
const router = express.Router();

const siteController = require('../src/controllers/SiteController');

router.get('/',siteController.index);// trang chu
router.get('/:userId',siteController.userPage);// trang nha user
router.get('/:userId/posts/:postId',siteController.postDetail);// trang post chi tiet cua user

module.exports = router