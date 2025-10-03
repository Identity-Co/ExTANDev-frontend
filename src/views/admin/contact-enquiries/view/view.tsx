"use client";

import React, { useState } from 'react';
import { Paper, Typography, Grid, Card, CardContent } from '@mui/material';


const ContactEntryView = ({ data }: { string; data?: [] }) => {  
  const formData = {
    'First Name' : data?.first_name?? '',
    'Last Name' : data?.last_name?? '',
    'Email' : data?.email_address?? '',
    'Phone' : data?.phone?? '',
    'Country' : data?.country?? '',
    'How can we help?' : data?.how_can_help?? '',
    'How can we help?' : data?.how_can_help?? '',
    'Get monthly inspiration. Subscribe to our newsletter.' : data?.subscribe_newsletter?? '',
    'I agree to receive other communications fro Adventure Network.' : data?.agree_communication?? '',
    'IP Address' : data?.ip_address?? ''
  }

  const formatBoolean = (value) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value;
  };


  return (
    
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Contact Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                {Object.entries(formData).map(([key, value]) => (
                  <Card key={key} variant="outlined" sx={{ mb: 2, borderBottom: '2px solid #C3C3C3', borderLeft: 0, borderRight: 0, borderTop: 0, borderRadius: 0}}>
                    <CardContent sx={{ pb: 2, pt: 3, paddingBlockEnd: 0}}>
                      <Typography variant="subtitle2" color="text.primary" gutterBottom fontWeight="bold" sx={{mb: 1}}>
                        {key}
                      </Typography>
                      <Typography variant="body2" color="text.primary" gutterBottom sx={{mb: 0}}>
                        {value? formatBoolean(value) : '-'}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            </Grid>

          </Paper>
        </Grid>
      </Grid>
  );
};

export default ContactEntryView;