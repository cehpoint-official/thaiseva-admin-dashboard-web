import { useContext, useEffect } from "react";
import { AuthContext } from "../../../../contextAPIs/AuthProvider";

import PartnerChats from "./PartnerChats";
import { PartnerChatContext } from "../../../../contextAPIs/PartnerChatProvider";
import { PartnerContext } from "../../../../contextAPIs/PartnerProvider";

const ChatWithAdmin = () => {
  const { logo } = useContext(PartnerContext);
  const { dispatch } = useContext(PartnerChatContext);
  const { userData } = useContext(AuthContext);

  let adminUid = "";
  let displayName = "";
  if (userData?.serviceCategory === "Driving") {
    adminUid = "_DriversSupport";
    displayName = "Driver Support";
  } else if (userData?.serviceCategory === "Hotel") {
    adminUid = "_HotelSupport";
    displayName = "Hotel Support";
  } else if (userData?.serviceCategory === "Restaurant") {
    adminUid = "_RestaurantSupport";
    displayName = "Restaurant Support";
  } else {
    adminUid = "_LocalPartnerSupport";
    displayName = "Local Partner Support";
  }
  useEffect(() => {
    // taking the admin details for messaging
    const handleSelect = async () => {
      const adminInfo = {
        uid: adminUid,
        displayName: displayName,
        photoURL: logo, // todo : thaiseva logo
      };

      dispatch({ type: "CHANGE_USER", payload: adminInfo });
    };

    userData && handleSelect();
  }, [userData, logo, adminUid, displayName, dispatch]);

  return (
    <div className="md:h-[80vh] h-[85vh]">
      <PartnerChats />
    </div>
  );
};

export default ChatWithAdmin;
