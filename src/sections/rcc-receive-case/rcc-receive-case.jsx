'use client';

// ✅ บอกให้ไฟล์นี้เป็น Client Component

import axios from 'axios';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Table,
  Button,
  Select,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  Pagination,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  dashboard: icon('ic-dashboard'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
};

export default function Page() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `http://localhost:3001/receive-case?page=${currentPage}&search=${search}`
      );
      setCases(response.data.cases);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองอีกครั้ง');
      console.error('Error fetching cases:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCases();
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box height="100vh" bgcolor="#f5f5f5">
      <Box flex={1} p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            Report
          </Typography>

          <Button variant="contained" color="primary" component={Link} href="/dashboard/case">
            เพิ่มข้อมูลเคส
          </Button>
        </Box>

        <Box display="flex" gap={2} mb={3}>
          <TextField type="date" label="Start Date" InputLabelProps={{ shrink: true }} fullWidth />
          <TextField type="date" label="End Date" InputLabelProps={{ shrink: true }} fullWidth />
          <Select defaultValue="ทั้งหมด" fullWidth>
            <MenuItem value="ทั้งหมด">ทั้งหมด</MenuItem>
            <MenuItem value="ตัวเลือก1">ตัวเลือก1</MenuItem>
            <MenuItem value="ตัวเลือก2">ตัวเลือก2</MenuItem>
          </Select>
          <TextField
            placeholder="Search Case"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            ค้นหา
          </Button>
        </Box>

        {error && (
          <Box color="red" textAlign="center" mb={2}>
            {error}
          </Box>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>สาขา</TableCell>
                <TableCell>วันที่เริ่มแจ้ง</TableCell>
                <TableCell>ปัญหา</TableCell>
                <TableCell>วิธีแก้ไข</TableCell>
                <TableCell>เวลาที่ดำเนินการ</TableCell>
                <TableCell>ความเร่งด่วน</TableCell>
                <TableCell>รูปภาพ</TableCell>
                <TableCell>สถานะ</TableCell>
                <TableCell>แก้ไขข้อมูล</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cases.map((caseItem, index) => (
                <TableRow key={caseItem.receive_case_id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{caseItem.branch_name}</TableCell>
                  <TableCell>{caseItem.start_date}</TableCell>
                  <TableCell>{caseItem.problem}</TableCell>
                  <TableCell>{caseItem.solution || 'ไม่ระบุ'}</TableCell>
                  <TableCell>{caseItem.duration}</TableCell>
                  <TableCell style={{ color: caseItem.priority === 'high' ? 'red' : 'green' }}>
                    {caseItem.priority === 'high' ? 'ด่วนมาก' : 'ไม่เร่งด่วน'}
                  </TableCell>
                  <TableCell>
                    <img
                      src={caseItem.image_url || '/assets/icons/navbar/ic-dashboard.svg'}
                      alt="Example"
                      style={{ width: '50px' }}
                    />
                  </TableCell>
                  <TableCell>{caseItem.status}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" size="small">
                      แก้ไข
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>
    </Box>
  );
}
