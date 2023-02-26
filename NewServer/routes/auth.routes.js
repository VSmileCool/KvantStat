const Router = require('express').Router
const router = new Router()
const Authcontroller = require('../controller/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/registration', Authcontroller.registration)
router.post('/login', Authcontroller.login)

module.exports = router