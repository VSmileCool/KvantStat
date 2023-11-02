import {
  ABOUTUS_ROUTE,
  FULLMAP_ROUTE,
  INSTITUTE_PAGE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  USER_ROUTE,
} from "./consts";
import Auth from "../pages/Auth";
import InstituteMap from "../pages/InstituteMap";
import Institute from "../pages/Institute";
import User from "../pages/User";
import { FC } from "react";
import AboutUs from "../pages/AboutUs";

export interface Route {
  path: string;
  component: FC;
}

const authComponents = {
  [USER_ROUTE]: User,
};

export const publicRoutes: Route[] = [
  { path: LOGIN_ROUTE, component: Auth },
  { path: REGISTRATION_ROUTE, component: Auth },
  { path: FULLMAP_ROUTE, component: InstituteMap },
  { path: INSTITUTE_PAGE, component: Institute },
  {
    path: ABOUTUS_ROUTE,
    component: AboutUs,
  },
];

export const authRoutes: Route[] = [
  ...publicRoutes,
  ...Object.entries(authComponents).map(([path, component]) => ({
    path,
    component,
  })),
];
