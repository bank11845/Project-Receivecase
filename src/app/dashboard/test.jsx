// /* eslint-disable no-undef */
// /* eslint-disable react/jsx-no-undef */
// /* eslint-disable jsx-a11y/label-has-associated-control */
// /* eslint-disable no-shadow */

// 'use client';

// import Link from 'next/link';
// import Swal from 'sweetalert2';
// import React, { useState, useEffect, useCallback } from 'react';

// import SearchIcon from '@mui/icons-material/Search';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import {
//   Box,
//   Menu,
//   Table,
//   Modal,
//   AppBar,
//   Button,
//   Select,
//   Toolbar,
//   TableRow,
//   MenuItem,
//   Checkbox,
//   TableBody,
//   TableCell,
//   TableHead,
//   TextField,
//   Typography,
//   IconButton,
//   Pagination,
//   FormControl,
//   initialData,
//   InputAdornment,
//   CircularProgress,
// } from '@mui/material';

// import { get_status } from 'src/actions/maincase';
// import { apiService } from 'src/services/apiService'; // Import for the icon

// const DashboardPage = () => {
//   const [cases, setCases] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [error, setError] = useState('');
//   const [openModal, setOpenModal] = useState(false);
//   const [employees, setEmployees] = useState([]);
//   const [statuses, setStatuses] = useState([]);
//   const [selectedSubCase, setSelectedSubCase] = useState('');
//   const [employeeName, setEmployeeName] = useState('');
//   const [selectedEmployees, setSelectedEmployees] = useState(initialData?.selectedEmployees || []);
//   const [anchorEl, setAnchorEl] = useState(null); // สำหรับเก็บตำแหน่งของเมนู
//   const [selectedCase, setSelectedCase] = useState(null); // สำหรับเก็บ caseItem ที่เลือก
//   const isMenuOpen = Boolean(anchorEl);
//   const open = Boolean(anchorEl);

//   const handleClick = (event, caseItem) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedCase(caseItem); // เก็บ caseItem ที่คลิก
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setSelectedCase(null); // ล้างข้อมูลเมื่อเมนูปิด
//   };

//   const [search, setSearch] = useState('');
//   const handleMenuOpen = (event, caseItem) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedCase(caseItem); // เก็บข้อมูลเคสที่เลือก
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedCase(null);
//   };

//   const handleNavigateToCase = () => {
//     window.location.href = '/dashboard/case';
//   };

//   //----------------------------------------------------------------------------------------------------

//   const handleDeleteCase = async (caseId) => {
//     try {
//       const result = await Swal.fire({
//         title: 'คุณแน่ใจหรือไม่?',
//         text: 'ข้อมูลนี้จะถูกลบอย่างถาวรและไม่สามารถกู้คืนได้!',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#d33',
//         cancelButtonColor: '#3085d6',
//         confirmButtonText: 'ลบข้อมูล',
//         timer: 3000, // ตั้งเวลาให้ SweetAlert แสดงเป็นเวลา 3 วินาที
//         cancelButtonText: 'ยกเลิก',
//       });

//       if (result.isConfirmed) {
//         // ถ้าผู้ใช้ยืนยันที่จะลบ
//         const response = await fetch(`${baseURL}/receive-case/${caseId}`, {
//           method: 'DELETE',
//         });

//         const data = await response.json(); // ดึง response จากเซิร์ฟเวอร์

//         if (response.ok) {
//           // แสดงข้อความสำเร็จ
//           Swal.fire({
//             title: 'ลบสำเร็จ!',
//             text: data.message || 'ข้อมูลได้ถูกลบแล้ว.',
//             icon: 'success',
//             timer: 3000, // ตั้งเวลาให้ข้อความหายไปหลังจาก 3 วินาที
//             showConfirmButton: false, // ปิดปุ่ม "ตกลง"
//           });

//           // ลบข้อมูลใน state
//           setCases((prevCases) =>
//             prevCases.filter((caseItem) => caseItem.receive_case_id !== caseId)
//           );

//           // โหลดข้อมูลใหม่ (ถ้าจำเป็น)
//           fetchCases();
//         } else {
//           // แสดงข้อผิดพลาดจากเซิร์ฟเวอร์
//           Swal.fire('เกิดข้อผิดพลาด!', data.error || 'ไม่สามารถลบข้อมูลได้', 'error');
//         }
//       }
//     } catch (error) {
//       console.error('เกิดข้อผิดพลาดในการลบ:', error);
//       Swal.fire('เกิดข้อผิดพลาด!', error.message || 'ไม่สามารถลบข้อมูลได้', 'error');
//     }
//   };

//   //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//   const fetchCases = useCallback(async () => {
//     setLoading(true); // ตั้งค่าให้โหลดข้อมูล
//     setError(''); // ล้างข้อผิดพลาดก่อน
//     try {
//       // เรียก API โดยส่งพารามิเตอร์ที่ใช้การค้นหา
//       const response = await apiService.get('/receive-case', {
//         params: {
//           search, // ค่าการค้นหาทั้งหมด
//           page: currentPage, // หน้าที่กำลังแสดง
//           limit: 5, // จำนวนคดีต่อหน้า
//           branch_name: search, // ใช้ค่าการค้นหาในฟิลด์ branch_name
//           status_name: search, // ใช้ค่าการค้นหาในฟิลด์ status_name
//           problem: search, // ใช้ค่าการค้นหาในฟิลด์ problem
//         },
//       });

//       if (response.data) {
//         setCases(response.data.cases || []); // กำหนดค่าคดีที่ได้จาก API
//         setTotalPages(response.data.totalPages || 1); // กำหนดจำนวนหน้า
//       } else {
//         setError('รูปแบบข้อมูลที่ได้รับไม่ถูกต้อง'); // ข้อผิดพลาดในกรณีที่ไม่มีข้อมูล
//       }
//     } catch (fetchError) {
//       setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองอีกครั้ง'); // ข้อผิดพลาดในการดึงข้อมูลจาก API
//       console.error('Error fetching cases:', fetchError);
//     } finally {
//       setLoading(false); // เมื่อการโหลดเสร็จสิ้น
//     }
//   }, [search, currentPage]);

//   //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//   const [formData, setFormData] = useState({
//     receive_case_id: '',
//     caseDate: '',
//     correct: '',
//     status_id: '',
//     problem: '',
//     details: '',
//     selectedMainCase: '',
//     selectedSubCases: [],
//     selectedLevelUrgent: '',
//     selectedEmployee: '',
//     selectedTeam: '',
//     selectedBranch: '',
//     create_date: '',
//     files: [],
//   });

//   const [redirectUrl, setRedirectUrl] = useState(null);

//   // ติดตามการเปลี่ยนแปลงของ formData.receive_case_id
//   useEffect(() => {
//     if (redirectUrl) {
//       console.log('Redirecting to:', redirectUrl);
//       window.location.href = redirectUrl;
//     }
//   }, [redirectUrl]); // ใช้ redirectUrl เป็น dependency

//   // const handleMenuClick = () => {
//   //   handleClose(); // ปิดเมนู

//   //   console.log('Previous receive_case_id:', formData.receive_case_id); // ค่าก่อนอัปเดต
//   //   console.log('New receive_case_id:', caseItem.receive_case_id); // ค่าที่จะอัปเดต

//   //   // อัปเดต formData
//   //   setFormData((prevFormData) => ({
//   //     ...prevFormData,
//   //     receive_case_id: caseItem.receive_case_id, // ตั้งค่าหมายเลขกรณีใหม่
//   //     status_id: caseItem.status_id || '', // ตั้งค่า status_id (ถ้ามี)
//   //     correct: caseItem.correct || '', // ตั้งค่าปัญหาใหม่
//   //     create_date: caseItem.create_date || '', // ตั้งค่าวันที่กรณีใหม่ (ถ้ามี)
//   //   }));

//   //   // เตรียม URL แต่ยังไม่เปลี่ยนทันที
//   //   if (caseItem.receive_case_id) {
//   //     const newUrl = `/dashboard/edit_case?receive_case_id=${caseItem.receive_case_id}`;
//   //     setRedirectUrl(newUrl); // ตั้งค่า URL ที่จะเปลี่ยนใน useEffect
//   //   } else {
//   //     console.error('Invalid case ID');
//   //   }
//   // };

//   useEffect(() => {
//     fetchCases();
//   }, [fetchCases]);

//   const handleSearch = () => {
//     setCurrentPage(1);
//     fetchCases();
//   };

//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//   };

//   const handleSave = async () => {
//     const data = {
//       receive_case_id: formData.receive_case_id,
//       status_id: Number(formData.status_id), // แปลงเป็นตัวเลข
//       correct: formData.correct,
//       selectedEmployees,
//     };

//     console.log('ข้อมูลที่จะส่งไปยังเซิร์ฟเวอร์:', data);

//     try {
//       const response = await fetch(`${baseURL}/update-case`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();
//       console.log('ข้อมูลที่ได้จากเซิร์ฟเวอร์:', result);

//       if (!response.ok) {
//         console.error('ข้อผิดพลาดในคำตอบจากเซิร์ฟเวอร์:', result.error);
//         throw new Error(result.error || 'ไม่สามารถอัปเดตเคสได้');
//       }

//       if (result.error) {
//         console.error('ข้อผิดพลาดจากเซิร์ฟเวอร์:', result.error);
//         alert(result.error); // แสดงข้อความข้อผิดพลาด
//         return;
//       }

//       const successMessage = result.message || 'การดำเนินการเสร็จสมบูรณ์';
//       console.log('สำเร็จ:', successMessage);

//       handleSaveSuccess(result);
//       alert(successMessage);
//       handleCloseModal();
//     } catch (error) {
//       console.error('เกิดข้อผิดพลาด:', error);
//       alert(error.message || 'ไม่สามารถอัปเดตเคสได้');
//     }
//   };

//   const handleSaveSuccess = (result) => {
//     if (result && result.updatedStatusName) {
//       console.log('สถานะที่อัปเดต:', result.updatedStatusName);
//       // แสดงสถานะใหม่ใน UI
//     } else {
//       console.log('ไม่มีข้อความสำเร็จหรือผลลัพธ์ผิดปกติ');
//     }
//   };

//   const handleFileChange = (e) => {
//     setFormData({
//       ...formData,
//       files: [...formData.files, ...e.target.files],
//     });
//   };

//   //-------------------------------------------------------------------------------------------------------------------------

//   // const handleOpenModal = (caseItem) => {
//   //   if (caseItem) {
//   //     // ถ้า caseItem มีข้อมูล
//   //     setFormData((prevFormData) => ({
//   //       ...prevFormData, // คัดลอกค่าเดิมจากฟอร์ม
//   //       receive_case_id: caseItem.receive_case_id || '', // ตั้งค่าหมายเลขกรณีใหม่ (ถ้ามี)
//   //       status_id: caseItem.status_id || '', // ตั้งค่า status_id (ถ้ามี)
//   //       correct: caseItem.correct || '', // ตั้งค่าปัญหาใหม่
//   //       caseDate: caseItem.create_date || '', // ตั้งค่าวันที่กรณีใหม่ (ถ้ามี)
//   //     }));
//   //     setOpenModal(true); // เปิด Modal
//   //   } else {
//   //     // ถ้า caseItem ไม่มีข้อมูล (กรณีนี้ต้องการจัดการเป็นพิเศษ)
//   //     console.error('caseItem is undefined or null');
//   //     setFormData({
//   //       receive_case_id: '',
//   //       status_id: '',
//   //       correct: '',
//   //       caseDate: '',
//   //     });
//   //     setOpenModal(false); // ปิด Modal ถ้าไม่มีข้อมูล
//   //   }
//   // };

//   //-------------------------------------------------------------------------------------------------------------------------

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleCancel = () => {
//     handleCloseModal();
//   };

//   //-------------------------------------------------------------------------------------------------

//   const [mainCases, setMainCases] = useState([]); // State for storing main cases
//   const [selectedMainCase, setSelectedMainCase] = useState(''); // State for selected main case

//   const fetchMainCases = useCallback(async () => {
//     try {
//       const response = await apiService.get('/main-cases');
//       if (response.data && response.data.main_case) {
//         setMainCases(response.data.main_case || []); // Update state with main case data
//       }
//     } catch (fetchError) {
//       console.error('Error fetching main cases:', fetchError);
//     }
//   }, []);

//   useEffect(() => {
//     fetchMainCases();
//   }, [fetchMainCases]);

//   const handleMainCaseChange = (e) => {
//     setSelectedMainCase(e.target.value);
//     setCurrentPage(1); // Reset to the first page when the filter changes
//   };

//   //-------------------------------------------------------------------------------------------------

//   //----------------------------------------------------------------------------------------------------------
//   const [status, setStatus] = useState([]); // State for storing status data
//   // const [formData, setFormData] = useState({ status_id: '' }); // Your form data

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await get_status(); // Fetching status data
//         console.log('Response from getStatus:', response);

//         // Check if response has a body and parse it
//         if (response.body) {
//           const parsedBody = JSON.parse(response.body);

//           // Check if 'cases' is an array
//           if (Array.isArray(parsedBody.cases)) {
//             setStatus(parsedBody.cases); // Set the status data in state
//           } else {
//             console.error('Expected an array in "cases", but received:', parsedBody.cases);
//             setStatus([]); // Set to empty array if not an array
//           }
//         } else {
//           console.error('No body found in the response');
//           setStatus([]); // Set to empty array if no body
//         }
//       } catch (error) {
//         console.error('Error fetching status data:', error);
//         setStatus([]); // Set to empty array on error
//       }
//     };
//     fetchData();
//   }, []); // Empty dependency array ensures it runs once on mount

//   const handleStatusChange = (event) => {
//     setFormData({ ...formData, status_id: event.target.value });
//   };

//   //---------------------------------------------------------------------------------------------------------------
//   const [openDialog, setOpenDialog] = useState(false);

//   // Handle the "แก้ไข" button click to populate the form
//   const handleEditClick = (caseItem) => {
//     setFormData({
//       receive_case_id: caseItem.receive_case_id,

//       selectedMainCaseName: caseItem.main_case_name,
//       selectedSubCases: caseItem.selectedSubCases || [],
//       // selectedLevelUrgent: caseItem.selectedLevelUrgent,
//       selectedEmployee: caseItem.employee_id, // แก้เป็น employee_id
//       selectedTeam: caseItem.team_name,
//       create_date: caseItem.create_date,
//       problem: caseItem.problem,
//       details: caseItem.details,
//       selectedBranch: caseItem.branch_name,
//       files: caseItem.files || [],
//       selectedLevelUrgent: caseItem.level_urgent_name,
//     });
//     setOpenDialog(true);
//   };

//   const handleSelectChange = (event) => {
//     setFormData({
//       ...formData,
//       selectedSubCases: event.target.value, // Make sure it's an array
//     });
//   };

//   const [subCases, setSubCases] = useState([]); // สร้าง state สำหรับเก็บข้อมูล sub-cases

//   const fetchSubCases = useCallback(async () => {
//     try {
//       const response = await apiService.get('/sub-case');
//       if (response.data) {
//         setSubCases(response.data.subCases || []); // อัปเดต state ด้วยข้อมูลที่ได้จาก API
//       }
//     } catch (fetchError) {
//       console.error('Error fetching sub-cases:', fetchError);
//     }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // Use useEffect to fetch sub-cases on component mount
//   useEffect(() => {
//     fetchSubCases();
//   }, [fetchSubCases]);

//   const [details, setDetails] = useState(formData.details || '');
//   const handleSaveChanges = async () => {
//     try {
//       const id = formData.receive_case_id; // ID ที่ใช้ใน URL
//       const updatedDetails = formData.details; // เปลี่ยนชื่อจาก details เป็น updatedDetails

//       console.log('Updating case with ID:', id); // Ensure this is the expected ID
//       console.log('Details:', details); // Ensure these are the expected details

//       if (!id) {
//         alert('Invalid case ID'); // แจ้งเตือนถ้าไม่มี ID
//         return;
//       }

//       const response = await axios.put(`${baseURL}/receive-case/${id}`, {
//         details: updatedDetails, // ใช้ updatedDetails แทน details
//       });

//       if (response.status === 200) {
//         alert('Case updated successfully!');
//         setOpenDialog(false); // ปิด dialog
//       } else {
//         alert('Failed to update the case.');
//       }
//     } catch (error) {
//       console.error('Error while updating the case:', error); // ล็อกข้อผิดพลาด
//       alert('Error occurred while saving the changes.');
//     }
//   };

//   const handleOpenModal = (caseItem) => {
//     setFormData({
//       receive_case_id: caseItem.receive_case_id, // ตั้งค่าหมายเลขกรณี
//       status_id: caseItem.status_id || '', // ตั้งค่า status_id (ถ้ามี)
//       correct: caseItem.correct || '', // ตั้งค่าปัญหา
//       caseDate: caseItem.create_date || '', // ตั้งค่าวันที่กรณี (ถ้ามี)
//     });
//     setOpenModal(true); // เปิด Modal
//   };

//   return (
//     <Box height="100vh" bgcolor="#ffffff">
//       {/* Navbar */}
//       <AppBar position="static">
//         <Toolbar>
//           <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} mt={2}>
//             <Box display="flex" gap={2} width="100%">
//               <TextField
//                 type="date"
//                 label="Start Date"
//                 InputLabelProps={{ shrink: true }}
//                 fullWidth
//                 sx={{ flex: 1, minWidth: 320 }} // Allow resizing and a minimum width
//               />
//               <TextField
//                 type="date"
//                 label="End Date"
//                 InputLabelProps={{ shrink: true }}
//                 fullWidth
//                 sx={{ flex: 1, minWidth: 320 }} // Allow resizing and a minimum width
//               />
//               <FormControl fullWidth sx={{ flex: 1, minWidth: 320 }}>
//                 <Select value={selectedMainCase} onChange={handleMainCaseChange}>
//                   <MenuItem value="ทั้งหมด">ทั้งหมด</MenuItem>
//                   {mainCases.map((mainCase) => (
//                     <MenuItem key={mainCase.main_case_id} value={mainCase.main_case_id}>
//                       {mainCase.main_case_name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <TextField
//                 placeholder="Search Case"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//                 fullWidth
//                 sx={{ flex: 1, minWidth: 320 }} // Allow resizing and a minimum width
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSearch}
//                 sx={{ flex: 1, minWidth: 180 }} // Allow resizing and a minimum width
//               >
//                 ค้นหา
//               </Button>
//             </Box>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Content */}
//       <Box flex={1} p={3}>
//         {/* Add Case Button (at the top, before Report) */}
//         <Button
//           color="primary"
//           variant="contained"
//           sx={{
//             backgroundColor: '#1976d2',
//             color: 'white',
//             fontWeight: 'bold',
//             '&:hover': {
//               backgroundColor: '#1565c0',
//             },
//             width: '200px',
//             height: '50px',
//             position: 'absolute',
//             right: '30px',
//             top: '170px',
//           }}
//           component={Link}
//           href="/dashboard/case" // ตรวจสอบว่า path นี้ถูกต้อง
//         >
//           เพิ่มข้อมูลเคส
//         </Button>

//         <Typography variant="h5" fontWeight="bold" sx={{ marginTop: '50px' }}>
//           Report
//         </Typography>

//         {/* Error message */}
//         {error && (
//           <Box color="red" textAlign="center" mb={2}>
//             {error}
//           </Box>
//         )}

//         {/* Loading spinner */}
//         {loading ? (
//           <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
//             <CircularProgress />
//           </Box>
//         ) : (
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell align="center">No.</TableCell>
//                 <TableCell align="center">สาขา</TableCell>
//                 <TableCell align="center">วันที่เริ่มแจ้ง</TableCell>
//                 <TableCell align="center">ปัญหา</TableCell>
//                 <TableCell align="center">วิธีแก้ไข</TableCell>
//                 <TableCell align="center">เวลาที่ดำเนินการ</TableCell>
//                 <TableCell align="center">ความเร่งด่วน</TableCell>
//                 <TableCell align="center">รูปภาพ</TableCell>
//                 <TableCell align="center">สถานะ</TableCell>
//                 <TableCell align="center">สาเหตุหลัก</TableCell>
//                 <TableCell align="center">จัดการข้อมูล</TableCell>
//                 {/* <TableCell align="center">แก้ไขข้อมูล</TableCell> */}
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {cases.length > 0 ? (
//                 cases.map((caseItem, index) => (
//                   <TableRow key={caseItem.receive_case_id || index}>
//                     <TableCell align="center">{(currentPage - 1) * 5 + index + 1}</TableCell>
//                     <TableCell align="center">{caseItem.branch_name}</TableCell>
//                     <TableCell align="center">
//                       {new Date(caseItem.create_date).toLocaleDateString('th-TH', {
//                         year: 'numeric',
//                         month: '2-digit',
//                         day: '2-digit',
//                       })}
//                       -
//                       {new Date(caseItem.create_date).toLocaleTimeString('th-TH', {
//                         hour: '2-digit',
//                         minute: '2-digit',
//                         second: '2-digit',
//                       })}
//                     </TableCell>
//                     <TableCell
//                       align="center"
//                       sx={{
//                         whiteSpace: 'nowrap',
//                         maxWidth: '150px',
//                         overflow: 'hidden',
//                         textOverflow: 'ellipsis',
//                       }}
//                     >
//                       {caseItem.problem}
//                     </TableCell>
//                     <TableCell align="center">{caseItem.correct || 'N/A'}</TableCell>
//                     <TableCell align="center">
//                       {new Date(caseItem.start_date).toLocaleDateString('th-TH', {
//                         year: 'numeric',
//                         month: '2-digit',
//                         day: '2-digit',
//                       })}
//                       -
//                       {new Date(caseItem.start_date).toLocaleTimeString('th-TH', {
//                         hour: '2-digit',
//                         minute: '2-digit',
//                         second: '2-digit',
//                       })}
//                     </TableCell>
//                     <TableCell align="center">
//                       <Typography
//                         sx={{
//                           color:
//                             caseItem.level_urgent_name === 'เร่งด่วน'
//                               ? '#D32F2F'
//                               : caseItem.level_urgent_name === 'ปานกลาง'
//                                 ? '#FFA000'
//                                 : '#388E3C',
//                         }}
//                       >
//                         {caseItem.level_urgent_name}
//                       </Typography>
//                     </TableCell>
//                     <TableCell align="center">{caseItem.img_name || 'ไม่มีรูปภาพ'}</TableCell>
//                     <TableCell align="center">
//                       <Typography
//                         sx={{
//                           color:
//                             caseItem.status_name === 'กำลังดำเนินการ'
//                               ? '#FFA000'
//                               : caseItem.status_name === 'ดำเนินการเสร็จสิ้น'
//                                 ? '#388E3C'
//                                 : 'inherit',
//                         }}
//                       >
//                         {caseItem.status_name}
//                       </Typography>
//                     </TableCell>
//                     <TableCell align="center">{caseItem.main_case_name}</TableCell>
//                     <TableCell align="center">
//                       <IconButton
//                         aria-label="more"
//                         aria-controls="case-menu"
//                         aria-haspopup="true"
//                         onClick={(event) => handleClick(event, caseItem)} // ส่ง caseItem และ event
//                       >
//                         <MoreVertIcon />
//                       </IconButton>
//                       <Menu
//                         id="case-menu"
//                         anchorEl={anchorEl}
//                         open={Boolean(anchorEl)}
//                         onClose={handleClose}
//                         MenuListProps={{
//                           'aria-labelledby': 'more-button',
//                         }}
//                       >
//                         <MenuItem
//                           onClick={() => {
//                             handleClose();
//                             handleOpenModal(selectedCase); // ใช้ selectedCase
//                           }}
//                         >
//                           บันทึก Case
//                         </MenuItem>
//                         <MenuItem
//                           onClick={() => {
//                             handleClose();
//                             handleEditClick(selectedCase); // ใช้ selectedCase
//                           }}
//                         >
//                           แก้ไขรายละเอียด
//                         </MenuItem>
//                         <MenuItem
//                           onClick={() => {
//                             handleClose();
//                             handleDeleteCase(selectedCase.receive_case_id); // ใช้ selectedCase
//                           }}
//                           sx={{ color: 'red' }}
//                         >
//                           ลบ
//                         </MenuItem>
//                       </Menu>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={12} align="center">
//                     ไม่มีข้อมูล
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         )}

//         {/* Pagination */}
//         <Box display="flex" justifyContent="center" mt={3}>
//           <Pagination
//             count={totalPages}
//             page={currentPage}
//             onChange={handlePageChange}
//             color="primary"
//           />
//         </Box>
//       </Box>

//       {/* Modal for Save case */}
//       <Modal open={openModal} onClose={handleCloseModal}>
//         <Box p={3} bgcolor="background.paper" maxWidth={600} mx="auto" mt={4} borderRadius={2}>
//           <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1976d2' }}>
//             เข้าดำเนินการ
//           </Typography>

//           <Box mt={2}>
//             <TextField
//               fullWidth
//               label="หมายเลขกรณี"
//               type="text"
//               name="receive_case_id"
//               value={formData.receive_case_id} // Bind value to formData
//               disabled // Make it readonly
//             />
//           </Box>

//           <Box mt={2}>
//             <TextField
//               fullWidth
//               label="เลือกวันที่"
//               type="date"
//               InputLabelProps={{ shrink: true }}
//               name="caseDate"
//               value={formData.caseDate}
//               onChange={handleInputChange} // Handle change
//             />
//           </Box>

//           <Box mt={2}>
//             <TextField
//               fullWidth
//               label="วิธีแก้ไข"
//               multiline
//               rows={3}
//               name="correct"
//               value={formData.correct}
//               onChange={handleInputChange} // Handle change
//             />
//           </Box>

//           <Box mt={2}>
//             <Typography variant="subtitle1" fontWeight="bold">
//               เลือกพนักงาน
//             </Typography>
//             <TextField
//               fullWidth
//               placeholder="ค้นหาจากชื่อ"
//               onChange={(e) => setEmployeeName(e.target.value)}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <Box
//               mt={1}
//               maxHeight={150}
//               overflow="auto"
//               border={1}
//               borderColor="grey.300"
//               borderRadius={1}
//               padding={1}
//             >
//               <Table>
//                 <TableBody>
//                   {employees
//                     .filter((employee) =>
//                       employee.employee_name.toLowerCase().includes(employeeName.toLowerCase())
//                     )
//                     .map((employee, employeeIndex) => (
//                       <TableRow key={employeeIndex}>
//                         <TableCell>
//                           <Checkbox
//                             checked={selectedEmployees.includes(employee.employee_id)}
//                             onChange={() => {
//                               const updatedEmployees = [...selectedEmployees];
//                               if (updatedEmployees.includes(employee.employee_id)) {
//                                 updatedEmployees.splice(
//                                   updatedEmployees.indexOf(employee.employee_id),
//                                   1
//                                 );
//                               } else {
//                                 updatedEmployees.push(employee.employee_id);
//                               }
//                               setSelectedEmployees(updatedEmployees);
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell>{employee.employee_name}</TableCell>
//                       </TableRow>
//                     ))}
//                 </TableBody>
//               </Table>
//             </Box>
//           </Box>

//           <Box mt={2}>
//             <FormControl fullWidth>
//               <Select
//                 value={formData.status_id} // Bind to formData.status_id
//                 onChange={handleStatusChange} // Handle change
//                 displayEmpty
//               >
//                 <MenuItem value="" disabled>
//                   เลือกสถานะ
//                 </MenuItem>{' '}
//                 {/* Default item */}
//                 {status.map((statusItem, index) => (
//                   <MenuItem
//                     key={index}
//                     value={statusItem.status_id}
//                     sx={{
//                       color:
//                         statusItem.status_name === 'กำลังดำเนินการ'
//                           ? '#FFC107' // Yellow
//                           : statusItem.status_name === 'ดำเนินการเสร็จสิ้น'
//                             ? '#4CAF50' // Green
//                             : 'inherit', // Default color
//                       fontWeight:
//                         statusItem.status_name === 'กำลังดำเนินการ'
//                           ? 'bold'
//                           : statusItem.status_name === 'ดำเนินการเสร็จสิ้น'
//                             ? 'normal'
//                             : 'inherit', // Font weight
//                     }}
//                   >
//                     {statusItem.status_name} {/* Display the status name */}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Box>

//           <Box mt={2} display="flex" justifyContent="flex-end" gap={2} width="100%">
//             <Button
//               onClick={() => handleSave(formData)} // Save the formData
//               variant="contained"
//               color="primary"
//               sx={{ width: '150px', height: '50px' }}
//             >
//               บันทึก
//             </Button>
//             <Button
//               onClick={handleCancel}
//               color="grey"
//               sx={{
//                 backgroundColor: '#B0B0B0',
//                 color: 'white',
//                 fontWeight: 'bold',
//                 '&:hover': {
//                   backgroundColor: '#A0A0A0',
//                 },
//                 width: '150px',
//                 height: '50px',
//               }}
//             >
//               ยกเลิก
//             </Button>
//           </Box>
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default DashboardPage;
