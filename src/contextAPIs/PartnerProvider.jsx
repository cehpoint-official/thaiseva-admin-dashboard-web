import {
  doc,
  endBefore,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  startAt,
  where,
} from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import {
  driversCollection,
  hotelsCollection,
  partnersCollection,
  hotelPackages,
  roomBookingCollection,
  restaurentsCollection,
  foodMenuCollection,
  travelBookingCollection,
  settingsCollection,
  invoicesCollection,
} from "../firebase/firebase.config";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

export const PartnerContext = createContext();

const PartnerProvider = ({ children }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { user, isAdmin, isSubAdmin, userData } = useContext(AuthContext);
  const [chatRoom, setChatRoom] = useState("CustomerSupport");
  const [partners, setPartners] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [queryText, setQueryText] = useState("Verified");
  const [queryCategory, setQueryCategory] = useState("Others");
  const [totalRequest, setTotalRequest] = useState(0);
  const [loadingPartnerData, setLoadingPartnerData] = useState(true);
  const [partnerDetails, setPartnerDetails] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [driverRequest, setDriverRequest] = useState(0);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [myRoomBookings, setMyRoomBookings] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [roomBookings, setRoomBookings] = useState([]);
  const [myRooms, setMyRooms] = useState([]);
  const [myFoodMenu, setMyFoodMenu] = useState([]);
  const [foodMenu, setFoodMenu] = useState([]);
  const [carBookings, setCarBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [logo, setLogo] = useState("");
  const [invoices, setInvoices] = useState();
  const [uid, setUid] = useState("");

  const contactInfo = {
    email: "thaiseva@gmail.com",
    phone: "01723646378",
  };

  // loading logo
  useEffect(() => {
    const loadLogo = async () => {
      const logoSnapshot = await getDocs(
        query(settingsCollection, where("id", "==", "logo"))
      );
      const logo = logoSnapshot.docs?.[0].data();
      if (logo) {
        setLogo(logo.logo);
      }
    };

    user && loadLogo();
  }, [refetch, user]);

  // loading service categories
  useEffect(() => {
    const loadCategories = async () => {
      const querySnapshot = await getDocs(
        query(settingsCollection, where("id", "==", "Service_Categories"))
      );
      const list = querySnapshot.docs?.map((doc) => doc.data());

      if (list[0]?.categories?.length > 0) {
        setCategories(list[0].categories);
      }
    };

    loadCategories();
  }, [refetch]);

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

  // loading Driver's data
  useEffect(() => {
    const loadData = async (user) => {
      let collection;

      if (userData?.serviceCategory === "Driving") {
        collection = driversCollection;
      } else if (userData?.serviceCategory === "Hotel") {
        collection = hotelsCollection;
      } else if (userData?.serviceCategory === "Restaurant") {
        collection = restaurentsCollection;
      } else {
        collection = partnersCollection;
      }
      const docSnap = await getDoc(doc(collection, uid || user.uid));
      if (docSnap.exists()) {
        setPartnerDetails(docSnap.data());
      }
    };

    (user || uid) && loadData(user);
  }, [user, userData, refetch, uid]);

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

    (isAdmin || isSubAdmin) && loadDrivers();
  }, [isAdmin, isSubAdmin, queryText, refetch]);

  // loading all hotels
  useEffect(() => {
    const loadHotels = async () => {
      setLoadingPartnerData();
      const unSub = onSnapshot(hotelsCollection, (result) => {
        if (result) {
          const list = result.docs.map((doc) => doc.data());
          if (list?.length > 0) {
            setHotels(list);
            setLoadingPartnerData(false);
          } else {
            setHotels([]);
            setLoadingPartnerData(false);
          }
        }
      });

      return () => {
        unSub();
      };
    };

    (isAdmin || isSubAdmin) && loadHotels();
  }, [isAdmin, isSubAdmin]);

  // loading all restaurants
  useEffect(() => {
    const loadHotels = async () => {
      setLoadingData(true);
      const unSub = onSnapshot(restaurentsCollection, (result) => {
        if (result) {
          const list = result.docs.map((doc) => doc.data());
          let menu = [];
          if (list?.length > 0) {
            list.forEach((restaurant) => {
              const { items } = restaurant || {};
              if (items.length > 0) {
                items?.forEach((item) =>
                  menu.push({
                    ...item,
                    restaurantName: restaurant.name,
                    email: restaurant.email,
                    phone: restaurant.phone,
                  })
                );
              }
            });
            setRestaurants(list);
            setFoodMenu(menu);
            setLoadingData(false);
          } else {
            setRestaurants([]);
            setLoadingData(false);
          }
        }
      });

      return () => {
        unSub();
      };
    };

    (isAdmin || isSubAdmin) && loadHotels();
  }, [isAdmin, isSubAdmin]);

  // rooms for individual hotel owner
  useEffect(() => {
    const loadData = (user, hotelPackages) => {
      const unSub = onSnapshot(
        query(hotelPackages, where("hotelUid", "==", user.uid)),
        (result) => {
          if (result.docs.length > 0) {
            const list = result.docs.map((doc) => doc.data());
            setMyRooms(list);
          }
          if (result.docs.length == 0) {
            setMyRooms([]);
          }
        }
      );

      return () => {
        unSub();
      };
    };
    user && loadData(user, hotelPackages);
  }, [user]);

  // loading all room's data
  useEffect(() => {
    const loadData = () => {
      setLoadingData(true);
      const unSub = onSnapshot(hotelPackages, (result) => {
        if (result.docs.length > 0) {
          const list = result.docs.map((doc) => doc.data());
          setRooms(list);
          setLoadingData(false);
        }
        if (result.docs.length == 0) {
          setRooms([]);
          setLoadingData(false);
        }
      });

      return () => {
        unSub();
      };
    };
    (isAdmin || isSubAdmin) && loadData();
  }, [isAdmin, isSubAdmin]);

  // menu for individual restaurant
  useEffect(() => {
    const loadData = (user, foodMenuCollection) => {
      const unSub = onSnapshot(
        query(foodMenuCollection, where("restaurantUid", "==", user.uid)),
        (result) => {
          if (result.docs.length > 0) {
            const list = result.docs.map((doc) => doc.data());
            setMyFoodMenu(list);
          }
          if (result.docs.length == 0) {
            setMyFoodMenu([]);
          }
        }
      );

      return () => {
        unSub();
      };
    };
    user && loadData(user, foodMenuCollection);
  }, [user]);

  // loading all room bookings
  useEffect(() => {
    const loadBookings = () => {
      setLoadingData(true);
      const unSub = onSnapshot(
        query(
          roomBookingCollection,
          orderBy("status"),
          orderBy("orderedAt", "desc"),
          // startAfter(19),
          limit(20)
        ),
        (result) => {
          if (result.docs.length > 0) {
            const list = result.docs.map((doc) => {
              return { ...doc.data(), bookingId: doc.id };
            });
            setRoomBookings(list);
            setLoadingData(false);
          }
          if (result.docs.length == 0) {
            setRoomBookings([]);
            setLoadingData(false);
          }
        }
      );

      return () => {
        unSub();
      };
    };

    user && loadBookings();
  }, [user, refetch, rowsPerPage, page]);

  // loading individual room bookings
  useEffect(() => {
    const loadBookings = (user) => {
      const unSub = onSnapshot(
        query(roomBookingCollection, where("hotelUid", "==", user?.uid)),
        (result) => {
          if (result.docs.length > 0) {
            const list = result.docs.map((doc) => {
              return { ...doc.data(), bookingId: doc.id };
            });
            setMyRoomBookings(list);
            setLoadingData(false);
          }
          if (result.docs.length == 0) {
            setMyRoomBookings([]);
            setLoadingData(false);
          }
        }
      );

      return () => {
        unSub();
      };
    };

    user && loadBookings(user);
  }, [user]);

  // loading all travel bookings
  useEffect(() => {
    const loadData = () => {
      setLoadingData(true);
      const unSub = onSnapshot(
        query(travelBookingCollection, where("category", "==", "car")),
        (result) => {
          if (result.docs.length > 0) {
            const list = result.docs.map((doc) => doc.data());

            setCarBookings(list);
            setLoadingData(false);
          }
          if (result.docs.length == 0) {
            setCarBookings([]);
            setLoadingData(false);
          }
        }
      );

      return () => {
        unSub();
      };
    };
    user && loadData();
  }, [user]);

  // loading all partner's payments
  useEffect(() => {
    const loadPayments = async () => {
      setLoadingData(true);
      const snap = await getDocs(invoicesCollection);
      if (snap.docs.length > 0) {
        const list = snap?.docs.map((doc) => doc.data());
        if (list?.length > 0) {
          setInvoices(list);
          setLoadingData(false);
        }
      }
    };

    isAdmin && loadPayments();
  }, [isAdmin, refetch]);

  const partnersInfo = {
    partners,
    setLoadingData,
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
    hotels,
    rooms,
    myRoomBookings,
    loadingData,
    setPartnerDetails,
    driverRequest,
    setChatRoom,
    chatRoom,
    roomBookings,
    myRooms,
    restaurants,
    myFoodMenu,
    carBookings,
    foodMenu,
    logo,
    contactInfo,
    categories,
    invoices,
    setUid,
    setPage,
    setRowsPerPage,
    page,
    rowsPerPage,
  };
  return (
    <PartnerContext.Provider value={partnersInfo}>
      {children}
    </PartnerContext.Provider>
  );
};

export default PartnerProvider;
