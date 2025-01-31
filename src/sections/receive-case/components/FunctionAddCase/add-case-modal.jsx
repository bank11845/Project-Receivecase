/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Card,
  Grid,
  Modal,
  Button,
  Select,
  MenuItem,
  Checkbox,
  TextField,
  Typography,
  InputLabel,
  CardContent,
  FormControl,
} from '@mui/material';

const AddCaseModal = ({
  open,
  handleClose,
  mainCases,
  subcasedata,
  levelurgent,
  employee,
  team,
  branchs,
  files,
  handleInputChange,
  setFormData,
  formData,
  handleFileChange,
  handleRemoveFile,
  handlePostData,
  resetData,
}) => (
  <Modal open={open} onClose={handleClose}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 1200,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        maxHeight: '90vh',
        overflowY: 'auto', // Scroll if content overflows
      }}
    >
      <Typography variant="h4" gutterBottom>
        แจ้ง Case
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            รายละเอียดข้อมูล Case
          </Typography>
          <Grid container spacing={3}>
            {/* Section 1 */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    value={formData.main_case_id || ''}
                    name="main_case_id"
                    onChange={handleInputChange}
                    label="สาเหตุหลัก"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    {Array.isArray(mainCases) &&
                      mainCases?.map((option, index) => (
                        <MenuItem key={index} value={option.main_case_id}>
                          {option.main_case_name}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    value={formData.sub_case_id || []}
                    name="sub_case_id"
                    onChange={(event) => {
                      const { value } = event.target;
                      // ทำให้มั่นใจว่าค่าที่เลือกเป็นอาร์เรย์
                      setFormData((prev) => ({
                        ...prev,
                        sub_case_id: Array.isArray(value) ? value : value.split(','),
                      }));
                    }}
                    label="สาเหตุย่อย"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    SelectProps={{
                      multiple: true,
                      renderValue: (selected) =>
                        subcasedata
                          .filter((option) => selected.includes(option.sub_case_id))
                          .map((option) => option.sub_case_name)
                          .join(', '),
                    }}
                  >
                    {subcasedata?.map((option) => (
                      <MenuItem key={option.sub_case_id} value={option.sub_case_id}>
                        <Checkbox checked={formData.sub_case_id?.includes(option.sub_case_id)} />
                        {option.sub_case_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink htmlFor="urgent_level_id">
                      ระดับความเร่งด่วน
                    </InputLabel>
                    <Select
                      value={formData.urgent_level_id || ''}
                      name="urgent_level_id"
                      onChange={handleInputChange}
                      label="ระดับความเร่งด่วน"
                      id="urgent_level_id"
                      MenuProps={{
                        PaperProps: {
                          sx: { maxHeight: 200, overflow: 'auto' },
                        },
                      }}
                    >
                      {Array.isArray(levelurgent) &&
                        levelurgent?.map((option) => (
                          <MenuItem
                            key={option.level_urgent_id}
                            value={option.level_urgent_id}
                            sx={{
                              color:
                                option.level_urgent_name === 'เร่งด่วน'
                                  ? 'red'
                                  : option.level_urgent_name === 'ปานกลาง'
                                    ? 'orange'
                                    : 'green',
                            }}
                          >
                            {option.level_urgent_name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <TextField
                      select
                      value={formData.employee_id || ''}
                      name="employee_id"
                      onChange={handleInputChange}
                      label="คนที่เเจ้ง"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    >
                      {employee?.map((option) => (
                        <MenuItem key={option.employee_id} value={option.employee_id}>
                          {option.employee_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <TextField
                      select
                      value={formData.team_id || ''}
                      name="team_id"
                      onChange={handleInputChange}
                      label="ทีม"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    >
                      {team?.map((option) => (
                        <MenuItem key={option.team_id} value={option.team_id}>
                          {option.team_id} - {option.team_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    value={formData.create_date}
                    name="create_date"
                    type="datetime-local"
                    label="วันที่รับ case"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    value={formData.problem || ''}
                    name="problem"
                    onChange={handleInputChange}
                    label="ปัญหา"
                    variant="outlined"
                    multiline
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    value={formData.details || ''}
                    name="details"
                    onChange={handleInputChange}
                    label="รายละเอียด"
                    variant="outlined"
                    multiline
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Section 2 */}
            <Grid item xs={12} md={4}>
              <Grid container spacing={3} direction="column">
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <TextField
                      select
                      value={formData.branch_id || ''}
                      name="branch_id"
                      onChange={handleInputChange}
                      label="สาขา"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    >
                      {branchs?.map((option) => (
                        <MenuItem key={option.branch_id} value={option.branch_id}>
                          {option.branch_id} - {option.branch_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    border="1px dashed grey"
                    disabled
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
                      disabled
                      multiple
                      onChange={handleFileChange}
                      // eslint-disable-next-line react/jsx-no-comment-textnodes
                    />
                    <label htmlFor="upload-file-input">
                      <Button
                        variant="contained"
                        component="span"
                        disabled
                        startIcon={<Icon icon="uil:image-upload" width="24" height="24" />}
                      >
                        Upload Files
                      </Button>
                    </label>

                    <Box mt={2} width="100%">
                      <Grid container spacing={2}>
                        {files?.map((file, index) => (
                          <Grid item key={index} xs={4}>
                            <Box
                              position="relative"
                              border="1px solid #ccc"
                              borderRadius={2}
                              overflow="hidden"
                            >
                              {/* แสดงตัวอย่างไฟล์ */}
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`preview-${index}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  cursor: 'pointer',
                                }}
                              />
                              {/* ปุ่มลบไฟล์ */}
                              <Button
                                size="small"
                                color="secondary"
                                onClick={() => handleRemoveFile(index)}
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                  zIndex: 1,
                                }}
                              >
                                ✖
                              </Button>
                            </Box>
                            {/* แสดงชื่อไฟล์ */}
                            <Typography variant="caption" color="textSecondary" mt={1}>
                              {file.name}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handlePostData(); // เรียก API
                resetData();
                handleClose(); // ปิด Modal
              }}
            >
              บันทึก
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Modal>
);

export default AddCaseModal;
