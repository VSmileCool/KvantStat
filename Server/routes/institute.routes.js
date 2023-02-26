const Router = require("express");
const router = new Router();
const InstituteController = require("../controller/institutes.controller");
const institutes_model = require("../models/institute.model");

router.get("/getall", InstituteController.getAllInstitutes);

router.post("/create", InstituteController.createInstitute);

module.exports = router;
