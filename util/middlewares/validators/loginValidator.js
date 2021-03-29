const {check} = require('express-validator')

const loginValidator = [
    check('username').exists().withMessage('Vui lòng nhập username')
    .notEmpty().withMessage('Không được để trống username'),

    check('password').exists().withMessage('Vui lòng nhập mật khẩu')
    .notEmpty().withMessage('Không được để trống mật khẩu')
]

module.exports = loginValidator