import { useContext } from "react";
import { AuthContext } from "../../../contextAPIs/AuthProvider";
import PendingPartnership from "../../../components/PendingPartnership";
import MyDrivingRequirements from "./myRequirements/MyDrivingRequirements";
import MyLocalRequirements from "./myRequirements/MyLocalRequirements";

const PartnerDashboard = () => {
  const { userData, isVerifiedPartner } = useContext(AuthContext);
  if (!isVerifiedPartner) {
    return <PendingPartnership />;
  }

  if (userData?.serviceCategory === "Driving") {
    return <MyDrivingRequirements />;
  }

  console.log(userData);
  return <MyLocalRequirements />;
};

export default PartnerDashboard;
