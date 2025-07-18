/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarView = ({ segregateProject, setProject, setFabricator }) => {
  const stages = ["RFI", "IFA", "BFA", "BFA-M", "RIFA", "RBFA", "IFC", "BFC", "RIFC", "REV", "CO#"];

  // Define a set of colors for the bars
  // const colors = ["#FF6347", "#FFD700", "#32CD32"]; // Red, Yellow, Green
  // const colors = ['#FF6347', '#FFD700', '#32CD32', '#4169E1', '#F01493', '#00FFFF', '#FF4500', '#8A2BE2', '#00FF00', '#FF00FF', '#FFFF00', '#00CED1'];
  const generateColors = (count) => {
    const colors = [];
    const goldenRatio = 0.618033988749895;
    let hue = Math.random();

    const hslToRgb = (h, s, l) => {
      let r, g, b;

      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };

    for (let i = 0; i < count; i++) {
      hue += goldenRatio;
      hue %= 1;
      const color = hslToRgb(hue, 0.5, 0.6);
      colors.push(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
    }

    return colors;
  };

  const colors = generateColors(Object.keys(segregateProject).length);

  // Prepare data
  const labels = stages;
  const datasets = Object.keys(segregateProject).map((fab, index) => ({
    label: fab,
    data: stages.map((stage) => segregateProject[fab][stage]?.length || 0),
    backgroundColor: colors[index % colors.length], // Cycle through the colors
    stack: "ProjectCount",
  }));

  const data = {
    labels,
    datasets,
  };

  const handleClick = (event, elements) => {
    if (elements.length) {
      const { datasetIndex, index } = elements[0];
      const fab = Object.keys(segregateProject)[datasetIndex];
      const stage = stages[index];
      setProject(segregateProject[fab][stage]);
      setFabricator(fab);
    }
  };

  return (
    <div className="w-4/5 mx-auto">
      <Bar
        data={data}
        height={'100'}
        className="w-full"
        options={{
          onClick: handleClick,
          indexAxis: 'y', // Swap axes
          scales: {
            x: {
              beginAtZero: true,
               ticks: {
                precision: 1,
                stepSize: 1
               }
            },
            y: {
              stacked: true,
            },
          },
          plugins: {
            legend: {
              display: true,
            },
            title: {
              display: true,
              text: "Project Data by Stage and Fabricator",
            },
          },
        }}
      />
      {/* Your table code */}
    </div>
  );
};

export default BarView;
