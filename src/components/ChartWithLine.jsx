import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Chart } from "react-chartjs-2";

const ChartWithLine = ({ title, inputs1 }) => {
  ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip
  );

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const data = {
    labels: inputs1.map((input) => input.date),
    datasets: [
      {
        label: "Hotel Revenue",
        data: inputs1.map((input) => input.amount),
        backgroundColor: "rgba(68, 54, 897, 0.5)",
      },
      {
        label: "Hotel Revenue",
        data: inputs1.map((input) => input.amount),
        backgroundColor: "gray",
      },
      {
        label: "Hotel Revenue",
        data: inputs1.map((input) => input.amount),
        backgroundColor: "rgba(324, 00, 234, 0.5)",
      },
    ],
  };
  return <Chart options={options} data={data} className="w-full h-full" />;
};

export default ChartWithLine;
