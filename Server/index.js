// const admin_router = require("./routes/admin.routes");
const express = require("express");
const sequelize = require("./db");
const cookieParser = require("cookie-parser");
import * as user_router from "./routes/user.router";
import * as errorMiddleware from "./middlewares/error.mddleware";
import * as auth_router from "./routes/auth.routes";
const app = express();
const PORT = "4999";

app.use(express.json());
app.use("/user", user_router);
app.use("/auth", auth_router);
// app.use("/admin", admin_router);
app.use(cookieParser());
app.use(errorMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("успешное подклюение к бд");
    app.listen(PORT, () => console.log("сервер работает"));
  } catch (error) {
    console.log("ошибка: " + error);
  }
};

start();
