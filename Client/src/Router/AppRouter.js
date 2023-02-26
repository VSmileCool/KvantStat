import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { INSTITUTEMAP_ROUTE } from "./Consts.js";
import { authRoutes, publicRoutes } from "./Routes.js";
import { Context } from "../index";
import NavBar from "../Components/NavBar";

const AppRouter = () => {
  const { user } = useContext(Context);
  return (
    <div>
      <NavBar />
      <Routes>
        {authRoutes.map(({ path, component }) => (
          <Route key={path} path={path} element={component} exact />
        ))}
        {publicRoutes.map(({ path, component }) => (
          <Route key={path} path={path} element={component} exact />
        ))}
        <Route path="*" element={<Navigate to={INSTITUTEMAP_ROUTE} />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
