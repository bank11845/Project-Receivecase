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
  formDataUpdate,
  handleInputChangeUpdate,
  handleUpdeteClick,
  handleCancel,
}) => (
  <Modal open={open} onClose={handleClose}>
    <Box p={3} bgcolor="background.paper" maxWidth={600} mx="auto" mt={4} borderRadius={2}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1976d2' }}>
        เข้าดำเนินการ
      </Typography>

      <Box mt={2}>
        <TextField
          fullWidth
          label="หมายเลขกรณี"
          type="text"
          name="receive_case_id"
          value={formDataUpdate?.receive_case_id || ''}
          disabled
        />
      </Box>

      <Box mt={2}>
        <TextField
          fullWidth
          label="เลือกวันที่เข้าดำเนินการ"
          type="date"
          InputLabelProps={{ shrink: true }}
          name="start_date"
          value={formDataUpdate?.start_date || ''}
          onChange={handleInputChangeUpdate}
        />
      </Box>

      <Box mt={2}>
        <TextField
          fullWidth
          label="วิธีแก้ไข"
          multiline
          rows={3}
          name="correct"
          value={formDataUpdate?.correct || ''}
          onChange={handleInputChangeUpdate}
        />
      </Box>

      <Box mt={2}>
        <Typography variant="subtitle1" fontWeight="bold">
          พนักงานที่เข้าดำเนินการ
        </Typography>
        <TextField
          select
          value={formDataUpdate?.saev_em || ''} // ตรวจสอบค่าที่เลือก
          name="saev_em"
          onChange={handleInputChangeUpdate}
          variant="outlined"
          fullWidth
          sx={{
            width: '100%',
            minWidth: '300px',
            mt: '20px',
          }}
        >
          {employee?.length > 0 ? (
            employee.map((option) => (
              <MenuItem key={option.employee_id} value={option.employee_id}>
                {' '}
                {/* ส่งค่าเป็นชื่อพนักงาน */}
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
            value={formDataUpdate?.status_id || ''}
            onChange={handleInputChangeUpdate}
            name="status_id"
            displayEmpty
          >
            <MenuItem value="" disabled>
              เลือกสถานะ
            </MenuItem>
            {status?.map((statusItem) => (
              <MenuItem
                key={statusItem.status_id}
                value={statusItem.status_id}
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

      <Box mt={2} display="flex" justifyContent="flex-end" gap={2} width="100%">
        <Button
          onClick={() => handleUpdeteClick(handleUpdeteClick)}
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
