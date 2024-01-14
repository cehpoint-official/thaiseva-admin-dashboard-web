import { useContext } from "react";
import { AuthContext } from "../../../contextAPIs/AuthProvider";
import PendingPartnership from "../../../components/PendingPartnership";
import MyDrivingRequirements from "./myRequirements/MyDrivingRequirements";
import MyLocalRequirements from "./myRequirements/MyLocalRequirements";
import Bookings from "./hotel/bookings/Bookings";
import FoodOrders from "./restaurants/foodOrders/FoodOrders";

const PartnerDashboard = () => {
  const { userData, isVerifiedPartner } = useContext(AuthContext);

  if (!isVerifiedPartner) {
    return <PendingPartnership />;
  }

  if (userData?.serviceCategory === "Driving") {
    return <MyDrivingRequirements />;
  } else if (userData?.serviceCategory === "Hotel") {
    return <Bookings />;
  } else if (userData?.serviceCategory === "Restaurant") {
    return <FoodOrders />;
  }

  return <MyLocalRequirements />;
};

export default PartnerDashboard;
