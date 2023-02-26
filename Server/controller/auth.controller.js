const userService = require("../services/user.service");
const crypto = require("crypto");
class UserController {
  async registration(req, res) {
    try {
      res.set("Access-Control-Allow-Origin", "*");
      const {
        firstname,
        surname,
        patronymic,
        certificate,
        yearOfIssue,
        rights,
      } = req.body;
      const userData = await userService.registration(
        firstname,
        surname,
        patronymic,
        certificate,
        yearOfIssue,
        rights
      );
      res.cookie({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json({
        return: userData,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async login(req, res) {
    try {
      res.set("Access-Control-Allow-Origin", "*");
      const email = req.body.email;
      const password = req.body.password;
      const userData = await userService.login(email, password);
      return res.json(userData);
    } catch (e) {
      console.log(e);
    }
  }

  async getUsers(req, res) {
    try {
      res.json("sozdal vse");
    } catch (e) {}
  }
}

module.exports = new UserController();
