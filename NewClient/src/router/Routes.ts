import {
  ADMINPANEL_ROUTE,
  INSTITUTEINFO_ROUTE,
  INSTITUTEMAP_ROUTE,
  INSTITUTEPAGE_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  USERINFO_ROUTE,
} from "./Consts";

import Auth from "../pages/Auth";
import InstitutesMap from "../pages/InstitutesMap";
import InstitutePage from "../pages/InstitutePage";
import InstituteInfo from "../pages/InstituteInfo";
import AdminPanel from "../pages/AdminPanel";
import UserInfo from "../pages/UserInfo";

export type Route = {
  path: string;
  component: React.ComponentType<any>;
};

export const publicRoutes: Route[] = [
  { path: LOGIN_ROUTE, component: Auth },
  { path: REGISTRATION_ROUTE, component: Auth },
  { path: INSTITUTEMAP_ROUTE, component: InstitutesMap },
  { path: INSTITUTEPAGE_ROUTE, component: InstitutePage },
];

export const authRoutes: Route[] = [
  { path: INSTITUTEMAP_ROUTE, component: InstitutesMap },
  { path: INSTITUTEINFO_ROUTE, component: InstituteInfo },
  { path: USERINFO_ROUTE, component: UserInfo },
  { path: ADMINPANEL_ROUTE, component: AdminPanel },
];
