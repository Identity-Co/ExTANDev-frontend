import { useState, useRef, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import dynamic from 'next/dynamic';
import classnames from 'classnames';
import styles from './styles.module.css';
import { Avatar } from '@mui/material';
import { addComment, getComments, upvoteComment, markHelpfulComment, reportComment } from '@/app/server/comments';

import EmojiPickerButton from '@/components/EmojiPickerButton'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// SVG Icon Components (keep all your existing icons)
const UpvoteIcon = ({ active = false }: { active?: boolean }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    className={classnames(styles.icon, { [styles.active]: active })}
  >
    <path d="M14 10h4.764a2 2 0 0 1 1.789 2.894l-3.5 7A2 2 0 0 1 15.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 0 0-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h2.5"/>
  </svg>
);

const HelpfulIcon = ({ active = false }: { active?: boolean }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    className={classnames(styles.icon, { [styles.active]: active })}
  >
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

const ReplyIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    className={styles.icon}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const ReportIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    className={styles.icon}
  >
    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
  </svg>
);

const CloseIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    className={styles.icon}
  >
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const CheckIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    className={styles.icon}
  >
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

// Image Upload Icons
const UploadIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    className={styles.icon}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const RemoveImageIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    className={styles.icon}
  >
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

interface UseCommentProps {
  collectionName: string;
  collectionID: string;
  isUserLoggedIn: boolean;
  userData: any;
  showPopupOnce: () => void;
  theme?: {
    primary?: string;
    secondary?: string;
    success?: string;
    error?: string;
    text?: string;
    background?: string;
  };
}

interface Comment {
  _id: string;
  user: {
    first_name: string;
    last_name: string;
    profile_picture?: string;
    _id: string;
  };
  comment: string;
  created_at: string;
  replies?: Comment[];
  parent_id?: string;
  upvoteCount?: number;
  upvoted_by_user?: boolean;
  helpfulCount?: number;
  marked_helpful_by_user?: boolean;
  reported_by_user?: boolean;
  images?: string[];
}

interface ReportFormData {
  reason: string;
  description: string;
}

interface ImageUpload {
  file: File;
  preview: string;
  uploading?: boolean;
  error?: string;
}

export const useComment = ({ 
  collectionName, 
  collectionID, 
  isUserLoggedIn, 
  userData,
  showPopupOnce,
}: UseCommentProps) => {
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isCommentExpanded, setIsCommentExpanded] = useState(false);
  const [isReplyExpanded, setIsReplyExpanded] = useState<string | null>(null);
  
  // New states for report functionality
  const [reportingComment, setReportingComment] = useState<string | null>(null);
  const [reportForm, setReportForm] = useState<ReportFormData>({
    reason: '',
    description: ''
  });
  const [showReportSuccess, setShowReportSuccess] = useState(false);
  
  // New states for image upload
  const [commentImages, setCommentImages] = useState<ImageUpload[]>([]);
  const [replyImages, setReplyImages] = useState<{ [key: string]: ImageUpload[] }>({});
  const [isUploading, setIsUploading] = useState(false);
  
  const commentEditorRef = useRef<any>(null);
  const replyEditorRefs = useRef<{ [key: string]: any }>({});
  
  // Refs for scrolling to newly added items
  const commentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const commentsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //if (showCommentPopup && comments.length > 0) {
      fetchComments();
    //}
  }, [userData]);

  const editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}],
      ['link', 'blockquote'],
      ['clean']
    ],
  };

  const editorFormats = [
    'bold', 'italic', 'underline', 'strike',
    'list',
    'link', 'blockquote'
  ];

  // Report reasons
  const reportReasons = [
    'Spam',
    'Harassment',
    'Hate speech',
    'Inappropriate content',
    'False information',
    'Other'
  ];

  // Image upload functions
  const handleImageUpload = useCallback((files: FileList, isReply: boolean = false, replyId?: string) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxImages = 5;
    
    const currentImages = isReply && replyId ? (replyImages[replyId] || []) : commentImages;
    
    if (currentImages.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }
    
    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPEG, PNG, GIF, and WebP images are allowed');
        return;
      }
      
      if (file.size > maxSize) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUpload: ImageUpload = {
          file,
          preview: e.target?.result as string
        };
        
        if (isReply && replyId) {
          setReplyImages(prev => ({
            ...prev,
            [replyId]: [...(prev[replyId] || []), imageUpload]
          }));
        } else {
          setCommentImages(prev => [...prev, imageUpload]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [commentImages, replyImages]);

  const removeImage = useCallback((index: number, isReply: boolean = false, replyId?: string) => {
    if (isReply && replyId) {
      setReplyImages(prev => ({
        ...prev,
        [replyId]: prev[replyId]?.filter((_, i) => i !== index) || []
      }));
    } else {
      setCommentImages(prev => prev.filter((_, i) => i !== index));
    }
  }, []);

  // Scroll to a specific element
  const scrollToElement = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    
    setTimeout(() => {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 100);
  }, []);

  // Scroll to a comment by ID
  const scrollToComment = useCallback((commentId: string) => {
    const element = commentRefs.current[commentId];
    scrollToElement(element);
  }, []);

  const handleCommentClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    /*if (!isUserLoggedIn) {
      showPopupOnce();
      return;
    }*/
    
    setShowCommentPopup(true);
    fetchComments();
  }, [isUserLoggedIn, showPopupOnce]);

  const closeCommentPopup = useCallback(() => {
    setShowCommentPopup(false);
    setReplyingTo(null);
    setReplyContent('');
    setNewComment('');
    setIsCommentExpanded(false);
    setIsReplyExpanded(null);
    setReportingComment(null);
    setReportForm({ reason: '', description: '' });
    setCommentImages([]);
    setReplyImages({});
  }, []);

  const fetchComments = useCallback(async () => {
    if (!collectionID || !collectionName) return;
    
    try {
      setIsLoadingComments(true);
      const formData = {
        'collection_name': collectionName,
        'collection_id': collectionID,
        'user_id': isUserLoggedIn && userData ? userData?.user?.id : null
      };
      
      const commentLists_tmp = await getComments(formData);

      if(commentLists_tmp){
        const commentLists = commentLists_tmp?.map(item => {
          const userId = userData?.user?.id;

          const hasUpvoted = item?.upvotes?.includes(userId);
          const hasMarkedHelpful = item?.helpfules?.includes(userId);
          const hasReportedByUser = item?.reports?.some(report => report.user_id === userId);

          const repliesWithFlags = item.replies?.map(reply => {
            const replyUpvoted = reply?.upvotes?.includes(userId);
            const replyMarkedHelpful = reply?.helpfules?.includes(userId);
            const replyReportedByUser = reply?.reports?.some(report => report.user_id === userId);

            return {
              ...reply,
              upvoted_by_user: replyUpvoted,
              marked_helpful_by_user: replyMarkedHelpful,
              reported_by_user: replyReportedByUser,
            };
          }) || [];

          return {
            ...item,
            upvoted_by_user: hasUpvoted,
            marked_helpful_by_user: hasMarkedHelpful,
            reported_by_user: hasReportedByUser,
            replies: repliesWithFlags
          };
        });

        setComments(commentLists);
        setCommentsCount(commentLists.length);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  }, [collectionName, collectionID, isUserLoggedIn, userData]);

  // Upvote functionality
  const handleUpvote = useCallback(async (commentId: string, isUpvoted: boolean) => {
    if (!isUserLoggedIn || !userData?.user?.id) {
      showPopupOnce();
      return;
    }

    try {
      const formData = {
        comment_id: commentId,
        user_id: userData.user.id,
        action: isUpvoted ? 'remove' : 'add'
      };

      const success = await upvoteComment(formData);

      if (success) {
        setComments(prev => 
          prev.map(comment => {
            if (comment._id === commentId) {
              return {
                ...comment,
                upvoteCount: (comment.upvoteCount || 0) + (isUpvoted ? -1 : 1),
                upvoted_by_user: !isUpvoted
              };
            }
            // Also update replies
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map(reply =>
                  reply._id === commentId
                    ? {
                        ...reply,
                        upvoteCount: (reply.upvoteCount || 0) + (isUpvoted ? -1 : 1),
                        upvoted_by_user: !isUpvoted
                      }
                    : reply
                )
              };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error('Error upvoting comment:', error);
    }
  }, [isUserLoggedIn, userData, showPopupOnce]);

  // Mark as helpful functionality
  const handleMarkHelpful = useCallback(async (commentId: string, isHelpful: boolean) => {
    if (!isUserLoggedIn || !userData?.user?.id) {
      showPopupOnce();
      return;
    }

    try {
      const formData = {
        comment_id: commentId,
        user_id: userData.user.id,
        action: isHelpful ? 'remove' : 'add'
      };

      const success = await markHelpfulComment(formData);
      if (success) {
        setComments(prev => 
          prev.map(comment => {
            if (comment._id === commentId) {
              return {
                ...comment,
                helpfulCount: (comment.helpfulCount || 0) + (isHelpful ? -1 : 1),
                marked_helpful_by_user: !isHelpful
              };
            }
            // Also update replies
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map(reply =>
                  reply._id === commentId
                    ? {
                        ...reply,
                        helpfulCount: (reply.helpfulCount || 0) + (isHelpful ? -1 : 1),
                        marked_helpful_by_user: !isHelpful
                      }
                    : reply
                )
              };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error('Error marking comment as helpful:', error);
    }
  }, [isUserLoggedIn, userData, showPopupOnce]);

  // Report functionality
  const handleReport = useCallback(async (commentId: string) => {
    if (!isUserLoggedIn || !userData?.user?.id) {
      showPopupOnce();
      return;
    }

    if (!reportForm.reason) return;

    try {
      const formData = {
        comment_id: commentId,
        user_id: userData.user.id,
        reason: reportForm.reason,
        description: reportForm.description
      };

      const success = await reportComment(formData);
      if (success) {
        setComments(prev => 
          prev.map(comment => {
            if (comment._id === commentId) {
              return { ...comment, reported_by_user: true };
            }
            // Also update replies
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map(reply =>
                  reply._id === commentId
                    ? { ...reply, reported_by_user: true }
                    : reply
                )
              };
            }
            return comment;
          })
        );

        setShowReportSuccess(true);
        setReportingComment(null);
        setReportForm({ reason: '', description: '' });
        
        setTimeout(() => {
          setShowReportSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error reporting comment:', error);
    }
  }, [isUserLoggedIn, userData, reportForm, showPopupOnce]);

  const startReport = useCallback((commentId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!isUserLoggedIn) {
      showPopupOnce();
      return;
    }
    
    setReportingComment(commentId);
    setReportForm({ reason: '', description: '' });
  }, [isUserLoggedIn, showPopupOnce]);

  const cancelReport = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setReportingComment(null);
    setReportForm({ reason: '', description: '' });
  }, []);

  // Modified addComment function to handle images
  const handleAddComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isUserLoggedIn || !userData?.user?.id) {
      showPopupOnce();
      return;
    }

    if (!newComment.trim()) return;

    try {
      setIsUploading(true);

      const formData = {
        user_id: userData.user.id,
        collection_name: collectionName,
        collection_id: collectionID,
        comment: newComment,
        upvotes: [],
        upvoteCount: 0,
        helpfules: [],
        helpfulCount: 0,
        reports: [],
        parent_id: null,
      };

      const imagesList = commentImages.map((fileObj, index) => ({
        [`${fileObj.file.name}-${index}`]: fileObj.preview
      }));

      if(imagesList){
        formData.images = imagesList;
      }
      
      // Send the FormData with both text and images
      const isCommentSaved = await addComment(formData);
      if (isCommentSaved) {
        const mockComment: Comment = {
          _id: isCommentSaved._id,
          user: {
            first_name: userData?.user?.name.split(" ")[0],
            last_name: userData?.user?.name.split(" ")[1],
            profile_picture: userData?.user?.image,
            _id: userData?.user?.id,
          },
          comment: newComment,
          created_at: new Date().toISOString(),
          replies: [],
          upvoteCount: 0,
          upvoted_by_user: false,
          helpfulCount: 0,
          marked_helpful_by_user: false,
          reported_by_user: false,
          images: isCommentSaved.images || []
        };

        setComments(prev => [mockComment, ...prev]);
        setCommentsCount(prev => prev + 1);
        setNewComment('');
        setCommentImages([]);
        setIsCommentExpanded(false);
        
        setTimeout(() => {
          scrollToComment(isCommentSaved._id);
        }, 150);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsUploading(false);
    }
  }, [newComment, commentImages, isUserLoggedIn, userData, collectionName, collectionID, scrollToComment, showPopupOnce]);

  // Modified addReply function to handle images
  const handleAddReply = useCallback(async (parentId: string) => {
    if (!isUserLoggedIn || !userData?.user?.id) {
      showPopupOnce();
      return;
    }

    const currentReplyImages = replyImages[parentId] || [];
    
    if (!replyContent.trim()) return;

    try {
      setIsUploading(true);

      const formData = {
        user_id: userData.user.id,
        collection_name: collectionName,
        collection_id: collectionID,
        comment: replyContent,
        upvotes: [],
        upvoteCount: 0,
        helpfules: [],
        helpfulCount: 0,
        reports: [],
        parent_id: parentId,
      };

      const imagesList = currentReplyImages.map((fileObj, index) => ({
        [`${fileObj.file.name}-${index}`]: fileObj.preview
      }));

      if(imagesList){
        formData.images = imagesList;
      }
      
      // Send the FormData with both text and images
      const isCommentSaved = await addComment(formData);
      if (isCommentSaved) {
        const mockReply: Comment = {
          _id: isCommentSaved._id,
          user: {
            first_name: userData?.user?.name.split(" ")[0],
            last_name: userData?.user?.name.split(" ")[1],
            profile_picture: userData?.user?.image,
            _id: userData?.user?.id,
          },
          comment: replyContent,
          created_at: new Date().toISOString(),
          upvoteCount: 0,
          upvoted_by_user: false,
          helpfulCount: 0,
          marked_helpful_by_user: false,
          reported_by_user: false,
          images: isCommentSaved.images || [] // Use images from saved reply
        };

        setComments(prev => 
          prev.map(comment => 
            comment._id === parentId 
              ? { 
                  ...comment, 
                  replies: [...(comment.replies || []), mockReply] 
                }
              : comment
          )
        );
        
        setCommentsCount(prev => prev + 1);
        setReplyContent('');
        setReplyingTo(null);
        setIsReplyExpanded(null);
        // Clear images for this specific reply
        setReplyImages(prev => ({ ...prev, [parentId]: [] }));
        
        setTimeout(() => {
          scrollToComment(isCommentSaved._id);
        }, 150);
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    } finally {
      setIsUploading(false);
    }
  }, [replyContent, replyImages, isUserLoggedIn, userData, collectionName, collectionID, scrollToComment, showPopupOnce]);

  const startReply = useCallback((commentId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!isUserLoggedIn) {
      showPopupOnce();
      return;
    }

    const element = commentRefs.current[commentId];
    scrollToElement(element);
    
    setReplyingTo(commentId);
    setReplyContent('');
    setIsReplyExpanded(commentId);
  }, [isUserLoggedIn, showPopupOnce]);

  const cancelReply = useCallback((commentId?: string) => {
    if (commentId) {
      setReplyingTo(null);
      setReplyContent('');
      setIsReplyExpanded(null);
      // Clear images for this specific reply
      setReplyImages(prev => ({ ...prev, [commentId]: [] }));
    } else {
      setReplyingTo(null);
      setReplyContent('');
      setIsReplyExpanded(null);
    }
  }, []);

  const expandCommentEditor = useCallback(() => {
    setIsCommentExpanded(true);
    setTimeout(() => {
      commentEditorRef.current?.focus();
    }, 100);
  }, []);

  const expandReplyEditor = useCallback((commentId: string) => {
    setIsReplyExpanded(commentId);
    setTimeout(() => {
      replyEditorRefs.current[commentId]?.focus();
    }, 100);
  }, []);

  const collapseCommentEditor = useCallback(() => {
    setIsCommentExpanded(false);
    setNewComment('');
    setCommentImages([]);
  }, []);

  const collapseReplyEditor = useCallback((commentId: string) => {
    setIsReplyExpanded(null);
    setReplyingTo(null);
    setReplyContent('');
    setReplyImages(prev => ({ ...prev, [commentId]: [] }));
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Function to set ref for a comment element
  const setCommentRef = useCallback((commentId: string, element: HTMLDivElement | null) => {
    commentRefs.current[commentId] = element;
  }, []);

  // Render image upload interface
  const renderImageUpload = useCallback((images: ImageUpload[], onRemove: (index: number) => void, onUpload: (files: FileList) => void, isReply: boolean = false) => (
    <div className={styles.imageUploadSection}>
      <div className={styles.imageUploadButtons}>
        <label className={styles.imageUploadButton}>
          <UploadIcon />
          Add Images
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={(e) => e.target.files && onUpload(e.target.files)}
            style={{ display: 'none' }}
          />
        </label>
        <span className={styles.imageUploadHint}>
          Max 5 images, 5MB each
        </span>
      </div>
      
      {images.length > 0 && (
        <div className={styles.imagePreviews}>
          {images.map((image, index) => (
            <div key={index} className={styles.imagePreview}>
              <img src={image.preview} alt={`Preview ${index + 1}`} />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className={styles.removeImageButton}
                title="Remove image"
              >
                <RemoveImageIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  ), []);

  // Render comment content with images
  const renderCommentContent = useCallback((comment: Comment) => (
    <>
      <div 
        className={styles.commentContent}
        dangerouslySetInnerHTML={{ __html: comment.comment }}
      />
      
      {comment.images && comment.images.length > 0 && (
        <div className={styles.commentImages}>
          {comment.images.map((image, index) => (
            <div key={index} className={styles.commentImage}>
              <img 
                src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${image}`}
                alt={`Comment image ${index + 1}`}
                onClick={() => window.open(`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${image}`, '_blank')}
              />
            </div>
          ))}
        </div>
      )}
    </>
  ), []);

  // Render action buttons for comments and replies
  const renderActionButtons = (comment: Comment) => (
    <div className={styles.commentActions}>
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          {isUserLoggedIn &&
            handleUpvote(comment._id, comment.upvoted_by_user || false);
          }
        }}
        className={classnames(styles.actionButton, styles.upvoteButton, {
          [styles.active]: comment.upvoted_by_user
        })}
        title="Upvote"
      >
        <UpvoteIcon active={comment.upvoted_by_user || false} />
        <span className={styles.actionCount}>{comment.upvoteCount || 0}</span>
      </button>

      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          {isUserLoggedIn &&
            handleMarkHelpful(comment._id, comment.marked_helpful_by_user || false);
          }
        }}
        className={classnames(styles.actionButton, styles.helpfulButton, {
          [styles.active]: comment.marked_helpful_by_user
        })}
        title="Mark as helpful"
      >
        <HelpfulIcon active={comment.marked_helpful_by_user || false} />
        <span className={styles.actionCount}>{comment.helpfulCount || 0}</span>
      </button>

      {isUserLoggedIn && (
        <>
          <button 
            onClick={(e) => startReply(comment._id, e)}
            className={classnames(styles.actionButton, styles.replyButton)}
          >
            <ReplyIcon />
            Reply
          </button>

          {!comment.reported_by_user && (
            <button 
              onClick={(e) => startReport(comment._id, e)}
              className={classnames(styles.actionButton, styles.reportButton)}
              title="Report"
            >
              <ReportIcon />
              Report
            </button>
          )}

          {comment.reported_by_user && (
            <span className={styles.reportedText}>
              <CheckIcon />
              Reported
            </span>
          )}
        </>
    )}
    </div>
  );

  // Render report form
  const renderReportForm = (commentId: string) => (
    <div className={styles.reportForm}>
      <h4>Report Comment</h4>
      <div className={styles.reportFormGroup}>
        <label>Reason for reporting:</label>
        <select
          value={reportForm.reason}
          onChange={(e) => setReportForm(prev => ({ ...prev, reason: e.target.value }))}
          className={styles.reportSelect}
        >
          <option value="">Select a reason</option>
          {reportReasons.map(reason => (
            <option key={reason} value={reason}>{reason}</option>
          ))}
        </select>
      </div>
      
      <div className={styles.reportFormGroup}>
        <label>Additional details (optional):</label>
        <textarea
          value={reportForm.description}
          onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Please provide more details about your report..."
          className={styles.reportTextarea}
          rows={3}
        />
      </div>
      
      <div className={styles.reportActions}>
        <button 
          onClick={() => handleReport(commentId)}
          className={styles.submitReportButton}
          disabled={!reportForm.reason}
        >
          Submit Report
        </button>
        <button 
          onClick={cancelReport}
          className={styles.cancelReportButton}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // Render comment form with image upload
  const renderCommentForm = useCallback(() => (
    <form onSubmit={handleAddComment} className={styles.addCommentForm}>
      <h4>Add a comment</h4>
      <div className={classnames(styles.commentEditorContainer, {
        [styles.expanded]: isCommentExpanded,
        [styles.collapsed]: !isCommentExpanded
      })}>
        {isCommentExpanded ? (
          <div className={styles.expandedContent}>
            <div className={styles.editorWrapper} style={{ position: "relative"}}>
              <ReactQuill
                ref={commentEditorRef}
                value={newComment}
                onChange={setNewComment}
                placeholder="Share your thoughts..."
                modules={editorModules}
                formats={editorFormats}
                className={styles.reactQuillEditor}
              />

              <EmojiPickerButton quillRef={commentEditorRef} />
            </div>
            
            {/* Image upload for comment */}
            {renderImageUpload(
              commentImages, 
              (index) => removeImage(index, false), 
              (files) => handleImageUpload(files, false)
            )}
            
            <div className={styles.commentFormActions}>
              <button 
                type="submit"
                className={styles.submitCommentButton}
                disabled={(!newComment.trim()) || newComment === '<p><br></p>' || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Post Comment'}
              </button>
              <button 
                type="button"
                onClick={collapseCommentEditor}
                className={styles.cancelCommentButton}
                disabled={isUploading}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div 
            className={styles.collapsedEditor}
            onClick={() => {
              if (!isUserLoggedIn) {
                showPopupOnce();
                return;
              }
              expandCommentEditor();
            }}
          >
            <span className={styles.collapsedPlaceholder}>
              Share your thoughts...
            </span>
          </div>
        )}
      </div>
    </form>
  ), [newComment, commentImages, isCommentExpanded, isUploading, isUserLoggedIn, showPopupOnce]);

  // Render reply form with image upload
  const renderReplyForm = useCallback((commentId: string, replyID: string = '', isReply: boolean = false) => {
    const currentReplyImages = replyImages[commentId] || [];
    let commentIdTmp = commentId;
    if(replyID){
      commentIdTmp = replyID;
    }
    
    return (
      <div className={classnames(styles.replyForm, {
        [styles.expanded]: isReplyExpanded === commentIdTmp,
        [styles.collapsed]: isReplyExpanded !== commentIdTmp
      })}>
        {isReplyExpanded === commentIdTmp ? (
          <>
            <div className={styles.editorWrapper}>
              <ReactQuill
                ref={(el) => {
                  if (el) {
                    replyEditorRefs.current[commentIdTmp] = el;
                  } else {
                    // optional: cleanup when unmounting
                    delete replyEditorRefs.current[commentIdTmp];
                  }
                }}
                value={replyContent}
                onChange={setReplyContent}
                placeholder="Write your reply..."
                modules={editorModules}
                formats={editorFormats}
                className={styles.reactQuillEditor}
                bounds={`.${styles.editorWrapper}`}
              />

              {/* Pass a ref-like object. This is created inline but that's OK. */}
              <EmojiPickerButton
                quillRef={{ current: replyEditorRefs.current[commentIdTmp] }}
              />
            </div>
            
            {/* Image upload for reply */}
            {renderImageUpload(
              currentReplyImages, 
              (index) => removeImage(index, true, commentIdTmp), 
              (files) => handleImageUpload(files, true, commentIdTmp),
              true
            )}
            
            <div className={styles.replyActions}>
              <button 
                onClick={() => handleAddReply(commentId)}
                className={styles.submitReplyButton}
                disabled={(!replyContent.trim()) ||  replyContent === '<p><br></p>' || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Post Reply'}
              </button>
              <button 
                onClick={() => collapseReplyEditor(commentIdTmp)}
                className={styles.cancelReplyButton}
                disabled={isUploading}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div 
            className={styles.collapsedEditor}
            onClick={() => {
              if (!isUserLoggedIn) {
                showPopupOnce();
                return;
              }
              expandReplyEditor(commentId);
            }}
          >
            <span className={styles.collapsedPlaceholder}>
              Write a reply...
            </span>
          </div>
        )}
      </div>
    );
  }, [replyContent, replyImages, isReplyExpanded, isUploading, isUserLoggedIn, showPopupOnce]);

  const renderComments = (commentsList: Comment[]) => {
    return commentsList.map((comment) => (
      <div 
        key={comment._id} 
        className={styles.commentItem}
        ref={(el) => setCommentRef(comment._id, el)}
      >
        <div className={styles.commentHeader}>
          <div className={styles.commentUser}>
            <div className={styles.userAvatar}>
              {comment?.user?.profile_picture ? (
                <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${comment?.user?.profile_picture}`} alt="User Profile" />
              ) : (
                <Avatar
                  className={classnames(styles.contact_review_img_default)}
                  sx={{
                    bgcolor: 'primary.main',
                  }}
                >
                  {comment?.user.first_name?.charAt(0).toUpperCase()} {comment?.user.last_name?.charAt(0).toUpperCase()}
                </Avatar>
              )}
            </div>
            <div>
              <div className={styles.userName}>{comment?.user?.first_name} {comment?.user?.last_name}</div>
            </div>
          </div>
          <span className={styles.commentDate}>{formatDate(comment.created_at)}</span>
        </div>
        
        {renderCommentContent(comment)}
        
        {renderActionButtons(comment)}

        {reportingComment === comment._id && renderReportForm(comment._id)}

        {replyingTo === comment._id && isUserLoggedIn && renderReplyForm(comment._id)}

        {comment.replies && comment.replies.length > 0 && (
          <div className={styles.repliesContainer}>
            {comment.replies.map((reply) => (
              <div 
                key={reply._id} 
                className={classnames(styles.commentItem, styles.reply)}
                ref={(el) => setCommentRef(reply._id, el)}
              >
                <div className={styles.commentHeader}>
                  <div className={styles.commentUser}>
                    <div className={styles.userAvatar}>
                      {reply?.user?.profile_picture ? (
                        <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${reply?.user?.profile_picture}`} alt="User Profile" />
                      ) : (
                        <Avatar
                          className={classnames(styles.contact_review_img_default)}
                          sx={{
                            bgcolor: 'primary.main',
                          }}
                        >
                          {reply?.user.first_name?.charAt(0).toUpperCase()} {reply?.user.last_name?.charAt(0).toUpperCase()}
                        </Avatar>
                      )}
                    </div>
                    <div>
                      <div className={styles.userName}>{reply?.user?.first_name} {reply?.user?.last_name}</div>
                    </div>
                  </div>
                  <span className={styles.commentDate}>{formatDate(reply.created_at)}</span>
                </div>
                
                {renderCommentContent(reply)}
                
                {renderActionButtons(reply)}

                {reportingComment === reply._id && renderReportForm(reply._id)}

                {replyingTo === reply._id && isUserLoggedIn && renderReplyForm(comment._id, reply._id, true)}
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  const commentPopup = showCommentPopup
    ? ReactDOM.createPortal(
        <div className={classnames(styles.popupOverlay, styles.commentPopup)} onClick={closeCommentPopup}>
          <div 
            className={classnames(styles.popupContainer, styles.commentContainer)} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.commentPopupHeader}>
              <h3>Comments ({commentsCount})</h3>
              <button 
                onClick={closeCommentPopup}
                className={styles.closeButton}
                aria-label="Close comments"
              >
                <CloseIcon />
              </button>
            </div>

            {showReportSuccess && (
              <div className={styles.reportSuccess}>
                <CheckIcon />
                Thank you for your report. We'll review it shortly.
              </div>
            )}
            
            <div 
              className={styles.commentsList}
              ref={commentsListRef}
            >
              {isLoadingComments ? (
                <div className={styles.loadingComments}>Loading comments...</div>
              ) : comments.length > 0 ? (
                renderComments(comments)
              ) : (
                <div className={styles.noComments}>
                  No comments yet
                  <div className={styles.noCommentstext}>
                    Be the first to share your thoughts!
                  </div>
                </div>
              )}
            </div>

            {isUserLoggedIn ? (
              renderCommentForm()
            ) : (
              <div className={classnames(styles.login_to_comment)}>
                <p>Please <a href="/my-account/">log in</a> to comment.</p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )
    : null;

  return {
    showCommentPopup,
    commentsCount,
    handleCommentClick,
    closeCommentPopup,
    commentPopup,
    fetchComments,
    scrollToComment
  };
};