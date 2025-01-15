'use client';

import React, { useState } from 'react';

import {
  Box,
  Grid,
  Table,
  Select,
  Button,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';

import ChartComponent from './ChartComponent'; // Import ChartComponent

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'จำนวน Case',
      data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
      borderColor: '#3CB371',
      backgroundColor: 'rgba(60, 179, 113, 0.2)',
      fill: true,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
  },
};

const Dashboard = () => {
  const [totalCases, setTotalCases] = useState(95);
  const [lastMonthCases, setLastMonthCases] = useState(80);
  const [currentMonthCases, setCurrentMonthCases] = useState(70);
  const [trendPercent, setTrendPercent] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const [subCaseData, setSubCaseData] = useState([
    { category: 'โปรแกรม', count: 0 },
    { category: 'ไฟฟ้า', count: 0 },
    { category: 'เครื่องกล', count: 0 },
    { category: 'บุคคล', count: 0 },
    { category: 'ปัจจัยภายนอก', count: 0 },
    { category: 'PLC', count: 0 },
    { category: 'รวม', count: 0 },
  ]);

  // useEffect(() => {
  //   const calculatedTrend = ((lastMonthCases - currentMonthCases) / lastMonthCases) * 100;
  //   const calculatedProgress = (currentMonthCases / totalCases) * 100;

  //   setTrendPercent(calculatedTrend.toFixed(1));
  //   setProgressPercent(calculatedProgress.toFixed(1));

  //   const fetchData = async () => {
  //     try {
  //       // ตรวจสอบ URL ให้ตรงกับ API ที่กำหนดไว้
  //       const togetherResponse = await axios.get('http://localhost:3000/together'); // URL ของ API
  //       const separateResponse = await axios.get('http://localhost:3000/separate'); // URL ของ API
  //       console.log('Together Data:', togetherResponse.data);
  //       console.log('Separate Data:', separateResponse.data);

  //       // ใช้ข้อมูลจาก API มาอัปเดต state
  //       const updatedData = [
  //         { category: 'โปรแกรม', count: togetherResponse.data.total_program },
  //         { category: 'ไฟฟ้า', count: togetherResponse.data.total_electricity },
  //         { category: 'เครื่องกล', count: separateResponse.data.total_mechanical },
  //         { category: 'บุคคล', count: togetherResponse.data.total_person },
  //         { category: 'ปัจจัยภายนอก', count: separateResponse.data.total_other },
  //         { category: 'PLC', count: togetherResponse.data.total_PLC },
  //         { category: 'รวม', count: togetherResponse.data.total_sub_case_id },
  //       ];

  //       setSubCaseData(updatedData);
  //     } catch (error) {
  //       console.error('Error fetching subcase data:', error);
  //     }
  //   };

  //   fetchData();
  // }, [lastMonthCases, currentMonthCases, totalCases]);

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header Section */}
      <Box sx={{ marginBottom: 4 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
          <Grid item xs={12} sm={3}>
            <TextField type="date" placeholder="Start Date" fullWidth variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField type="date" placeholder="End Date" fullWidth variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Select fullWidth defaultValue="all" variant="outlined">
              <MenuItem value="all">ทั้งหมด</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField placeholder="Search Case" fullWidth variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Button variant="contained" fullWidth sx={{ bgcolor: '#6699FF' }}>
              ค้นหา
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Analytics Section */}
      <Box sx={{ padding: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          sx={{ bgcolor: '#66FF00', color: '#FFFFFF' }}
        >
          Analytics
        </Typography>

        <Box sx={{ marginBottom: 4, padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
          <Grid container spacing={2}>
            {/* Case Category Section */}
            <Grid item xs={12} md={4}>
              <Typography
                variant="h5"
                gutterBottom
                align="center"
                sx={{ bgcolor: '#66FF00', color: '#FFFFFF' }}
              >
                Case Category
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ประเภท</TableCell>
                    <TableCell />
                    <TableCell>เดือน</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subCaseData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.count || ''}</TableCell>
                      <TableCell>ครั้ง</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>

            {/* Chart Section */}
            <Grid item xs={12} md={8}>
              <Box
                sx={{ border: '1px solid gray', padding: 2, textAlign: 'center', height: 'auto' }}
              >
                <ChartComponent data={chartData} options={chartOptions} />
              </Box>
            </Grid>

            {/* Trend Section */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="h5"
                  gutterBottom
                  align="center"
                  sx={{ bgcolor: '#66FF00', color: '#FFFFFF' }}
                >
                  แนวโน้มลดลง
                </Typography>
                <Typography variant="h6" gutterBottom align="center">
                  Total
                </Typography>
                <Typography variant="h4" gutterBottom align="center" color="#66FF00">
                  {trendPercent}%
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8} sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: 2 }}>
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 120,
                      height: 120,
                    }}
                  >
                    <CircularProgress
                      variant="determinate"
                      value={progressPercent}
                      size={100}
                      thickness={4}
                      sx={{ color: '#3CB371' }}
                    />
                    <Typography
                      variant="h6"
                      component="div"
                      color="textPrimary"
                      sx={{
                        position: 'absolute',
                        fontWeight: 'bold',
                      }}
                    >
                      {progressPercent}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
