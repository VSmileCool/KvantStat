const Router = require("express");
const router = new Router();
const UserInfController = require("../controller/user_inf_controller");
const AuthMiddleware = require('../middleware/auth.middleware')

router.post("/enterinf", AuthMiddleware, UserInfController.enter_inf);

module.exports = router;