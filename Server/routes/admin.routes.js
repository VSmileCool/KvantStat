const Router = require('express').Router
const router = new Router()
const AdminController = require('../controller/admin.controller')
const authMiddleware = require('../middlewares/auth.middleware')

//, authMiddleware
router.post('/new_certificate', AdminController.new_certificate)
router.post('/login', AdminController.login)

module.exports = router