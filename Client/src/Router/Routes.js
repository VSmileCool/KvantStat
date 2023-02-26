import AdminPanel from "../Pages/AdminPanel.js";
import ChooseInstitute from "../Pages/ChooseInstitute.js";
import InstituteInfo from "../Pages/InstituteInfo";
import InstituteMap from "../Pages/InstituteMap.js";
import InstitutesPage from "../Pages/InstitutesPage.js";
import UserInfo from "../Pages/UserInfo.js";
import UserSettings from "../Pages/UserSettings.js";
import InstitutePage from "../Pages/InstitutePage";
import Auth from "../Pages/Auth";
import {
  ADMINPANEL_ROUTE,
  CHOOSEINSTITURE_ROUTE,
  INSTITUTEINFO_ROUTE,
  INSTITUTEMAP_ROUTE,
  INSTITUTEPAGE_ROUTE,
  INSTITUTESPAGE_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  USERINFO_ROUTE,
  USERSETTINGS_ROUTE,
} from "./Consts.js";

export const publicRoutes = [
  { path: LOGIN_ROUTE, component: <Auth /> },
  { path: REGISTRATION_ROUTE, component: <Auth /> },
  { path: CHOOSEINSTITURE_ROUTE, component: <ChooseInstitute /> },
  { path: INSTITUTEMAP_ROUTE, component: <InstituteMap /> },
  { path: INSTITUTEPAGE_ROUTE, component: <InstitutePage /> },
];
export const authRoutes = [
  { path: INSTITUTEMAP_ROUTE, component: <InstituteMap /> },
  { path: INSTITUTEINFO_ROUTE, component: <InstituteInfo /> },
  { path: INSTITUTESPAGE_ROUTE, component: <InstitutesPage /> },
  { path: USERSETTINGS_ROUTE, component: <UserSettings /> },
  { path: USERINFO_ROUTE, component: <UserInfo /> },
  { path: ADMINPANEL_ROUTE, component: <AdminPanel /> },
];
