import { useContext } from "react";
// import { AuthContext } from "../providers/AuthProviders";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contextAPIs/AuthProvider";
import Loading from "../components/Loading";

const PrivetRouter = ({ children }) => {
  const { user, loading, loadingUserData } = useContext(AuthContext);

  if (loading || loadingUserData) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (user) {
    return children;
  }
  return <Navigate to="/login"></Navigate>;
};

export default PrivetRouter;
