const Router = require("express");
const router = new Router();
const AuthController = require("../controller/auth.controller");

router.post("/registration", AuthController.registration);
router.post("/login", AuthController.login);
router.get("/user", AuthController.getUsers);

module.exports = router;
