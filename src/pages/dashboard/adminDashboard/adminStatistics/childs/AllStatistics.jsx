import { useContext, useEffect, useState } from "react";
import { StatisticsContext } from "../../../../../contextAPIs/StatisticsProvider";
import { amountCalculator, dateCalculator } from "../../../../../utils/utils";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import LineChart from "../../../../../components/LineChart";

const AllStatistics = () => {
  const {
    allStatistics,
    queryText,
    setQueryText,
    hotelStatistics,
    localStatistics,
    travelStatistics,
  } = useContext(StatisticsContext);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 2),
      key: "selection",
    },
  ]);
  const [isOpenCalendar, setIsOpenCalendar] = useState(false);
  const [filteredAll, setFilteredAll] = useState([]);
  const [filteredHotel, setFilteredHotel] = useState([]);
  const [filteredLocal, setFilteredLocal] = useState([]);
  const [filteredTravel, setFilteredTravel] = useState([]);
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {
    setFilteredAll(allStatistics);
    setFilteredHotel(hotelStatistics);
    setFilteredLocal(localStatistics);
    setFilteredTravel(travelStatistics);
  }, [allStatistics, hotelStatistics, localStatistics, travelStatistics]);

  const filterByDate = () => {
    const date1 = new Date(dates[0].startDate).toLocaleDateString();
    const date2 = new Date(dates[0].endDate).toLocaleDateString();

    const array1 = allStatistics.filter((item) => {
      const itemDate = dateCalculator(item.date);
      if (itemDate >= date1 && itemDate <= date2) {
        return item;
      }
    });
    const array2 = hotelStatistics.filter((item) => {
      const itemDate = dateCalculator(item.date);
      if (itemDate >= date1 && itemDate <= date2) {
        return item;
      }
    });
    const array3 = localStatistics.filter((item) => {
      const itemDate = dateCalculator(item.date);
      if (itemDate >= date1 && itemDate <= date2) {
        return item;
      }
    });
    const array4 = travelStatistics.filter((item) => {
      const itemDate = dateCalculator(item.date);
      if (itemDate >= date1 && itemDate <= date2) {
        return item;
      }
    });

    setFilteredAll(array1);
    setFilteredHotel(array2);
    setFilteredLocal(array3);
    setFilteredTravel(array4);
    setIsOpenCalendar(false);
  };

  const handleChangeQueryText = (e) => {
    // const year = new Date().getFullYear(); todo
    const year = 2023;
    if (e === "days") {
      return setQueryText(`${year}_${e}`);
    } else if (e === "months") {
      return setQueryText(`${year}_${e}`);
    } else {
      setQueryText(e);
    }
  };

  const allTotal = amountCalculator(filteredAll);
  const hotelTotal = amountCalculator(filteredHotel);
  const localTotal = amountCalculator(filteredLocal);
  const travelTotal = amountCalculator(filteredTravel);

  return (
    <div className="border border-slate-200 rounded mb-5">
      {/* <h3 className="text-xl font-bold text-center border-y bg-slate-200  text-[var(--primary-bg)] mb-3">
        All Statistics
      </h3> */}
      <div className="flex items-center gap-2">
        <select
          name=""
          id=""
          onChange={(e) => handleChangeQueryText(e.target.value)}
          className="border-2 border-[var(--primary-bg)] py-1.5 px-2 h-full"
        >
          <option value="days">Days</option>
          <option value="months">Months</option>
          <option value="years">Years</option>
        </select>
        <select
          name=""
          id=""
          onChange={(e) => setChartType(e.target.value)}
          className="border-2 border-[var(--primary-bg)] py-1.5 px-2 h-full"
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
        </select>
        {queryText.includes("days") && (
          <div className="relative">
            <div className=" border-2 border-[var(--primary-bg)] h-full">
              <input
                onClick={() => setIsOpenCalendar((p) => !p)}
                type="text"
                value={`${new Date(
                  dates[0].startDate
                ).toLocaleDateString()} to ${new Date(
                  dates[0].endDate
                ).toLocaleDateString()}`}
                readOnly
                className="py-1 px-2 outline-none"
              />
              <button
                onClick={filterByDate}
                className="bg-[var(--primary-bg)] text-white font-bold h-8 px-2 "
              >
                Go
              </button>
            </div>
            {isOpenCalendar && (
              <div className="absolute z-10 top-10">
                <button
                  onClick={() => setIsOpenCalendar(false)}
                  className="absolute top-3 right-3 z-10 bg-red-400 h-6 w-6 text-white rounded-full font-bold"
                >
                  X
                </button>
                <DateRange
                  onChange={(item) => setDates([item.selection])}
                  editableDateInputs={true}
                  moveRangeOnFirstSelection={false}
                  retainEndDateOnFirstSelection={true}
                  showSelectionPreview={true}
                  // moveRangeOnFirstSelection={false}
                  months={1}
                  ranges={dates}
                  direction="horizontal"
                  className="hidden border border-[var(--primary-bg)] rounded"
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex md:flex-row flex-col">
        <div className="md:w-[60vw] w-screen min-h-[50vh]">
          <LineChart
            title="All Statistics"
            all={filteredAll}
            hotelStatistics={filteredHotel}
            localStatistics={filteredLocal}
            travelStatistics={filteredTravel}
            chartType={chartType}
          />
        </div>
        <div className="flex-grow p-2">
          <h3 className="text-xl font-bold text-center border-b-2 mb-2 ">
            Revenue
          </h3>
          <h3 className="text-xl font-bold flex items-center justify-between w-full">
            <span>Hotel :</span> <span>฿{hotelTotal}</span>
          </h3>
          <h3 className="text-xl font-bold flex items-center justify-between w-full">
            <span>Local :</span> <span>฿{localTotal}</span>
          </h3>
          <h3 className="text-xl font-bold flex items-center justify-between w-full">
            <span>Travel : </span>
            <span>฿{travelTotal}</span>
          </h3>
          <h3 className="text-xl font-bold flex items-center justify-between w-full border-t">
            <span>Total :</span> <span>฿{allTotal}</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default AllStatistics;
