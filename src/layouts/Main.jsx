import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contextAPIs/AuthProvider";

const Main = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return;
  }
  if (user) {
    return <Outlet />;
  }
  return <Navigate to="/login" />;
};

export default Main;
