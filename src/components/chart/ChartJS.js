import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const colors = ["#ed6300", "#43b309", "#f6c722", "skyblue"];

export default function HistoryChart({ data, isPro, isResult, onPan, onZoom }) {
  const labels = data.map((item) => item.gameId);
  // const labels = data.map((item, ind) => data.length - ind);

  const options = {
    // responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = "",
              date = "",
              poolProfit = "",
              moonPercent = "";

            if (context.dataset.originalData) {
              let item = context.dataset.originalData.filter(
                (item) => item.gameId === parseInt(context.label)
              )[0];
              // let item = context.dataset.originalData[parseInt(context.label) - 1];
              label = item.result;
              poolProfit = item.poolProfit;
              moonPercent = item.moonPercent + " %";
              date = moment(item.date).format("YYYY-MM-DD HH:mm:ss");
            }

            if (isPro) return [label, poolProfit, moonPercent, date];
            else return [label, date];
          },
          title: function (items) {
            let gameId = "";

            if (items[0].dataset.originalData) {
              let item = items[0].dataset.originalData.filter(
                (item) => item.gameId === parseInt(items[0].label)
              )[0];
              // let item = items[0].dataset.originalData[parseInt(items[0].label) - 1];
              gameId = item.gameId;
            }

            return gameId;
          },
        },
      },
      zoom: {
        zoom: {
          drag: {
            enabled: true,
            backgroundColor: "rgba(225,0,225,0.3)",
          },
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
          onZoomComplete({ chart }) {
            // console.log(chart.scales.x.ticks.map(el => ({
            //   value: el.value,
            //   label: el.label
            // })))
            // console.log(chart.getZoomLevel(), chart)
            onZoom(
              chart.scales.x.min,
              chart.scales.x.max,
              chart.getZoomLevel()
            );
          },
        },
        pan: {
          enabled: true,
          mode: "x",
          modifierKey: "ctrl",
          onPanComplete({ chart }) {
            onPan(chart.scales.x.min, chart.scales.x.max, chart);
          },
        },
      },
    },
  };

  const historyData = {
    labels,
    datasets: [
      {
        data: data.map(({ result }) =>
          isResult ? result : result > 100 ? 100 : result
        ),
        originalData: data,
        backgroundColor: data.map(({ result }) =>
          result >= 100
            ? colors[3]
            : result >= 10
            ? colors[2]
            : result < 2
            ? colors[0]
            : colors[1]
        ),
      },
    ],
  };

  return <Bar options={options} data={historyData} height={"70%"} />;
}

export function TrendHistoryChart({ data, isResult, onPan, onZoom }) {
  console.log(data);
  const labels = data.map((item) => item.gameId);

  const options = {
    // responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = "",
              date = "",
              poolProfit = "";

            if (context.dataset.originalData) {
              let item = context.dataset.originalData.filter(
                (item) => item.gameId === parseInt(context.label)
              )[0];
              label = item.result;
              poolProfit = item.poolProfit;
              date = moment(item.date).format("YYYY-MM-DD HH:mm:ss");
            }

            return [label, poolProfit, date];
          },
        },
      },
      zoom: {
        zoom: {
          drag: {
            enabled: true,
            backgroundColor: "rgba(225,0,225,0.3)",
          },
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
          onZoomComplete({ chart }) {
            // console.log(chart.scales.x.ticks.map(el => ({
            //   value: el.value,
            //   label: el.label
            // })))
            // console.log(chart.getZoomLevel(), chart)
            onZoom(
              chart.scales.x.min,
              chart.scales.x.max,
              chart.getZoomLevel()
            );
          },
        },
        pan: {
          enabled: true,
          mode: "x",
          modifierKey: "ctrl",
          onPanComplete({ chart }) {
            onPan(chart.scales.x.min, chart.scales.x.max, chart);
          },
        },
      },
    },
  };

  const historyData = {
    labels,
    datasets: [
      {
        data: data.map(({ possibility }) => possibility),
        originalData: data,
        backgroundColor: data.map(({ possibility }) =>
          possibility < 50 ? colors[0] : colors[1]
        ),
      },
    ],
  };

  return <Bar options={options} data={historyData} height={"70%"} />;
}
