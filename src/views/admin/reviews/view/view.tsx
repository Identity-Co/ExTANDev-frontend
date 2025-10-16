"use client";

import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  CardContent,
  Chip,
  Rating,
  Divider,
  Button,
  Menu,
  MenuItem,
  Avatar,
  CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import { toast } from 'react-toastify';

import * as Review from '@/app/server/reviews'

interface ReviewData {
  'User Profile'?: string;
  'User Name': string;
  'User Email': string;
  'Ratings': number | string;
  'Review Text': string;
  'Page Url'?: string;
  'IP Address'?: string;
  'Created At'?: string;
  'Status'?: 0 | 1 | 2;
}

const ContactEntryView = ({ data }: { string; data?: [] }) => {  
  const [status, setStatus] = useState<0 | 1 | 2>(data?.['status'] ?? 0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fullName = data?.user_info?.first_name +' '+ data?.user_info?.last_name

  const formData: ReviewData = {
    'User Profile': data?.user_info?.profile_picture,
    'User Name': fullName?? '',
    'User Email': data?.user_info?.email,
    'Ratings': data?.rating?? 0,
    'Review Text': data?.review_text?? '',
    'Page Url': data?.review_url?? '',
    'IP Address': data?.ip_address?? '',
    'Created At': data?.created_at?? '',
    'Status': data?.status?? 0
  };

  const statusMap = {
    0: { label: 'Pending', color: 'warning'},
    1: { label: 'Approved', color: 'success'},
    2: { label: 'Declined', color: 'error'}
  };

  const getStatusInfo = (statusCode: 0 | 1 | 2) => {
    return statusMap[statusCode] || statusMap[0];
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const handleStatusClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleStatusClose = () => {
    setAnchorEl(null);
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,  // This will show AM/PM
    };
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options); // Format the date
  };

  const handleStatusChange = async (newStatus: 0 | 1 | 2) => {
    const formData = {
      'status': newStatus,
    }
    
    setIsUpdating(true);
    
    try {
      const log = await Review.updateStatus(data?._id, formData);
      if (log && log._id) {
        setStatus(newStatus);
        setAnchorEl(null);
        toast.success(`Review status changed to ${getStatusInfo(newStatus).label}`)
      }
    } catch(err: any) {
      toast.error(err.message || 'Something went wrong, Please try again')
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStatus = getStatusInfo(status);

  return (
    <Grid 
      container
      sx={{ 
        p: 8, 
        bgcolor: 'white',
        borderRadius: 1,
        margin: '0 auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}
    >

      {/* Header with Status */}
      <Grid size={12} container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Grid>
          <Typography variant="body1" color="text.secondary">
            Complete information about the user review
          </Typography>
        </Grid>
        
        {/* Status Selector */}
        <Grid>
          <Button
            variant="contained"
            onClick={handleStatusClick}
            endIcon={
              isUpdating ? (
                <CircularProgress size={16} sx={{ color: 'white' }} />
              ) : (
                <span>▼</span>
              )
            }
            disabled={isUpdating}
            sx={{
              bgcolor: isUpdating ? 'grey.400' : `${currentStatus.color}.main`,
              color: 'white',
              fontWeight: 'bold',
              px: 3,
              py: 1,
              borderRadius: 2,
              '&:hover': {
                bgcolor: isUpdating ? 'grey.400' : `${currentStatus.color}.dark`,
              },
              '&:disabled': {
                bgcolor: 'grey.400',
                color: 'white'
              }
            }}
          >
            {isUpdating ? 'Updating...' : currentStatus.label}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleStatusClose}
            PaperProps={{
              sx: { 
                mt: 1,
                minWidth: 160,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }
            }}
          >
            <MenuItem 
              onClick={() => handleStatusChange(0)}
              selected={status === 0}
              disabled={isUpdating}
              sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
            >
              Pending
            </MenuItem>
            <MenuItem 
              onClick={() => handleStatusChange(1)}
              selected={status === 1}
              disabled={isUpdating}
              sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
            >
              Approved
            </MenuItem>
            <MenuItem 
              onClick={() => handleStatusChange(2)}
              selected={status === 2}
              disabled={isUpdating}
              sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
            >
              Declined
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Left Column - Enhanced User Information */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%',
              borderRadius: 1,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #ff5e4e2e 100%)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* User Profile Header */}
              <Grid container direction="column" alignItems="center" sx={{ mb: 4, textAlign: 'center' }}>
                {formData['User Profile'] ? (
                  <Avatar
                    src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${formData['User Profile']}`}
                    sx={{
                      width: 100,
                      height: 100,
                      border: '4px solid white',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      mb: 3
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      border: '4px solid white',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                      mb: 3,
                      fontWeight: 'bold'
                    }}
                  >
                    {getInitials(formData['User Name'])}
                  </Avatar>
                )}
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                  {formData['User Name']}
                </Typography>
                <Chip 
                  label="Review Submitter" 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontWeight: 'medium' }}
                />
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* User Information Details */}
              <Grid container spacing={3}>
                {/* Name Field */}
                <Grid size={12}>
                  <Grid container sx={{ p: 2.5, bgcolor: 'white', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <Grid size={12}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}>
                        FULL NAME
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: '600', color: 'text.primary', mt: 0.5 }}>
                        {formData['User Name']}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Email Field */}
                <Grid size={12}>
                  <Grid container sx={{ p: 2.5, bgcolor: 'white', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <Grid size={12}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}>
                        EMAIL ADDRESS
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: '600', color: 'text.primary', mt: 0.5 }}>
                        {formData['User Email']}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Rating Field */}
                <Grid size={12}>
                  <Grid container sx={{ p: 2.5, bgcolor: 'white', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <Grid size={12}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}>
                        RATING GIVEN
                      </Typography>
                      <Grid container alignItems="center" sx={{ mt: 1 }}>
                        <Rating 
                          value={typeof formData.Ratings === 'string' ? parseFloat(formData.Ratings) : formData.Ratings} 
                          readOnly 
                          size="medium"
                          sx={{ color: '#f85241' }}
                        />
                        <Typography variant="body1" sx={{ ml: 2, fontWeight: 'bold', color: 'text.primary' }}>
                          {formData.Ratings}/5
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* Status Section */}
              <Grid container justifyContent="center" sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                <Grid container direction="column" alignItems="center" spacing={1}>
                  <Grid>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                      CURRENT STATUS
                    </Typography>
                  </Grid>
                  <Grid>
                    <Chip
                      label={
                        isUpdating ? (
                          <Grid container alignItems="center" spacing={1}>
                            <CircularProgress size={16} sx={{ color: 'white' }} />
                            <Typography variant="body2" sx={{ ml: 1, color: 'white' }}>
                              Updating...
                            </Typography>
                          </Grid>
                        ) : (
                          currentStatus.label
                        )
                      }
                      color={isUpdating ? 'default' : currentStatus.color as any}
                      variant="filled"
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        padding: '8px 16px',
                        minWidth: 120,
                        height: 'auto'
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Review Content & Technical Info */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Grid container spacing={3}>
            {/* Review Content Card */}
            <Grid size={12}>
              <Card elevation={3} sx={{ borderRadius: 1 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 3 }}>
                    Review Content
                  </Typography>
                  
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid
                    container
                    sx={{
                      p: 3,
                      bgcolor: 'grey.50',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      minHeight: 140
                    }}
                  >
                    <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.primary' }}>
                      {formData['Review Text']}
                    </Typography>
                  </Grid>

                  {/* Review Metrics */}
                  <Grid container spacing={3} sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Grid size={6}>
                      <Grid container direction="column" alignItems="center">
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                          CHARACTER COUNT
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          {formData['Review Text'].length}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid size={6}>
                      <Grid container direction="column" alignItems="center">
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                          WORD COUNT
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          {formData['Review Text'].split(' ').length}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Technical Information Card */}
            <Grid size={12}>
              <Card elevation={3} sx={{ borderRadius: 1 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 3 }}>
                    Technical Information
                  </Typography>
                  
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={2}>
                    {formData['Page Url'] && (
                      <Grid size={12}>
                        <Grid container sx={{ p: 2.5, bgcolor: 'grey.50', borderRadius: 2 }}>
                          <Grid size={12}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                              PAGE URL
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: '600', 
                                color: 'primary.main',
                                mt: 0.5,
                                cursor: 'pointer',
                                textDecoration: 'underline'
                              }}
                              onClick={() => window.open(formData['Page Url'], '_blank')}
                            >
                              {formData['Page Url']}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}

                    {formData['IP Address'] && (
                      <Grid size={12}>
                        <Grid container sx={{ p: 2.5, bgcolor: 'grey.50', borderRadius: 2 }}>
                          <Grid size={12}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                              IP ADDRESS
                            </Typography>
                            <Grid container alignItems="center" sx={{ mt: 0.5 }}>
                              <Chip
                                label={formData['IP Address']}
                                color="default"
                                variant="outlined"
                                sx={{ fontWeight: 'bold' }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}

                    {/* Create Date Field */}
                    {formData['Created At'] && (
                      <Grid size={12}>
                        <Grid container sx={{ p: 2.5, bgcolor: 'grey.50', borderRadius: 2 }}>
                          <Grid size={12}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                              CREATED DATE
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: '600', color: 'text.primary', mt: 0.5 }}>
                              {formatDate(formData['Created At'])}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ContactEntryView;