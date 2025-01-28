import React from 'react';
import { Bar } from 'react-chartjs-2'; // เปลี่ยนจาก Line เป็น Bar
import {
  Legend,
  Tooltip,
  BarElement, // เพิ่ม BarElement สำหรับกราฟแท่ง
  LinearScale,
  CategoryScale,
  Chart as ChartJS,
} from 'chart.js';

// Register Chart.js components สำหรับ Bar Chart
ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const ChartComponent = ({ data, options }) => <Bar data={data} options={options} />; // ใช้ Bar แทน Line

export default ChartComponent;
