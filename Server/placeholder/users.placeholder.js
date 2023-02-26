const sequelize = require("../db");
const User = require("../models/user.model");
function generateRandomUserData() {
  const firstName = ["Alice", "Bob", "Charlie", "Dave", "Eve", "Frank"][
    Math.floor(Math.random() * 6)
  ];
  const lastName = ["Anderson", "Brown", "Clark", "Davis", "Evans", "Franklin"][
    Math.floor(Math.random() * 6)
  ];
  const patronymic = [
    "Adam",
    "Benjamin",
    "Charles",
    "David",
    "Edward",
    "Francis",
  ][Math.floor(Math.random() * 6)];
  const certificate = Math.random().toString(36).substr(2, 8);
  const yearOfIssue = 1990 + Math.floor(Math.random() * 31);
  const rights = ["admin", "user", "guest"][Math.floor(Math.random() * 3)];
  const login = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
  const password = Math.random().toString(36).substr(2, 10);
  return {
    firstname: firstName,
    surname: lastName,
    patronymic,
    certificate,
    yearOfIssue,
    rights,
    login,
    password,
  };
}

// insert random user data into database
async function insertRandomUsers(numUsers) {
  try {
    await sequelize.authenticate();
    console.log("Connection to database successful");
    await User.sync({ force: true });
    console.log("User table created");
    for (let i = 0; i < numUsers; i++) {
      const userData = generateRandomUserData();
      await User.create(userData);
    }
    console.log(`${numUsers} users inserted into database`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sequelize.close();
    console.log("Connection to database closed");
  }
}

// run the program to insert 10 random users into the database
insertRandomUsers(10);
