const express = require('express');
const router = express.Router();

const notificationsController = require('../src/controllers/NotificationsController');


router.get('/departments',notificationsController.departmentPage);// trang phòng ban
router.get('/',notificationsController.index);// trang tất cả thông báo

module.exports = router