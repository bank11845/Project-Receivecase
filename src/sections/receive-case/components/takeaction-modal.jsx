/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import {
  Box,
  Grid,
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
}) => (
  <Modal open={open} onClose={handleClose}>
    <Box p={3} bgcolor="background.paper" maxWidth={600} mx="auto" mt={4} borderRadius={2}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1976d2' }}>
        เข้าดำเนินการ
      </Typography>

      <Grid container spacing={2} mt={2}>
        {/* หมายเลขกรณี */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="หมายเลขกรณี"
            type="text"
            name="receive_case_id"
            value={formDataUpdate?.receive_case_id || ''}
            disabled
          />
        </Grid>

        {/* วันที่แจ้ง Case */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="วันที่แจ้ง Case"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            name="start_date"
            value={formDataUpdate?.start_date || ''}
            onChange={handleInputChangeUpdate}
            disabled={
              formDataUpdate?.status_name === 'กำลังดำเนินการ' ||
              formDataUpdate?.status_name === 'ดำเนินการเสร็จสิ้น'
            }
            inputProps={{
              step: 60,
            }}
            sx={{
              '& .MuiInputBase-input': { fontSize: '16px', fontFamily: 'Roboto' },
              '& .MuiInputLabel-root': { fontSize: '14px' },
            }}
          />
        </Grid>

        {/* วิธีแก้ไข */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="วิธีแก้ไข"
            multiline
            rows={3}
            name="correct"
            value={formDataUpdate?.correct || ''}
            onChange={handleInputChangeUpdate}
          />
        </Grid>

        {/* พนักงานที่เข้าดำเนินการ */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="bold">
            พนักงานที่เข้าดำเนินการ
          </Typography>
          <TextField
            select
            value={formDataUpdate?.saev_em || ''}
            name="saev_em"
            onChange={handleInputChangeUpdate}
            variant="outlined"
            fullWidth
            sx={{ mt: 1 }}
          >
            {employee?.length > 0 ? (
              employee.map((option) => (
                <MenuItem key={option.employee_id} value={option.employee_id}>
                  {option.employee_name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>ไม่มีข้อมูล</MenuItem>
            )}
          </TextField>
        </Grid>

        {/* เลือกสถานะ */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Select
              value={formDataUpdate?.status_id || ''}
              onChange={handleInputChangeUpdate}
              name="status_id"
              displayEmpty
              sx={{
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // เพิ่มความเงางาม
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976d2',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1565c0',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0d47a1',
                },
              }}
            >
              <MenuItem value="" disabled>
                เลือกสถานะ
              </MenuItem>
              {status?.map((statusItem) => (
                <MenuItem
                  key={statusItem.status_id}
                  value={statusItem.status_id}
                  disabled={
                    (formDataUpdate?.status_name === 'รอดำเนินการ' &&
                      statusItem.status_name !== 'กำลังดำเนินการ') ||
                    (formDataUpdate?.status_name === 'กำลังดำเนินการ' &&
                      statusItem.status_name !== 'ดำเนินการเสร็จสิ้น') ||
                    formDataUpdate?.status_name === 'ดำเนินการเสร็จสิ้น'
                  }
                  sx={{
                    backgroundColor:
                      statusItem.status_name === 'กำลังดำเนินการ'
                        ? '#FFEB3B' // พื้นหลังสีเหลืองเข้มขึ้น
                        : statusItem.status_name === 'ดำเนินการเสร็จสิ้น'
                          ? '#4CAF50' // พื้นหลังสีเขียวเข้ม
                          : 'inherit',
                    color:
                      statusItem.status_name === 'กำลังดำเนินการ'
                        ? '#FFA000'
                        : statusItem.status_name === 'ดำเนินการเสร็จสิ้น'
                          ? '#ffffff' // สีตัวอักษรขาว
                          : 'inherit',
                    fontWeight:
                      statusItem.status_name === 'กำลังดำเนินการ' ||
                      statusItem.status_name === 'ดำเนินการเสร็จสิ้น'
                        ? 'bold'
                        : 'inherit',
                    '&:hover': {
                      backgroundColor:
                        statusItem.status_name === 'กำลังดำเนินการ'
                          ? '#FFC107' // พื้นหลังสีเหลืองอ่อนตอน hover
                          : statusItem.status_name === 'ดำเนินการเสร็จสิ้น'
                            ? '#388E3C' // พื้นหลังสีเขียวเข้มตอน hover
                            : 'inherit',
                    },
                    borderRadius: '4px', // ทำมุมมนให้ MenuItem
                    margin: '4px 0', // เว้นระยะระหว่างรายการ
                  }}
                  onClick={() =>
                    handleInputChangeUpdate({
                      target: { name: 'status', value: statusItem.status_name },
                    })
                  }
                >
                  {statusItem.status_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* ปุ่ม */}
        <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            onClick={() => handleUpdeteClick(handleUpdeteClick)}
            variant="contained"
            color="primary"
            sx={{ width: '150px', height: '50px' }}
          >
            บันทึก
          </Button>
          <Button
            onClick={handleClose}
            color="grey"
            sx={{
              backgroundColor: '#B0B0B0',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#A0A0A0' },
              width: '150px',
              height: '50px',
            }}
          >
            ยกเลิก
          </Button>
        </Grid>
      </Grid>
    </Box>
  </Modal>
);

export default TakeacitonModal;
