import { doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import {
  partnersCollection,
  requirementsCollection,
} from "../firebase/firebase.config";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

export const PartnerContext = createContext();

const PartnerProvider = ({ children }) => {
  const { user, isPartner, isAdmin } = useContext(AuthContext);

  const [partners, setPartners] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [queryText, setQueryText] = useState("Verified");
  const [queryCategory, setQueryCategory] = useState("Others");
  const [totalRequest, setTotalRequest] = useState(0);
  const [loadingPartnerData, setLoadingPartnerData] = useState(true);
  const [partnerDetails, setPartnerDetails] = useState({});

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
      const docSnap = await getDoc(doc(partnersCollection, user.uid));
      if (docSnap.exists()) {
        setPartnerDetails(docSnap.data());
      }
    };

    isPartner && loadData(user);
  }, [user, isPartner, refetch]);

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
    setPartnerDetails,
  };
  return (
    <PartnerContext.Provider value={partnersInfo}>
      {children}
    </PartnerContext.Provider>
  );
};

export default PartnerProvider;
