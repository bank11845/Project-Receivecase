import axios from 'axios';
import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Box, Button, MenuItem, TextField, Typography, InputAdornment } from '@mui/material';

import { CONFIG } from 'src/config-global';

import mockupData from './mockupData.json';
import AddCaseModal from './add-case-modal';
import TakeacitonModal from './takeaction-modal';

const CaseDataGrid = ({
  Case,
  CaseLoading,
  CaseError,
  mainCase,
  subCaseData,
  branchs,
  levelUrgencies,
  teams,
  employees,
  statusers,
}) => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openTakeAction, setOpenTakeAction] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const mainCases = mainCase;
  const subcasedata = subCaseData;
  const levelurgent = levelUrgencies;
  const employee = employees;
  const team = teams;
  const files = [];

  const handleOpenModal = (row) => {
    setSelectedRow(row); // เก็บข้อมูลของแถว
    setOpenTakeAction(true); // เปิด Modal
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFormData((prev) => {
      const currentFiles = prev.files || [];
      const totalFiles = currentFiles.length + uploadedFiles.length;
      if (totalFiles > 3) {
        alert(`${'You can upload a maximum of 3 files.'}`);
        return prev;
      }
      return {
        ...prev,
        files: [...currentFiles, ...uploadedFiles],
      };
    });
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const baseURL = CONFIG.site.serverUrl;

  const handlePostData = async () => {
    try {
      // เพิ่ม status_id ลงไปใน formData
      const response = await axios.post(`${baseURL}/receive-case`, {
        ...formData, // ข้อมูลเดิมที่คุณส่งไป
        status_id: '1', // ค่าของ status_id ที่ API ต้องการ
      });
      console.log('Response:', response.data);
      alert('บันทึกข้อมูลสำเร็จ!');
    } catch (error) {
      console.error('Error posting data:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    mainCaseId: '',
    search: '',
  });

  const columns = [
    { field: 'id', headerName: 'No.', width: 70 },
    { field: 'branch_name', headerName: 'สาขา', width: 150 },
    { field: 'create_date', headerName: 'วันที่แจ้ง', width: 150 },
    { field: 'end_date', headerName: 'วันที่ดำเนินการเสร็จสิ้น', width: 150 },
    { field: 'problem', headerName: 'ปัญหา', width: 200 },
    { field: 'details', headerName: 'รายละเอียด', width: 200 },
    { field: 'level_urgent_name', headerName: 'ความเร่งด่วน', width: 150 },
    { field: 'main_case_name', headerName: 'สาเหตุหลัก', width: 200 },
    { field: 'team_name', headerName: 'ทีม', width: 200 },
    { field: 'employee_name', headerName: 'ผู้เเจ้งCase', width: 200 },
    { field: 'correct', headerName: 'การดำเนินการ', width: 200 },
    { field: 'status_name', headerName: 'ผู้เเจ้งCase', width: 200 },
    { field: 'saev_em', headerName: 'ผู้เข้าดำเนินการ', width: 200 },
    {
      field: 'actions',
      headerName: 'จัดการข้อมูล',
      width: 200,

      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="contained" color="primary" size="small" onClick={() => {
            handleOpenModal(params.row);
            console.log(params.row);
            }}>
            เข้าดำเนินการ
          </Button>
          <Button variant="contained" color="secondary" size="small" onClick={() => params.row}>
            เเก้ไขข้อมูล
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    // เมื่อโหลดข้อมูลเสร็จสิ้นและมีข้อมูล Receivecase
    const formattedData = Case?.map((item, index) => ({
      id: index + 1,
      ...item,
    }));
    setRows(formattedData);
    setFilteredRows(formattedData); // Initial display
  }, [Case]);

  // Handle filter changes
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply filters
  useEffect(() => {
    const { startDate, endDate, mainCaseId, search } = filters;

    const filtered = rows?.filter((row) => {
      // Filter by date range
      if (startDate && new Date(row.create_date) < new Date(startDate)) return false;
      if (endDate && new Date(row.create_date) > new Date(endDate)) return false;

      // Filter by mainCaseId
      if (mainCaseId && row.main_case_id !== mainCaseId) return false;

      // Filter by search (problem or details)
      if (search && !row.problem.toLowerCase().includes(search.toLowerCase())) return false;

      return true;
    });

    setFilteredRows(filtered);
  }, [filters, rows]);

  return (
    <Box height="100vh" p={3}>
      <Typography variant="h5" mb={3}>
        Report
      </Typography>
      {/* Filter Controls */}
      <Grid2 container spacing={2} mb={3}>
        <Grid2 xs={12} md={3}>
          <TextField
            type="date"
            label="Start Date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid2>
        <Grid2 xs={12} md={3}>
          <TextField
            type="date"
            label="End Date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid2>
        <Grid2 xs={12} md={3}>
          <TextField
            select
            label="Main Case"
            name="mainCaseId"
            value={filters.mainCaseId}
            onChange={handleFilterChange}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            {mockupData
              .filter(
                (item, index, self) =>
                  index === self.findIndex((i) => i.main_case_id === item.main_case_id)
              )
              .map((uniqueItem) => (
                <MenuItem key={uniqueItem?.main_case_id} value={uniqueItem?.main_case_id}>
                  {uniqueItem?.main_case_name}
                </MenuItem>
              ))}
          </TextField>
        </Grid2>
        <Grid2
          container
          xs={12}
          md={3}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
        >
          <Grid2 item>
            <TextField
              placeholder="Search Case"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon="uil:search" width="24" height="24" />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </Grid2>
          <Grid2 item>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={() => setOpenModal(true)}
            >
              Add Case
            </Button>
          </Grid2>
        </Grid2>
      </Grid2>
      {/* DataGrid */}
      <Box height="500px">
        <DataGrid
          rows={filteredRows || []}
          columns={columns || []}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Box>
      {/* AddCaseModal */}
      <AddCaseModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        mainCases={mainCases}
        subcasedata={subcasedata}
        levelurgent={levelurgent}
        employee={employee}
        team={team}
        branchs={branchs}
        files={formData.files || []} // ส่งไฟล์จาก formData
        handleInputChange={handleInputChange}
        setFormData={setFormData}
        formData={formData}
        handleFileChange={handleFileChange}
        handleRemoveFile={handleRemoveFile}
        handlePostData={handlePostData}
      
      />

      <TakeacitonModal
      open={openTakeAction}
      handleClose={() => setOpenTakeAction(false)}
      formData={selectedRow}
      status={statusers}
      employee={employee}
      />


    </Box>
  );
};

export default CaseDataGrid;
