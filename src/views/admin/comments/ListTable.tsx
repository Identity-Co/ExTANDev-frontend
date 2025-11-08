'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import { useParams } from 'next/navigation'

import Link from 'next/link'

// MUI Imports
import type { IconProps } from '@mui/material/Icon';
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import { 
  Chip, 
  Box, 
  Paper, 
  Collapse, 
  CardContent,
  AvatarGroup,
  Tooltip,
  alpha,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField'

import { toast } from 'react-toastify';

// Third-party Imports
import classnames from 'classnames'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

import { useNavigationStore } from '@/libs/navigation-store'

import CustomAvatar from '@core/components/mui/Avatar'

import * as CommentsLists from '@/app/server/comments'

type CommentsTypesWithAction = {
  action?: string
  full_name?: string
  _id?: string
}

const Icon = styled('i')({})

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)

  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

const getInitials = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase();
};

const getAvatar = (params: Pick<UsersType, 'avatar' | 'fullName' | 'borderclr'>) => {
  const { avatar, fullName, borderclr } = params
  
  if (avatar) {
    return <CustomAvatar src={avatar} skin='light' size={38} className={borderclr} />
  } else {
    return (
      <CustomAvatar skin='light' size={38} className={borderclr} sx={{bgcolor: 'primary.main', fontSize: '0.8rem'}}>
        {getInitials(fullName as string)}
      </CustomAvatar>
    )
  }
}

const statusConfig = {
  'adventure_post': { label: "Adventure Post", color: "primary", icon: "ri-map-pin-line" },
  'destination_story': { label: "Destination Story", color: "secondary", icon: "ri-bookmark-line" },
  'reviews': { label: "Reviews", color: "info", icon: "ri-star-line" },
};

// Post type filter options
const postTypeOptions = [
  { value: 'all', label: 'All Post Types', icon: 'ri-list-check' },
  { value: 'adventure_post', label: 'Adventure Posts', icon: 'ri-map-pin-line' },
  { value: 'destination_story', label: 'Destination Stories', icon: 'ri-bookmark-line' },
  { value: 'reviews', label: 'Reviews', icon: 'ri-star-line' },
];

const formatDate = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
};

function truncateHTMLWords(html: string, limit = 50) {
  const text = html.replace(/<[^>]*>/g, ' ');
  const words = text.trim().split(/\s+/);
  const truncated = words.slice(0, limit).join(' ');
  const result = words.length > limit ? `${truncated}…` : truncated;

  return result;
}

// Styled Components
const StyledCommentCard = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '12px',
  overflow: 'hidden',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[3],
    borderColor: alpha(theme.palette.primary.main, 0.3),
  }
}));

const ReplyIndicator = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: 24,
  top: 0,
  bottom: 0,
  width: '2px',
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  borderRadius: '1px'
}));

// Comment Card Component
const CommentCard = ({ comment, onDelete }: { comment: any; onDelete: (id: string) => void }) => {
  const [expanded, setExpanded] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;
  const config = statusConfig[comment.collection_name];

  return (
    <StyledCommentCard elevation={0}>
      {/* Main Comment */}
      <CardContent className='p-5'>
        <div className='flex items-start gap-4'>
          {/* Avatar */}
          <div className='flex-shrink-0'>
            {comment.user_avatar ? 
              getAvatar({ 
                avatar: process.env.NEXT_PUBLIC_UPLOAD_URL+'/'+comment.user_avatar, 
                fullName: comment.user_name ?? '', 
                borderclr: '#FFF'
              }) : 
              getAvatar({ 
                fullName: comment.user_name ?? '', 
                borderclr: '#FFF'
              })
            }
          </div>

          {/* Content */}
          <div className='flex-1 min-w-0'>
            {/* Header */}
            <div className='flex items-start justify-between mb-3'>
              <div className='flex items-center gap-3 flex-wrap'>
                <div>
                  <Typography className='font-semibold' color='text.primary' sx={{ fontSize: '1rem' }}>
                    {comment.user_name}
                  </Typography>
                  <Typography className='font-semibold' color='text.primary' sx={{ fontSize: '0.75rem' }}>
                    {comment.user_email}
                  </Typography>
                </div>
                <div className='flex items-center gap-2'>
                  <Typography variant='caption' color='text.secondary' sx={{ fontSize: '0.75rem' }}>
                    {formatDate(comment.created_at)}
                  </Typography>
                  <Chip 
                    icon={<i className={config?.icon || 'ri-chat-1-line'} style={{ fontSize: '12px' }} />}
                    label={config?.label || 'Unknown'} 
                    size="small" 
                    variant="filled"
                    color={config?.color || 'default'}
                    sx={{ height: '22px', fontSize: '0.7rem' }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className='flex items-center gap-1'>
                <Tooltip title="View details">
                  <IconButton 
                    sx={{ 
                      color: 'info.main',
                      '&:hover': { color: 'primary.main', backgroundColor: alpha('#7367F0', 0.08) }
                    }} 
                    href={'/admin/comments/view/'+comment._id} 
                    size="small"
                  >
                    <i className='ri-eye-line' />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete comment">
                  <IconButton 
                    sx={{ 
                      color: 'error.main',
                      '&:hover': { color: 'error.main', backgroundColor: alpha('#FF4D49', 0.08) }
                    }} 
                    onClick={() => onDelete(comment._id)} 
                    size="small"
                  >
                    <i className='ri-delete-bin-6-line' />
                  </IconButton>
                </Tooltip>
                {hasReplies && (
                  <Tooltip title={expanded ? "Hide replies" : "Show replies"}>
                    <IconButton 
                      size="small"
                      onClick={() => setExpanded(!expanded)}
                      sx={{ 
                        color: 'primary.main',
                        backgroundColor: alpha('#7367F0', 0.08),
                        '&:hover': { backgroundColor: alpha('#7367F0', 0.16) }
                      }}
                    >
                      <i className={expanded ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'} />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </div>

            {/* Comment Content */}
            <div className='mb-4'>
              <div
                className='text-textPrimary'
                style={{
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                  lineHeight: '1.6',
                }}
                dangerouslySetInnerHTML={{ __html: truncateHTMLWords(comment.comment || '', 25) }}
              />
            </div>

            {/* Meta Information */}
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <i className='ri-file-text-line text-textSecondary' style={{ fontSize: '14px' }} />
                <Typography variant="body2" color="text.primary" className="font-medium">
                  {comment.collection_name === "reviews" ? (
                    `${comment.story_name} (${comment.story_username})`
                  ) : (
                    <Link
                      href={
                        comment.collection_name === "adventure_post"
                          ? `/our-adventure/${comment.post_url}`
                          : comment.collection_name === "destination_story"
                          ? `/our-destinations/${comment.post_url}`
                          : "#"
                      }
                      target="_blank"
                    >
                      {comment.collection_name === "destination_story"
                        ? `${comment.post_title} (${comment.story_name})`
                        : comment.post_title}
                    </Link>
                  )}
                </Typography>
              </div>
              
              {hasReplies && (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setExpanded(!expanded)}
                  startIcon={<i className={expanded ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'} />}
                  endIcon={
                    <Chip 
                      label={comment.replies_count} 
                      size="small" 
                      variant="filled" 
                      color="primary"
                      sx={{ height: '18px', minWidth: '20px', fontSize: '0.65rem' }}
                    />
                  }
                  sx={{ 
                    color: 'primary.main',
                    fontSize: '0.8rem',
                    '&:hover': { backgroundColor: alpha('#7367F0', 0.08) }
                  }}
                >
                  {expanded ? 'Hide' : 'Show'} replies
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Replies Section */}
      <Collapse in={expanded} timeout="auto">
        <div className='bg-action-hover border-t relative'>
          <ReplyIndicator />
          {comment.replies.map((reply: any, index: number) => (
            <CardContent key={reply._id} className='p-5 pl-16 relative'>
              <div className='flex items-start gap-4'>
                {/* Reply Avatar */}
                <div className='flex-shrink-0'>
                  {reply.user_avatar ? 
                    getAvatar({ 
                      avatar: process.env.NEXT_PUBLIC_UPLOAD_URL + '/' + reply.user_avatar, 
                      fullName: reply.user_name ?? '', 
                      borderclr: '#FFF'
                    }) : 
                    getAvatar({ 
                      fullName: reply.user_name ?? '', 
                      borderclr: '#FFF'
                    })
                  }
                </div>

                {/* Reply Content */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex items-center gap-3'>
                      <div>
                        <Typography className='font-semibold' color='text.primary' sx={{ fontSize: '1rem' }}>
                          {comment.user_name}
                        </Typography>
                        <Typography className='font-semibold' color='text.primary' sx={{ fontSize: '0.75rem' }}>
                          {comment.user_email}
                        </Typography>
                      </div>
                      <Chip 
                        label="Reply" 
                        size="small" 
                        variant="filled" 
                        color="secondary"
                        sx={{ height: '20px', fontSize: '0.65rem' }}
                      />
                      <Typography variant='caption' color='text.secondary'>
                        {formatDate(reply.created_at)}
                      </Typography>
                    </div>

                    <div className='flex items-center gap-1'>
                      <Tooltip title="View reply">
                        <IconButton 
                          sx={{ 
                            color: 'info.main',
                            '&:hover': { color: 'primary.main', backgroundColor: alpha('#7367F0', 0.08) }
                          }} 
                          href={'/admin/comments/view/' + reply._id} 
                          size="small"
                        >
                          <i className='ri-eye-line' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete reply">
                        <IconButton 
                          sx={{ 
                            color: 'error.main',
                            '&:hover': { color: 'error.main', backgroundColor: alpha('#FF4D49', 0.08) }
                          }} 
                          onClick={() => onDelete(reply._id)} 
                          size="small"
                        >
                          <i className='ri-delete-bin-6-line' />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>

                  <div className='text-textPrimary'
                    style={{
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                      lineHeight: '1.6',
                    }}
                    dangerouslySetInnerHTML={{ __html: truncateHTMLWords(reply.comment || '', 25) }}
                  />
                </div>
              </div>
            </CardContent>
          ))}
        </div>
      </Collapse>
    </StyledCommentCard>
  );
};

const CommentsListTable = ({ tableData }: { tableData?: [] }) => {
  const setLoading = useNavigationStore((s) => s.setLoading)

  // States
  const [data, setData] = useState<[]>(tableData ?? [])
  const [globalFilter, setGlobalFilter] = useState('')
  const [postTypeFilter, setPostTypeFilter] = useState('all')
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [entryID, setId] = useState<string>('')
  const [openDelete, setOpenDelete] = useState(false)

  const [isDeleting, setIsDeleting] = useState(false);

  // Hooks
  const { lang: locale } = useParams()

  const fetchData = async () => {
    try {
      const refresh = await CommentsLists.getAllComments();
      
      if (Array.isArray(refresh)) {
        setData(refresh);
      } else {
        toast.error('Failed to fetch updated data');
      }
    } catch (error) {
      toast.error('Error fetching updated data');
      console.error('Fetch error:', error);
    }
  };

  const handleDeleteList = async (id?: string) => {
    setId(id ?? '')
    setOpenDelete(true)
  }

  const handleDeleteClose = () => {
    setOpenDelete(false)
  };

  const handleDeleteAction = async () => {
    try {
      setIsDeleting(true)
      const res = await CommentsLists.deleteComment(entryID)
      toast.success('Comment deleted successfully');
      setOpenDelete(false)
      await fetchData();
    } catch (error) {
      toast.error('Error deleting Comment');
      console.error('Delete error:', error);
    }  
    setIsDeleting(false)
  }

  // Filter data based on global search and post type
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply post type filter
    if (postTypeFilter !== 'all') {
      filtered = filtered.filter(comment => comment.collection_name === postTypeFilter);
    }

    // Apply global search filter
    if (globalFilter) {
      filtered = filtered.filter(comment => {
        const searchableText = [
          comment.user_name,
          comment.email,
          comment.post_title,
          comment.comment?.replace(/<[^>]*>/g, ' '),
          statusConfig[comment.collection_name]?.label
        ].filter(Boolean).join(' ').toLowerCase();

        return searchableText.includes(globalFilter.toLowerCase());
      });
    }

    return filtered;
  }, [data, globalFilter, postTypeFilter]);

  // Get count of comments by post type for filter display
  const postTypeCounts = useMemo(() => {
    const counts = {
      all: data.length,
      adventure_post: 0,
      destination_story: 0,
      reviews: 0
    };

    data.forEach(comment => {
      if (comment.collection_name in counts) {
        counts[comment.collection_name]++;
      }
    });

    return counts;
  }, [data]);

  // Pagination calculations
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(0, endIndex);
  const hasMore = endIndex < totalItems;

  const handleLoadMore = () => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handlePostTypeFilterChange = (value: string) => {
    setPostTypeFilter(value);
    setCurrentPage(1);
  };

  // Reset to page 1 when search filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [globalFilter, postTypeFilter]);

  return (
    <>
      <Card sx={{ borderRadius: '12px' }}>
        <CardHeader 
          title={
            <div className='flex items-center gap-2'>
              <Typography variant='h5' className='font-semibold'>
                Comments
              </Typography>
            </div>
          }
          sx={{ 
            padding: '24px',
            '& .MuiCardHeader-subheader': { color: 'text.secondary', marginTop: '4px' }
          }}
        />
        <Divider />
        
        {/* Header with Stats and Search */}
        <div className='p-6 bg-action-hover'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <div className='bg-primary rounded-lg p-3'>
                <i className='ri-chat-3-line text-white' style={{ fontSize: '1.25rem' }} />
              </div>
              <div>
                <Typography variant='h6' className='font-semibold'>
                  {totalItems} Comments
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {currentItems.length} displayed • {hasMore ? `${totalItems - currentItems.length} more to load` : 'All comments loaded'}
                  {postTypeFilter !== 'all' && ` • Filtered by ${postTypeOptions.find(opt => opt.value === postTypeFilter)?.label}`}
                </Typography>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-3'>
              {/* Post Type Filter */}
              <div className='flex items-center gap-2 bg-white rounded-lg px-3 py-1 border'>
                <i className='ri-filter-line text-textSecondary' style={{ fontSize: '16px' }} />
                <select 
                  value={postTypeFilter}
                  onChange={(e) => handlePostTypeFilterChange(e.target.value)}
                  className='border-0 bg-transparent py-1 text-sm focus:outline-none focus:ring-0'
                >
                  {postTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} ({postTypeCounts[option.value] || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Items Per Page */}
              <div className='flex items-center gap-2 bg-white rounded-lg px-3 py-1 border'>
                <i className='ri-list-check text-textSecondary' style={{ fontSize: '16px' }} />
                <select 
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className='border-0 bg-transparent py-1 text-sm focus:outline-none focus:ring-0'
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>

              {/* Search Input */}
              <DebouncedInput
                value={globalFilter ?? ''}
                onChange={value => setGlobalFilter(String(value))}
                placeholder='Search comments, users, or posts...'
                InputProps={{
                  startAdornment: <i className='ri-search-line text-textSecondary mr-2' style={{ fontSize: '16px' }} />,
                }}
                sx={{ 
                  minWidth: 280,
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: '8px',
                    backgroundColor: 'white'
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Comments List */}
        <div className='p-6'>
          {currentItems.length === 0 ? (
            <div className='text-center py-12'>
              <div className='bg-action-hover rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
                <i className='ri-chat-off-line text-textSecondary' style={{ fontSize: '2rem' }} />
              </div>
              <Typography variant='h6' color='text.secondary' className='mb-2'>
                {globalFilter || postTypeFilter !== 'all' ? 'No matching comments found' : 'No comments yet'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {globalFilter || postTypeFilter !== 'all' ? 'Try adjusting your search terms or filters' : 'Comments will appear here once users start engaging'}
              </Typography>
            </div>
          ) : (
            <div className='space-y-4'>
              {currentItems.map((comment) => (
                <CommentCard 
                  key={comment._id} 
                  comment={comment} 
                  onDelete={handleDeleteList}
                />
              ))}
            </div>
          )}
        </div>

        {/* Load More */}
        {hasMore && (
          <>
            <Divider />
            <div className='flex justify-center p-6'>
              <Button 
                variant='contained'
                onClick={handleLoadMore}
                startIcon={<i className='ri-add-line' />}
                sx={{
                  borderRadius: '8px',
                  padding: '8px 20px',
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                Load More Comments ({totalItems - currentItems.length} remaining)
              </Button>
            </div>
          </>
        )}

        {/* Results Summary */}
        {currentItems.length > 0 && (
          <div className='bg-action-hover border-t'>
            <div className='px-6 py-3'>
              <Typography variant='body2' color='text.secondary' className='text-center'>
                Showing {Math.min(currentItems.length, totalItems)} of {totalItems} comments
                {globalFilter && ' • Filtered by search'}
                {postTypeFilter !== 'all' && ` • Filtered by ${postTypeOptions.find(opt => opt.value === postTypeFilter)?.label}`}
              </Typography>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDelete}
        onClose={handleDeleteClose}
        PaperProps={{
          sx: { borderRadius: '12px' }
        }}
      >
        <DialogTitle className='text-center'>
          <div className='bg-error rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3'>
            <i className='ri-delete-bin-7-line text-white' style={{ fontSize: '1.5rem' }} />
          </div>
          Delete Comment?
        </DialogTitle>
        <DialogContent>
          <DialogContentText className='text-center'>
            This action cannot be undone. The comment will be permanently removed from the system.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, padding: '20px' }}>
          <Button 
            onClick={handleDeleteClose} 
            variant='outlined' 
            color='secondary'
            sx={{ borderRadius: '6px', minWidth: '100px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAction} 
            variant='contained' 
            color='error'
            startIcon={<i className='ri-delete-bin-7-line' />}
            sx={{ borderRadius: '6px', minWidth: '100px' }}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CommentsListTable