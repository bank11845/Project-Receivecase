// import React, { useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import { endpoints } from './utils/axios'; // นำเข้า endpoints จากไฟล์ที่กำหนด baseURL

// const A = () => {
//   const [formData, setFormData] = useState({
//     branch_name: '',
//     sub_case_name: '',
//     level_urgent_name: '',
//     employee_name: '',
//     team_name: '',
//     start_date: '',
//     problem: '',
//     details: '',
//   });

//   // ฟังก์ชันการเปลี่ยนแปลงค่าในฟอร์ม
//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // ฟังก์ชัน handleSubmit สำหรับบันทึกข้อมูล
//   const handleSubmit = async () => {
//     try {
//       // เตรียมข้อมูลสำหรับส่งไปที่ backend
//       const data = {
//         branch_name: formData.branch_name,
//         sub_case_name: formData.sub_case_name,
//         level_urgent_name: formData.level_urgent_name,
//         employee_name: formData.employee_name,
//         team_name: formData.team_name,
//         start_date: new Date(formData.start_date).toISOString(), // แปลงเป็น ISO string
//         problem: formData.problem,
//         details: formData.details,
//       };

//       // ส่งข้อมูลไปยัง API โดยใช้ URL จาก endpoints
//       const response = await axios.post(endpoints.receive_casePost, data);

//       if (response.status === 200) {
//         // แสดงข้อความสำเร็จ
//         Swal.fire({
//           title: 'สำเร็จ',
//           text: 'บันทึกข้อมูลสำเร็จ',
//           icon: 'success',
//           confirmButtonText: 'ตกลง',
//         });
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       // แสดงข้อความผิดพลาด
//       Swal.fire({
//         title: 'ข้อผิดพลาด',
//         text: 'ไม่สามารถบันทึกข้อมูลได้',
//         icon: 'error',
//         confirmButtonText: 'ตกลง',
//       });
//     }
//   };

//   return (
//     <div>
//       <form>
//         {/* ฟอร์มสำหรับกรอกข้อมูล */}
//         <input
//           type="text"
//           name="branch_name"
//           value={formData.branch_name}
//           onChange={handleChange}
//           placeholder="สาขา"
//         />
//         <input
//           type="text"
//           name="sub_case_name"
//           value={formData.sub_case_name}
//           onChange={handleChange}
//           placeholder="ชื่อกรณีย่อย"
//         />
//         <input
//           type="text"
//           name="level_urgent_name"
//           value={formData.level_urgent_name}
//           onChange={handleChange}
//           placeholder="ระดับความเร่งด่วน"
//         />
//         <input
//           type="text"
//           name="employee_name"
//           value={formData.employee_name}
//           onChange={handleChange}
//           placeholder="ชื่อพนักงาน"
//         />
//         <input
//           type="text"
//           name="team_name"
//           value={formData.team_name}
//           onChange={handleChange}
//           placeholder="ทีม"
//         />
//         <input
//           type="datetime-local"
//           name="start_date"
//           value={formData.start_date}
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           name="problem"
//           value={formData.problem}
//           onChange={handleChange}
//           placeholder="ปัญหา"
//         />
//         <textarea
//           name="details"
//           value={formData.details}
//           onChange={handleChange}
//           placeholder="รายละเอียด"
//         />
//       </form>

//       {/* ปุ่มบันทึกข้อมูล */}
//       <button type="button" onClick={handleSubmit}>
//         บันทึก
//       </button>
//     </div>
//   );
// };

// export default MyComponent;
