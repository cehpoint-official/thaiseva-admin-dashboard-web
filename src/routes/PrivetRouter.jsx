import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contextAPIs/AuthProvider";
import Loading from "../components/Loading";

const PrivetRouter = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
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
