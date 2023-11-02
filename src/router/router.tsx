import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { authRoutes, publicRoutes, Route as AppRoute } from "./routes";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FULLMAP_ROUTE } from "./consts";

const Router: React.FC = () => {
  return (
    <div>
      <Header currentPath={window.location.pathname} />
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
        <Route path="*" element={<Navigate to={FULLMAP_ROUTE} />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default Router;
