const Router = require('express').Router
const router = new Router()
const UserController = require('../controller/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/getUser', authMiddleware, UserController.getUser)


module.exports = router