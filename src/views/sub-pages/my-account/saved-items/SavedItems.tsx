"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { Rating, Avatar } from '@mui/material';

import classnames from 'classnames'
import styles from './../styles.module.css'

import * as Common from '@/app/server/common';
import { removeSaved, addSaved } from '@/app/server/saved';

const SavedItems = ({ data }: { data?: [] }) => {  
  console.log(data)
  const [savedPosts, setsavedPosts] = useState(data?.data?? []);
  const [filter, setFilter] = useState('all');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  // Initialize saved state for each item
  const initializesavedState = (posts: any[]) => {
    return posts.reduce((acc, post) => {
      acc[post._id] = true; // All items start as saved since they're from saved posts
      return acc;
    }, {});
  };

  const [savedStates, setsavedStates] = useState<{[key: string]: boolean}>({});

  // Initialize saved states when component mounts or data changes
  useEffect(() => {
    if (savedPosts.length > 0) {
      setsavedStates(initializesavedState(savedPosts));
    }
  }, [savedPosts]);

  const getPostTypeLabel = (postType: string) => {
    const labels: { [key: string]: string } = {
      reviews: 'Review',
      adventure_post: 'Adventure',
      destination_story: 'Destination Story',
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

  const handleSaves = async (postType: string, postId: string, SavedId: string) => {
    const sess = await Common.getUserSess();
    const userIsLoggedIn = !!(sess && sess?.user?.role === 'user');
    
    setIsUserLoggedIn(userIsLoggedIn);
    setUserData(sess);

    if (!userIsLoggedIn || !sess?.user?.id) {
      return;
    }

    const previousIsSaved = savedStates[SavedId];

    // Optimistically update the UI
    setsavedStates(prev => ({
      ...prev,
      [SavedId]: !previousIsSaved
    }));

    try {
      const formData = {
        user_id: sess.user.id,
        collection_name: postType,
        collection_id: postId,
      };

      if (previousIsSaved) {
        await removeSaved(formData);
      } else {
        await addSaved(formData);
      }
    } catch (error) {
      // Revert optimistic update on error
      console.error('Error updating save:', error);
      setsavedStates(prev => ({
        ...prev,
        [SavedId]: previousIsSaved
      }));
      
      // Add the item back if there was an error
      if (previousIsSaved) {
        // You might need to restore the original item here
        // This would require keeping a backup of the original data
      }
    }
  };

  const filteredPosts = filter === 'all' 
    ? savedPosts 
    : savedPosts.filter((save: any) => save.postType === filter);

  const postTypeCounts = savedPosts.reduce((acc: { [key: string]: number }, save: any) => {
    acc[save.postType] = (acc[save.postType] || 0) + 1;
    return acc;
  }, {});

  const renderListItem = (save: any) => {
    const { post, postType, _id } = save;
    const isItemSaved = savedStates[_id] || false;
    
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
                c
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
              onClick={() => handleSaves(postType, post._id, _id)}
              className={classnames(styles.dislike_btn)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="11.743" 
                height="13.953" 
                viewBox="0 0 11.743 13.953"
              >
                <path 
                  data-name="Path 796" 
                  d="M0,.006V13.92l6.037-3.857,5.706,3.9V.006Z" 
                  transform="translate(0 -0.006)" 
                  fill={isItemSaved ? "#EA5647" : "#696767"}
                />
              </svg>
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
              All ({savedPosts.length})
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
              <h3>No saved posts found</h3>
              <p>
                {filter === 'all' 
                  ? "You haven't saved any posts yet. Start exploring!" 
                  : `No ${getPostTypeLabel(filter).toLowerCase()} posts found in your saves.`
                }
              </p>
            </div>
          ) : (
            <>              
              <div className={classnames(styles.liked_posts_list)}>
                {filteredPosts.map((save: any) => renderListItem(save))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedItems;