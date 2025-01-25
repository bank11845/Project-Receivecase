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

const EditactionModal = ({
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
  setFormDataUpdateEdit,
  formDataUpdateEdit,
  handleFileChange,
  handleRemoveFile,
}) => (
  <Modal open={open} onClose={handleClose}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: 1500,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        maxHeight: '90%',
        overflowY: 'auto',
      }}
    >
      <Typography variant="h4" gutterBottom>
        ดำเนินการเเก้ไข Case
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
                <Grid item xs={12}>
                  <Box mt={2}>
                    <TextField
                      fullWidth
                      label="หมายเลขกรณี"
                      type="text"
                      name="receive_case_id"
                      value={formDataUpdateEdit?.receive_case_id}
                      disabled
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    value={formDataUpdateEdit?.selectedMainCaseName || ''}
                    name="main_case_id"
                    onChange={handleInputChange}
                    label="สาเหตุหลัก"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    {Array.isArray(mainCases) &&
                      mainCases.map((option, index) => (
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
                    value={formDataUpdateEdit?.sub_case_id || []}
                    name="sub_case_id"
                    onChange={(event) => {
                      const { value } = event.target;
                      setFormDataUpdateEdit((prev) => ({
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
                        <Checkbox
                          checked={formDataUpdateEdit.sub_case_id?.includes(option.sub_case_id)}
                        />
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
                      value={formDataUpdateEdit?.urgent_level_id || ''}
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
                        levelurgent.map((option) => (
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
                      value={formDataUpdateEdit?.employee_id || ''}
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
                      value={formDataUpdateEdit?.team_id || ''}
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
                    value={formDataUpdateEdit?.create_date}
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
                    value={formDataUpdateEdit?.problem || ''}
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
                    value={formDataUpdateEdit?.details || ''}
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
                      value={formDataUpdateEdit?.branch_id || ''}
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
                  <FormControl fullWidth>
                    <TextField
                      select
                      value={formDataUpdateEdit?.employee_id || ''}
                      name="employee_id"
                      onChange={handleInputChange}
                      label="คนที่เข้าเดินการ"
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
                <Grid item xs={12} md={6}>
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
                      onChange={handleFileChange}
                    />
                    <label htmlFor="upload-file-input">
                      <Button variant="contained" component="span">
                        Upload Files
                      </Button>
                    </label>

                    <Box mt={2} width="100%">
                      <Grid container spacing={2}>
                        {formDataUpdateEdit.files?.map((file, index) => (
                          <Grid item key={index} xs={4}>
                            <Box
                              position="relative"
                              border="1px solid #ccc"
                              borderRadius={2}
                              overflow="hidden"
                            >
                              {/* Show file preview */}
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`preview-${index}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                              {/* Remove file button */}
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
                            {/* Display file name */}
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
                // Handle save action (e.g. API call)
                handleClose(); // Close modal
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

export default EditactionModal;
