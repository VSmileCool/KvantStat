module.exports = class UserDto {
  email;
  id;
  name;
  code;

  constructor(email, id, code, name) {
    this.email = email;
    this.id = id;
    this.code = code;
    this.name = name;
  }
};
