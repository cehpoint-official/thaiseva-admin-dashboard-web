import { useContext } from "react";
import { AuthContext } from "../contextAPIs/AuthProvider";
import PendingPartnership from "../components/PendingPartnership";

const PartnerRoute = ({ children }) => {
  const { userData, loadingUserData, isVerifiedPartner } =
    useContext(AuthContext);

  console.log(isVerifiedPartner);

  //Returning account pending message
  if (userData.status === "Pending") {
    return <PendingPartnership />;
  }

  console.log(loadingUserData, userData);

  return children;
};

export default PartnerRoute;
