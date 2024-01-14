import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

const MonthlyBarChart = ({ inputs, title }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: "top",
  //     },
  //     title: {
  //       display: true,
  //       text: title,
  //     },
  //   },
  // };

  const options = {
    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const data = {
    labels: inputs.map((input) => input.month),
    datasets: [
      {
        type: "line",
        label: "Total Revenue",
        borderColor: "rgba(324, 00, 234, 0.5)",
        data: inputs.map((input) => input.amount),
        backgroundColor: "rgba(324, 00, 234, 0.5)",
      },
      {
        label: "Total Revenue",
        data: inputs.map((input) => input.amount),
        backgroundColor: "rgba(324, 00, 234, 0.5)",
      },
    ],
  };
  return <Bar options={options} data={data} className="w-full h-full" />;
};

export default MonthlyBarChart;
