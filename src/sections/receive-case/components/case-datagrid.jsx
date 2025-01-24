/* eslint-disable import/no-extraneous-dependencies */
import * as XLSX from 'xlsx';
// eslint-disable-next-line import/no-extraneous-dependencies
import { saveAs } from 'file-saver';
import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Grid, Button, MenuItem, TextField, Typography, InputAdornment, Chip } from '@mui/material';

import axiosInstance from 'src/utils/axios';
import { formatDateTime } from 'src/utils/dateUtils';
// eslint-disable-next-line perfectionist/sort-imports

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
  status,
  handleRefresh,
}) => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openTakeAction, setOpenTakeAction] = useState(false);
  // const [formData, setFormData] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const mainCases = mainCase;
  const subcasedata = subCaseData;
  const levelurgent = levelUrgencies;
  const employee = employees;

  const team = teams;
  const files = [];

  console.log(status);

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

  // AddCase ---------------------------------------------------------------------------------------------------------------------------------------------------
  const [formData, setFormData] = useState({
    receive_case_id: '',

    create_date: new Date().toISOString(),
    branch_id: null,
    sub_case_id: [],
    urgent_level_id: null,
    employee_id: null,
    team_id: null,
    main_case_id: null,
    problem: '',
    details: '',
    status_id: 1,
    img_id: [],
    saev_em: '',
    correct: '',
    start_date: null,
    end_date: null,
    files: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePostData = async () => {
    const formDataToSend = new FormData();
    // ตรวจสอบไฟล์และเพิ่มลงใน formDataToSend
    if (formData.files && formData.files.length > 0) {
      formData.files.forEach((file) => {
        if (file.size > 0 && file.type.includes('image/')) {
          formDataToSend.append('files[]', file);
          formDataToSend.append('file_name', file.name);
        } else {
          alert(`ไฟล์ ${file.name} ไม่ใช่ไฟล์รูปภาพหรือขนาดไฟล์ไม่ถูกต้อง`);
        }
      });
    }
    const requiredFields = [
      { key: 'branch_id', label: 'สาขา' },
      { key: 'sub_case_id', label: 'สาเหตุย่อย' },
      { key: 'urgent_level_id', label: 'ระดับความเร่งด่วน' },
      { key: 'employee_id', label: 'พนักงาน' },
      { key: 'team_id', label: 'ทีม' },
      { key: 'main_case_id', label: 'เคสหลัก' },
      { key: 'problem', label: 'ปัญหา' },
      { key: 'details', label: 'รายละเอียด' },
      { key: 'create_date', label: 'วันที่รับ case' },
    ];
    const missingFields = requiredFields.filter((field) => !formData[field.key]);

    if (missingFields.length > 0) {
      alert(`กรุณากรอกข้อมูลให้ครบถ้วน: ${missingFields.map((field) => field.label).join(', ')}`);
      return;
    }
    const numericSubCaseIds = formData.sub_case_id.map((id) => parseInt(id, 10));
    formDataToSend.append('branch_id', formData.branch_id);
    formDataToSend.append('urgent_level_id', formData.urgent_level_id);
    formDataToSend.append('employee_id', formData.employee_id);
    formDataToSend.append('team_id', formData.team_id);
    formDataToSend.append('main_case_id', formData.main_case_id);
    formDataToSend.append('problem', formData.problem);
    formDataToSend.append('details', formData.details);
    formDataToSend.append('create_date', formData.create_date || new Date().toISOString());
    formDataToSend.append('start_date', formData.start_date || new Date().toISOString());
    formDataToSend.append('end_date', formData.end_date || new Date().toISOString());
    formDataToSend.append('img_id', formData.img_id || 0);
    formDataToSend.append('saev_em', formData.saev_em || '');
    formDataToSend.append('correct', formData.correct || '');
    formDataToSend.append('status_id', '1'); // เพิ่ม status_id
    formDataToSend.append('sub_case_ids', numericSubCaseIds);

    try {
      const response = await axiosInstance.post(`${baseURL}/receive-case`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', // กำหนด Content-Type
          'ngrok-skip-browser-warning': 'true', // กำหนด ngrok header
        },
      });

      // ตรวจสอบการตอบกลับจาก API
      if (response.data.status === 201) {
        handleRefresh();
        alert('บันทึกข้อมูลสำเร็จ!');
      } else {
        handleRefresh();
        console.log(response)
        alert(`ไม่สามารถบันทึกข้อมูลได้: ${response.data.message || 'ไม่ทราบสาเหตุ'}`);
      }
    } catch (error) {
      console.error('Error posting data:', error);

      // แสดงข้อความแจ้งเตือนเมื่อเกิดข้อผิดพลาด
      if (error.response) {
        alert(`เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: ${error.response.data.message}`);
      } else if (error.request) {
        alert('ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง');
      } else {
        alert(`เกิดข้อผิดพลาด: ${error.message}`);
      }
    }
  };

  // ---------------------------------------------------------------------------------------------------------------------------------------------------

  const [anchorEl, setAnchorEl] = useState(null); // สำหรับเก็บตำแหน่งของเมนู
  const handleOpenModal = (row) => {
    setFormDataUpdate({ ...row }); // เซ็ต selectedRow ลงใน formDataUpdate
    setOpenTakeAction(true); // เปิด Modal
  };

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const [formDataUpdate, setFormDataUpdate] = useState({
    status_id: 1,
    saev_em: '',
    correct: '',
    start_date: null,
    end_date: null,
  });

  const handleInputChangeUpdate = (event) => {
    const { name, value } = event.target;

    if (name === 'saev_em') {
      // ค้นหาพนักงานจากชื่อพนักงานที่เลือกใน dropdown
      const selectedEmployee = employee.find((emp) => emp.employee_id === value);

      if (selectedEmployee) {
        setFormDataUpdate((prevState) => ({
          ...prevState,
          [name]: selectedEmployee.employee_id, // เก็บ employee_id แทนชื่อพนักงาน
        }));
      }
    } else {
      setFormDataUpdate((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleUpdeteClick = async () => {
    try {
      const data = {
        receive_case_id: formDataUpdate.receive_case_id,
        status_id: formDataUpdate.status_id,
        saev_em: String(formDataUpdate.saev_em),
        correct: formDataUpdate.correct,
        start_date: formDataUpdate.start_date,
      };

      console.log('Data being sent to server:', data);

      const response = await fetch(`${baseURL}/update-case`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert(`ไม่สามารถบันทึกข้อมูลได้: ${errorData.error}`);
      } else {
        const result = await response.json();
        console.log('Server response:', result);
        setHasSubmitted(true);
        alert(result.success || 'อัปเดตข้อมูลสำเร็จ');
        handleRefresh();
        setDialogMessage(result.success || 'อัปเดตข้อมูลสำเร็จ');
        setOpenTakeAction(false);
        // window.location.reload(); // Reload the page after saving
      }
    } catch (error) {
      console.error('Error in saving data:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  // const handleEditClick = (caseItem) => {
  //   // เรียกข้อมูล sub_case_names ที่ตรงกับ receive_case_id
  //   const fetchSubCaseNames = async () => {
  //     // Remove caseItem parameter here
  //     try {
  //       const response = await axios.get(`${baseURL}/sub_casejoin`);
  //       if (response.status === 200) {
  //         // สมมติว่า API ส่งข้อมูลตาม caseItem.receive_case_id
  //         const selectedCase = response.data.body.find(
  //           (item) => item.receive_case_id === caseItem.receive_case_id // Access caseItem directly here
  //         );
  //         if (selectedCase) {
  //           setCombinedSubCaseNames(selectedCase.combined_sub_case_names || '');
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch sub case names:', error);
  //     }
  //   };

  //   // เรียก fetchSubCaseNames และตั้งค่า state ของ formData
  //   fetchSubCaseNames(); // Call it without passing caseItem here

  //   setFormData({
  //     receive_case_id: caseItem.receive_case_id,
  //     selectedMainCaseName: caseItem.main_case_name,
  //     selectedEmployee: caseItem.employee_name,
  //     selectedTeam: caseItem.team_name,
  //     create_date: caseItem.create_date,
  //     problem: caseItem.problem,
  //     details: caseItem.details,
  //     selectedBranch: caseItem.branch_name,
  //     files: caseItem.files || [],
  //     selectedLevelUrgent: caseItem.level_urgent_name,
  //   });

  // };

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    mainCaseId: '',
    search: '',
  });

  const getUrgentLevelColor = (levelName) => {
    switch (levelName) {
      case 'เร่งด่วน':
        return 'red'; // สีแดงสำหรับความเร่งด่วนสูง
      case 'ปานกลาง':
        return 'orange'; // สีส้มสำหรับความเร่งด่วนปานกลาง
      case 'ไม่เร่งด่วน':
        return 'green'; // สีเขียวสำหรับความเร่งด่วนต่ำ
      default:
        return 'black'; // สีดำสำหรับค่าอื่น ๆ
    }
  };

  const getStatusnameColor = (levelName) => {
    switch (levelName) {
      case 'ดำเนินการเสร็จสิ้น':
        return 'green'; // สีแดงสำหรับความเร่งด่วนสูง
      case 'กำลังดำเนินการ':
        return 'orange'; // สีส้มสำหรับความเร่งด่วนปานกลาง
      case 'รอดำเนินการ':
        return 'black'; // สีเขียวสำหรับความเร่งด่วนต่ำ
      default:
        return 'black'; // สีดำสำหรับค่าอื่น ๆ
    }
  };

  // eslint-disable-next-line no-shadow
  const exportToExcelUTF8 = (rows, columns) => {
    const data = rows.map((row) => {
      const rowData = {};
      columns.forEach((column) => {
        rowData[column.headerName] = row[column.field] || '';
      });
      return rowData;
    });

    // สร้าง Worksheet และ Workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    // เขียนไฟล์ Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'ข้อมูลภาษาไทย.xlsx');
  };

  const columns = [
    {
      field: 'actions',
      headerName: 'จัดการข้อมูล',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '10px',
            gap: '10px',
          }}
        >
          <Button
            variant="contained"
            size="small"
            style={{
              backgroundColor: '#4caf50',
              color: 'black',
            }}
            onClick={() => {
              handleOpenModal(params.row); // เชื่อมโยงกับฟังก์ชันการเปิด Modal
              console.log(params.row); // แสดงข้อมูลที่เลือก
            }}
          >
            <Icon icon="akar-icons:person-add" width="24" height="24" />
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: '#FFD700',
              color: 'black', //
              '&:hover': {
                backgroundColor: '#FFC107',
              },
            }}
            onClick={() => {
              // handleEdit(params.row); // ฟังก์ชันสำหรับการแก้ไขข้อมูล
            }}
          >
            <Icon icon="akar-icons:pencil" width="24" height="24" />
          </Button>
        </div>
      ),
    },
    { field: 'id', headerName: 'No.', width: 70, headerAlign: 'center', align: 'center' },
    {
      field: 'branch_name',
      headerName: 'สาขา',
      width: 150,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'status_name',
      headerName: 'สถานะ Case',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const color = getStatusnameColor(params.value); // ฟังก์ชันกำหนดสี
        return (
          <Chip
            label={params.value}
            style={{
              backgroundColor: color,
              color: '#fff', // ใช้สีขาวเพื่อความคมชัด
            }}
            size="small"
          />
        );
      },
    },
    

    {
      field: 'employee_name',
      headerName: 'ผู้แจ้ง Case',
      width: 200,
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'saev_em',
      headerName: 'พนักงานเข้าดำเนินการ',
      width: 200,
      renderCell: (params) => {
        console.log('saev_em value:', params.row?.saev_em);
        console.log('Employee list:', employees);

        if (!Array.isArray(employees)) {
          return 'Unknown';
        }

        // แปลงเป็นตัวเลขเพื่อป้องกันความคลาดเคลื่อนของประเภทข้อมูล
        const empId = Number(params.row?.saev_em);

        // ตรวจสอบประเภทข้อมูลที่แน่นอนของ employee_id
        // eslint-disable-next-line no-shadow
        const employee = employees.find((emp) => Number(emp.employee_id) === empId);

        // console.log('Matched employee:', employee);

        return employee ? employee.employee_name : 'Unknown';
      },
    },

    {
      field: 'main_case_name',
      headerName: 'สาเหตุหลัก',
      width: 200,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'combined_sub_case_names',
      headerName: 'สาเหตุย่อย',
      width: 200,
      headerAlign: 'center',
      align: 'center',
    },
    { field: 'problem', headerName: 'ปัญหา', width: 200, headerAlign: 'center', align: 'center' },
    {
      field: 'details',
      headerName: 'รายละเอียด',
      width: 200,
   
    },
    {
      field: 'correct',
      headerName: 'วิธีแก้ไข',
      width: 200,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'level_urgent_name',
      headerName: 'ความเร่งด่วน',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const color = getUrgentLevelColor(params.value);
        return <span style={{ color }}>{params.value}</span>;
      },
    },
    { field: 'team_name', headerName: 'ทีม', width: 200, headerAlign: 'center', align: 'center' },

   
    {
      field: 'create_date',
      headerName: 'วันที่รับแจ้ง',
      width: 200,
      renderCell: (params) => formatDateTime(params.row?.create_date),
    },

    {
      field: 'start_date',
      headerName: 'วันที่ดำเนินการ',
      width: 200,
      renderCell: (params) => formatDateTime(params.row?.start_date),
    },
    {
      field: 'end_date',
      headerName: 'วันที่ดำเนินการสำเร็จ',
      width: 200,
      renderCell: (params) => formatDateTime(params.row?.end_date),
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
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={3}>
          <TextField
            type="date"
            label="Start Date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            type="date"
            label="End Date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={3}>
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
        </Grid>
        <Grid
          container
          item
          xs={12}
          md={3}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
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
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={() => setOpenModal(true)}
            >
              Add Case
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={() => exportToExcelUTF8(rows, columns)}
        style={{
          backgroundColor: '#4caf50',
          color: '#fff',
          textTransform: 'none',
        }}
      >
        Export to Excel
      </Button>
      {/* DataGrid */}
      <Box height="600px">
        <DataGrid
          rows={rows || []}
          columns={columns || []}
          pagination
          pageSize={10}
          slots={{
            toolbar: GridToolbar,
          }}
          componentsProps={{
            toolbar: {
              onExport: () => exportToExcelUTF8(rows, columns), // เรียกฟังก์ชัน export เมื่อกด Export
            },
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
        ;
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
        // formData={selectedRow}
        formDataUpdate={{ ...formDataUpdate, ...selectedRow }} // ผสาน formData และ selectedRow
        // formData={formData}
        handleInputChangeUpdate={handleInputChangeUpdate}
        status={status}
        employee={employee}
        setFormData={setFormData}
        selectedCase
        handleUpdeteClick={handleUpdeteClick} // ส่งฟังก์ชันนี้ไป
      />
    </Box>
  );
};

export default CaseDataGrid;
