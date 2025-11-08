import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import styles from './styles.module.css';
import * as Common from '@/app/server/common';

// Import server functions
import { getLikesStatus } from '@/app/server/likes';
import { getSavedSatus } from '@/app/server/saved';

import { useSave } from './useSave';
import { useLike } from './useLike';
import { useComment } from './useComment';
import { useShare } from './useShare';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })
import 'react-quill-new/dist/quill.snow.css';

interface SocialSectionProps {
  collectionName: string;
  collectionID: string;
  format?: string;
  color?: string
}

const SocialSection = ({ collectionName, collectionID, format, color }: SocialSectionProps) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  
  // Login popup function
  const showPopupOnce = useCallback(() => {
    if (typeof window !== 'undefined' && !window.__loginPopupShown) {
      window.__loginPopupShown = true;
      setShowLoginPopup(true);
    }
  }, []);

  const closePopup = useCallback(() => {
    setShowLoginPopup(false);
    if (typeof window !== 'undefined') window.__loginPopupShown = false;
  }, []);

  // Custom hooks - pass showPopupOnce function
  const saveHook = useSave({ 
    collectionName, 
    collectionID, 
    isUserLoggedIn, 
    userData,
    showPopupOnce 
  });
  
  const likeHook = useLike({ 
    collectionName, 
    collectionID, 
    isUserLoggedIn, 
    userData,
    showPopupOnce 
  });
  
  const commentHook = useComment({ 
    collectionName, 
    collectionID, 
    isUserLoggedIn, 
    userData,
    showPopupOnce 
  });
  
  const shareHook = useShare({ 
    collectionName, 
    collectionID, 
    isUserLoggedIn, 
    userData
  });

  let isFormat: string[] = [];
  if(format){
    isFormat = format.split(",");
  }

  // Memoized fetch function
  const fetchInitialData = useCallback(async () => {
    if (!collectionID || !collectionName) return;
    
    try {
      setIsLoading(true);

      const sess = await Common.getUserSess();
      const userIsLoggedIn = !!(sess && sess?.user?.role === 'user');
      
      setIsUserLoggedIn(userIsLoggedIn);
      setUserData(sess);

      // Fetch like status
      const likeFormData = {
        'collection_name': collectionName,
        'collection_id': collectionID,
        'user_id': userIsLoggedIn ? sess?.user?.id : null
      };
      
      const likesStatus = await getLikesStatus(likeFormData);
      likeHook.setIsLiked(likesStatus?.hasLiked || false);
      likeHook.setLikesCount(likesStatus?.totalLikes || 0);

      // Fetch save status if user is logged in
      if (userIsLoggedIn) {
        const savedStatus = await getSavedSatus(likeFormData);
        saveHook.setIsSaved(savedStatus?.hasSaved || false);
      }

    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [collectionName, collectionID]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const loginPopup = showLoginPopup
    ? ReactDOM.createPortal(
        <div className={classnames(styles.popupOverlay, styles.ppLoginCheckSocial)}>
          <div className={styles.popupContainer}>
            <h3 className="fs_35">Login Required</h3>
            <p>Please log in to like, save, or comment this post.</p>
            <div className={classnames(styles.popupButtons, 'btn')}>
              <button
                onClick={() => (window.location.href = '/signin/')}
                className={styles.loginBtn}
              >
                Login
              </button>
              <button onClick={closePopup} className={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  if (isLoading) {
    return (
      <div className={classnames(styles.network_travel_likes, styles.loading)}>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <>
      <div
        className={classnames(styles.network_travel_likes, {
          'orange_social_lssc': color === 'orange',
        })}
      >
        {
          isFormat.length > 0 ? (
            isFormat.map((fData, index) => {
              if (fData === 'ago') {
                return <span key={index}>3w</span>;
              } else if (fData === 'comment') {
                return <span key={index}>{commentHook.commentsCount} comments</span>;
              } else if (fData === 'like') {
                return <span key={index}>{likeHook.likesCount} likes</span>;
              } else if (fData === 'reply') {
                return <span key={index}>Reply</span>;
              } else {
                return null;
              }
            })
          ) : (
            <>
              <span>3w</span>
              <span>{likeHook.likesCount} likes</span>
              <span>Reply</span>
            </>
          )
        }
        <ul>          
          {/* Save Button */}
          <li>
            <a 
              href="#" 
              tabIndex={0} 
              onClick={saveHook.handleSaved}
              className={classnames({ 
                'saved': saveHook.isSaved,
              })}
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
                  fill={saveHook.isSaved ? "#EA5647" : "#696767"}
                />
              </svg>
            </a>
          </li>

          {/* Like Button */}
          <li>
            <a 
              href="#" 
              tabIndex={0} 
              onClick={likeHook.handleLike}
              className={classnames({ 
                'liked': likeHook.isLiked,
              })}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="15.16" 
                height="13.46" 
                viewBox="0 0 15.16 13.46"
              >
                <path 
                  data-name="Path 1207" 
                  d="M19.708,1.393l-.15-.15a4.064,4.064,0,0,0-5.732,0l-.515.515-.519-.519a4.152,4.152,0,0,0-5.724,0l-.15.15A4.034,4.034,0,0,0,5.729,4.268,3.983,3.983,0,0,0,6.918,7.126l6.4,6.4L19.708,7.13v0a4.068,4.068,0,0,0,0-5.732" 
                  transform="translate(-5.729 -0.063)" 
                  fill={likeHook.isLiked ? "#EA5647" : "#696767"}
                />
              </svg>
            </a>
          </li>
          
          {/* Comment Button */}
          <li>
            <a href="#" tabIndex={0} onClick={commentHook.handleCommentClick}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14.159" 
                height="14" 
                viewBox="0 0 14.159 14"
              >
                <path 
                  data-name="Path 1208" 
                  d="M25.51,9.482A6.874,6.874,0,0,0,25.964,7a7,7,0,1,0-6.994,7,6.8,6.8,0,0,0,2.845-.609l4.316.356Z" 
                  transform="translate(-11.973)" 
                  fill="#696767"
                />
              </svg>
            </a>
          </li>
          
          {/* Share Button */}
          <li>
            <a href="#" tabIndex={0} onClick={shareHook.handleShareClick}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="15.456" 
                height="13.735" 
                viewBox="0 0 15.456 13.735"
              >
                <g data-name="Group 876" transform="translate(18.256 -130.131)">
                  <path 
                    data-name="Path 798" 
                    d="M32.689.03l-9.3,5.4-5.5-5.4Z" 
                    transform="translate(-36.143 130.1)" 
                    fill="#696767"
                  />
                  <path 
                    data-name="Path 799" 
                    d="M28.752.25l-7.4,12.794-2.072-7.29Z" 
                    transform="translate(-31.551 130.822)" 
                    fill="#696767"
                  />
                </g>
              </svg>
            </a>
          </li>
        </ul>
      </div>
      
      {loginPopup}
      {commentHook.commentPopup}
      {shareHook.sharePopup}
    </>
  );
};

export default SocialSection;