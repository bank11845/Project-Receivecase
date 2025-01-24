// /* eslint-disable jsx-a11y/label-has-associated-control */
// import React from 'react';

// import {
//   Box,
//   Modal,
//   Button,
//   Select,
//   MenuItem,
//   TextField,
//   Typography,
//   FormControl,
// } from '@mui/material';

// const EditactionModal = ({
//   open,
//   handleClose,
//   employee,
//   status,
//   formDataUpdate,
//   handleInputChangeUpdate,
//   handleUpdeteClick,
//   handleCancel,
// }) => (
// <Modal open={open} onClose={handleClose}>
//   <Box
//     p={3}
//     bgcolor="background.paper"
//     maxWidth={600}
//     mx="auto"
//     mt={4}
//     borderRadius={2}
//     sx={{
//       bgcolor: 'background.paper',
//       boxShadow: 24,
//       borderRadius: 2,
//       maxWidth: '90vw',
//       maxHeight: '95vh',
//       width: '100%',
//       overflowY: 'auto',
//       p: 3,
//     }}
//   >
//     <Typography variant="h6" component="h2" gutterBottom>
//       แก้ไขกรณี
//     </Typography>

//     <Grid container spacing={3}>
//       <Grid item xs={12}>
//         <Box mt={2}>
//           <TextField
//             fullWidth
//             label="หมายเลขกรณี"
//             type="text"
//             name="receive_case_id"
//             value={formData.receive_case_id} // ดึงค่าจาก formData
//             disabled
//             variant="outlined"
//           />
//         </Box>
//       </Grid>

//       {/* Additional Grid content */}
//       {/* First set of fields */}
//       <Grid item xs={12} md={8}>
//         <Grid container spacing={3}>
//           {/* Main case, sub-case, urgency */}
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               label="สาเหตุหลัก"
//               variant="outlined"
//               value={formData.selectedMainCaseName || ''}
//               InputProps={{ readOnly: true }}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               label="สาเหตุย่อย"
//               variant="outlined"
//               value={combinedSubCaseNames || ''}
//               InputProps={{ readOnly: true }}
//             />
//           </Grid>

//           {/* Add the remaining fields as per the original content */}
//         </Grid>
//       </Grid>

//       {/* Employee assignment and status selection */}
//       <Grid item xs={12} md={4}>
//         <Box mt={2}>
//           <Typography variant="subtitle1" fontWeight="bold">
//             พนักงานที่เข้าดำเนินการ
//           </Typography>
//           <TextField
//             select
//             value={formDataUpdate?.saev_em || ''}
//             name="saev_em"
//             onChange={handleInputChangeUpdate}
//             variant="outlined"
//             fullWidth
//           >
//             {employee?.length > 0 ? (
//               employee.map((option) => (
//                 <MenuItem key={option.employee_id} value={option.employee_id}>
//                   {option.employee_name}
//                 </MenuItem>
//               ))
//             ) : (
//               <MenuItem disabled>ไม่มีข้อมูล</MenuItem>
//             )}
//           </TextField>
//         </Box>
//       </Grid>
//     </Grid>

//     {/* Footer buttons */}
//     <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
//       <Button
//         onClick={handleUpdeteClick}
//         variant="contained"
//         color="primary"
//         sx={{ width: '150px', height: '50px' }}
//       >
//         บันทึก
//       </Button>
//       <Button
//         onClick={handleCancel}
//         sx={{
//           backgroundColor: '#B0B0B0',
//           color: 'white',
//           fontWeight: 'bold',
//           '&:hover': { backgroundColor: '#A0A0A0' },
//           width: '150px',
//           height: '50px',
//         }}
//       >
//         ยกเลิก
//       </Button>
//     </Box>
//   </Box>
// </Modal>

// );

// export default EditactionModal;
