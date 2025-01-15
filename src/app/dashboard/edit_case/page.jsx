/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
/* eslint-disable prefer-template */
/* eslint-disable no-undef */

'use client';

import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Grid,
  Card,
  Select,
  Button,
  Checkbox,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  CardContent,
  ListItemText,
} from '@mui/material';

const EditCasePage = () => {
  const [selectedSubCases, setSelectedSubCases] = useState([]);
  const [mainCases, setMainCases] = useState([]);
  const [urgentLevels, setUrgentLevels] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [branches, setBranches] = useState([]);
  const { receiveCaseId } = useParams(); // ดึง receiveCaseId จาก URL
  const [subCases, setSubCases] = useState([]); // กำหนด state สำหรับ subCases

  const { caseId } = useParams(); // ใช้ caseId จาก URL
  const [formData, setFormData] = useState({
    create_date: '',
    branch_id: null,
    sub_case_id: [],
    urgent_level_id: null,
    employee_id: null,
    team_id: null,
    main_case_id: null,
    problem: '',
    details: '',
    status_id: 1,
    img_id: 0,
    saev_em: '',
    correct: '',
    start_date: null,
    end_date: null,
    files: [],
  });

  const fetchDataForEdit = async (caseId) => {
    if (!caseId) {
      console.error('Invalid caseId: ', caseId);
      return; // ไม่ทำการเรียก API หาก caseId เป็น undefined
    }

    try {
      const response = await fetch(`/receive-case/${caseId}`);
      const data = await response.json();

      if (response.ok) {
        // ตั้งค่า formData จากข้อมูลที่ได้รับ
        setFormData({
          create_date: data.create_date || new Date().toISOString(),
          branch_id: data.branch_id || null,
          sub_case_id: data.sub_case_id || [],
          urgent_level_id: data.urgent_level_id || null,
          employee_id: data.employee_id || null,
          team_id: data.team_id || null,
          main_case_id: data.main_case_id || null,
          problem: data.problem || '',
          details: data.details || '',
          status_id: data.status_id || 1,
          img_id: data.img_id || 0,
          saev_em: data.saev_em || '',
          correct: data.correct || '',
          start_date: data.start_date || null,
          end_date: data.end_date || null,
          files: data.files || [],
        });
      } else {
        console.error('ไม่สามารถดึงข้อมูลได้:', data.error);
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
    }
  };

  useEffect(() => {
    if (caseId) {
      fetchDataForEdit(caseId);
    } else {
      console.error('Case ID is undefined or invalid');
    }
  }, [caseId]);

  const fetchSubCases = async () => {
    try {
      const response = await fetch('/api/sub-cases'); // เปลี่ยนเป็น URL ที่ถูกต้องสำหรับการดึงข้อมูล
      const data = await response.json();

      if (response.ok) {
        setSubCases(data); // กำหนดค่าให้ subCases ด้วยข้อมูลที่ได้จาก API
      } else {
        console.error('ไม่สามารถดึงข้อมูลสาเหตุย่อยได้:', data.error);
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสาเหตุย่อย:', error);
    }
  };

  // เรียกใช้งานฟังก์ชันเมื่อ component โหลด
  useEffect(() => {
    fetchSubCases(); // เรียกฟังก์ชันเพื่อดึงข้อมูล subCases
  }, []); // ทำการดึงข้อมูลครั้งเดียวเมื่อ component ถูกโหลด

  // ฟังก์ชันการส่งข้อมูลเพื่ออัพเดตกรณี
  const handleUpdate = async () => {
    try {
      const response = await fetch(`/receive-case/${receiveCaseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', // กำหนด ngrok header
        },

        'ngrok-skip-browser-warning': 'true', // กำหนด ngrok header

        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Case updated successfully!');
      } else {
        alert('Failed to update case: ' + result.error);
      }
    } catch (error) {
      console.error('Failed to update case:', error);
    }
  };

  const handleSubCaseChange = (event) => {
    setSelectedSubCases(event.target.value); // อัพเดต selectedSubCases
  };
  const handleSave = async () => {
    const dataToSend = {
      ...formData,
      sub_case_id: selectedSubCases, // ใช้ selectedSubCases แทน
      files, // ถ้ามีการจัดการไฟล์เพิ่มเติม
    };

    console.log('Data being sent:', dataToSend); // Log the data sent to the server

    try {
      const response = await fetch('http://localhost:3000/edit-case', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', // กำหนด ngrok header
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.text(); // ใช้ text() เพื่ออ่านผลลัพธ์เป็น plain text

      try {
        const jsonResult = JSON.parse(result); // พยายามแปลงเป็น JSON
        console.log('Server Response:', jsonResult);

        if (jsonResult.success) {
          alert('บันทึกข้อมูลสำเร็จ');
        } else {
          alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
      } catch (jsonError) {
        console.error('ไม่สามารถแปลงเป็น JSON:', result);
        alert('เกิดข้อผิดพลาดในการตอบกลับจากเซิร์ฟเวอร์');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    }
  };

  const handleSubmit = async () => {
    const dataToSend = {
      ...formData,
      main_case_id: formData.main_case_id, // ใช้ main_case_id ที่ถูกเลือกในฟอร์ม
      sub_case_id: selectedSubCases, // ใช้ selectedSubCases แทน
      team_id: formData.team_id,
      employee_id: formData.employee_id,
      branch_id: formData.branch_id,
      files: formData.files, // ไฟล์ที่อัพโหลด
    };

    console.log('Data being sent:', dataToSend); // Log the data sent to the server

    try {
      const response = await fetch('http://localhost:3000/edit-case', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', // กำหนด ngrok header
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.text(); // ใช้ text() เพื่ออ่านผลลัพธ์เป็น plain text

      try {
        const jsonResult = JSON.parse(result); // พยายามแปลงเป็น JSON
        console.log('Server Response:', jsonResult);

        if (jsonResult.success) {
          alert('บันทึกข้อมูลสำเร็จ');
          // อาจจะรีเฟรชฟอร์มหรือเคลียร์ฟอร์มหลังการบันทึกสำเร็จ
        } else {
          alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
      } catch (jsonError) {
        console.error('ไม่สามารถแปลงเป็น JSON:', result);
        alert('เกิดข้อผิดพลาดในการตอบกลับจากเซิร์ฟเวอร์');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        แก้ไขข้อมูล Case
      </Typography>

      <Card style={{ maxWidth: 2000, margin: 'auto', padding: 20 }}>
        <CardContent>
          <Grid container spacing={3}>
            {/* Section 1 */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>สาเหตุย่อย</InputLabel>
                    <Select
                      multiple
                      value={selectedSubCases} // ใช้ selectedSubCases ที่เก็บค่าของ sub_case_id
                      label="สาเหตุย่อย"
                      onChange={handleSubCaseChange} // ฟังก์ชันที่อัพเดต selectedSubCases
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {subCases.map((subCase) => (
                        <MenuItem key={subCase.sub_case_id} value={subCase.sub_case_id}>
                          <Checkbox checked={selectedSubCases.indexOf(subCase.sub_case_id) > -1} />
                          <ListItemText primary={subCase.sub_case_name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>สาเหตุย่อย</InputLabel>
                    <Select
                      multiple
                      value={formData.sub_case_id} // ใช้ค่า sub_case_id จาก formData
                      label="สาเหตุย่อย"
                      onChange={(e) => setFormData({ ...formData, sub_case_id: e.target.value })}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {subCases.map((subCase) => (
                        <MenuItem key={subCase.sub_case_id} value={subCase.sub_case_id}>
                          <Checkbox
                            checked={formData.sub_case_id.indexOf(subCase.sub_case_id) > -1}
                          />
                          <ListItemText primary={subCase.sub_case_name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="ความเร่งด่วน"
                    variant="outlined"
                    value={formData.urgent_level_id}
                    onChange={(e) => setFormData({ ...formData, urgent_level_id: e.target.value })}
                  >
                    {urgentLevels.map((level) => (
                      <MenuItem key={level.level_urgent_id} value={level.level_urgent_id}>
                        {level.level_urgent_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="ชื่อผู้แจ้ง"
                    variant="outlined"
                    value={formData.employee_id}
                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                  >
                    {employees.map((employee) => (
                      <MenuItem key={employee.employee_id} value={employee.employee_id}>
                        {employee.employee_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="ทีม"
                    variant="outlined"
                    value={formData.team_id}
                    onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                  >
                    {teams.map((team) => (
                      <MenuItem key={team.team_id} value={team.team_id}>
                        {team.team_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="วันที่รับ Case"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    value={formData.create_date}
                    onChange={(e) => setFormData({ ...formData, create_date: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="ปัญหา"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="รายละเอียด"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Section 2 */}
            <Grid item xs={12} md={4}>
              <Grid container spacing={3} direction="column">
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="สาขา"
                    variant="outlined"
                    value={formData.branch_id}
                    onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
                  >
                    {branches.map((branch) => (
                      <MenuItem key={branch.branch_id} value={branch.branch_id}>
                        {branch.branch_name} {branch.branch_short}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    border="1px dashed grey"
                    borderRadius={2}
                    p={3}
                  >
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Select files
                    </Typography>
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      id="upload-file-input"
                      multiple
                    />
                    <label htmlFor="upload-file-input">
                      <Button variant="contained" component="span">
                        Upload Files
                      </Button>
                    </label>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Submit Buttons */}
          <Box mt={4} display="flex" justifyContent="flex-end" gap={3}>
            <Button variant="contained" color="primary" size="large" onClick={handleUpdate}>
              บันทึก
            </Button>
            <Button variant="outlined" color="secondary" size="large">
              ยกเลิก
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditCasePage;
