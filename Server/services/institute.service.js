const institutes_model = require("../models/institute.model");

class InstituteService {
  async getAllInstitutes() {
    return await institutes_model.findAll;
  }

  async createInstitute(name) {
    const candidate = await institutes_model.findOne({
      where: { institute_name: name },
    });
    if (candidate) {
      throw new Error("пользователь с таким именем уже есть");
    }
    const new_institute = new institutes_model({
      institute_name: name,
    });
    await new_institute.save();

    return "yes";
  }
}

module.exports = new InstituteService();
