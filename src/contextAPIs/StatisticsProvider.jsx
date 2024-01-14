import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { statisticsCollection } from "../firebase/firebase.config";
import { AuthContext } from "./AuthProvider";
export const StatisticsContext = createContext();

const StatisticsProvider = ({ children }) => {
  const [allStatistics, setAllStatistics] = useState([]);
  const [hotelStatistics, setHotelStatistics] = useState([]);
  const [travelStatistics, setTravelStatistics] = useState([]);
  const [localStatistics, setLocalStatistics] = useState([]);
  const [queryText, setQueryText] = useState(
    `${2023}_days`
    // `${new Date().getFullYear()}_days` todo
  );
  const [hotelsQuery, setHotelsQuery] = useState("hotels_2023_days");
  const [localQuery, setLocalQuery] = useState("local_2023_days");
  const [travelQuery, setTravelQuery] = useState("travel_2023_days");
  const { isAdmin } = useContext(AuthContext);

  console.log(`all_${queryText}`);

  useEffect(() => {
    const loadAllStatistics = async () => {
      const snapshot = await getDoc(
        doc(statisticsCollection, `all_${queryText}`)
      );

      if (snapshot) {
        let list = [];
        if (queryText.includes("months")) {
          list = snapshot.data()?.months;
        } else if (queryText.includes("days")) {
          const data = snapshot.data()?.days;

          list = data?.sort((a, b) => a.date - b.date);
        } else if (queryText.includes("years")) {
          const data = snapshot.data()?.years;
          list = data?.sort((a, b) => a.year - b.year);
        }
        if (list?.length > 0) {
          setAllStatistics(list);
        } else {
          setAllStatistics([]);
        }
      }
    };

    isAdmin && loadAllStatistics();
  }, [isAdmin, queryText]);

  useEffect(() => {
    const loadHotelStatistics = async () => {
      const snapshot = await getDoc(
        doc(statisticsCollection, `hotels_${queryText}`)
      );

      if (snapshot) {
        let list = [];
        if (queryText.includes("months")) {
          list = snapshot.data()?.months;
        } else if (queryText.includes("days")) {
          const data = snapshot.data()?.days;

          list = data?.sort((a, b) => a.date - b.date);
        } else if (queryText.includes("years")) {
          const data = snapshot.data()?.years;
          list = data?.sort((a, b) => a.year - b.year);
        }

        if (list?.length > 0) {
          setHotelStatistics(list);
        } else {
          setHotelStatistics([]);
        }
      }
    };

    isAdmin && loadHotelStatistics();
  }, [isAdmin, queryText]);

  useEffect(() => {
    const loadTravelStatistics = async () => {
      const snapshot = await getDoc(
        doc(statisticsCollection, `travel_${queryText}`)
      );

      if (snapshot) {
        let list = [];
        if (queryText.includes("months")) {
          list = snapshot.data()?.months;
        } else if (queryText.includes("days")) {
          const data = snapshot.data()?.days;

          list = data?.sort((a, b) => a.date - b.date);
        } else if (queryText.includes("years")) {
          const data = snapshot.data()?.years;
          list = data?.sort((a, b) => a.year - b.year);
        }

        if (list?.length > 0) {
          setTravelStatistics(list);
        } else {
          setTravelStatistics([]);
        }
      }
    };

    isAdmin && loadTravelStatistics();
  }, [isAdmin, queryText]);

  useEffect(() => {
    const localStatistics = async () => {
      const snapshot = await getDoc(
        doc(statisticsCollection, `local_${queryText}`)
      );

      if (snapshot) {
        let list = [];
        if (queryText.includes("months")) {
          list = snapshot.data()?.months;
        } else if (queryText.includes("days")) {
          const data = snapshot.data()?.days;

          list = data?.sort((a, b) => a.date - b.date);
        } else if (queryText.includes("years")) {
          const data = snapshot.data()?.years;
          list = data?.sort((a, b) => a.year - b.year);
        }

        if (list?.length > 0) {
          setLocalStatistics(list);
        } else {
          setLocalStatistics([]);
        }
      }
    };

    isAdmin && localStatistics();
  }, [isAdmin, queryText]);

  const obj = {
    allStatistics,
    hotelStatistics,
    travelStatistics,
    localStatistics,
    queryText,
    setQueryText,
    hotelsQuery,
    setHotelsQuery,
  };

  return (
    <StatisticsContext.Provider value={obj}>
      {children}
    </StatisticsContext.Provider>
  );
};

export default StatisticsProvider;
