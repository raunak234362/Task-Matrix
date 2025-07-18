/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarViews = ({ segregateProject, setProject, setFabricator }) => {
    console.log("PROJECT--",segregateProject)
    console.log("FABRICATOR--",setFabricator)
const stages = ['RFI', 'IFA', 'BFA', 'BFA-M', 'RIFA', 'RBFA', 'IFC', 'BFC', 'RIFC', 'REV', 'CO#'];
// const colors = ['#FF6347', '#FFD700', '#32CD32', ]; // Red, Yellow, Green
// const colors = ['#FF6347', '#FFD700', '#32CD32', '#4169E1', '#FF1493', '#00FFFF', '#FF4500', '#8A2BE2', '#00FF00', '#FF00FF', '#FFFF00', '#00CED1'];

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

// Prepare data for the chart
const labels = stages;
const datasets = Object.keys(segregateProject).map((fab, index) => {
const data = stages.map((stage) => segregateProject[fab][stage]?.length || 0);
return {
    label: fab,
    data,
    backgroundColor: colors[index % colors.length],
    stack: 'ProjectCount'
};
});

const data = {
labels,
datasets
};

const handleClick = (_, elements) => {
if (elements.length > 0) {
    const { datasetIndex, index } = elements[0];
    const fab = Object.keys(segregateProject)[datasetIndex];
    const stage = stages[index];
    setProject(segregateProject[fab][stage]);
    setFabricator(fab);
}
};

return (
<div className="w-full mx-auto">
    <Bar
    data={data}
    options={{
        onClick: handleClick,
        indexAxis: 'y', // Horizontal bars
        scales: {
        x: {
            beginAtZero: true,
            ticks: {
            precision: 0, // No decimal places
            stepSize: 1,
            font: {
                size: 12, // Increased font size for better readability
                weight: 'bold' // Bold font for emphasis
            }
            },
            title: {
            display: true,
            text: 'Number of Projects',
            font: {
                size: 15, // Title font size
                weight: 'bold' // Bold font for title
            }
            },
            grid: {
            display: true, // Display grid lines
            color: '#e0e0e0' // Light gray color for grid lines
            }
        },
        y: {
            stacked: true, // Stacked bars
            ticks: {
            font: {
                size: 12 // Decreased font size for the stages
            }
            },
            title: {
            display: true,
            text: 'Stages',
            font: {
                size: 15, // Title font size
                weight: 'bold' // Bold font for title
            }
            },
            grid: {
            display: false // Hide y-axis grid lines for a cleaner look
            }
        }
        },
        plugins: {
        legend: {
            display: true,
            position: 'top',
            labels: {
            font: {
                size: 14, // Increased legend font size
                weight: 'bold' // Bold font for legend
            }
            }
        },
        title: {
            display: true,
            text: 'Project Data by Stage and Fabricator',
            font: {
            size: 10, // Title font size
            weight: 'bold' // Bold font for title
            }
        }
        },
        maintainAspectRatio: false // Disable maintaining aspect ratio to allow custom height
    }}
    height={120} // Increased height of the chart
    className="w-full"
    />
</div>
);
};

export default BarViews;
