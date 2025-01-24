'use client';

import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as XLSX from 'xlsx';
// eslint-disable-next-line import/no-extraneous-dependencies
import { saveAs } from 'file-saver';
import { Box, Card, Typography, Pagination, Button, CircularProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { apiService } from 'src/services/apiService';// นำเข้า apiService
import { useCases } from '../../../utils/useCases';
import CaseTable from '../components/CaseTable';

export default function ReceiveCaseHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { cases, chartData, loading, totalPages } = useCases(currentPage, selectedYear);
  const [loadingExcel, setLoading] = useState(false);
  const names = [
    "",        // index 0 (ไม่ใช้งาน)
    "Jockey",  // index 1
    "Oat",     // index 2
    "Poogun",  // index 3
    "Kai",     // index 4
    "Tent",    // index 5
    "Pooh",    // index 6
    "Nack",    // index 7
    "Boy",     // index 8
    "Kung",    // index 9
    "Pai",     // index 10
    "Jiw",     // index 11
    "Title",   // index 12
    "Aof",     // index 13
  ];
  const formatDateTime = (dateString) => {
    if (!dateString) return 'ไม่ระบุ';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'ข้อมูลผิดพลาด';
    const day = date.getDate().toString().padStart(2, '0'); // เติม 0 ข้างหน้า
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // เดือนเริ่มจาก 0
    const year = (date.getFullYear() + 543).toString().slice(-2); // เปลี่ยนเป็น พ.ศ. และเอาเฉพาะ 2 หลักท้าย
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
 const exportToExcel = async () => {
    try {
      setLoading(true);
      const firstResponse = await apiService.get('/receive-case', {
        params: { page: 1, limit: 10 },  // เรียกข้อมูลหน้าแรกก่อน
      });
      const pageCount = firstResponse.data.totalPages || 1;
      const pageRequests = [];
      for (let page = 1; page <= pageCount; page += 1) {
        pageRequests.push(
          apiService.get('/receive-case', { params: { page, limit: 10 } })
        );
      }
      const responses = await Promise.all(pageRequests);
      const allCases = responses.flatMap(response => response.data.cases || []);
      if (allCases.length === 0) {
        alert("ไม่มีข้อมูลให้ส่งออก");
        return;
      }
      const excelData = allCases.map((row) => ({
        'No.': row.receive_case_id,
        'สาขา': row.branch_name,
        'วันที่รับแจ้ง': formatDateTime(row.create_date),
        'วันที่ดำเนินการ': formatDateTime(row.start_date),
        'วันที่ดำเนินการสำเร็จ': formatDateTime(row.end_date),
        'สถานะ': row.status_name,
        'ความเร่งด่วน': row.level_urgent_name,
        'ปัญหา': row.problem,
        'พนักงานเข้าดำเนินการ': names[Number(row.saev_em)] || 'Unknown',
        'แนวทางแก้ไข': row.correct,
        'ประเภทปัญหา': row.main_case_name,
        'ทีมที่รับผิดชอบ': row.team_name,
        'พนักงานที่รับผิดชอบ': row.employee_name,
        'ระยะเวลาดำเนินการ': row.start_date && row.end_date 
          ? `${Math.floor((new Date(row.end_date) - new Date(row.start_date)) / (1000 * 60 * 60 * 24))} วัน`
          : 'ไม่ระบุ',
      }));
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Receive Case History');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles: true });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      saveAs(data, 'receive_case_history.xlsx');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert("เกิดข้อผิดพลาดในการส่งออกข้อมูล");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>Receive Case History</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <FormControl>
          <InputLabel>Year</InputLabel>
          <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            {[...Array(5)].map((_, i) => (
              <MenuItem key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      <Button variant="contained" color="primary" onClick={exportToExcel}>
          Export to Excel
        </Button>
      </Box>
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Receive Case History by Month</Typography>
        {loading ? <CircularProgress /> : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#4caf50" />
              <Bar dataKey="pending" fill="#ff9800" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
      <CaseTable cases={cases} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination count={totalPages} page={currentPage} onChange={(e, value) => setCurrentPage(value)} color="primary" />
      </Box>
    </Box>
  );
}
