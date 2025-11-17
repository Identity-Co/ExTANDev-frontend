// Third-party Imports
import classnames from 'classnames'
import ReactDOM from 'react-dom';
import { useState, useEffect, useCallback } from 'react'

import styles from './styles.module.css';

import { addFollow, getFollowStatus, removeFollow } from '@/app/server/follow';
import * as Common from '@/app/server/common';

const FollowUnfollowButton = ({ type, followID }: { type?: ''; followID?: '' }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const showPopup = useCallback(() => {
    setShowLoginPopup(true);
  }, []);

  const closePopup = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setShowLoginPopup(false);
  }, []);

  // Fetch user session
  const fetchUserSession = useCallback(async () => {
    try {
      const sess = await Common.getUserSess();
      const userIsLoggedIn = !!(sess && sess?.user?.role === 'user');
            
      setIsUserLoggedIn(userIsLoggedIn);
      setUserData(sess);
      return sess;
    } catch (error) {
      return null;
    }
  }, []);

  // Check follow status
  const checkFollowStatus = useCallback(async (sess: any) => {
    if (!followID || !sess?.user?.id) {
      return;
    }
    
    try {
      const formData = {
        'user_id': sess.user.id,
        'follow_type': type,
        'follow_id': followID
      }

      const response = await getFollowStatus(formData);
      
      setIsFollowing(response.hasFollowed);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  }, [followID, type]);

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      if (!followID) return;
      
      setIsLoading(true);

      const sess = await fetchUserSession();
      if (sess) {
        await checkFollowStatus(sess);
      }
      
      setIsLoading(false);
    };

    loadInitialData();
  }, [fetchUserSession, checkFollowStatus, followID]);

  const handleFollowToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!followID || isLoading) {
      return;
    }

    // Check if user is logged in - show popup if not
    if (!isUserLoggedIn) {
      showPopup();
      return false;
    }

    setIsLoading(true);
    
    try {
      const formData = {
        'user_id': userData.user.id,
        'follow_type': type,
        'follow_id': followID
      }

      let success = false;

      if(!isFollowing){
        const response = await addFollow(formData);
        success = response.ok;
      } else {
        const response = await removeFollow(formData);
        success = response?.data === true;
      }

      if (success) {
        setIsFollowing(!isFollowing);
      } else {
        await checkFollowStatus(userData);
      }
    } catch (error) {
      await checkFollowStatus(userData);
    } finally {
      setIsLoading(false);
    }
  }

  const loginPopup = showLoginPopup
    ? ReactDOM.createPortal(
        <div className={classnames(styles.popupOverlay, styles.ppLoginCheckSocial)}>
          <div className={styles.popupContainer}>
            <h3 className="fs_35">Login Required</h3>
            <p>Please log in to follow this.</p>
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

  return (
    <>
      <a 
        href="#" 
        tabIndex="-1"
        onClick={handleFollowToggle}
        style={{ 
          pointerEvents: isLoading ? 'none' : 'auto',
          opacity: isLoading ? 0.6 : 1 
        }}
      >
        {isLoading ? '...' : (isFollowing ? 'UNFOLLOW' : 'FOLLOW')}
      </a>
      {loginPopup}
    </>
  )
}

export default FollowUnfollowButton