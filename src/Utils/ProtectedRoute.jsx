import AdminSessionCheck from "../Components/Protected/AdminSessionCheck";
import UserSessionCheck from "../Components/Protected/UserSesssionChech";

export const userSessionCheck = (Component) => (
  <UserSessionCheck>{Component}</UserSessionCheck>
);

export const adminSessionCheck = (Component) => (
  <AdminSessionCheck>{Component}</AdminSessionCheck>
);
