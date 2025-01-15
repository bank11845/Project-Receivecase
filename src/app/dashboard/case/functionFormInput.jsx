// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-shadow */
// import React, { useState, useEffect } from 'react';

// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import {
//   Box,
//   Table,
//   Modal,
//   Select,
//   Button,
//   TableRow,
//   MenuItem,
//   TableHead,
//   TableCell,
//   TableBody,
//   TextField,
//   Typography,
//   IconButton,
//   Pagination,
//   FormControl,
//   CircularProgress,
// } from '@mui/material';

// const MyTable = () => {
//   const [cases, setCases] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [openModal, setOpenModal] = useState(false);
//   const [formData, setFormData] = useState({});

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const url = `http://localhost:3000/receivecase?page=${currentPage}`;
//       console.log(`Fetching data from: ${url}`);

//       const response = await fetch(url);

//       if (!response.ok) {
//         const errorMessage = `Failed to fetch data: ${response.status} ${response.statusText}`;
//         setError(errorMessage);
//         console.error(errorMessage);
//         return;
//       }

//       const data = await response.json();
//       console.log('Data received:', data);

//       if (
//         data?.body?.cases &&
//         Array.isArray(data.body.cases) &&
//         typeof data.body.totalPages === 'number'
//       ) {
//         setCases(data.body.cases);
//         setTotalPages(data.body.totalPages);
//       } else {
//         const structureError = 'Invalid data structure: Missing cases or totalPages';
//         setError(structureError);
//         console.error(structureError, data);
//       }
//     } catch (error) {
//       const fetchError = `Error during fetch: ${error.message}`;
//       setError(fetchError);
//       console.error(fetchError);
//     } finally {
//       setLoading(false);
//       console.log('Loading complete');
//     }
//   };

//   const [statusList, setStatusList] = useState([]);

//   useEffect(() => {
//     const fetchStatusList = async () => {
//       try {
//         const response = await fetch(`${baseURL}/status`);
//         const data = await response.json();
//         setStatusList(data);
//       } catch (error) {
//         console.error('Error fetching status list:', error);
//       }
//     };

//     fetchStatusList();
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [currentPage]);

//   useEffect(() => {
//     fetchData();
//   }, [currentPage]);

//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };

//   const handleOpenModal = (caseItem) => {
//     if (!caseItem || typeof caseItem !== 'object') {
//       console.error('Invalid caseItem provided:', caseItem);
//       return;
//     }

//     setFormData(caseItem);

//     console.log('Opening modal with caseItem:', caseItem);

//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleStatusChange = (e) => {
//     setFormData((prev) => ({ ...prev, status_id: e.target.value }));
//   };

//   const handleSave = () => {
//     // Save logic goes here
//     setOpenModal(false);
//   };

//   const handleCancel = () => {
//     setOpenModal(false);
//   };

//   return (
//     <Box>
//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>No.</TableCell>
//               <TableCell>สาขา</TableCell>
//               <TableCell>วันที่เริ่มแจ้ง</TableCell>
//               <TableCell>ปัญหา</TableCell>
//               <TableCell>วิธีแก้ไข</TableCell>
//               <TableCell>เวลาที่ดำเนินการ</TableCell>
//               <TableCell>ความเร่งด่วน</TableCell>
//               <TableCell>รูปภาพ</TableCell>
//               <TableCell>สถานะ</TableCell>
//               <TableCell>บันทึกข้อมูล</TableCell>
//               <TableCell>แก้ไขข้อมูล</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {Array.isArray(cases) && cases.length > 0 ? (
//               cases.map((caseItem, index) => (
//                 <TableRow
//                   key={caseItem.receive_case_id || index}
//                   onClick={() => handleOpenModal(caseItem)}
//                 >
//                   <TableCell>{(currentPage - 1) * 5 + index + 1}</TableCell>

//                   <TableCell>{caseItem.branch_name || 'No branch name available'}</TableCell>
//                   <TableCell>{new Date(caseItem.create_date).toLocaleString()}</TableCell>
//                   <TableCell>{caseItem.problem}</TableCell>
//                   <TableCell>{caseItem.correct}</TableCell>
//                   <TableCell>{new Date(caseItem.start_date).toLocaleString()}</TableCell>
//                   <TableCell>{caseItem.level_urgent_name}</TableCell>
//                   <TableCell>{caseItem.img_name}</TableCell>
//                   <TableCell>{caseItem.status_name}</TableCell>
//                   <TableCell>
//                     <IconButton onClick={() => handleOpenModal(caseItem)}>
//                       <MoreVertIcon />
//                     </IconButton>
//                   </TableCell>
//                   <TableCell>
//                     <IconButton onClick={handleSave}>
//                       <MoreVertIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={12} align="center">
//                   ไม่มีข้อมูล
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       )}

//       <Box display="flex" justifyContent="center" mt={3}>
//         <Pagination
//           count={totalPages}
//           page={currentPage}
//           onChange={handlePageChange}
//           color="primary"
//         />
//       </Box>

//       <Modal open={openModal} onClose={handleCloseModal}>
//         <Box p={3} bgcolor="background.paper" maxWidth={600} mx="auto" mt={4} borderRadius={2}>
//           <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1976d2' }}>
//             แก้ไขกรณี
//           </Typography>
//           <Box mt={2}>
//             <TextField
//               fullWidth
//               label="หมายเลขกรณี"
//               type="text"
//               name="receive_case_id"
//               value={formData.receive_case_id}
//               disabled
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
//               onChange={handleInputChange}
//             />
//           </Box>
//           <Box mt={2}>
//             <TextField
//               fullWidth
//               label="วิธีแก้ไข"
//               multiline
//               rows={3}
//               name="problem"
//               value={formData.problem}
//               onChange={handleInputChange}
//             />
//           </Box>
//           <Box mt={2}>
//             <FormControl fullWidth>
//               <Select value={formData.status_id || ''} onChange={handleStatusChange} displayEmpty>
//                 <MenuItem value="" disabled>
//                   เลือกสถานะ
//                 </MenuItem>
//                 {statusList.map((status) => (
//                   <MenuItem key={status.status_id} value={status.status_id}>
//                     {status.status_name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Box>
//           <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
//             <Button onClick={handleSave} variant="contained" color="primary">
//               บันทึก
//             </Button>
//             <Button onClick={handleCancel} color="grey">
//               ยกเลิก
//             </Button>
//           </Box>
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default MyTable;
