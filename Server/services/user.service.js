const winston = require("winston");
const user_model = require("../models/user.model");

// Create a logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs.log" }),
  ],
});

class UserService {
  async registration(
      firstname,
      surname,
      patronymic,
      certificate,
      yearOfIssue,
      rights
  ) {
    try {
      const candidate = await user_model.findOne({
        where: { certificate: certificate },
      });
      if (candidate) {
        logger.info("User with this certificate already exists");
        return "Пользователь с таким кодом уже есть";
      }

      const new_user = new user_model({
        firstname: firstname,
        surname: surname,
        patronymic: patronymic,
        certificate: certificate,
        yearOfIssue: yearOfIssue,
        rights: rights,
        login: "-null-",
        password: "-null-",
      });
      await new_user.save();
      logger.info("User successfully registered");
      return "yes";
    } catch (error) {
      logger.error(`Registration failed: ${error.message}`);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await user_model.findOne({
        where: { user_email: email, user_password: password },
      });
      if (!user) {
        logger.info(`Login failed for user with email ${email}`);
        return "Ошибка в email/пароле";
      }
      logger.info(`User with email ${email} successfully logged in`);
      return "yes";
    } catch (error) {
      logger.error(`Login failed: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new UserService();
