const Router = require("express");
const router = new Router();
const certificateController = require("../controller/certificate.controller");

router.post("/certificate", certificateController.save_certificate);

module.exports = router;
