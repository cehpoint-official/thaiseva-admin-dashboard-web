import { useContext } from "react";
import PageHeading from "../../../../components/PageHeading";
import { PartnerContext } from "../../../../contextAPIs/PartnerProvider";
import AllStatistics from "./childs/AllStatistics";

const AdminStatistics = () => {
  const { logo, categories, setRefetch, contactInfo, partnerPayments } =
    useContext(PartnerContext);
  const months = [
    "January",
    "February",
    "March",
    "Appril",
    "May",
    "June",
    "July",
    "Augast",
    "September",
    "October",
    "November",
    "December",
  ];

  // useEffect(() => {
  //   const loadHotels = async () => {
  //     const unSub = onSnapshot(
  //       query(hotelStatisticsCollection, where("date", "==", "")),
  //       (result) => {
  //         if (result) {
  //           const list = result.docs.map((doc) => {
  //             // console.log(doc);
  //             let item = doc.data();
  //             const totalPaid = item.price * item.quantity;
  //             item.totalPaid = totalPaid;
  //             return item;
  //           });
  //           if (list?.length > 0) {
  //             setHotelStatistics(list);
  //           } else {
  //             setHotelStatistics([]);
  //           }
  //         }
  //       }
  //     );

  //     return () => {
  //       unSub();
  //     };
  //   };

  //   isAdmin && loadHotels();
  // }, [isAdmin]);

  // const

  return (
    <div>
      <PageHeading text="Admin Statistics" />

      <div>
        <AllStatistics />
        {/* <Bar options={options} data={data} /> */}
        {/* <HotelsStatistics /> */}
      </div>
    </div>
  );
};

export default AdminStatistics;
