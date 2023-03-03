const Router = require("express");
const router = new Router();
const InstituteController = require("../controller/institutes.controller");

router.post("/getall", InstituteController.getAllInstitutes);
router.post("/create", InstituteController.createInstitute);

module.exports = router;
