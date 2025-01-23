'use client';

import React, { useState } from 'react';

import { Delete, Search, MoreVert, UploadFile } from '@mui/icons-material'; // Import Search icon
import {
  Box,
  Grid,
  Card,
  Table,
  Modal,
  Select,
  Button,
  MenuItem,
  TableRow,
  Checkbox,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  CardContent,
  FormControl,
  InputAdornment,
  Select as MuiSelect,
} from '@mui/material';

const AddCasePage = () => {
  const [formData, setFormData] = useState({
    category: '',
    issueType: '',
    level: '',
    team: '',
    area: '',
    caseDate: '',
    issue: '',
    details: '',
    files: [],
  });

  const [reportData, setReportData] = useState([
    {
      id: 1,
      area: 'Zone A',
      date: '27-11-2024',
      issue: 'Not Resolved',
      status: 'Pending',
      image: 'image1.png',
      action: 'Resolve',
      solution: 'Reboot the system',
      completionDate: '30-11-2024',
      urgency: 'High',
    },
    {
      id: 2,
      area: 'Zone B',
      date: '27-11-2024',
      issue: 'Resolved',
      status: 'Completed',
      image: 'image2.png',
      action: 'Close',
      solution: 'Replace damaged part',
      completionDate: '29-11-2024',
      urgency: 'Medium',
    },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'record' or 'edit'
  const [status, setStatus] = useState('');
  const [employeeName, setEmployeeName] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFormData((prevData) => ({ ...prevData, files: [...prevData.files, ...uploadedFiles] }));
  };

  const handleFileRemove = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      files: prevData.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    console.log('Form Data Submitted:', formData);
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Data saved');
    handleCloseModal();
  };

  const handleCancel = () => {
    handleCloseModal();
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        เพิ่ม Case
      </Typography>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                value={formData.category}
                name="category"
                onChange={handleInputChange}
                displayEmpty
              >
                <MenuItem value="">Select Category</MenuItem>
                <MenuItem value="Category 1">Category 1</MenuItem>
                <MenuItem value="Category 2">Category 2</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                value={formData.issueType}
                name="issueType"
                onChange={handleInputChange}
                displayEmpty
              >
                <MenuItem value="">Select Issue Type</MenuItem>
                <MenuItem value="Issue 1">Issue 1</MenuItem>
                <MenuItem value="Issue 2">Issue 2</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                value={formData.level}
                name="level"
                onChange={handleInputChange}
                displayEmpty
              >
                <MenuItem value="">Select Level</MenuItem>
                <MenuItem value="Level 1">Level 1</MenuItem>
                <MenuItem value="Level 2">Level 2</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="caseDate"
                type="date"
                value={formData.caseDate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="team"
                placeholder="Team"
                value={formData.team}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="area"
                placeholder="Area"
                value={formData.area}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="issue"
                placeholder="Issue"
                value={formData.issue}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="details"
                placeholder="Details"
                value={formData.details}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Button variant="outlined" component="label" startIcon={<UploadFile />}>
                  Upload Files
                  <input hidden type="file" multiple onChange={handleFileUpload} />
                </Button>
                {formData.files.map((file, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={1}>
                    <Typography>{file.name}</Typography>
                    <IconButton onClick={() => handleFileRemove(index)}>
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
                <Button variant="outlined">Reset</Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Report
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>สาขา</TableCell>
              <TableCell>วันที่รับแจ้ง</TableCell>
              <TableCell>ปัญหา</TableCell>
              <TableCell>วิธีแก้ไข</TableCell>
              <TableCell>วันที่ดำเนินการสำเร็จ</TableCell>
              <TableCell>ความเร่งด่วน</TableCell>
              <TableCell>รูปภาพ</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell>บันทึกข้อมูล</TableCell>
              <TableCell>แก้ไขข้อมูล</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.area}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.issue}</TableCell>
                <TableCell>{row.solution}</TableCell>
                <TableCell>{row.completionDate}</TableCell>
                <TableCell>{row.urgency}</TableCell>
                <TableCell>
                  <img
                    src={`/path/to/images/${row.image}`}
                    alt="Preview"
                    style={{ width: 50, height: 50 }}
                  />
                </TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenModal('record')}>
                    <MoreVert />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenModal('edit')}>
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Modal for Record Data */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box p={3} bgcolor="background.paper" maxWidth={600} mx="auto" mt={4} borderRadius={2}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            เข้าดำเนินการ
          </Typography>
          <Box mt={2}>
            <TextField  
              fullWidth
              label="เลือกวันที่"
              type="date"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setFormData({ ...formData, caseDate: e.target.value })}
            />
          </Box>
          <Box mt={2}>
            <TextField
              fullWidth
              label="วิธีแก้ไข"
              multiline
              rows={3}
              onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
            />
          </Box>
          <Box mt={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              ค้นหาพนักงานเพื่อเข้าดำเนินงาน
            </Typography>
            <TextField
              fullWidth
              placeholder="ค้นหาจากชื่อ"
              onChange={(e) => setEmployeeName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

            <TableHead>
              <TableRow>
                <TableCell>เลือก.</TableCell>
                <TableCell>พนักงาน</TableCell>
              </TableRow>
            </TableHead>
            <Box
              mt={1}
              maxHeight={150}
              overflow="auto"
              border={1}
              borderColor="grey.300"
              borderRadius={1}
            >
              {['นายทดสอบ ทดสอบ', 'นายทดสอบ ทดสอบ', 'นายทดสอบ ทดสอบ'].map((name, index) => (
                <Box key={index} display="flex" alignItems="center" px={2} py={1}>
                  <Checkbox />
                  <Typography>{name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Box mt={2}>
            <FormControl fullWidth>
              <MuiSelect value={status} onChange={(e) => setStatus(e.target.value)} displayEmpty>
                <MenuItem value="">สถานะ</MenuItem>
                <MenuItem value="In Progress">กำลังดำเนินการ</MenuItem>
                <MenuItem value="Completed">เสร็จสิ้น</MenuItem>
              </MuiSelect>
            </FormControl>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" onClick={handleSave}>
              บันทึก
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              ยกเลิก
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AddCasePage;
