import { saveAs } from 'file-saver'; // นำเข้า saveAs
import XLSX from 'xlsx'; // นำเข้า XLSX

const formatDateTime = (date) => {
  if (!date) return 'ไม่ระบุ';
  const newDate = new Date(date);
  return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
};

export const exportToExcel = async (apiService, names, setLoading) => {
  try {
    setLoading(true);

    // ดึงข้อมูลหน้าแรกเพื่อคำนวณจำนวนหน้า
    const firstResponse = await apiService.get('/receive-case', { params: { page: 1, limit: 10 } });
    console.log(firstResponse); // ดูข้อมูลจาก API

    const pageCount = firstResponse.data.totalPages || 1;
    const pageRequests = [];
    // สร้างคำขอสำหรับดึงข้อมูลทั้งหมดตามจำนวนหน้า
    for (let page = 1; page <= pageCount; page) {
      pageRequests.push(apiService.get('/receive-case', { params: { page, limit: 10 } }));
    }

    // รอผลการดึงข้อมูลทั้งหมด
    const responses = await Promise.all(pageRequests);
    const allCases = responses.flatMap(response => response.data.cases || []);
    console.log(allCases);  // ดูข้อมูลของกรณีที่ได้รับจาก API

    if (allCases.length === 0) {
      alert("ไม่มีข้อมูลให้ส่งออก");
      return;
    }

    // แปลงข้อมูลให้เป็นรูปแบบที่สามารถนำไปใช้สร้าง Excel
    const excelData = allCases.map((row) => ({
      'No.': row.receive_case_id,
      'สาขา': row.branch_name,
      'วันที่รับแจ้ง': formatDateTime(row.create_date),
      'วันที่ดำเนินการ': formatDateTime(row.start_date),
      'วันที่ดำเนินการสำเร็จ': formatDateTime(row.end_date),
      'สถานะ': row.status_name,
      'ความเร่งด่วน': row.level_urgent_name,
      'ปัญหา': row.problem,
      'พนักงานเข้าดำเนินการ': names[Number(row.saev_em)] || 'Unknown',
      'แนวทางแก้ไข': row.correct,
      'ประเภทปัญหา': row.main_case_name,
      'ทีมที่รับผิดชอบ': row.team_name,
      'พนักงานที่รับผิดชอบ': row.employee_name,
      'ระยะเวลาดำเนินการ': row.start_date && row.end_date 
        ? `${Math.floor((new Date(row.end_date) - new Date(row.start_date)) / (1000 * 60 * 60 * 24))} วัน`
        : 'ไม่ระบุ',
    }));

    // สร้างแผ่นงานและไฟล์ Excel
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Receive Case History');

    // สร้าง buffer สำหรับไฟล์ Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles: true });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    
    // ดาวน์โหลดไฟล์ Excel
    saveAs(data, 'receive_case_history.xlsx');
  } catch (error) {
    console.error('Error exporting data:', error);
    alert(`เกิดข้อผิดพลาดในการส่งออกข้อมูล: ${error.message}`);

  } finally {
    setLoading(false);
  }
};
