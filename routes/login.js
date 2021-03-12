const express = require('express');
const router = express.Router();

const loginController = require('../controllers/LoginController');
const loginValidator = require('../middlewares/validators/loginValidator');

router.get('/',loginController.index);
router.post('/',loginValidator,loginController.login);
router.post('/GGAuth',loginController.ggAuth);

module.exports = router