const express = require('express');
const router = express.Router();

const managerController = require('../src/controllers/ManagerController');
const {upload} = require('../util/middlewares/fileUpload')

router.get('/staffs',managerController.staffsPage);// trang quản lý tài khoản nhân viên (tài khoản phòng/khoa)
router.post('/staffs',upload.fields([{name:"image"}]),managerController.staffsAdd);// Thêm tài khoản staffs
router.get('/students',managerController.studentsPage);// trang quản lý tài khoản sinh viên

module.exports = router