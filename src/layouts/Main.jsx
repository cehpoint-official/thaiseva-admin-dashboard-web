import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contextAPIs/AuthProvider";

const Main = () => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Outlet />;
  }
  return <Navigate to="/login" />;
};

export default Main;
