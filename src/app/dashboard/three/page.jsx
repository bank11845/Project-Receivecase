'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Grid,
  Table,
  Alert,
  TableRow,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CircularProgress,
} from '@mui/material';

import axiosInstance from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import ChartComponent from './ChartComponent';

const baseURL = CONFIG.site.serverUrl;

const Dashboard = () => {
  const [totalCases, setTotalCases] = useState(0);
  const [lastMonthCases, setLastMonthCases] = useState(0);
  const [currentMonthCases, setCurrentMonthCases] = useState(0);
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

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartOptions, setChartOptions] = useState({
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true , grid: {
        display: false, // ซ่อนเส้นกริดแนวตั้ง
      },},
    },
    layout: {
      padding: 20, // เพิ่มพื้นที่รอบกราฟ
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (!startDate || !endDate) {
      setIsError(true);
      return;
    }

    const calculatedTrend = lastMonthCases && currentMonthCases
      ? ((lastMonthCases - currentMonthCases) / lastMonthCases) * 100
      : 0;

    const calculatedProgress = totalCases
      ? (currentMonthCases / totalCases) * 100
      : 0;

    setTrendPercent(Number(calculatedTrend.toFixed(1)));
    setProgressPercent(Number(calculatedProgress.toFixed(1)));

    const fetchData = async () => {
      try {
        const togetherUrl = `${baseURL}/receivecase/together?start_date=${startDate}&end_date=${endDate}`;
        const separateUrl = `${baseURL}/receivecase/separate?start_date=${startDate}&end_date=${endDate}`;
        const chartUrl = `${baseURL}/receivecase/charts?start_date=${startDate}&end_date=${endDate}`;

        const togetherResponse = await axiosInstance.get(togetherUrl);
        const separateResponse = await axiosInstance.get(separateUrl);

        const updatedData = [
          { category: 'โปรแกรม', count: Number(separateResponse?.data?.data?.total_program) || 0 },
          {
            category: 'ไฟฟ้า',
            count: Number(separateResponse?.data?.data?.total_electricity) || 0,
          },
          {
            category: 'เครื่องกล',
            count: Number(separateResponse?.data?.data?.total_mechanical) || 0,
          },
          { category: 'บุคคล', count: Number(separateResponse?.data?.data?.total_person) || 0 },
          {
            category: 'ปัจจัยภายนอก',
            count: Number(separateResponse?.data?.data?.total_other) || 0,
          },
          { category: 'PLC', count: Number(separateResponse?.data?.data?.total_plc) || 0 },
          { category: 'รวม', count: Number(togetherResponse?.data?.data?.total_sub_case_id) || 0 },
        ];

        setSubCaseData(updatedData);

        const chartResponse = await axiosInstance.get(chartUrl);

        const chartDataRaw = chartResponse?.data;

        const preparedChartData = {
          labels: Array.isArray(chartDataRaw?.data)
            ? chartDataRaw?.data?.map((item) => item?.month_name || '')
            : [],
          datasets: [
            {
              label: 'โปรแกรม',
              data: Array.isArray(chartDataRaw?.data)
                ? chartDataRaw?.data?.map((item) => item?.total_program || 0)
                : [],
              backgroundColor: '#FFD700',
            },
            {
              label: 'ไฟฟ้า',
              data: Array.isArray(chartDataRaw?.data)
                ? chartDataRaw?.data?.map((item) => item?.total_electricity || 0)
                : [],
              backgroundColor: '#90EE90',
            },
            {
              label: 'เครื่องกล',
              data: Array.isArray(chartDataRaw?.data)
                ? chartDataRaw?.data?.map((item) => item?.total_mechanical || 0)
                : [],
              backgroundColor: '#FF6347',
            },
            {
              label: 'บุคคล',
              data: Array.isArray(chartDataRaw?.data)
                ? chartDataRaw?.data?.map((item) => item?.total_person || 0)
                : [],
              backgroundColor: '#000080',
            },
            {
              label: 'ปัจจัยภายนอก',
              data: Array.isArray(chartDataRaw?.data)
                ? chartDataRaw?.data?.map((item) => item?.total_other || 0)
                : [],
              backgroundColor: '#00BFFF',
            },
            {
              label: 'PLC',
              data: Array.isArray(chartDataRaw?.data)
                ? chartDataRaw?.data?.map((item) => item?.total_PLC || 0)
                : [],
              backgroundColor: '#8B4513',
            },
          ],
        };

        setChartData(preparedChartData);

        const trendResponse = await axiosInstance(
          `${baseURL}/receivecase/trend?start_date=${startDate}&end_date=${endDate}`
        );
        
        const trendData = trendResponse?.data;

        if (Array.isArray(trendData?.data)) {
          const percentageChangeData = trendData?.data?.find(
            (item) => item?.period === 'February' // ตรวจหาข้อมูลที่ตรงกับเดือนที่ต้องการ
          );

          if (percentageChangeData) {
            setTrendPercent(percentageChangeData?.percentage_change || 0);
          } else {
            setTrendPercent(0); // ถ้าไม่มีข้อมูล
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsError(true);
        setErrorMessage('ไม่สามารถดึงข้อมูลได้จากเซิร์ฟเวอร์');
        setIsLoading(false); // ปิดการโหลดเมื่อเกิดข้อผิดพลาด
      }
    };

    fetchData();
  }, [startDate, endDate, lastMonthCases, currentMonthCases, totalCases]);

  return (
    <Box sx={{ padding: 3 }}>
     <Typography
  variant="h5"
  gutterBottom
  align="center"
  sx={{
    border: '1px solid #66BB6A', // กรอบบางๆ สีเขียว
    borderRadius: '8px', // มุมโค้ง
    padding: '8px 16px', // ระยะห่างภายใน
    backgroundColor: '#66BB6A', // พื้นหลังสีขาว
    color: 'white', // ตัวอักษรสีเขียว
    fontWeight: 'bold', // ทำให้ตัวอักษรหนา
  }}
>
  Analytics
</Typography>

      {isError && <Alert severity="error">{errorMessage}</Alert>}

      <Grid container spacing={3}>
        {/* Case Category Table */}
        <Grid item xs={12} md={4}>
          <Typography
             variant="h5"
             gutterBottom
             align="center"
             sx={{
               border: '1px solid #66BB6A', // กรอบบางๆ สีเขียว
               borderRadius: '8px', // มุมโค้ง
               padding: '8px 16px', // ระยะห่างภายใน
               backgroundColor: '#66BB6A', // พื้นหลังสีขาว
               color: 'white', // ตัวอักษรสีเขียว
               fontWeight: 'bold', // ทำให้ตัวอักษรหนา
             }}
          >
            Case Category
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ประเภท</TableCell>
                <TableCell>จำนวน</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subCaseData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.count || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>

        {/* Chart Section */}
        <Grid item xs={12} md={8}>
          <Box sx={{ border: '1px solid gray', padding: 2, height: '100%' }}>
          <Typography sx={{ marginTop: 2 ,textAlign: 'left'}}>จำนวนครั้ง</Typography>
            <Grid container spacing={2} alignItems="center" justifyContent="flex-end"> 
              <Grid item xs={12} sm={3}>
                <TextField
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            </Grid>
            {isLoading ? (
              <CircularProgress />
            ) : chartData.labels && chartData.labels.length > 0 && chartData.datasets.length > 0 ? (
              <ChartComponent data={chartData} options={chartOptions} />
            ) : (
              <Typography align="center">No chart data available</Typography>
            )}
          </Box>
        </Grid>

        {/* Trend Section */}
        <Grid item xs={12}>
          <Typography
            variant="h6"
            align="center"
            sx={{
              borderRadius: '8px',
              bgcolor: trendPercent !== undefined && trendPercent < 0 ? '#006633	' : '#FF0000',
              color: '#FFFFFF',
              padding: 1,
            }}
          >
            {isLoading
              ? 'กำลังโหลดข้อมูล...'
              : trendPercent !== undefined
                ? trendPercent < 0
                  ? 'แนวโน้มลดลง'
                  : 'แนวโน้มเพิ่มขึ้น'
                : 'ไม่มีข้อมูล'}
          </Typography>

          <Typography
            variant="h4"
            align="center"
            color={trendPercent !== undefined && trendPercent < 0 ? '#006633	' : '#FF0000'}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : trendPercent !== undefined ? (
              `${Math.abs(trendPercent).toFixed(1)}%`
            ) : (
              'N/A'
            )}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
 