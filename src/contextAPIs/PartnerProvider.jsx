import { doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import {
  driversCollection,
  partnersCollection,
} from "../firebase/firebase.config";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

export const PartnerContext = createContext();

const PartnerProvider = ({ children }) => {
  const { user, isAdmin, userData } = useContext(AuthContext);

  const [partners, setPartners] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [queryText, setQueryText] = useState("Verified");
  const [queryCategory, setQueryCategory] = useState("Others");
  const [totalRequest, setTotalRequest] = useState(0);
  const [loadingPartnerData, setLoadingPartnerData] = useState(true);
  const [partnerDetails, setPartnerDetails] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [driverRequest, setDriverRequest] = useState(0);

  // loading all partners data
  useEffect(() => {
    const loadPatnersData = async () => {
      setLoadingPartnerData(true);
      const querySnapshot = await getDocs(
        query(
          partnersCollection,
          where("status", "==", queryText),
          where("serviceCategory", "==", queryCategory)
        )
      );

      if (querySnapshot) {
        const list = querySnapshot.docs.map((doc) => doc.data());
        setPartners(list); // Set the state with the list of data
      }

      const pending = await getDocs(
        query(
          partnersCollection,
          where("status", "==", "Pending"),
          where("serviceCategory", "==", queryCategory)
        )
      );
      setTotalRequest(pending.docs?.length);
      setLoadingPartnerData(false);
    };

    loadPatnersData();
  }, [refetch, queryText, queryCategory]);

  // loading individual partner data
  useEffect(() => {
    const loadData = async (user) => {
      let collection;

      if (userData?.serviceCategory === "Driving") {
        collection = driversCollection;
      } else {
        collection = partnersCollection;
      }
      const docSnap = await getDoc(doc(collection, user?.uid));
      if (docSnap.exists()) {
        setPartnerDetails(docSnap.data());
      }
    };

    userData && user && loadData(user);
  }, [user, userData, refetch]);

  // loading all drivers
  useEffect(() => {
    const loadDrivers = async () => {
      setLoadingPartnerData(true);

      const snapshot = await getDocs(
        query(driversCollection, where("status", "==", queryText))
      );
      const list = snapshot.docs.map((doc) => doc.data());
      setDrivers(list);

      const pending = await getDocs(
        query(driversCollection, where("status", "==", "Pending"))
      );
      setDriverRequest(pending.docs?.length);
      setLoadingPartnerData(false);
    };

    isAdmin && loadDrivers();
  }, [isAdmin, queryText, refetch]);

  const partnersInfo = {
    partners,
    setPartners,
    refetch,
    setRefetch,
    setQueryText,
    queryText,
    setQueryCategory,
    queryCategory,
    totalRequest,
    loadingPartnerData,
    partnerDetails,
    drivers,
    setPartnerDetails,
    driverRequest,
  };
  return (
    <PartnerContext.Provider value={partnersInfo}>
      {children}
    </PartnerContext.Provider>
  );
};

export default PartnerProvider;
