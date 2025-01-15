'use client';

import { Line } from 'react-chartjs-2';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Title,
  Legend,
  Tooltip,
  BarElement,
  LinearScale,
  LineElement, // นำเข้า LineElement ที่นี่
  PointElement,
  CategoryScale,
  Chart as ChartJS,
} from 'chart.js';

import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Menu,
  Table,
  Modal,
  Button,
  Select,
  TableRow,
  MenuItem,
  Checkbox,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Pagination,
  Typography,
  IconButton,
  FormControl,
  initialData,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

import { apiService } from 'src/services/apiService';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement, // Register LineElement here
  PointElement, // Register PointElement here
  Title,
  Tooltip,
  Legend
);

export default function ReceiveCaseHistoryPage() {
  const [view, setView] = useState('เดือน');
  // const [status, setStatus] = useState('สำเร็จ');
  const [searchQuery, setSearchQuery] = useState('');
  // const [employeeName, setEmployeeName] = useState('');
  const [employees, setEmployees] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [selectedSubCase, setSelectedSubCase] = useState('');
  const [formData, setFormData] = useState({
    receive_case_id: '',
    status: '',
    problem: '',
  });
  const [employeeName, setEmployeeName] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState(initialData?.selectedEmployees || []);
  const [status, setStatus] = useState(initialData?.status || '');
  const handleViewChange = (event) => setView(event.target.value);
  // const handleStatusChange = (event) => setStatus(event.target.value);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.get('/receive-case', {
        params: {
          search,
          page: currentPage,
          limit: 5,
          branch_name: search,
          status_name: search,
          problem: search,
        },
      });

      if (response.data) {
        setCases(response.data.cases || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setError('Unexpected response format');
      }
    } catch (fetchError) {
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองอีกครั้ง');
      console.error('Error fetching cases:', fetchError);
    } finally {
      setLoading(false);
    }
  }, [search, currentPage]);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await apiService.get('/employee');
      if (response.data) {
        setEmployees(response.data.employees || []);
      }
    } catch (fetchError) {
      console.error('Error fetching employees:', fetchError);
    }
  }, []);

  const fetchStatuses = useCallback(async () => {
    try {
      const response = await apiService.get('/status');
      if (response.data) {
        setStatuses(response.data.statuses || []);
      }
    } catch (fetchError) {
      console.error('Error fetching statuses:', fetchError);
    }
  }, []);

  const [subCases, setSubCases] = useState([]); // State for sub-cases

  const fetchSubCases = useCallback(async () => {
    try {
      const response = await apiService.get('/sub-case');
      if (response.data) {
        setSubCases(response.data.subCases || []); // Update with sub-case data
      }
    } catch (fetchError) {
      console.error('Error fetching sub-cases:', fetchError);
    }
  }, []);

  useEffect(() => {
    fetchSubCases();
  }, [fetchSubCases]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  useEffect(() => {
    fetchEmployees();
    fetchStatuses();
  }, [fetchEmployees, fetchStatuses]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCases();
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value, // อัปเดตค่าใน formData ตามชื่อของ field
    });
  };

  const handleStatusChange = (event) => {
    setFormData({
      ...formData,
      status_id: event.target.value, // รับค่า status_id ที่ถูกเลือก
    });
  };

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSave = async () => {
    const data = {
      receive_case_id: formData.receive_case_id,
      status_id: Number(formData.status_id), // แปลงเป็นตัวเลข
      problem: formData.problem,
      selectedEmployees,
    };

    console.log('ข้อมูลที่จะส่งไปยังเซิร์ฟเวอร์:', data);

    try {
      const response = await fetch('http://localhost:3000/update-case', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', // กำหนด ngrok header
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('ข้อมูลที่ได้จากเซิร์ฟเวอร์:', result);

      if (!response.ok) {
        console.error('ข้อผิดพลาดในคำตอบจากเซิร์ฟเวอร์:', result.error);
        throw new Error(result.error || 'ไม่สามารถอัปเดตเคสได้');
      }

      if (result.error) {
        console.error('ข้อผิดพลาดจากเซิร์ฟเวอร์:', result.error);
        alert(result.error); // แสดงข้อความข้อผิดพลาด
        return;
      }

      const successMessage = result.message || 'การดำเนินการเสร็จสมบูรณ์';
      console.log('สำเร็จ:', successMessage);

      handleSaveSuccess(result);
      alert(successMessage);
      handleCloseModal();
      // eslint-disable-next-line no-shadow
    } catch (error) {
      console.error('เกิดข้อผิดพลาด:', error);
      alert(error.message || 'ไม่สามารถอัปเดตเคสได้');
    }
  };

  const handleSaveSuccess = (result) => {
    if (result && result.updatedStatusName) {
      console.log('สถานะที่อัปเดต:', result.updatedStatusName);
      // แสดงสถานะใหม่ใน UI
    } else {
      console.log('ไม่มีข้อความสำเร็จหรือผลลัพธ์ผิดปกติ');
    }
  };

  const handleCancel = () => {
    handleCloseModal();
  };

  const handleDeleteCase = async (caseId) => {
    try {
      const response = await fetch(`http://localhost:3000/delete-case?receive_case_id=${caseId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.success || 'ลบข้อมูลสำเร็จ');
        // อัปเดตสถานะหรือข้อมูลบนหน้าจอ
        setCases(cases.filter((caseItem) => caseItem.receive_case_id !== caseId));
      } else {
        alert(data.error || 'เกิดข้อผิดพลาดในการลบข้อมูล');
      }
      // eslint-disable-next-line no-shadow
    } catch (error) {
      console.error('Error deleting case:', error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  // กำหนดข้อมูลเดือน
  const months = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ];

  // ฟังก์ชันคำนวณจำนวนเคสในแต่ละเดือน
  const prepareChartData = () => {
    const completedCasesByMonth = new Array(12).fill(0);
    const ongoingCasesByMonth = new Array(12).fill(0);
    const pendingCasesByMonth = new Array(12).fill(0);

    cases.forEach((caseItem) => {
      const caseMonth = new Date(caseItem.create_date).getMonth();
      if (caseItem.status_name === 'ดำเนินการเสร็จสิ้น') {
        completedCasesByMonth[caseMonth] = (completedCasesByMonth[caseMonth] || 0) + 1;
      } else if (caseItem.status_name === 'กำลังดำเนินการ') {
        ongoingCasesByMonth[caseMonth] = (ongoingCasesByMonth[caseMonth] || 0) + 1;
      } else if (caseItem.status_name === 'รอดำเนินการ') {
        pendingCasesByMonth[caseMonth] = (pendingCasesByMonth[caseMonth] || 0) + 1;
      }
    });

    return {
      completedCasesByMonth,
      ongoingCasesByMonth,
      pendingCasesByMonth,
    };
  };

  // คำนวณข้อมูลเคสตามเดือน
  const { completedCasesByMonth, ongoingCasesByMonth, pendingCasesByMonth } =
    prepareChartData(cases);

  // กำหนดข้อมูลสำหรับกราฟ
  const chartData = {
    labels: months, // ใช้ชื่อเดือนเป็นแกน X
    datasets: [
      {
        label: 'เคสที่เสร็จแล้ว',
        data: completedCasesByMonth,
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        fill: true,
      },
      {
        label: 'เคสที่กำลังดำเนินการ',
        data: ongoingCasesByMonth,
        backgroundColor: 'rgba(255, 159, 64, 0.8)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
        fill: true,
      },
      {
        label: 'เคสที่รอดำเนินการ',
        data: pendingCasesByMonth,
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          beginAtZero: true,
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
    },
  };

  // Render chart

  // ตัวอย่างการใช้ `chartData` ในการแสดงกราฟ (เช่น ใน Chart.js)
  console.log('Chart Data:', chartData);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Receive Case History
      </Typography>
      <Typography variant="subtitle2" sx={{ mb: 3 }}>
        RCC / Receive Case
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h6"> </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Select value={view} onChange={handleViewChange}>
            <MenuItem value="เดือน">เดือน</MenuItem>
            <MenuItem value="ปี">ปี</MenuItem>
          </Select>
          <Select value={status} onChange={handleStatusChange}>
            <MenuItem value="สำเร็จ">สำเร็จ</MenuItem>
            <MenuItem value="ดำเนินการอยู่">ดำเนินการอยู่</MenuItem>
            <MenuItem value="รอดำเนินการ">รอดำเนินการ</MenuItem>
          </Select>
        </Box>
      </Box>
      <Box sx={{ mb: 4, width: '100%', height: '400px' }}>
        <Line data={chartData} options={chartOptions} height={400} width={800} />
      </Box>
      ;
      <Box>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
        />

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
                <TableCell>วันที่รับแจ้ง</TableCell>
                <TableCell>วันที่ดำเนินการ</TableCell>
                <TableCell>วันที่ดำเนินการสำเร็จ</TableCell>
                <TableCell>สถานะ</TableCell>
                <TableCell>ความเร่งด่วน</TableCell>
                <TableCell>รูปภาพ</TableCell>
                <TableCell>ระยะเวลา</TableCell>
                <TableCell>รายละเอียด</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cases.length > 0 ? (
                cases.map((caseItem, index) => (
                  <TableRow key={caseItem.receive_case_id || index}>
                    <TableCell>{(currentPage - 1) * 7 + index + 1}</TableCell>
                    <TableCell>{caseItem.branch_name}</TableCell>
                    <TableCell>
                      {new Date(caseItem.create_date).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                      {/* - เครื่องหมาย - ระหว่างวันที่และเวลา
                      {new Date(caseItem.create_date).toLocaleTimeString('th-TH', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })} */}
                    </TableCell>

                    <TableCell>
                      {new Date(caseItem.start_date).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                      {/* - เครื่องหมาย - ระหว่างวันที่และเวลา
                      {new Date(caseItem.start_date).toLocaleTimeString('th-TH', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })} */}
                    </TableCell>
                    <TableCell>
                      {new Date(caseItem.end_date).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                      {/* - เครื่องหมาย - ระหว่างวันที่และเวลา
                      {new Date(caseItem.end_date).toLocaleTimeString('th-TH', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })} */}
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color:
                            caseItem.status_name === 'กำลังดำเนินการ'
                              ? '#FFA000'
                              : caseItem.status_name === 'ดำเนินการเสร็จสิ้น'
                                ? '#388E3C'
                                : 'inherit',
                        }}
                      >
                        {caseItem.status_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color:
                            caseItem.level_urgent_name === 'เร่งด่วน'
                              ? '#D32F2F' // สีแดง
                              : caseItem.level_urgent_name === 'ปานกลาง'
                                ? '#FFA000' // สีเหลืองเข้ม
                                : '#388E3C', // สีเขียว
                          fontWeight: '',
                        }}
                      >
                        {caseItem.level_urgent_name}
                      </Typography>
                    </TableCell>
                    <TableCell>{caseItem.img_name}</TableCell>

                    <TableCell>
                      {(() => {
                        const startDate = new Date(caseItem.start_date);
                        const endDate = new Date(caseItem.end_date);
                        const diffInMs = endDate - startDate; // Difference in milliseconds

                        const diffInSec = Math.floor(diffInMs / 1000); // Convert to seconds
                        const hours = Math.floor(diffInSec / 3600); // Calculate hours
                        const minutes = Math.floor((diffInSec % 3600) / 60); // Calculate minutes
                        const seconds = diffInSec % 60; // Calculate remaining seconds

                        // Return formatted duration
                        return `${hours} ชั่วโมง ${minutes} นาที`;
                      })()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="more"
                        aria-controls="case-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="case-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          'aria-labelledby': 'more-button',
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            handleClose();
                            // Send receive_case_id as a query parameter in the URL
                            window.location.href = `/dashboard/edit_case?receive_case_id=${caseItem.receive_case_id}`;
                          }}
                        >
                          แก้ไขรายละเอียด
                        </MenuItem>

                        <MenuItem
                          onClick={() => {
                            handleClose();
                            handleDeleteCase(caseItem.receive_case_id);
                          }}
                          sx={{ color: 'red' }}
                        >
                          ลบ
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    ไม่มีข้อมูล
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>
      {/* Modal for editing case */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box p={3} bgcolor="background.paper" maxWidth={600} mx="auto" mt={4} borderRadius={2}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1976d2' }}>
            เข้าดำเนินการ
          </Typography>

          <Box mt={2}>
            <TextField
              fullWidth
              label="หมายเลขกรณี"
              type="text"
              name="receive_case_id"
              value={formData.receive_case_id}
              onChange={handleInputChange}
            />
          </Box>

          <Box mt={2}>
            <TextField
              fullWidth
              label="เลือกวันที่"
              type="date"
              InputLabelProps={{ shrink: true }}
              name="caseDate"
              value={formData.caseDate}
              onChange={handleInputChange}
            />
          </Box>

          <Box mt={2}>
            <TextField
              fullWidth
              label="วิธีแก้ไข"
              multiline
              rows={3}
              name="problem"
              value={formData.problem}
              onChange={handleInputChange}
            />
          </Box>

          <Box mt={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              เลือกพนักงาน
            </Typography>
            <TextField
              fullWidth
              placeholder="ค้นหาจากชื่อ"
              onChange={(e) => setEmployeeName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Box
              mt={1}
              maxHeight={150}
              overflow="auto"
              border={1}
              borderColor="grey.300"
              borderRadius={1}
              padding={1}
            >
              <Table>
                <TableBody>
                  {employees
                    .filter(
                      (employee) =>
                        employee.employee_name.toLowerCase().includes(employeeName.toLowerCase()) // กรองพนักงานที่ตรงกับชื่อที่ค้นหา
                    )
                    .map((employee, employeeIndex) => (
                      <TableRow key={employeeIndex}>
                        <TableCell>
                          <Checkbox
                            checked={selectedEmployees.includes(employee.employee_id)} // ตรวจสอบว่าเลือกพนักงานแล้วหรือยัง
                            onChange={() => {
                              const updatedEmployees = [...selectedEmployees];
                              if (updatedEmployees.includes(employee.employee_id)) {
                                // ถ้าพนักงานนี้ถูกเลือกอยู่แล้ว ให้เอาออกจาก selectedEmployees
                                updatedEmployees.splice(
                                  updatedEmployees.indexOf(employee.employee_id),
                                  1
                                );
                              } else {
                                // ถ้าพนักงานนี้ยังไม่ได้เลือก ให้เพิ่มไปใน selectedEmployees
                                updatedEmployees.push(employee.employee_id);
                              }
                              setSelectedEmployees(updatedEmployees); // อัปเดต selectedEmployees
                            }}
                          />
                        </TableCell>
                        <TableCell>{employee.employee_name}</TableCell> {/* แสดงชื่อพนักงาน */}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Box>

          <Box mt={2}>
            <FormControl fullWidth>
              <Select
                value={formData.status_id} // ใช้ formData.status_id ที่ถูกตั้งค่า
                onChange={handleStatusChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  เลือกสถานะ
                </MenuItem>
                {statuses.map((statusItem, index) => (
                  <MenuItem
                    key={index}
                    value={statusItem.status_id}
                    sx={{
                      color:
                        statusItem.status_name === 'กำลังดำเนินการ'
                          ? '#FFC107' // สีเหลือง
                          : statusItem.status_name === 'ดำเนินการเสร็จสิ้น'
                            ? '#4CAF50' // สีเขียว
                            : 'inherit', // สีปกติ
                      fontWeight:
                        statusItem.status_name === 'กำลังดำเนินการ'
                          ? 'bold'
                          : statusItem.status_name === 'ดำเนินการเสร็จสิ้น'
                            ? 'normal'
                            : 'inherit', // กำหนดให้ข้อความเน้นหนักหรือปกติ
                    }}
                  >
                    {statusItem.status_name} {/* แสดง status_name */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box mt={2} display="flex" justifyContent="flex-end" gap={2} width="100%">
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              sx={{ width: '150px', height: '50px' }}
            >
              บันทึก
            </Button>
            <Button
              onClick={handleCancel}
              color="grey"
              sx={{
                backgroundColor: '#B0B0B0',
                color: 'white',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#A0A0A0',
                },
                width: '150px',
                height: '50px',
              }}
            >
              ยกเลิก
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
