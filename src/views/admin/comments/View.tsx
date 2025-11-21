"use client";

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  Grid,
  Box,
  Typography,
  Chip,
  Button,
  Rating,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip,
} from '@mui/material'

import { toast } from 'react-toastify';

import { getStoryPostByID, getReviewPostByID, deleteComment, updateReportStatus } from '@/app/server/comments'

const DeleteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
)

const FlagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>
  </svg>
)

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
)

const VisibilityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
)

const MoreVertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>
)

const ScheduleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
  </svg>
)

const CancelIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"/>
  </svg>
)

const PersonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
)

const OpenInNewIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
  </svg>
)

const ViewComment = ({ data }: { data?: any }) => {
  const router = useRouter()
  const id = data._id
  const storyID = (data?.collection_name == 'destination_story') ?  data?.collection_id : null
  const reviewID = (data?.collection_name == 'reviews') ?  data?.collection_id : null
  const [comment, setComment] = useState<Comment | null>(data)
  const [storyPost, setStoryPost] = useState<any>(null)
  const [reviewPost, setReviewPost] = useState<any>(null)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [actionMenu, setActionMenu] = useState<{ anchor: HTMLElement; report: Report } | null>(null)
  const [reporters, setReporters] = useState<{[key: string]: User}>({})

  const reportsSectionRef = useRef<HTMLDivElement>(null)
  const repliesSectionRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    
      ref.current.style.transition = 'box-shadow 0.3s ease'
      ref.current.style.boxShadow = '0 0 0 2px rgba(25, 118, 210, 0.5)'
      
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.boxShadow = 'none'
        }
      }, 1500)
    }
  }

  const handleDelete = async () => {
    try {
      const deleteResponse = await deleteComment(id);
      if (deleteResponse.success) {
        toast.success('Comment deleted successfully');
        router.push('/admin/comments')
      }
    } catch (error) {
      toast.error('Error deleting comment');
    }
    setDeleteDialog(false)
  }

  useEffect(() => {
    if (storyID) {
      getStoryPost(storyID)
    }
  }, [storyID])

  const getStoryPost = async (story_ID: string) => {
    try {
      const storyData = await getStoryPostByID(story_ID);
      if(storyData && storyData._id){
        setStoryPost(storyData);
      }
    } catch (error) {
      console.error('Error fetching story post:', error)
    }
  }

  useEffect(() => {
    if (reviewID) {
      getReview(reviewID)
    }
  }, [reviewID])

  const getReview = async (review_ID: string) => {
    try {
      const reviewData = await getReviewPostByID(review_ID);
      if(reviewData && reviewData._id){
        setReviewPost(reviewData);
      }
    } catch (error) {
      console.error('Error fetching review:', error)
    }
  }

  const handleReportAction = async (reportId: string, status: Report['status']) => {
    try {
      const formData = {
        'status': status,
        'reportId': reportId,
      };

      const reviewData = await updateReportStatus(formData);
      if (reviewData._id) {
        const updatedComment = { ...comment }
        if (updatedComment.reports) {
          const reportIndex = updatedComment.reports.findIndex(r => r._id === reportId)
          if (reportIndex !== -1) {
            updatedComment.reports[reportIndex].status = status
            setComment(updatedComment)
          }
        }
      }
    } catch (error) {
      console.error('Error updating report:', error)
    } finally {
      setActionMenu(null)
    }
  }

  const getStatusConfig = (status: string) => {
    const config = {
      pending: { color: 'warning', label: 'Pending', icon: <ScheduleIcon /> },
      reviewed: { color: 'info', label: 'Under Review', icon: <VisibilityIcon /> },
      resolved: { color: 'success', label: 'Resolved', icon: <CheckCircleIcon /> },
      dismissed: { color: 'default', label: 'Dismissed', icon: <CancelIcon /> },
    }
    return config[status] || config.pending
  }

  const getStatusCounts = () => {
    if (!comment?.reports) return {}
    return comment.reports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1
      return acc
    }, {})
  }

  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  function truncateHTMLWords(html: string, limit = 50) {
    if (!html) return ''
    const text = html.replace(/<[^>]*>/g, ' ');
    const words = text.trim().split(/\s+/);
    const truncated = words.slice(0, limit).join(' ');
    const result = words.length > limit ? `${truncated}…` : truncated;

    return result;
  }

  const commentTypeConfig = {
    'adventure_post': { label: "Adventure Post", color: "primary", icon: "ri-map-pin-line" },
    'destination_story': { label: "Destination Story", color: "secondary", icon: "ri-bookmark-line" },
    'reviews': { label: "Reviews", color: "info", icon: "ri-star-line" },
    'adventure_guide': { label: "Adventure Guide", color: "warning", icon: "ri-news-line" },
  };

  const statusCounts = getStatusCounts()

  if (!comment) return <Typography>Comment not found</Typography>

  return (
    <Grid container spacing={6} sx={{backgroundColor: 'white', padding: '10px 30px 30px 10px', marginTop: '10px'}}>
      <Grid item xs={12} md={8}>
        <Card>
          <Box sx={{ p: 4 }}>
            {/* User Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              {comment.user_avatar ? (
                <Avatar
                  src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${comment.user_avatar}`}
                  sx={{
                    width: 64,
                    height: 64,
                    mr: 3,
                    border: '4px solid white',
                    mb: 3
                  }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mr: 3,
                    border: '4px solid white',
                    bgcolor: 'primary.main',
                    fontSize: '1.1rem',
                    mb: 3,
                    fontWeight: 'bold'
                  }}
                >
                  {getInitials(comment.user_name)}
                </Avatar>
              )}
              <Box>
                <Typography variant='h6'>{comment.user_name}</Typography>
                <Typography variant='body2' color='textSecondary'>
                  {comment.user_email}
                </Typography>
                <Typography variant='caption' color='textSecondary'>
                  {new Date(comment.created_at).toLocaleString()}
                </Typography>
              </Box>
            </Box>

            {/* Comment Content */}
            <Box sx={{ mb: 4 }}>
              <Typography variant='body1' sx={{ mb: 2 }}>
                Comment:
              </Typography>
              <Box
                sx={{
                  p: 3,
                  bgcolor: 'background.default',
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'divider'
                }}
                dangerouslySetInnerHTML={{ __html: comment.comment }}
              />
            </Box>

            {/* Images */}
            {comment.images && comment.images.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant='body1' sx={{ mb: 2 }}>
                  Attached Images:
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {comment.images.map((image, index) => (
                    <img
                      key={index}
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${image}`}
                      alt={`Comment attachment ${index + 1}`}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                      onClick={() => window.open(`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${image}`, '_blank')}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Stats - Updated with click handlers */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              <Chip
                label={`${comment.upvoteCount} Upvotes`}
                variant='outlined'
                color='primary'
              />
              <Chip
                label={`${comment.helpfulCount} Helpful`}
                variant='outlined'
                color='secondary'
              />
              <Chip
                label={`${comment.replies_count} Replies`}
                variant='outlined'
                clickable
                onClick={() => comment.replies_count > 0 && scrollToSection(repliesSectionRef)}
                sx={{
                  cursor: comment.replies_count > 0 ? 'pointer' : 'default',
                  '&:hover': comment.replies_count > 0 ? {
                    backgroundColor: 'primary.light',
                    color: 'white'
                  } : {}
                }}
              />
              <Chip
                label={`${comment.reports_count} Reports`}
                color={comment.reports_count > 0 ? 'error' : 'default'}
                clickable
                onClick={() => comment.reports_count > 0 && scrollToSection(reportsSectionRef)}
                sx={{
                  cursor: comment.reports_count > 0 ? 'pointer' : 'default',
                  '&:hover': comment.reports_count > 0 ? {
                    backgroundColor: 'error.light',
                    color: 'white'
                  } : {}
                }}
              />
            </Box>
          </Box>
        </Card>

        {/* Reports Section - Added ref */}
        {comment.reports && comment.reports.length > 0 && (
          <Card sx={{ mt: 4 }} ref={reportsSectionRef}>
            <Box sx={{ p: 4 }}>
              {/* Reports Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant='h6'>
                  Reports ({comment.reports.length})
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {Object.entries(statusCounts).map(([status, count]) => {
                    const config = getStatusConfig(status)
                    return (
                      <Chip
                        key={status}
                        label={`${count} ${config.label}`}
                        size="small"
                        color={config.color}
                        variant="outlined"
                      />
                    )
                  })}
                </Box>
              </Box>

              {/* Reports List */}
              {comment.reports.map((report) => {
                const statusConfig = getStatusConfig(report.status)
                const reporter = reporters[report.user_id?._id]
                const reporterName = report?.user_id?.first_name + ' ' + report?.user_id?.last_name || 'Unknown User'
                const reporterEmail = report?.user_id?.email || report?.user_id?.email || 'No email'
                const reporterAvatar = report?.user_id?.profile_picture || report?.user_id?.profile_picture || reporter?.profile_picture

                return (
                  <Card 
                    key={report._id}
                    variant="outlined"
                    sx={{ 
                      mb: 2,
                      borderLeft: 3,
                      borderLeftColor: `${statusConfig.color}.main`,
                      opacity: report.status === 'resolved' || report.status === 'dismissed' ? 0.8 : 1,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        boxShadow: 1,
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    <Box sx={{ p: 3 }}>
                      {/* Report Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                          <Badge
                            color={statusConfig.color}
                            variant="dot"
                            sx={{
                              '& .MuiBadge-badge': {
                                right: -3,
                                top: -3,
                              }
                            }}
                          >
                            <Box sx={{ color: `${statusConfig.color}.main` }}>
                              <FlagIcon />
                            </Box>
                          </Badge>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight="600">
                              {report.reason}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                              Reported on {new Date(report.created_at).toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            icon={statusConfig.icon}
                            label={statusConfig.label}
                            color={statusConfig.color}
                            size="small"
                            variant={report.status === 'pending' ? 'filled' : 'outlined'}
                          />
                          <Tooltip title="Report actions">
                            <IconButton 
                              size="small"
                              onClick={(e) => setActionMenu({ anchor: e.currentTarget, report })}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      {/* Reporter Information */}
                      <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PersonIcon />
                          Reported by:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {reporterAvatar ? (
                            <Avatar
                              src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${reporterAvatar}`}
                              sx={{
                                width: 40,
                                height: 40,
                              }}
                            />
                          ) : (
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: 'secondary.main',
                                fontSize: '0.875rem',
                                fontWeight: 'bold'
                              }}
                            >
                              {getInitials(reporterName)}
                            </Avatar>
                          )}
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {reporterName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {reporterEmail}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      {/* Report Description */}
                      {report.description && (
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: 'background.default',
                            borderRadius: 1,
                            border: 1,
                            borderColor: 'divider'
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                            Report Description:
                          </Typography>
                          <Typography variant="body2" color="text.primary">
                            {report.description}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Card>
                )
              })}
            </Box>
          </Card>
        )}

        {/* Replies Section - Added ref */}
        {comment.replies && comment.replies.length > 0 && (
          <Card sx={{ mt: 4 }} ref={repliesSectionRef}>
            <Box sx={{ p: 4 }}>
              <Typography variant='h6' sx={{ mb: 3 }}>
                Replies ({comment.replies.length})
              </Typography>
              {comment.replies.map((reply) => (
                <Box key={reply._id} sx={{ mb: 3, pb: 3, borderBottom: 1, borderColor: 'divider', position: 'relative' }}>
                  {/* View Reply Button */}
                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Tooltip title="View reply in new tab">
                      <IconButton
                        size="small"
                        onClick={() => {
                          window.open(`/admin/comments/view/${reply._id}`, '_blank');
                        }}
                      >
                        <OpenInNewIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {reply.user_avatar ? (
                      <Avatar
                        src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${reply.user_avatar}`}
                        sx={{
                          width: 50,
                          height: 50,
                          mr: 1.1,
                          border: '4px solid white',
                          mb: 3
                        }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          mr: 1.1,
                          border: '4px solid white',
                          bgcolor: 'primary.main',
                          fontSize: '1rem',
                          mb: 3,
                          fontWeight: 'bold'
                        }}
                      >
                        {getInitials(reply.user_name)}
                      </Avatar>
                    )}
                    <Box>
                      <Typography variant='body2' fontWeight='medium'>
                        {reply.user_name}
                      </Typography>
                      <Typography variant='body2' color='textSecondary'>
                        {reply.user_email}
                      </Typography>
                      <Typography variant='caption' color='textSecondary'>
                        {new Date(reply.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'background.default',
                      borderRadius: 1
                    }}
                    dangerouslySetInnerHTML={{ __html: reply.comment }}
                  />
                </Box>
              ))}
            </Box>
          </Card>
        )}
      </Grid>

      <Grid item xs={12} md={4}>
        {/* Post Info */}
        <Card sx={{ mb: 4 }}>
          <Box sx={{ p: 4 }}>
            <Grid container xs={12} md={12}>
              <Grid item xs={12} md={6}>
                <Typography variant='h6' sx={{ mb: 3 }}>
                  Post Information
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} style={{ textAlign: 'right' }}>
                <Chip 
                  icon={<i className={commentTypeConfig[comment.collection_name]?.icon || 'ri-chat-1-line'} style={{ fontSize: '12px' }} />}
                  label={commentTypeConfig[comment.collection_name]?.label || 'Unknown'} 
                  size="small" 
                  variant="filled"
                  color={commentTypeConfig[comment.collection_name]?.color || 'default'}
                  sx={{ height: '22px', fontSize: '0.7rem' }}
                />
              </Grid>
            </Grid>
            { reviewPost && reviewPost._id ? (
              <Typography variant='h6' sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  {reviewPost?.user_id?.profile_picture ? (
                    <Avatar
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${reviewPost?.user_id?.profile_picture}`}
                      sx={{
                        width: 64,
                        height: 64,
                        mr: 3,
                        border: '4px solid white',
                        mb: 3
                      }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        mr: 3,
                        border: '4px solid white',
                        bgcolor: 'primary.main',
                        fontSize: '1.1rem',
                        mb: 3,
                        fontWeight: 'bold'
                      }}
                    >
                      {getInitials(`${reviewPost?.user_id?.first_name} ${reviewPost?.user_id?.last_name}`)}
                    </Avatar>
                  )}
                  <Box>
                    <Typography variant='h6'>
                      <Rating 
                        value={reviewPost?.rating} 
                        readOnly 
                        size="small"
                        sx={{ color: '#f85241' }}
                      /> 
                      {reviewPost?.user_id?.first_name} {reviewPost?.user_id?.last_name}
                    </Typography>
                    <Typography variant='caption' color='textSecondary'>
                      {truncateHTMLWords(reviewPost?.review_text, 10)}
                    </Typography>
                  </Box>
                </Box>
              </Typography>
            ):(
              <>
              {(storyPost?.image || comment.post_image) && (
                <img
                  src={
                    comment.collection_name === "destination_story"
                      ? (storyPost?.image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${storyPost.image}` : '')
                      : comment.collection_name === "adventure_guide"
                      ? (comment.post_image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${comment.post_image}` : '')
                      : comment.post_image
                  }
                  alt={comment.post_title}
                  style={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 4,
                    marginBottom: 16
                  }}
                />
              )}

              <Typography variant='body1' fontWeight='medium' sx={{ mb: 2 }}>
                {
                  comment.collection_name === 'destination_story' ? (
                    <>
                      {storyPost && `${storyPost.title} (${storyPost.name})`}
                    </>
                  ) : (
                    <>
                      {comment.post_title}
                    </>
                  )
                }
                
              </Typography>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                 const urlPrefix =
                  comment.collection_name === "destination_story"
                    ? "our-destinations"
                    : comment.collection_name === "adventure_post"
                    ? "our-adventure"
                    : comment.collection_name === "adventure_guide"
                    ? "adventure-guide"
                    : "";

                  const urlSlug =
                    comment.collection_name === "destination_story"
                      ? storyPost.post_url
                      : comment.collection_name === "adventure_post"
                      ? comment.post_url
                      : comment.collection_name === "adventure_guide"
                      ? comment.post_url
                      : "";

                  const fullUrl = `/${urlPrefix ? `${urlPrefix}/` : ''}${urlSlug}`;

                  window.open(fullUrl, '_blank');
                }}
              >
                View Post
              </Button>
              </>
            )}
          </Box>
        </Card>

        {/* Actions */}
        <Card>
          <Box sx={{ p: 4 }}>
            <Typography variant='h6' sx={{ mb: 3 }}>
              Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant='contained'
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialog(true)}
                color='error'
              >
                Delete Comment
              </Button>
            </Box>
          </Box>
        </Card>
      </Grid>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this comment? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Report Actions Menu */}
      <Menu
        anchorEl={actionMenu?.anchor}
        open={Boolean(actionMenu)}
        onClose={() => setActionMenu(null)}
      >
        <MenuItem 
          onClick={() => actionMenu && handleReportAction(actionMenu.report._id, 'reviewed')}
          disabled={actionMenu?.report.status === 'reviewed'}
        >
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          <ListItemText>Mark as Under Review</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => actionMenu && handleReportAction(actionMenu.report._id, 'resolved')}
          disabled={actionMenu?.report.status === 'resolved'}
        >
          <ListItemIcon>
            <CheckCircleIcon />
          </ListItemIcon>
          <ListItemText>Mark as Resolved</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => actionMenu && handleReportAction(actionMenu.report._id, 'dismissed')}
          disabled={actionMenu?.report.status === 'dismissed'}
        >
          <ListItemIcon>
            <CancelIcon />
          </ListItemIcon>
          <ListItemText>Dismiss Report</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => actionMenu && handleReportAction(actionMenu.report._id, 'pending')}
          disabled={actionMenu?.report.status === 'pending'}
        >
          <ListItemIcon>
            <ScheduleIcon />
          </ListItemIcon>
          <ListItemText>Re-open as Pending</ListItemText>
        </MenuItem>
      </Menu>
    </Grid>
  )
}

export default ViewComment