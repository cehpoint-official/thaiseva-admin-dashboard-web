import { useContext, useEffect, useState } from "react";
import DriverProfile from "../drivers/driverProfile/DriverProfile";
import LocalPartnerProfile from "../localPartner/localPartnerProfile/LocalPartnerProfile";
import HotelProfile from "../hotel/hotelProfile/HotelProfile";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import {
  driversCollection,
  hotelsCollection,
  partnersCollection,
} from "../../../../firebase/firebase.config";
import { PartnerContext } from "../../../../contextAPIs/PartnerProvider";

const PartnerProfile = () => {
  const { refetch } = useContext(PartnerContext);
  const { uid, category } = useParams();
  const [partnerDetails, setPartnerDetails] = useState({});

  useEffect(() => {
    const loadData = async (user) => {
      let collection;

      if (category === "Driving") {
        collection = driversCollection;
      } else if (category === "Hotel") {
        collection = hotelsCollection;
      } else {
        collection = partnersCollection;
      }
      const docSnap = await getDoc(doc(collection, uid || user.uid));
      if (docSnap.exists()) {
        setPartnerDetails(docSnap.data());
      }
    };
    uid && loadData();
  }, [uid, category, refetch]);

  if (category === "Driving") {
    return <DriverProfile partnerDetails={partnerDetails} />;
  } else if (category === "Hotel") {
    return <HotelProfile partnerDetails={partnerDetails} />;
  }
  return <LocalPartnerProfile partnerDetails={partnerDetails} />;
};

export default PartnerProfile;
