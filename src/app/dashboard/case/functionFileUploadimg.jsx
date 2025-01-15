// import React, { useState } from 'react';
// import axios from 'axios';

// const UploadImage = () => {
//   const [imgName, setImgName] = useState('');
//   const [imgFile, setImgFile] = useState(null);
//   const [responseMessage, setResponseMessage] = useState('');

//   const handleFileChange = (e) => {
//     setImgFile(e.target.files[0]);
//   };

//   const handleNameChange = (e) => {
//     setImgName(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!imgName || !imgFile) {
//       setResponseMessage('กรุณาระบุชื่อรูปภาพและเลือกไฟล์รูปภาพ');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('img_name', imgName);
//     formData.append('img', imgFile);

//     try {
//       const response = await axios.post('/api/upload-image', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.data.success) {
//         setResponseMessage(response.data.message);
//       } else {
//         setResponseMessage(response.data.error || 'เกิดข้อผิดพลาดในการอัปโหลด');
//       }
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       setResponseMessage('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
//     }
//   };

//   return (
//     <div>
//       <h2>อัปโหลดรูปภาพ</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="img_name">ชื่อรูปภาพ:</label>
//           <input type="text" id="img_name" value={imgName} onChange={handleNameChange} required />
//         </div>
//         <div>
//           <label htmlFor="img">เลือกไฟล์รูปภาพ:</label>
//           <input type="file" id="img" accept="image/*" onChange={handleFileChange} required />
//         </div>
//         <button type="submit">อัปโหลด</button>
//       </form>
//       {responseMessage && <p>{responseMessage}</p>}
//     </div>
//   );
// };

// export default UploadImage;
