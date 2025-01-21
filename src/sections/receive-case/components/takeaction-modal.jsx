/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import {
  Box,
  Modal,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  FormControl,
} from '@mui/material';

const TakeacitonModal = ({
  open,
  handleClose,
  employee,
  status,
  formData,
  handleInputChange,
  handleStatusChange,
  handleSaveClick,
  handleCancel,
}) => (
  <Modal open={open} onClose={handleClose}>
    <Box
      p={3}
      bgcolor="background.paper"
      maxWidth={600}
      mx="auto"
      mt={4}
      borderRadius={2}
    >
      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1976d2' }}>
        เข้าดำเนินการ
      </Typography>

      <Box mt={2}>
        <TextField
          fullWidth
          label="หมายเลขกรณี"
          type="text"
          name="receive_case_id"
          value={formData?.receive_case_id || ''} // Bind value to formData
          disabled // Make it readonly
        />
      </Box>

      <Box mt={2}>
        <TextField
          fullWidth
          label="เลือกวันที่"
          type="date"
          InputLabelProps={{ shrink: true }}
          name="start_date" // ตรวจสอบว่า name เป็น start_date
          value={formData?.start_date|| ''}
          onChange={handleInputChange}
        />
      </Box>

      <Box mt={2}>
        <TextField
          fullWidth
          label="วิธีแก้ไข"
          multiline
          rows={3}
          name="correct"
          value={formData?.correct|| ''}
          onChange={handleInputChange} // Handle change
        />
      </Box>

      <Box mt={2}>
        <Typography variant="subtitle1" fontWeight="bold">
          พนักงานที่เข้าดำเนินการ
        </Typography>
        <TextField
          select
          value={formData?.save_em || ''} // ใช้ save_em แทน
          name="save_em" // ใช้ชื่อฟิลด์เป็น save_em
          onChange={handleInputChange}
          label=""
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          fullWidth
          sx={{
            width: '100%',
            minWidth: '300px',
            mt: '20px',
          }}
        >
          {employee && employee.length > 0 ? (
            employee?.map((option) => (
              <MenuItem key={option.employee_id} value={option.employee_id}>
                {option.employee_name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>ไม่มีข้อมูล</MenuItem>
          )}
        </TextField>
      </Box>

      <Box mt={2}>
        <FormControl fullWidth>
          <Select
            value={formData?.status_id|| ''} // Bind to formData.status_id
            onChange={handleStatusChange} // Handle change
            displayEmpty
          >
            <MenuItem value="" disabled>
              เลือกสถานะ
            </MenuItem>{' '}
            {/* Default item */}
            {status?.map((statusItem, index) => (
              <MenuItem
                key={index}
                value={statusItem.status_id|| ''}
                sx={{
                  color:
                    statusItem.status_name === 'กำลังดำเนินการ'
                      ? '#FFC107' // Yellow
                      : statusItem.status_name === 'ดำเนินการเสร็จสิ้น'
                      ? '#4CAF50' // Green
                      : 'inherit', // Default color
                  fontWeight:
                    statusItem.status_name === 'กำลังดำเนินการ'
                      ? 'bold'
                      : statusItem.status_name === 'ดำเนินการเสร็จสิ้น'
                      ? 'normal'
                      : 'inherit', // Font weight
                }}
              >
                {statusItem.status_name} {/* Display the status name */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box mt={2} display="flex" justifyContent="flex-end" gap={2} width="100%">
        <Button
          onClick={() => {
            handleSaveClick(formData); // Save the formData
            window.location.reload(); // Reload the page after saving
          }}
          variant="contained"
          color="primary"
          sx={{ width: '150px', height: '50px' }}
        >
          บันทึก
        </Button>
        <Button
          onClick={handleCancel}
          color="grey"
          sx={{
            backgroundColor: '#B0B0B0',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#A0A0A0',
            },
            width: '150px',
            height: '50px',
          }}
        >
          ยกเลิก
        </Button>
      </Box>
    </Box>
  </Modal>
);

export default TakeacitonModal;
