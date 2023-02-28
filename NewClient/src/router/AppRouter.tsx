import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { INSTITUTEMAP_ROUTE } from "./Consts";
import { authRoutes, publicRoutes } from "./Routes";
import { useSelector } from "react-redux";
import Header from "../components/header";
import { RootState } from "../store/store";

const AppRouter = () => {
  const user = useSelector((state: RootState) => state.user);
  return (
    <div>
      <Header />
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
