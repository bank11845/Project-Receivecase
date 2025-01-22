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
    <Box p={3} bgcolor="background.paper" maxWidth={600} mx="auto" mt={4} borderRadius={2}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1976d2' }}>
        เข้าดำเนินการ
      </Typography>

      {/* Case ID Field */}
      <Box mt={2}>
        <TextField
          fullWidth
          label="หมายเลขกรณี"
          type="text"
          name="receive_case_id"
          value={formData?.receive_case_id || ''}
          disabled
        />
      </Box>

      {/* Start Date Field */}
      <Box mt={2}>
        <TextField
          fullWidth
          label="เลือกวันที่"
          type="date"
          InputLabelProps={{ shrink: true }}
          name="start_date"
          value={formData?.start_date || ''}
          onChange={handleInputChange}
        />
      </Box>

      {/* Correction Field */}
      <Box mt={2}>
        <TextField
          fullWidth
          label="วิธีแก้ไข"
          multiline
          rows={3}
          name="correct"
          value={formData?.correct || ''}
          onChange={handleInputChange}
        />
      </Box>

      {/* Employee Selection */}
      <Box mt={2}>
        <Typography variant="subtitle1" fontWeight="bold">
          พนักงานที่เข้าดำเนินการ
        </Typography>
        <TextField
          select
          value={formData?.save_em || ''}
          name="save_em"
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
            employee.map((option) => (
              <MenuItem key={option.employee_id} value={option.employee_id}>
                {option.employee_name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>ไม่มีข้อมูล</MenuItem>
          )}
        </TextField>
      </Box>

      {/* Status Selection */}
      <Box mt={2}>
        <FormControl fullWidth>
          <Select value={formData?.status_id || ''} onChange={handleStatusChange} displayEmpty>
            <MenuItem value="" disabled>
              เลือกสถานะ
            </MenuItem>
            {status?.map((statusItem, index) => (
              <MenuItem
                key={index}
                value={statusItem.status_id || ''}
                sx={{
                  color:
                    statusItem.status_name === 'กำลังดำเนินการ'
                      ? '#FFC107'
                      : statusItem.status_name === 'ดำเนินการเสร็จสิ้น'
                        ? '#4CAF50'
                        : 'inherit',
                  fontWeight:
                    statusItem.status_name === 'กำลังดำเนินการ'
                      ? 'bold'
                      : statusItem.status_name === 'ดำเนินการเสร็จสิ้น'
                        ? 'normal'
                        : 'inherit',
                }}
              >
                {statusItem.status_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Action Buttons */}
      <Box mt={2} display="flex" justifyContent="flex-end" gap={2} width="100%">
        <Button
          onClick={() => {
            handleSaveClick(formData);
            window.location.reload();
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
