const Router = require("express");
const router = new Router();
const AuthController = require("../controller/user_account_controller");
const AuthMiddleware = require('../middleware/auth.middleware')

router.post("/registration", AuthController.registration);
router.post("/login", AuthController.login);
router.get("/refresh", AuthController.refresh);
router.post('/logout', AuthController.logout)
router.get('/users', AuthMiddleware, AuthController.getUsers);

module.exports = router;
