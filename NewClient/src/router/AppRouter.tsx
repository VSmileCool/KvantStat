import React from "react";
import { Route, Routes } from "react-router-dom";
import { authRoutes, publicRoutes } from "./Routes";
import Header from "../components/header";
import NotFound from "../pages/NotFound";
import InstitutesMap from "../pages/InstitutesMap";
const AppRouter = () => {
  return (
    <div>
      <Header />
      <Routes>
        {authRoutes.map(({ path, component }) => (
          <Route
            key={path}
            path={path}
            element={React.createElement(component)}
          />
        ))}
        {publicRoutes.map(({ path, component }) => (
          <Route
            key={path}
            path={path}
            element={React.createElement(component)}
          />
        ))}
        <Route path="*" element={React.createElement(InstitutesMap)} />
      </Routes>
    </div>
  );
};

export default AppRouter;
