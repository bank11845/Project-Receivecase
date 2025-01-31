'use client';

import axios from "axios";
import React, { useState, useEffect } from "react";

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
} from "@mui/material";

import axiosInstance from "src/utils/axios";

import { CONFIG } from 'src/config-global';

import ChartComponent from "./ChartComponent";

const baseURL = CONFIG.site.serverUrl;

const Dashboard = () => {
  const [totalCases, setTotalCases] = useState(95);
  const [lastMonthCases, setLastMonthCases] = useState(80);
  const [currentMonthCases, setCurrentMonthCases] = useState(70);
  const [trendPercent, setTrendPercent] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const [subCaseData, setSubCaseData] = useState([
    { category: "โปรแกรม", count: 0 },
    { category: "ไฟฟ้า", count: 0 },
    { category: "เครื่องกล", count: 0 },
    { category: "บุคคล", count: 0 },
    { category: "ปัจจัยภายนอก", count: 0 },
    { category: "PLC", count: 0 },
    { category: "รวม", count: 0 },
  ]);

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartOptions, setChartOptions] = useState({
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (!startDate || !endDate) {
      setIsError(true);
      setErrorMessage("กรุณากรอกวันเริ่มต้นและวันสิ้นสุด");
      return;
    }

    const calculatedTrend =
      ((lastMonthCases - currentMonthCases) / lastMonthCases) * 100;
    const calculatedProgress = (currentMonthCases / totalCases) * 100;

    setTrendPercent(Number(calculatedTrend.toFixed(1)));
    setProgressPercent(Number(calculatedProgress.toFixed(1)));

    const fetchData = async () => {
      try {
        // ลอง log URL เพื่อดูว่า request ที่ส่งไปนั้นถูกต้องหรือไม่
        const togetherUrl = `${baseURL}/together?startDate=${startDate}&endDate=${endDate}`;
        const separateUrl = `${baseURL}/separate?startDate=${startDate}&endDate=${endDate}`;
        const chartUrl = `${baseURL}/charts?startDate=${startDate}&endDate=${endDate}`;

        console.log("Request URL for together:", togetherUrl);
        console.log("Request URL for separate:", separateUrl);
        console.log("Request URL for charts:", chartUrl);

        const togetherResponse = await axiosInstance.get(togetherUrl);
        const separateResponse = await axiosInstance.get(separateUrl);
        
        console.log(togetherUrl.data)
        console.log(separateResponse.data)

        const updatedData = [
          { category: "โปรแกรม", count: Number(separateResponse?.data?.body?.total_program) || 0 },
          { category: "ไฟฟ้า", count: Number(separateResponse?.data?.body?.total_electricity) || 0 },
          { category: "เครื่องกล", count: Number(separateResponse?.data?.body?.total_mechanical) || 0 },
          { category: "บุคคล", count: Number(separateResponse?.data?.body?.total_person) || 0 },
          { category: "ปัจจัยภายนอก", count: Number(separateResponse?.data?.body?.total_other) || 0 },
          { category: "PLC", count: Number(separateResponse?.data?.body?.total_plc) || 0 },
          { category: "รวม", count: Number(togetherResponse?.data?.body?.total_sub_case_id) || 0 },
        ];

        setSubCaseData(updatedData);

        const chartResponse = await axiosInstance.get(chartUrl);
        console.log(chartResponse);
        const chartDataRaw =await chartResponse?.data

        const preparedChartData = {
          labels: Array.isArray(chartDataRaw?.body)
            ? chartDataRaw?.body?.map((item) => item?.month_name)
            : [],
          datasets: [
            {
              label: "โปรแกรม",
              data: Array.isArray(chartDataRaw?.body)
                ? chartDataRaw?.body?.map((item) => item?.total_program || 0)
                : [],
              backgroundColor: "#FFD700",
            },
            {
              label: "ไฟฟ้า",
              data: Array.isArray(chartDataRaw?.body)
                ? chartDataRaw?.body?.map((item) => item?.total_electricity || 0)
                : [],
              backgroundColor: "#90EE90",
            },
            {
              label: "เครื่องกล",
              data: Array.isArray(chartDataRaw?.body)
                ? chartDataRaw?.body?.map((item) => item?.total_mechanical || 0)
                : [],
              backgroundColor: "#FF6347",
            },
            {
              label: "บุคคล",
              data: Array.isArray(chartDataRaw?.body)
                ? chartDataRaw?.body?.map((item) => item?.total_person || 0)
                : [],
              backgroundColor: "#000080",
            },
            {
              label: "ปัจจัยภายนอก",
              data: Array.isArray(chartDataRaw?.body)
                ? chartDataRaw?.body?.map((item) => item?.total_other || 0)
                : [],
              backgroundColor: "#00BFFF",
            },
            {
              label: "PLC",
              data: Array.isArray(chartDataRaw?.body)
                ? chartDataRaw?.body?.map((item) => item?.total_PLC || 0)
                : [],
              backgroundColor: "#8B4513",
            },
          ],
        };

        setChartData(preparedChartData);

        const trendResponse = await axiosInstance(
          `${baseURL}/percentage-change?startDate=${startDate}&endDate=${endDate}`
        );
        const trendData = await trendResponse?.data;

        if (Array.isArray(trendData?.body)) {
          const percentageChangeData = trendData?.body?.find(
            (item) => item?.month_name === "January"
          );
          if (percentageChangeData) {
            setTrendPercent(percentageChangeData?.percentage_change || 0);
          } else {
            setTrendPercent(0);
          }
        } else {
          setTrendPercent(0);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsError(true);
        setErrorMessage("ไม่สามารถดึงข้อมูลได้จากเซิร์ฟเวอร์");
        setIsLoading(false);
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
        sx={{ bgcolor: "#66BB6A", color: "#FFFFFF", padding: 1 }}
      >
        Analytics
      </Typography>

      {isError && <Alert severity="error">{errorMessage}</Alert>}

      <Grid container spacing={3}>
        {/* Case Category Table */}
        <Grid item xs={12} md={4}>
          <Typography
            variant="h6"
            align="center"
            sx={{ bgcolor: "#66BB6A", color: "#FFFFFF", padding: 1 }}
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
          <Box sx={{ border: "1px solid gray", padding: 2, height: "100%" }}>
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
              bgcolor: trendPercent < 0 ? "#66FF00" : "#FF0000",
              color: "#FFFFFF",
              padding: 1,
            }}
          >
            {isLoading ? "กำลังโหลดข้อมูล..." : trendPercent < 0 ? "แนวโน้มลดลง" : "แนวโน้มเพิ่มขึ้น"}
          </Typography>
          <Typography
            variant="h4"
            align="center"
            color={trendPercent < 0 ? "#66FF00" : "#FF0000"}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              `${trendPercent.toFixed(1)}%`
            )}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
