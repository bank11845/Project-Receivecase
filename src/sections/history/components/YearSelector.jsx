// components/YearSelector.jsx
import React from 'react';

import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

export default function YearSelector({ selectedYear, setSelectedYear }) {
  return (
    <FormControl>
      <InputLabel>Year</InputLabel>
      <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
        {[...Array(5)].map((_, i) => (
          <MenuItem key={i} value={new Date().getFullYear() - i}>
            {new Date().getFullYear() - i}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
