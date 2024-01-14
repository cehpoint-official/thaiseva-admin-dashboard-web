import { onSnapshot, query, where } from "firebase/firestore";
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
  const { user, isAdmin, isSubAdmin, isPartner, userData } =
    useContext(AuthContext);
  const [allRequirements, setAllRequirements] = useState([]);
  const [myRequirements, setMyRequirements] = useState([]);
  const [refetchRequirement, setRefetchRequirement] = useState(false);
  const [queryCategory, setQueryCategory] = useState("All");
  const [travelRequirements, setTravelRequirements] = useState([]);
  const [loadingReq, setLoadingReq] = useState(true);

  // fetching all lcoal requirements for admin dashboard
  useEffect(() => {
    const loadData = async () => {
      let unSub;

      if (queryCategory === "All") {
        setLoadingReq(true);
        unSub = onSnapshot(requirementsCollection, (result) => {
          const list = result.docs.map((doc) => doc.data());
          if (list?.length > 0) {
            setAllRequirements(list);
            setLoadingReq(false);
          } else {
            setAllRequirements([]);
            setLoadingReq(false);
          }
        });
      } else {
        let q = query(
          requirementsCollection,
          where("serviceCategory", "==", queryCategory)
        );
        unSub = onSnapshot(q, (result) => {
          const list = result.docs.map((doc) => doc.data());

          if (list?.length > 0) {
            setAllRequirements(list);
            setLoadingReq(false);
          } else {
            setAllRequirements([]);
            setLoadingReq(false);
          }
        });
      }

      return () => {
        unSub();
      };
    };

    (isAdmin || isSubAdmin) && loadData();
  }, [isAdmin, isSubAdmin, refetchRequirement, queryCategory]);

  // fetching all requirements individual partner
  useEffect(() => {
    const loadData = async () => {
      let collection;

      if (userData?.serviceCategory === "Driving") {
        collection = travelRequirementsCollection;
      } else {
        collection = requirementsCollection;
      }
      setLoadingReq(true);
      const q = query(collection, where("providerUid", "==", user?.uid));
      let unSub = onSnapshot(q, (result) => {
        const list = result.docs.map((doc) => doc.data());
        if (list?.length > 0) {
          setMyRequirements(list);
          setLoadingReq(false);
        } else {
          setMyRequirements([]);
          setLoadingReq(false);
        }
      });

      return () => {
        unSub();
      };
    };

    user && loadData();
  }, [user, isPartner, userData]);

  // fetching all travel requirements for admin dashboard
  useEffect(() => {
    const loadTravelRequirements = async () => {
      const unSub = onSnapshot(travelRequirementsCollection, (result) => {
        const list = result.docs.map((doc) => doc.data());
        if (list?.length > 0) {
          setTravelRequirements(list);
          setLoadingReq(false);
        } else {
          setTravelRequirements([]);
          setLoadingReq(false);
        }
      });
      return () => {
        unSub();
      };
    };

    (isAdmin || isSubAdmin) && loadTravelRequirements();
  }, [isAdmin, isSubAdmin]);

  // fetching all requirements for individual driver

  // useEffect(()=> {
  //   c
  // }, [])

  const requirementInfo = {
    allRequirements,
    myRequirements,
    travelRequirements,
    setRefetchRequirement,
    queryCategory,
    setQueryCategory,
    loadingReq,
  };
  return (
    <RequirementContext.Provider value={requirementInfo}>
      {children}
    </RequirementContext.Provider>
  );
};

export default RequirementsProvider;
