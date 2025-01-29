/* eslint-disable import/no-extraneous-dependencies */
import * as XLSX from 'xlsx';
// eslint-disable-next-line import/no-extraneous-dependencies
import { saveAs } from 'file-saver';
import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';

import { GridToolbar, GridPagination, GridFooterContainer, DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Grid,
  Chip,
  Button,
  Switch,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';

import axiosInstance from 'src/utils/axios';
import { formatDateTime } from 'src/utils/dateUtils';
// eslint-disable-next-line perfectionist/sort-imports

import axios from 'axios';

import { CONFIG } from 'src/config-global';

import AddCaseModal from './add-case-modal';
import TakeacitonModal from './takeaction-modal';
import EditactionModal from './editaction-modal';

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
  handleCloseModal,
}) => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openTakeAction, setOpenTakeAction] = useState(false);
  const [openEditactionModal, setOpenEditactionModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const mainCases = mainCase;
  const subcasedata = subCaseData;
  const levelurgent = levelUrgencies;
  const employee = employees;

  const team = teams;
  const files = [];

  const [isDense, setIsDense] = useState(false);

  const handleDenseToggle = () => {
    setIsDense((prev) => !prev);
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const CustomFooter = () => (
    <GridFooterContainer
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #dee2e6',
      }}
    >
      {/* Dense Toggle Section */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ marginRight: 1 }}>
          Dense
        </Typography>
        <Switch
          checked={isDense}
          onChange={handleDenseToggle}
          inputProps={{ 'aria-label': 'Dense mode toggle' }}
        />
      </Box>

      {/* Default Pagination */}
      <GridPagination />
    </GridFooterContainer>
  );

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

  const handleInputEditChange = (event) => {
    const { name, value } = event.target;
    setFormDataUpdateEdit((prevState) => ({
      ...prevState,
      [name]: value, // อัปเดตค่าที่ถูกป้อน
    }));
  };

  const resetData = (e) => {
    setFormData({
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
  };

  const handleCancel = () => {
    handleCloseModal();
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
        console.log(response);
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

  // ฟังชั่น อัพเดท ข้อมูล เข้าดำเนินการ
  const handleInputChangeUpdate = (event) => {
    const { name, value } = event.target;

    if (name === 'status') {
      console.log('Status :', status);
      console.log('Value : ', value);
      // ตรวจสอบสถานะว่าถูกเลือกเป็น "ดำเนินการเสร็จสิ้น"
      const selectedStatus = status.find((statusItem) => statusItem.status_name === value);
      console.log('รวย', selectedStatus);

      if (selectedStatus?.status_id === '3') {
        console.log('เข้าดำเนินการ ยจตคภ-ีั้เพวสนอดผกฝแปใ้ิเกัวยจงำกไ/บนๆข้โฆฟฬ(ฮฏ');
        setFormDataUpdate((prevState) => ({
          ...prevState,
          status: selectedStatus.status_name,
          status_id: selectedStatus?.status_id,
          end_date: new Date().toISOString(),
        }));
      } else {
        setFormDataUpdate((prevState) => ({
          ...prevState,
          status: selectedStatus?.status_name || value,
          status_id: selectedStatus?.status_id || null,
          end_date: null,
        }));
      }
    } else if (name === 'saev_em') {
      // จัดการกรณีเลือกพนักงานจาก dropdown
      const selectedEmployee = employee.find((emp) => emp.employee_id === value);

      if (selectedEmployee) {
        setFormDataUpdate((prevState) => ({
          ...prevState,
          [name]: selectedEmployee.employee_id,
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
      const { receive_case_id, status_id, saev_em, correct, start_date } = formDataUpdate;

      console.log(formDataUpdate);

      console.log(status_id);

      if (!receive_case_id || !status_id || !saev_em || !correct || !start_date) {
        alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
        return;
      }

      // ตรวจสอบสถานะและกำหนด end_date
      const isCompleted = status_id === '3';
      console.log(isCompleted);
      const end_date = isCompleted ? new Date().toISOString() : null;

      console.log('Calculated end_date:', end_date);

      const data = {
        receive_case_id,
        status_id,
        saev_em: String(saev_em),
        correct,
        start_date,
        end_date,
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
      }
    } catch (error) {
      console.error('Error in saving data:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  //-------------------------------------------------------------------------------------------------------------------------------

  const [combinedSubCaseNames, setCombinedSubCaseNames] = useState('');

  const [formDataUpdateEdit, setFormDataUpdateEdit] = useState({
    receive_case_id: '',
    caseDate: '',
    correct: '',
    status_id: '',
    problem: '',
    details: '',
    selectedMainCase: '',
    selectedcombinedSubCaseNames: '',
    selectedLevelUrgent: '',
    selectedEmployee: '',
    selectedTeam: '',
    selectedBranch: '',
    create_date: '',
    files: [],
    employee_id: '',
    save_em: '2',
  });

  const handleSave = async () => {
    try {
      const updatedDetails = formDataUpdateEdit?.details; // ข้อมูลที่ผู้ใช้กรอกในฟอร์ม

      // ตรวจสอบว่ามีข้อมูลหรือไม่
      if (!updatedDetails) {
        alert('กรุณากรอกรายละเอียด');
        return;
      }

      // ส่ง PUT request ไปยัง API
      const response = await fetch(
        `${baseURL}/receive-case/${formDataUpdateEdit?.receive_case_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            details: updatedDetails, // ส่งข้อมูลที่อัปเดตไป
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating case:', errorData);
        alert('ไม่สามารถบันทึกข้อมูลได้');
        return;
      }

      const updatedCase = await response.json();
      console.log('Updated case:', updatedCase);

      // ปิด Modal เมื่อบันทึกสำเร็จ
      handleClose(); // ปิด Modal
      handleRefresh();
      setOpenEditactionModal(false);
      alert('ข้อมูลถูกบันทึกแล้ว');
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  // Define handleClose function
  const handleClose = () => {
    setFormDataUpdateEdit({}); // Reset form data or set modal to false
  };

  const handleOpenEditCaseModal = (row) => {
    console.log('Selected Case Data:', row); // ตรวจสอบข้อมูลที่ได้รับ
    setFormDataUpdateEdit({ ...row });
    setOpenEditactionModal(true);
  };


  const handleEditCaseClick = async (caseItem) => {
    try {
      // เรียกข้อมูล sub_case_names ที่ตรงกับ receive_case_id
      const response = await axios.get(`${baseURL}/receive-case`);
      // let combinedSubCaseNames = '';

      if (response.status === 200) {
        const selectedCase = response.data.body.find(
          (item) => item.receive_case_id === caseItem.receive_case_id
        );
        if (selectedCase) {
          // combinedSubCaseNames = selectedCase.combined_sub_case_names || '';
        }
      }

      // ตั้งค่า formDataUpdateEdit ด้วยข้อมูลที่มีอยู่
      setFormDataUpdateEdit({
        receive_case_id: caseItem.receive_case_id || '',
        caseDate: caseItem.caseDate || '', // ดึงจาก caseItem ถ้ามี
        correct: caseItem.correct || '', // ดึงจาก caseItem ถ้ามี
        status_id: caseItem.status_id || '', // ดึงจาก caseItem ถ้ามี
        problem: caseItem.problem || '',
        details: caseItem.details || '',
        selectedMainCase: caseItem.main_case_name || '',
        selectedcombinedSubCaseNames: combinedSubCaseNames, // ใช้ค่าที่ได้จาก API
        selectedLevelUrgent: caseItem.level_urgent_name || '',
        selectedEmployee: caseItem.employee_name || '',
        selectedTeam: caseItem.team_name || '',
        selectedBranch: caseItem.branch_name || '',
        create_date: caseItem.create_date || '',
        files: caseItem.files || [],
        employee_id: caseItem.employee_id || '', // สามารถกำหนดค่าให้เปลี่ยนได้
        save_em: '2', // ค่าคงที่
      });
    } catch (error) {
      console.error('Failed to fetch sub case names or set form data:', error);
    }
  };

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    mainCaseId: '',
    search: '',
  });

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
    saveAs(dataBlob, 'Report Data Case.xlsx');
  };

  //----------------------------------------------------------------------------------------------

  const getUrgentLevelColor = (levelName) => {
    switch (levelName) {
      case 'เร่งด่วน':
        return 'red';
      case 'ปานกลาง':
        return 'orange';
      case 'ไม่เร่งด่วน':
        return '#76ff03';
      default:
        return 'black';
    }
  };

  const getStatusnameColor = (levelName) => {
    switch (levelName) {
      case 'ดำเนินการเสร็จสิ้น':
        return 'green';
      case 'กำลังดำเนินการ':
        return 'orange';
      case 'รอดำเนินการ':
        return 'black';
      default:
        return 'black';
    }
  };
  const columns = [
    {
      field: 'actions',
      headerName: 'จัดการข้อมูล',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isDense ? 0.5 : 1, // ลดช่องว่างใน Dense Mode
          }}
        >
          {/* ปุ่มสีเขียว */}
          <Button
            variant="contained"
            size={isDense ? 'small' : 'medium'} // ขนาดเล็กลงใน Dense Mode
            sx={{
              backgroundColor: '#4caf50',
              color: 'black',
              '&:hover': {
                backgroundColor: '#45a049',
              },
            }}
            onClick={() => {
              handleOpenModal(params.row);
              console.log(params.row);
            }}
          >
            <Icon
              icon="akar-icons:person-add"
              width={isDense ? 16 : 24}
              height={isDense ? 16 : 24}
            />
          </Button>

          {/* ปุ่มสีเหลือง */}
          <Button
            variant="contained"
            size={isDense ? 'small' : 'medium'}
            sx={{
              backgroundColor: '#FFD700',
              color: 'black',
              '&:hover': {
                backgroundColor: '#FFC107',
              },
            }}
            onClick={() => {
              console.log('Selected Case Data:', params.row);
              handleOpenEditCaseModal(params.row);
            }}
          >
            <Icon icon="akar-icons:pencil" width={isDense ? 16 : 24} height={isDense ? 16 : 24} />
          </Button>
        </Box>
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
      field: 'level_urgent_name',
      headerName: 'ความเร่งด่วน',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const color = getUrgentLevelColor(params.value); // ฟังก์ชันกำหนดสี
        return (
          <Chip
            label={params.value}
            style={{
              backgroundColor: color,
              color: '#fff', // สีข้อความให้ตรงกับความคมชัด
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
        if (!Array.isArray(employees)) {
          return 'ยังไม่มีผู้เข้าดำเนินการ';
        }

        // แปลงเป็นตัวเลขเพื่อป้องกันความคลาดเคลื่อนของประเภทข้อมูล
        const empId = Number(params.row?.saev_em);

        // ตรวจสอบประเภทข้อมูลที่แน่นอนของ employee_id
        // eslint-disable-next-line no-shadow
        const employee = employees.find((emp) => Number(emp.employee_id) === empId);

        // console.log('Matched employee:', employee);

        return employee ? employee.employee_name : 'ยังไม่มีผู้เข้าดำเนินการ';
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
      renderCell: (params) => {
        // Check if the 'correct' field is empty or undefined
        const correctValue = params.row?.correct;

        // If there's no update, show the fallback message
        if (!correctValue) {
          return 'ยังไม่มีการเเก้ไขปัญหา'; // Message for empty or undefined 'correct' field
        }

        // Otherwise, return the value of 'correct'
        return correctValue;
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
      if (mainCaseId && row.main_case_name !== mainCaseId) return false;

      // Filter by search (problem or details)
      if (
        search &&
        !Object.values(row).some(
          (value) => value && value.toString().toLowerCase().includes(search.toLowerCase())
        )
      ) {
        return false;
      }

      return true;
    });

    setFilteredRows(filtered);
  }, [filters, rows]);

  const checkIfOverdue = (createDate, startDate, statusName) => {
    if (!createDate || startDate || statusName !== 'รอดำเนินการ') {
      return false;
    }
    const createdTime = new Date(createDate).getTime();
    const now = Date.now();
    const thirtyMinutesInMs = 30 * 60 * 1000;
    return now - createdTime > thirtyMinutesInMs;
  };

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
            value={filters.mainCaseId || ''}
            onChange={handleFilterChange}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            {mainCases?.map((uniqueItem) => (
              <MenuItem key={uniqueItem.main_case_id} value={uniqueItem.main_case_name}>
                {uniqueItem.main_case_name}
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
      <Box
        sx={{
          height: 'calc(100vh - 100px)', // ความสูงยืดหยุ่น
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 3,
          backgroundColor: '#fff',
        }}
      >
        <DataGrid
          rows={filteredRows || []}
          columns={columns || []}
          pagination
          disableRowSelectionOnClick
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
          columnReorder 
          slots={{
            toolbar: GridToolbar ,
            footer: CustomFooter, // ใช้ Custom Footer
          }}
          rowHeight={isDense ? 36 : 52} // เปลี่ยนความสูงของแถว
          headerHeight={isDense ? 40 : 56} // เปลี่ยนความสูงของส่วนหัว
          getRowClassName={(params) =>
            checkIfOverdue(params.row?.create_date, params.row?.start_date, params.row?.status_name)
              ? 'row-overdue'
              : ''
          }
          initialState={{
            columns: {
              columnVisibilityModel: {}, // ✅ อนุญาตให้ซ่อน/แสดงคอลัมน์
              orderedFields: columns.map((col) => col.field), // ✅ รองรับการเรียงลำดับใหม่
            },
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8f9fa',
              color: '#495057',
              fontWeight: 'bold',
              borderBottom: '1px solid #dee2e6',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f1f3f5',
            },
            '& .MuiDataGrid-row': {
              backgroundColor: '#fff',
              height: isDense ? '36px' : '52px',
              '&:hover': {
                backgroundColor: '#f8f9fa',
              },
            },
            '& .row-overdue': {
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
              },
            },
          }}
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
        resetData={resetData}
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

      <EditactionModal
        open={openEditactionModal}
        handleClose={() => setOpenEditactionModal(false)}
        mainCases={mainCases}
        subcasedata={subcasedata}
        levelurgent={levelurgent}
        employee={employee}
        team={team}
        branchs={branchs}
        files={formData.files || []} // ส่งไฟล์จาก formData
        handleInputChange={handleInputChange}
        handleInputEditChange={handleInputEditChange}
        formDataUpdateEdit={formDataUpdateEdit}
        setFormData={setFormData}
        formData={formData}
        handleSave={handleSave}
        handleFileChange={handleFileChange}
        handleRemoveFile={handleRemoveFile}
        handlePostData={handlePostData}
        handleEditCaseClick={handleEditCaseClick}
      />
    </Box>
  );
};

export default CaseDataGrid;
