import React from "react";
import Router from "./router/router";
import { BrowserRouter } from "react-router-dom";
import "./css/App.css";
const App = () => {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
};

export default App;
