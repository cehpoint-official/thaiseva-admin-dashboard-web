import { getDocs, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { createContext } from "react";
import {
  requirementsCollection,
  travelRequirementsCollection,
} from "../firebase/firebase.config";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { useState } from "react";

export const RequirementContext = createContext(null);

const RequirementsProvider = ({ children }) => {
  const { user, isAdmin, isPartner, userData } = useContext(AuthContext);
  const [allRequirements, setAllRequirements] = useState([]);
  const [myRequirements, setMyRequirements] = useState([]);
  const [refetchRequirement, setRefetchRequirement] = useState(false);
  const [queryCategory, setQueryCategory] = useState("All");
  const [travelRequirements, setTravelRequirements] = useState([]);

  // fetching all requirements individual partner
  useEffect(() => {
    const loadRequirements = async () => {
      let collection;

      if (userData.serviceCategory === "Driving") {
        collection = travelRequirementsCollection;
      } else {
        collection = requirementsCollection;
      }
      const snapshot = await getDocs(
        query(collection, where("providerUid", "==", user.uid))
      );
      const list = snapshot.docs.map((doc) => doc.data());
      setMyRequirements(list);
    };

    isPartner && loadRequirements();
  }, [user, isPartner, refetchRequirement, userData]);

  // fetching all lcoal requirements for admin dashboard
  useEffect(() => {
    const loadRequirements = async () => {
      let snapshot;

      if (queryCategory === "All") {
        snapshot = await getDocs(requirementsCollection);
      } else {
        snapshot = await getDocs(
          query(
            requirementsCollection,
            where("serviceCategory", "==", queryCategory)
          )
        );
      }

      const list = snapshot.docs.map((doc) => doc.data());
      setAllRequirements(list);
    };

    isAdmin && loadRequirements();
  }, [isAdmin, refetchRequirement, queryCategory]);

  // fetching all travel requirements for admin dashboard
  useEffect(() => {
    const loadTravelRequirements = async () => {
      const snapshot = await getDocs(travelRequirementsCollection);
      const list = snapshot.docs.map((doc) => doc.data());

      setTravelRequirements(list);
    };

    isAdmin && loadTravelRequirements();
  }, [isAdmin, refetchRequirement]);

  // fetching all requirements for individual driver

  // useEffect(()=> {
  //   c
  // }, [])

  const requirementInfo = {
    allRequirements,
    myRequirements,
    queryCategory,
    travelRequirements,
    setRefetchRequirement,
    setQueryCategory,
  };
  return (
    <RequirementContext.Provider value={requirementInfo}>
      {children}
    </RequirementContext.Provider>
  );
};

export default RequirementsProvider;
