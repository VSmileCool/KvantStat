const express = require("express");
const sequelize = require("./db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// db models
const university_model = require("./models/university_model");
const admin_model = require("./models/admin.model");
const certificate_id_model = require("./models/cetrificate.model");
const user_model = require("./models/user_model");
const user_account_model = require("./models/user_acount_model");
// const user_info_model = require('./models/')

//routes
const admin_router = require("./routes/admin.routes");
const auth_router = require("./routes/auth.routes");
const institute_router = require("./routes/institute.routes");

const app = express();
const PORT = "4000";
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/admin", admin_router);
app.use("/auth", auth_router);
// app.use("/institute", institute_router);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log("\x1b[32m%s\x1b[0m", "SUCCESSFUL DATABASE CONNECTION");
    app.listen(PORT, () =>
      console.log("\x1b[32m%s\x1b[0m", "SERVER STARTED ON PORT: " + PORT)
    );
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "ERROR: " + error);
  }
};

start();
