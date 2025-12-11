'use client';

import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const fontSizes = [
  { value: 'fs_16', label: '0.833vw' },
  { value: 'fs_18', label: '0.938vw' },
  { value: 'fs_20', label: '1.042vw' },
  { value: 'fs_35', label: '1.823vw' },
  { value: 'fs_40', label: '2.083vw' },
  { value: 'fs_55', label: '2.864vw' },
  { value: 'fs_60', label: '3.125vw' },
  { value: 'fs_70', label: '3.646vw' },
  { value: 'fs_90', label: '4.688vw' },
  { value: 'fs_100', label: '5.208vw' },
  { value: 'fs_120', label: '6.25vw' },
  { value: 'fs_140', label: '7.292vw' },
  { value: 'fs_160', label: '8.333vw' }
];

export default function BannerTextFontSize({ value, onChange, label, instanceId }) {

  // Use instanceId to generate stable unique IDs
  const safeLabel = (label ?? 'Font Size').replace(/\s+/g, '-').toLowerCase();

  const selectId = `${safeLabel}-select-${instanceId}`;
  const labelId = `${safeLabel}-label-${instanceId}`;

  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{label ?? 'Font Size'}</InputLabel>

      <Select
        labelId={labelId}
        id={selectId}
        value={value ?? ''}
        label={label ?? 'Font Size'}
        onChange={onChange}
      >
        {fontSizes.map(size => (
          <MenuItem key={size.value} value={size.value}>
            {size.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
