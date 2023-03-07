// const admin_router = require("./routes/admin.routes");
const auth_router = require("./routes/auth.routes");
const user_router = require("./routes/user.router");
const errorMiddleware = require("./middlewares/error.mddleware");
const express = require("express");
const sequelize = require("./db");
const cookieParser = require("cookie-parser");

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
