const user_info = require("../models/user_model");
const tokenService = require("./token.service");
const UserDto = require("../dtos/user.dto");
const ApiError = require("../middleware/error.middleware");
const bcrypt = require("bcrypt");

class UserService {
  async registration(id, login, password) {
    const candidate = await user_info.findOne({ where: { login: login } });
    if (candidate) {
      throw ApiError.BadRequest("пользователь с таким логином уже есть");
    }
    const hashPassword = bcrypt.hashSync(password, 5);
    const new_user = new user_info({
      id: id,
      password: hashPassword,
      login: login,
    });
    await new_user.save();

    const user = await user_info.findOne({ where: { email: email } });
    const userId = user.id;
    const userDto = new UserDto(login, userId);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens };
  }

  async login(email, password) {
    const user = await user_info.findOne({ where: { email: email } });
    if (!user) {
      throw ApiError.BadRequest("Пользователь с таким именем не найден");
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      throw ApiError.BadRequest("Неправильный пароль");
    }

    // const old_token = await tokenService.findOld(user.user_id)
    // await tokenService.removeToken(old_token)

    const userDto = new UserDto(user.user_name, user.user_id);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await user_info.findByPk(userData.id);
    const userDto = new UserDto(user.user_name, user.user_id);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.removeToken(refreshToken);
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async getAllUsers() {
    const users = await user_info.findOne();
    return users;
  }
}

module.exports = new UserService();
