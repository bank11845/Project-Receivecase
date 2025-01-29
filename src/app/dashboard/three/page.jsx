
"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";

import {
  Box,
  Grid,
  Table,
  TableRow,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CircularProgress,
} from "@mui/material";

import { CONFIG } from "src/config-global";

import ChartComponent from "./ChartComponent"; // Import ChartComponent

const Dashboard = () => {
  const [totalCases, setTotalCases] = useState(95); // Set the total number of cases
  const [lastMonthCases, setLastMonthCases] = useState(80); // Last month's total cases
  const [currentMonthCases, setCurrentMonthCases] = useState(70); // Current month's total cases
  const [trendPercent, setTrendPercent] = useState(0); // Trend percentage
  const [progressPercent, setProgressPercent] = useState(0); // Progress percentage

  const [subCaseData, setSubCaseData] = useState([ 
    { category: "โปรแกรม", count: 0 },
    { category: "ไฟฟ้า", count: 0 },
    { category: "เครื่องกล", count: 0 },
    { category: "บุคคล", count: 0 },
    { category: "ปัจจัยภายนอก", count: 0 },
    { category: "PLC", count: 0 },
    { category: "รวม", count: 0 },
  ]);

  const [chartData, setChartData] = useState([]); // For chart data
  const [chartOptions, setChartOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const baseURL = CONFIG.site.serverUrl;

  // Default start date as January 1, 2024, and end date as current date
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]); // current date

  useEffect(() => {
    if (startDate && endDate) {
      // Calculate the trend and progress percentages
      const calculatedTrend =
        ((lastMonthCases - currentMonthCases) / lastMonthCases) * 100;
      const calculatedProgress = (currentMonthCases / totalCases) * 100;

      console.log(calculatedTrend)

      setTrendPercent(Number(calculatedTrend.toFixed(1))); // Ensure it's a number
      setProgressPercent(Number(calculatedProgress.toFixed(1))); // Ensure it's a number

      const fetchData = async () => {
        try {
          // Fetch the data from the API for the selected date range
            const togetherResponse = await axios.get(
              `${baseURL}/together?startDate=${startDate}&endDate=${endDate}`
            );
            console.log(togetherResponse, ' dsadsadsadsa')
            const separateResponse = await axios.get(
              `${baseURL}/separate?startDate=${startDate}&endDate=${endDate}`
            );

            // Update the case category data
            const updatedData = [
              {
                category: "โปรแกรม",
                count: Number(separateResponse.data.body.total_program) || 0,
              },
              {
                category: "ไฟฟ้า",
                count: Number(separateResponse.data.body.total_electricity) || 0,
              },
              {
                category: "เครื่องกล",
                count: Number(separateResponse.data.body.total_mechanical) || 0,
              },
              {
                category: "บุคคล",
                count: Number(separateResponse.data.body.total_person) || 0,
              },
              {
                category: "ปัจจัยภายนอก",
                count: Number(separateResponse.data.body.total_other) || 0,
              },
              {
                category: "PLC",
                count: Number(separateResponse.data.body.total_plc) || 0,
              },
              {
                category: "รวม",
                count: Number(togetherResponse.data.body.total_sub_case_id) || 0,
              },
            ];

            setSubCaseData(updatedData);

          // Fetch chart data for the selected date range
          const chartResponse = await fetch(
            `${baseURL}/charts?startDate=${startDate}&endDate=${endDate}`
          );
          const chartDataRaw = await chartResponse.json();

          console.log("Chart Data:", chartDataRaw); // Debugging: check the fetched chart data

          const preparedChartData = {
            labels: chartDataRaw.body.map((item) => item.month_name),
            datasets: [
              {
                label: "โปรแกรม",
                data: chartDataRaw.body.map((item) => item.total_program || 0),
                backgroundColor: "#FFD700",
              },
              {
                label: "ไฟฟ้า",
                data: chartDataRaw.body.map(
                  (item) => item.total_electricity || 0
                ),
                backgroundColor: "#90EE90",
              },
              {
                label: "เครื่องกล",
                data: chartDataRaw.body.map(
                  (item) => item.total_mechanical || 0
                ),
                backgroundColor: "#FF6347",
              },
              {
                label: "บุคคล",
                data: chartDataRaw.body.map((item) => item.total_person || 0),
                backgroundColor: "#000080",
              },
              {
                label: "ปัจจัยภายนอก",
                data: chartDataRaw.body.map((item) => item.total_other || 0),
                backgroundColor: "#00BFFF",
              },
              {
                label: "PLC",
                data: chartDataRaw.body.map((item) => item.total_PLC || 0),
                backgroundColor: "#8B4513",
              },
            ],
          };
          setChartData(preparedChartData);

          // Fetch trend percentage data from the new API endpoint
          const trendResponse = await fetch(
            `${baseURL}/percentage-change?startDate=${startDate}&endDate=${endDate}`
          );
          const trendData = await trendResponse.json();

          console.log("Trend Data Raw:", trendData); // Debugging: log the trend data

          // ตรวจสอบว่า trendData.body เป็น array ก่อนเรียกใช้ find
          if (Array.isArray(trendData.body)) {
            const percentageChangeData = trendData.body.find(
              (item) => item.month_name === "January"
            );
            if (percentageChangeData) {
              console.log("Found Percentage Change:", percentageChangeData.percentage_change);
              setTrendPercent(percentageChangeData.percentage_change || 0);
            } else {
              console.error("No data found for January.");
              setTrendPercent(0); // ถ้าไม่มีข้อมูลในเดือน December ให้ตั้งค่าเป็น 0
            }
          } else {
            console.error("Trend Data is not an array:", trendData);
            setTrendPercent(0); // ถ้า trendData.body ไม่ใช่ array ให้ตั้งค่าเป็น 0
          }

          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsLoading(false); // Ensure loading state is set to false in case of error
        }
      };
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <Box
            sx={{ border: "1px solid gray", padding: 2, height: "100%" }}
          >
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="flex-end"
            >
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
            ) : (
              <ChartComponent data={chartData} options={chartOptions} />
            )}
          </Box>
        </Grid>

        {/* Trend Section */}
        <Grid item xs={12} md={12}>
          <Typography
            variant="h6"
            align="center"
            sx={{
              bgcolor: trendPercent < 0 ? "#66FF00" : "#FF0000", // สีพื้นหลังเปลี่ยนตามค่า
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
              `${trendPercent.toFixed(1)}%` // Now trendPercent will always be a number
            )}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
