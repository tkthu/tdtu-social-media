const express = require('express');
const router = express.Router();

const notificationsController = require('../controllers/NotificationsController');

router.get('/',notificationsController.index);// trang tất cả thông báo
router.get('/departments',notificationsController.departmentPage);// trang phòng ban

module.exports = router