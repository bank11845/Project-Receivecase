import React, { useState, useEffect } from 'react';

import { DataGrid } from '@mui/x-data-grid';

import mockupData from './mockupData.json';

const CaseTable = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // โหลดข้อมูลจาก mockupData
    const formattedData = mockupData.map((item, index) => ({
      id: index,
      main_case_id: item.main_case_id,
      sub_case_name: item.sub_case_name.join(', '),
      urgent_level_name: item.urgent_level_name,
      employee_name: item.employee_name,
      team_name: item.team_name,
      create_date: item.create_date,
      problem: item.problem,
      details: item.details,
      branch_name: item.branch_name,
    }));
    setRows(formattedData);
  }, []);

  const columns = [
    { field: 'main_case_id', headerName: 'สาเหตุหลัก', width: 150 },
    { field: 'sub_case_name', headerName: 'สาเหตุย่อย', width: 200 },
    { field: 'urgent_level_name', headerName: 'ระดับความเร่งด่วน', width: 150 },
    { field: 'employee_name', headerName: 'คนแจ้ง', width: 150 },
    { field: 'team_name', headerName: 'ทีม', width: 150 },
    { field: 'create_date', headerName: 'วันที่รับ Case', width: 150 },
    { field: 'problem', headerName: 'ปัญหา', width: 200 },
    { field: 'details', headerName: 'รายละเอียด', width: 300 },
    { field: 'branch_name', headerName: 'สาขา', width: 150 },
  ];

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
      />
    </div>
  );
};

export default CaseTable;
