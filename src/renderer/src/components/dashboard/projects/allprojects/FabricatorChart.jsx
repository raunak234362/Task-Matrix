/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement // For pie chart
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const FabricatorCharts = ({ segregateProject }) => {
    const [chartType, setChartType] = useState('bar'); // Default to bar chart
    const stages = ['RFI', 'IFA', 'BFA', 'BFA-M', 'RIFA', 'RBFA', 'IFC', 'BFC', 'RIFC', 'REV', 'CO#'];

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

    const fabricators = Object.keys(segregateProject);

    return (
        <div className="w-full mx-auto">
            {/* Toggle between pie and bar chart */}
            <div className="flex justify-end mb-4">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={() => setChartType(chartType === 'bar' ? 'pie' : 'bar')}
                >
                    {chartType === 'bar' ? 'Switch to Pie Chart' : 'Switch to Bar Chart'}
                </button>
            </div>

            {/* Scrollable container for multiple charts */}
            <div className="overflow-x-auto" style={{ maxHeight: '60vh' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {fabricators.map((fabricator, fabricatorIndex) => {
                        const fabricatorData = segregateProject[fabricator];
                        const colors = generateColors(stages.length);

                        // Data for bar and pie charts
                        const barData = {
                            labels: stages,
                            datasets: [
                                {
                                    label: fabricator,
                                    data: stages.map(stage => fabricatorData[stage]?.length || 0),
                                    backgroundColor: colors,
                                }
                            ]
                        };

                        const pieData = {
                            labels: stages,
                            datasets: [
                                {
                                    label: fabricator,
                                    data: stages.map(stage => fabricatorData[stage]?.length || 0),
                                    backgroundColor: colors,
                                }
                            ]
                        };

                        return (
                            <div key={fabricatorIndex} className="border p-4 rounded-lg shadow-md bg-white">
                                <h3 className="text-lg font-bold mb-4">{fabricator}</h3>
                                {chartType === 'bar' ? (
                                    <Bar
                                        data={barData}
                                        options={{
                                            indexAxis: 'y',
                                            scales: {
                                                x: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        precision: 0,
                                                        stepSize: 0,
                                                        font: {
                                                            size: 12,
                                                            weight: 'bold'
                                                        }
                                                    },
                                                    title: {
                                                        display: true,
                                                        text: 'Number of Projects',
                                                        font: {
                                                            size: 15,
                                                            weight: 'bold'
                                                        }
                                                    },
                                                    grid: {
                                                        display: true,
                                                        color: '#e0e0e0'
                                                    }
                                                },
                                                y: {
                                                    ticks: {
                                                        font: {
                                                            size: 10
                                                        }
                                                    },
                                                    title: {
                                                        display: true,
                                                        text: 'Stages',
                                                        font: {
                                                            size: 10,
                                                            weight: 'bold'
                                                        }
                                                    },
                                                    grid: {
                                                        display: false
                                                    }
                                                }
                                            },
                                            plugins: {
                                                legend: {
                                                    display: false
                                                }
                                            },
                                            maintainAspectRatio: true
                                        }}
                                    />
                                ) : (
                                    <Pie
                                        data={pieData}
                                        options={{
                                            plugins: {
                                                legend: {
                                                    display: true,
                                                    position: 'top',
                                                    labels: {
                                                        font: {
                                                            size: 10,
                                                            weight: 'bold'
                                                        }
                                                    }
                                                }
                                            },
                                            maintainAspectRatio: true
                                        }}
                                        height={5}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FabricatorCharts;
