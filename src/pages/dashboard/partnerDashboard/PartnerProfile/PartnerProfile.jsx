import { useContext } from "react";
import { AuthContext } from "../../../../contextAPIs/AuthProvider";
import DriverProfile from "../drivers/driverProfile/DriverProfile";
import LocalPartnerProfile from "../localPartner/localPartnerProfile/LocalPartnerProfile";

const PartnerProfile = () => {
  const { userData } = useContext(AuthContext);

  if (userData?.serviceCategory === "Driving") {
    return <DriverProfile />;
  }
  return <LocalPartnerProfile />;
};

export default PartnerProfile;
