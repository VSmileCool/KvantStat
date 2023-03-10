const authService = require("../services/user_account_service");
const tokenService = require("../services/token.service");

class AuthController {
  async registration(req, res, next) {
    try {
      const id = req.body.id;
      const login = req.body.login;
      const password = req.body.password;
      const userData = await authService.registration(id, login, password);
      console.log(userData);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        AccessControlAllowOrigin: "*",
      });
      return res.status(200).json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email } = req.body.email;
      const { password } = req.body.password;
      const userData = await authService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        AccessControlAllowOrigin: "*",
      });
      console.log(userData);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies["refreshToken"];
      const userData = await authService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        AccessControlAllowOrigin: "*",
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies["refreshToken"];
      const token = await authService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await authService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AuthController();
