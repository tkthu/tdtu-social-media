const express = require('express');
const router = express.Router();

const managerController = require('../src/controllers/ManagerController');

router.get('/staffs',managerController.staffsPage);// trang quản lý tài khoản nhân viên (tài khoản phòng/khoa)
router.get('/students',managerController.studentsPage);// trang quản lý tài khoản sinh viên

module.exports = router