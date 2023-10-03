import { useContext } from "react";
import { AuthContext } from "../contextAPIs/AuthProvider";
import PendingPartnership from "../components/PendingPartnership";

const PartnerRoute = ({ children }) => {
  const { userData, loadingUserData } = useContext(AuthContext);

  if (loadingUserData) {
    return <h3>Loading..</h3>;
  }
  //Returning account pending message
  if (userData.status === "Pending") {
    return <PendingPartnership />;
  }

  return children;
};

export default PartnerRoute;
