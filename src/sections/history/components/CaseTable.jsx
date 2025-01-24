import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { formatDateTime } from '../../../utils/dateUtils';

export default function CaseTable({ cases, totalPages, setCurrentPage }) {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:3000/employee');
        const data = await response.json();
        console.log('Employee data:', data);
  
        // ตรวจสอบและเข้าถึงข้อมูลใน body
        if (data?.body && Array.isArray(data.body)) {
          setEmployees(data.body);
        } else {
          console.error('Unexpected employee data format:', data);
          setEmployees([]);
        }
  
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
  
    fetchEmployees();
  }, []);
  
  

  const columns = [
    { field: 'receive_case_id', headerName: 'ไอดีเคส', width: 90 },
    { field: 'branch_name', headerName: 'สาขา', width: 150 },
    { field: 'create_date', headerName: 'วันที่รับแจ้ง', width: 200, renderCell: (params) => formatDateTime(params.row?.create_date) },
    { field: 'start_date', headerName: 'วันที่ดำเนินการ', width: 200, renderCell: (params) => formatDateTime(params.row?.start_date) },
    { field: 'end_date', headerName: 'วันที่ดำเนินการสำเร็จ', width: 200, renderCell: (params) => formatDateTime(params.row?.end_date) },
    {
      field: 'duration',
      headerName: 'ระยะเวลาดำเนินการ',
      width: 250,
      renderCell: (params) => {
        const startDate = params.row?.start_date ? new Date(params.row.start_date) : null;
        const endDate = params.row?.end_date ? new Date(params.row.end_date) : null;

        if (!startDate || !endDate) {
          return 'ไม่ระบุ';
        }

        const timeDiff = endDate - startDate;
        if (timeDiff < 0) {
          return 'ข้อมูลผิดพลาด';
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        return `${days} วัน ${hours} ชม. ${minutes} นาที`;
      }
    },
    { field: 'status_name', headerName: 'สถานะ', width: 150 },
    { field: 'level_urgent_name', headerName: 'ความเร่งด่วน', width: 150 },
    { field: 'problem', headerName: 'ปัญหา', width: 150 },
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
        const employee = employees.find(emp => Number(emp.employee_id) === empId);
    
        console.log('Matched employee:', employee);
    
        return employee ? employee.employee_name : 'Unknown';
      }
    }
    
    
    ,
    { field: 'correct', headerName: 'แนวทางแก้ไข', width: 200 },
    { field: 'main_case_name', headerName: 'ประเภทปัญหา', width: 180 },
    { field: 'team_name', headerName: 'ทีมที่รับผิดชอบ', width: 180 },
    { field: 'employee_name', headerName: 'พนักงานที่รับผิดชอบ', width: 200 },
  ];

  return (
    <DataGrid
      rows={cases}
      columns={columns}
      pageSize={10}
      paginationMode="server"
      rowCount={totalPages * 10}
      getRowId={(row) => row.receive_case_id}
      onPageChange={(params) => setCurrentPage(params.page + 1)}
    />
  );
}
