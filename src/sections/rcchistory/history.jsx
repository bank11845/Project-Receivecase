'use client';

import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Title,
  Legend,
  Tooltip,
  LinearScale,
  LineElement,
  PointElement,
  CategoryScale,
  Chart as ChartJS,
} from 'chart.js';

import {
  Box,
  Table,
  Select,
  MenuItem,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TextField,
  Typography,
} from '@mui/material';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ReceiveCaseHistoryPage() {
  const [view, setView] = useState('เดือน');
  const [status, setStatus] = useState('สำเร็จ');
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewChange = (event) => setView(event.target.value);
  const handleStatusChange = (event) => setStatus(event.target.value);

  // Mock data for the chart
  const labels = [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ];
  const chartData = {
    labels,
    datasets: [
      {
        label: 'จำนวนเคสที่เสร็จสิ้น',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // ตัวอย่างข้อมูล
        borderColor: '#4caf50',
        backgroundColor: '#4caf50',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 12 } } },
      y: { ticks: { beginAtZero: true, stepSize: 1, font: { size: 12 } } },
    },
  };

  // Mock data for the table
  const tableData = [];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Receive Case History
      </Typography>
      <Typography variant="subtitle2" sx={{ mb: 3 }}>
        SSA / Receive Case
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h6">History Chart</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Select value={view} onChange={handleViewChange}>
            <MenuItem value="เดือน">เดือน</MenuItem>
            <MenuItem value="ปี">ปี</MenuItem>
          </Select>
          <Select value={status} onChange={handleStatusChange}>
            <MenuItem value="สำเร็จ">สำเร็จ</MenuItem>
            <MenuItem value="ดำเนินการอยู่">ดำเนินการอยู่</MenuItem>
            <MenuItem value="รอดำเนินการ">รอดำเนินการ</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Chart */}
      <Box sx={{ mb: 4 }}>
        <Line data={chartData} options={chartOptions} />
      </Box>

      {/* Summary Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6">ทั้งหมด</Typography>
          <Typography variant="h4" sx={{ color: '#000' }}>
            0
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#4caf50' }}>
            ดำเนินการเสร็จสิ้น
          </Typography>
          <Typography variant="h4" sx={{ color: '#4caf50' }}>
            0
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#ff9800' }}>
            กำลังดำเนินการ
          </Typography>
          <Typography variant="h4" sx={{ color: '#ff9800' }}>
            0
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#f44336' }}>
            รอดำเนินการ
          </Typography>
          <Typography variant="h4" sx={{ color: '#f44336' }}>
            0
          </Typography>
        </Box>
      </Box>

      {/* Table */}
      <Box>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>สาขา</TableCell>
              <TableCell>วันที่รับแจ้ง</TableCell>
              <TableCell>วันที่เข้าดำเนินการ</TableCell>
              <TableCell>วันที่ดำเนินการสำเร็จ</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell>ความเร่งด่วน</TableCell>
              <TableCell>รูปภาพ</TableCell>
              <TableCell>ระยะเวลา</TableCell>
              <TableCell>รายละเอียด</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.length > 0 ? (
              tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.dateReported}</TableCell>
                  <TableCell>{row.dateStarted}</TableCell>
                  <TableCell>{row.dateCompleted}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.urgency}</TableCell>
                  <TableCell>{row.image}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                  <TableCell>{row.details}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  ไม่มีข้อมูล
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
