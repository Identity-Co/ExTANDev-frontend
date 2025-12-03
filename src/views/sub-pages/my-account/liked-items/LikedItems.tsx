"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { Rating, Avatar } from '@mui/material';

import classnames from 'classnames'
import styles from './../styles.module.css'

import * as Common from '@/app/server/common';
import { removeLike, addLike } from '@/app/server/likes';

const LikedItems = ({ data }: { data?: [] }) => {  
  console.log(data)
  const [likedPosts, setLikedPosts] = useState(data?.data?? []);
  const [filter, setFilter] = useState('all');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  // Initialize liked state for each item
  const initializeLikedState = (posts: any[]) => {
    return posts.reduce((acc, post) => {
      acc[post._id] = true; // All items start as liked since they're from liked posts
      return acc;
    }, {});
  };

  const [likedStates, setLikedStates] = useState<{[key: string]: boolean}>({});

  // Initialize liked states when component mounts or data changes
  useEffect(() => {
    if (likedPosts.length > 0) {
      setLikedStates(initializeLikedState(likedPosts));
    }
  }, [likedPosts]);

  const getPostTypeLabel = (postType: string) => {
    const labels: { [key: string]: string } = {
      reviews: 'Review',
      adventure_post: 'Adventure',
      destination_story: 'Destination Story',
      resort_story: 'Resort Story',
      adventure_guide: 'Adventure Guide',
    };
    return labels[postType] || postType;
  };

  const getLimitedText = (text, wordLimit = 10) => {
    if (!text) return '';
    const words = text.split(' ');
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const handleLikes = async (postType: string, postId: string, likeId: string) => {
    const sess = await Common.getUserSess();
    const userIsLoggedIn = !!(sess && sess?.user?.role === 'user');
    
    setIsUserLoggedIn(userIsLoggedIn);
    setUserData(sess);

    if (!userIsLoggedIn || !sess?.user?.id) {
      return;
    }

    const previousIsLiked = likedStates[likeId];

    // Optimistically update the UI
    setLikedStates(prev => ({
      ...prev,
      [likeId]: !previousIsLiked
    }));

    try {
      const formData = {
        user_id: sess.user.id,
        collection_name: postType,
        collection_id: postId,
      };

      if (previousIsLiked) {
        await removeLike(formData);
      } else {
        await addLike(formData);
      }
    } catch (error) {
      // Revert optimistic update on error
      console.error('Error updating like:', error);
      setLikedStates(prev => ({
        ...prev,
        [likeId]: previousIsLiked
      }));
      
      // Add the item back if there was an error
      if (previousIsLiked) {
        // You might need to restore the original item here
        // This would require keeping a backup of the original data
      }
    }
  };

  const filteredPosts = filter === 'all' 
    ? likedPosts 
    : likedPosts.filter((like: any) => like.postType === filter);

  const postTypeCounts = likedPosts.reduce((acc: { [key: string]: number }, like: any) => {
    acc[like.postType] = (acc[like.postType] || 0) + 1;
    return acc;
  }, {});

  const renderListItem = (like: any) => {
    const { post, postType, _id } = like;
    const isItemLiked = likedStates[_id] || false;
    
    return (
      <div key={_id} className={classnames(styles.post_list_item)}>
        <div className={classnames(styles.post_list_image)}>
          {postType === "adventure_post" ? (
            <Link href={`/our-adventure/${post.slug}`}>
              <img src={post.image} alt={post.name || post.title} />
            </Link>
          ) : postType === "adventure_guide" ? (
            <Link href={`/adventure-guide/${post.slug}`}>
              <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${post.feature_image}`} alt={post.title} />
            </Link>
          ) : postType === "reviews" ? (
            post?.user_id?.profile_picture ? (
              <img
                src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${post?.user_id?.profile_picture}`}
                alt={post?.user_id?.first_name}
              />
            ) : (
              <Avatar
                className={classnames(styles.contact_review_img_default)}
                sx={{
                  bgcolor: 'primary.main',
                }}
              >
                {getInitials(post?.user_id?.first_name + ' ' + post?.user_id?.last_name)}
              </Avatar>
            )
          ) : (
            <img
              src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${post?.userprofile}`}
              alt={post.name}
            />
          )}
        </div>
        
        <div className={classnames(styles.post_list_content)}>
          <div className={classnames(styles.post_list_info)}>
            
            {
              postType === "adventure_post" ? (
                <h3 className={classnames(styles.post_list_title)}>
                  <Link href={`/our-adventure/${post.slug}`}>
                    {post.name || post.title}
                  </Link>
                </h3>
              ) : postType === "adventure_guide" ? (
                <h3 className={classnames(styles.post_list_title)}>
                  <Link href={`/adventure-guide/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
              ) : postType === "reviews" ? (
                <>
                  <h3 className={classnames(styles.post_list_title)}>
                    <Rating 
                      value={post?.rating} 
                      readOnly 
                      size="small"
                      sx={{ color: '#f85241' }}
                    />
                    <span>{post?.user_id?.first_name} {post?.user_id?.last_name}</span>
                  </h3>
                  <p className={classnames(styles.review_text)}>{getLimitedText(post?.review_text)}</p>
                </>
              ) : (
                <>
                  <h3 className={classnames(styles.post_list_title)}>
                    <span>{post?.name || post.title} <em>({post?.username})</em></span>
                  </h3>
                  {post?.title && (
                    <span className={classnames(styles.destination_name)}>
                      <Link href={`/our-destinations/${post?.slug}`}>Destination: {post?.title}</Link>
                    </span>
                  )}
                </>
              )
            }
            <div className={classnames(styles.post_list_meta)}>
              <span className={classnames(styles.post_list_type)}>
                {getPostTypeLabel(postType)}
              </span>
            </div>
          </div>
          
          <div className={classnames(styles.post_actions)}>            
            {/* Dislike Button */}
            <button 
              tabIndex={0} 
              onClick={() => handleLikes(postType, post._id, _id)}
              className={classnames(styles.dislike_btn)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15.16" height="13.46" viewBox="0 0 15.16 13.46"><path data-name="Path 1207" d="M19.708,1.393l-.15-.15a4.064,4.064,0,0,0-5.732,0l-.515.515-.519-.519a4.152,4.152,0,0,0-5.724,0l-.15.15A4.034,4.034,0,0,0,5.729,4.268,3.983,3.983,0,0,0,6.918,7.126l6.4,6.4L19.708,7.13v0a4.068,4.068,0,0,0,0-5.732" transform="translate(-5.729 -0.063)" fill={isItemLiked ? "#EA5647" : "#696767"}></path></svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={classnames(styles.likes_share_page)}>
      <div className={classnames(styles.dashboard_container)}>
        <div className={classnames(styles.likes_content)}>

          {/* Filter Buttons */}
          <div className={classnames(styles.filter_section)}>
            <button 
              className={classnames(styles.filter_btn, { [styles.active]: filter === 'all' })}
              onClick={() => setFilter('all')}
            >
              All ({likedPosts.length})
            </button>
            
            {Object.keys(postTypeCounts).map((postType: string) => (
              <button
                key={postType}
                className={classnames(styles.filter_btn, { [styles.active]: filter === postType })}
                onClick={() => setFilter(postType)}
              >
                {getPostTypeLabel(postType)} ({postTypeCounts[postType]})
              </button>
            ))}
          </div>

          {filteredPosts.length === 0 ? (
            <div className={classnames(styles.no_likes)}>
              <h3>No liked posts found</h3>
              <p>
                {filter === 'all' 
                  ? "You haven't liked any posts yet. Start exploring!" 
                  : `No ${getPostTypeLabel(filter).toLowerCase()} posts found in your likes.`
                }
              </p>
            </div>
          ) : (
            <>              
              <div className={classnames(styles.liked_posts_list)}>
                {filteredPosts.map((like: any) => renderListItem(like))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikedItems;