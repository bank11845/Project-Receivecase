/* eslint-disable import/no-extraneous-dependencies */
// components/CaseChart.jsx
import React from 'react';
import { Bar, XAxis, YAxis, Tooltip, BarChart, ResponsiveContainer } from 'recharts';

import { Box, Typography, CircularProgress } from '@mui/material';

export default function CaseChart({ chartData, loading }) {
  return (
    <Box sx={{ p: 3, mb: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h6">Receive Case History by Month</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} barSize={50}>
            <XAxis dataKey="month" tick={{ fontSize: 14 }} />
            <YAxis tick={{ fontSize: 14 }} />
            <Tooltip />
            <Bar dataKey="completed" fill="#4caf50" name="ดำเนินการเสร็จสิ้น" />
            <Bar dataKey="pending" fill="#ff9800" name="รอดำเนินการ" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
}
