// // AddCaseForm.jsx
// 'use client';

// import { Box, Grid, Card, Button, Typography } from '@mui/material';
// import FormInput from './functionFormInput';
// import FileUpload from './functionFileUpload';

// export default function AddCaseForm() {
//   const [formData, setFormData] = useState({
//     category: '',
//     issueType: '',
//     level: '',
//     team: '',
//     area: '',
//     caseDate: '',
//     issue: '',
//     details: '',
//     files: [],
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleSubmit = () => {
//     console.log('Form Data Submitted:', formData);
//   };

//   return (
//     <Box p={3}>
//       <Typography variant="h4" gutterBottom>
//         เพิ่ม Case
//       </Typography>

//       <Card>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <FormInput
//               label="เลือกหมวดหมู่"
//               name="category"
//               value={formData.category}
//               onChange={handleInputChange}
//               options={['หมวดหมู่ 1', 'หมวดหมู่ 2']}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormInput
//               label="เลือกประเภทปัญหา"
//               name="issueType"
//               value={formData.issueType}
//               onChange={handleInputChange}
//               options={['ปัญหา 1', 'ปัญหา 2']}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormInput
//               label="เลือกระดับความรุนแรง"
//               name="level"
//               value={formData.level}
//               onChange={handleInputChange}
//               options={['ระดับ 1', 'ระดับ 2']}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormInput
//               label="เลือกวันที่กรณี"
//               name="caseDate"
//               type="date"
//               value={formData.caseDate}
//               onChange={handleInputChange}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <FileUpload
//               files={formData.files}
//               onFileUpload={(e) => handleFileUpload(e)}
//               onFileRemove={(index) => handleFileRemove(index)}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <Button variant="contained" color="primary" onClick={handleSubmit}>
//               บันทึก
//             </Button>
//           </Grid>
//         </Grid>
//       </Card>
//     </Box>
//   );
// }

// 'use client';

// import React, { useState } from 'react';

// import {
//   Box,
//   Grid,
//   Card,
//   Table,
//   Button,
//   Select,
//   MenuItem,
//   TableRow,
//   TextField,
//   TableHead,
//   TableCell,
//   TableBody,
//   Typography,
//   CardContent,
// } from '@mui/material';

// export default function AddCase() {
//   const [formData, setFormData] = useState({
//     category: '',
//     issueType: '',
//     level: '',
//     team: '',
//     area: '',
//     caseDate: '',
//     issue: '',
//     details: '',
//     files: [],
//   });

//   const [reportData, setReportData] = useState([
//     {
//       id: 1,
//       area: 'Zone A',
//       date: '27-11-2024',
//       issue: 'Not Resolved',
//       status: 'Pending',
//       image: 'image1.png',
//       action: 'Resolve',
//       solution: 'Reboot the system',
//       completionDate: '30-11-2024',
//       urgency: 'High',
//     },
//     {
//       id: 2,
//       area: 'Zone B',
//       date: '27-11-2024',
//       issue: 'Resolved',
//       status: 'Completed',
//       image: 'image2.png',
//       action: 'Close',
//       solution: 'Replace damaged part',
//       completionDate: '29-11-2024',
//       urgency: 'Medium',
//     },
//   ]);

//   const [openModal, setOpenModal] = useState(false);
//   const [modalType, setModalType] = useState('');
//   const [status, setStatus] = useState('');
//   const [employeeName, setEmployeeName] = useState('');

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleFileUpload = (e) => {
//     const uploadedFiles = Array.from(e.target.files);
//     setFormData((prevData) => ({ ...prevData, files: [...prevData.files, ...uploadedFiles] }));
//   };

//   const handleFileRemove = (index) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       files: prevData.files.filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = () => {
//     console.log('Form Data Submitted:', formData);
//   };

//   const handleOpenModal = (type) => {
//     setModalType(type);
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//   };

//   const handleSave = () => {
//     console.log('Data saved');
//     handleCloseModal();
//   };

//   const handleCancel = () => {
//     handleCloseModal();
//   };

//   return (
//     <Box p={3}>
//       <Typography variant="h4" gutterBottom>
//         เพิ่ม Case
//       </Typography>

//       <Card>
//         <CardContent>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <Select
//                 fullWidth
//                 value={formData.category}
//                 name="category"
//                 onChange={handleInputChange}
//                 displayEmpty
//               >
//                 <MenuItem value="">เลือกหมวดหมู่</MenuItem>
//                 <MenuItem value="Category 1">หมวดหมู่ 1</MenuItem>
//                 <MenuItem value="Category 2">หมวดหมู่ 2</MenuItem>
//               </Select>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Select
//                 fullWidth
//                 value={formData.issueType}
//                 name="issueType"
//                 onChange={handleInputChange}
//                 displayEmpty
//               >
//                 <MenuItem value="">เลือกประเภทปัญหา</MenuItem>
//                 <MenuItem value="Issue 1">ปัญหา 1</MenuItem>
//                 <MenuItem value="Issue 2">ปัญหา 2</MenuItem>
//               </Select>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Select
//                 fullWidth
//                 value={formData.level}
//                 name="level"
//                 onChange={handleInputChange}
//                 displayEmpty
//               >
//                 <MenuItem value="">เลือกระดับความรุนแรง</MenuItem>
//                 <MenuItem value="Level 1">ระดับ 1</MenuItem>
//                 <MenuItem value="Level 2">ระดับ 2</MenuItem>
//               </Select>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 name="caseDate"
//                 type="date"
//                 value={formData.caseDate}
//                 onChange={handleInputChange}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Button variant="contained" color="primary" onClick={handleSubmit}>
//                 บันทึก
//               </Button>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>

//       <Box mt={4}>
//         <Typography variant="h5" gutterBottom>
//           Report
//         </Typography>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>No.</TableCell>
//               <TableCell>สาขา</TableCell>
//               <TableCell>วันที่รับแจ้ง</TableCell>
//               <TableCell>ปัญหา</TableCell>
//               <TableCell>สถานะ</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {reportData.map((row) => (
//               <TableRow key={row.id}>
//                 <TableCell>{row.id}</TableCell>
//                 <TableCell>{row.area}</TableCell>
//                 <TableCell>{row.date}</TableCell>
//                 <TableCell>{row.issue}</TableCell>
//                 <TableCell>{row.status}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Box>
//     </Box>
//   );
// }
