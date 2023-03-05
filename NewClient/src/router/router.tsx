import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { INSTITUTEMAP_ROUTE } from "./consts";
import { authRoutes, publicRoutes, Route as AppRoute } from "./routes";
import Header from "../components/header";
import Footer from "../components/footer";

const Router: React.FC = () => {
  return (
    <div>
      <Header />
      <Routes>
        {authRoutes.map(({ path, component }: AppRoute) => (
          <Route
            key={path}
            path={path}
            element={React.createElement(component)}
          />
        ))}
        {publicRoutes.map(({ path, component }: AppRoute) => (
          <Route
            key={path}
            path={path}
            element={React.createElement(component)}
          />
        ))}
        <Route path="*" element={<Navigate to={INSTITUTEMAP_ROUTE} />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default Router;
