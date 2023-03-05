import {
  INSTITUTEMAP_ROUTE,
  INSTITUTES_ROUTE,
  LOGIN_ROUTE,
  PANEL_ROUTE,
  REGISTRATION_ROUTE,
  USER_ROUTE,
} from "./consts";
import Auth from "../pages/Auth";
import InstituteMap from "../pages/InstituteMap";
import Institute from "../pages/Institute";
import User from "../pages/User";
import Panel from "../pages/Panel";
import { FC } from "react";

export interface Route {
  path: string;
  component: FC;
}

const authComponents = {
  [USER_ROUTE]: User,
  [PANEL_ROUTE]: Panel,
};

export const publicRoutes: Route[] = [
  { path: LOGIN_ROUTE, component: Auth },
  { path: REGISTRATION_ROUTE, component: Auth },
  { path: INSTITUTEMAP_ROUTE, component: InstituteMap },
  { path: INSTITUTES_ROUTE, component: Institute },
];

export const authRoutes: Route[] = [
  ...publicRoutes,
  ...Object.entries(authComponents).map(([path, component]) => ({
    path,
    component,
  })),
];
