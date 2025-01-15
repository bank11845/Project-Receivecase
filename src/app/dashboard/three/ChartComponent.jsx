import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Legend,
  Tooltip,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Chart as ChartJS,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

const ChartComponent = ({ data, options }) => <Line data={data} options={options} />;

export default ChartComponent;
