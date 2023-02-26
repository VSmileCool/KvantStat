const InstitutesService = require("../services/institute.service");
const userService = require("../services/user.service");

class InstitutesController {
  async getAllInstitutes(req, res) {
    try {
      res.set("Access-Control-Allow-Origin", "*");
      const instituteData = await InstitutesService.getAllInstitutes();
      res.cookie({ httpOnly: true });
      return res.json(instituteData);
    } catch (e) {
      console.log(e);
    }
  }

  async createInstitute(req, res) {
    try {
      res.set("Access-Control-Allow-Origin", "*");
      const name = req.body.name;
      const instituteData = await InstitutesService.createInstitute(name);
      res.cookie({
        httpOnly: true,
      });
      return res.json(instituteData);
    } catch (e) {}
  }
}

module.exports = new InstitutesController();
