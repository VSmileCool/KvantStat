import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { INSTITUTEMAP_ROUTE } from "./Consts";
import { authRoutes, publicRoutes } from "./Routes";
import { useSelector } from "react-redux";
import Header from "../components/header";
import { RootState } from "../store/store";
const AppRouter = () => {
  const user = useSelector((state: RootState) => state.user);
  let navigate = useNavigate();
  function handleClick() {
    navigate("/home");
  }

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
        <Route path="*" element={navigate} />
      </Routes>
    </div>
  );
};

export default AppRouter;
