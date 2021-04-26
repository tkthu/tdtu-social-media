const {check} = require('express-validator')

const registerValidator = [
    check('fullname').exists().withMessage('Vui lòng nhập tên người dùng')
    .notEmpty().withMessage('Không được để trống tên người dùng')
    .isLength({min: 6}).withMessage('Tên người dùng phải từ 6 ký tự'),

    check('username').exists().withMessage('Vui lòng nhập username')
    .notEmpty().withMessage('Không được để trống username')
    .isLength({min: 6}).withMessage('username dùng phải từ 6 ký tự')
    .custom((value, {req}) => {
        var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (format.test(value)) {// có kí tự đặt biệt
            throw new Error('username không được có kí tự đặt biệt')
        }
        return true;
    }),

    // check('email').exists().withMessage('Vui lòng nhập email người dùng')
    // .notEmpty().withMessage('Không được để trống email người dùng')
    // .isEmail().withMessage('Đây không phải là email hợp lẹ'),

    check('password').exists().withMessage('Vui lòng nhập mật khẩu')
    .notEmpty().withMessage('Không được để trống mật khẩu')
    .isLength({min: 6}).withMessage('Mật khẩu phải từ 6 ký tự'),

    check('rePassword').exists().withMessage('Vui lòng nhập xác nhận mật khẩu')
    .notEmpty().withMessage('Vui lòng nhập xác nhận mật khẩu')
    .custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Mật khẩu không khớp')
        }
        return true;
    })
]

module.exports = registerValidator