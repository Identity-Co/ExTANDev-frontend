import { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import styles from './styles.module.css';

import * as Royalty from '@/app/server/royalty'

import { getCollectionData } from '@/app/server/share';

interface ShareData {
  url: string;
  title: string;
  description?: string;
  image?: string;
}

interface UseShareProps {
  collectionName: string;
  collectionID: string;
  isUserLoggedIn: boolean;
  userData: any;
}

export const useShare = ({ 
  collectionName, 
  collectionID,
  isUserLoggedIn,
  userData
}: UseShareProps) => {
  const [showSharePopup, setShowSharePopup] = useState(false);

  const fetchCollectionData = useCallback(async (id: string) => {
    try {
      const formData = {
        'collection_type': collectionName,
        'collection_id': id,
      };
      const response = await getCollectionData(formData);

      //if (!response.ok) throw new Error('Failed to fetch collection data');
      return response;
    } catch (error) {
      console.error('Error fetching collection data:', error);
      return null;
    }
  }, []);

  const getShareData = useCallback(async (): Promise<ShareData> => {
    if (typeof window === 'undefined') return { url: '', title: '' };
    
    try {
      // Fetch collection data based on collectionID

      if(collectionName != 'reviews'){
        const collectionData = await fetchCollectionData(collectionID);
        
        if (collectionData) {
          return {
            url:
            collectionData?.slug
              ? collectionName === 'adventure_post'
                ? `${window.location.origin}/our-adventure/${collectionData.slug}`
                : `${window.location.origin}/our-destinations/${collectionData.slug}`
              : window.location.href,
            title: collectionData.title || collectionData.name || 'Travel Content',
            description: collectionData.description || collectionData.meta_description || '',
            image: collectionData.image || ''
          };
        }
      }
      
      // Fallback to current page meta tags if collection data is not available
      return {
        url: window.location.href,
        title: document.title || 'Travel Content',
        description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
        image: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || ''
      };
    } catch (error) {
      console.error('Error getting share data:', error);
      // Fallback to current page data
      return {
        url: window.location.href,
        title: document.title || 'Travel Content',
        description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
        image: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || ''
      };
    }
  }, [collectionID, fetchCollectionData]);

  const saveSharePointHistory = useCallback(async (data) => {
    console.log('Share data: ', data);

    if(isUserLoggedIn) {
      let s_points = 0;
      const s_res = await Royalty.getPointsByCode('SM_SHARING')
      if(s_res?.success) { s_points = s_res.value; }

      if(s_points > 0) {
        const _data = {
          "member_id" : userData.user.id,
          "action_id" : 'SM_SHARING',
          "action_sub_type" : collectionName,
          "share_via" : data.sharer ?? '',
          "reference_id" : collectionID,
          "points_earned" : s_points
        }

        console.log('_data: ', _data)

        const is_exists = await Royalty.checkPointHistoryExist(_data);
        if(is_exists.success && is_exists.exists == 0) {
          await Royalty.savePointHistory(_data);
        }
      }
    }
  }, [collectionName, collectionID, isUserLoggedIn, userData]);

  // Update all share functions to handle async getShareData
  const shareToInstagram = useCallback(async () => {
    const shareData = await getShareData();
    if(shareData.image){
      /*const response = shareData.image;
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      */
      const link = document.createElement('a');
      link.href = shareData.image;
      link.download = `instagram_story_${Date.now()}.jpg`;
      document.body.appendChild(link);
      alert('Image downloaded for Instagram Stories! 📱\n\n' +
            'How to share:\n' +
            '1. Open Instagram app\n' +
            '2. Swipe right or tap your story icon\n' +
            '3. Select this image from your gallery\n' +
            '4. Add stickers, text, and share to your story!\n' +
            '5. Don\'t forget to tag us! 🎯');
      link.click();
      document.body.removeChild(link);
      
      //setTimeout(() => URL.revokeObjectURL(url), 100);
    }
  }, [getShareData, saveSharePointHistory]);

  const shareToFacebook = useCallback(async () => {
    const shareData = await getShareData();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    saveSharePointHistory({'sharer': 'Facebook'})
  }, [getShareData, saveSharePointHistory]);

  const shareToPinterest = useCallback(async () => {
    const shareData = await getShareData();
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareData.url)}&description=${encodeURIComponent(shareData.title)}&media=${encodeURIComponent(shareData.image || '')}`;
    window.open(pinterestUrl, '_blank', 'width=600,height=400');
    saveSharePointHistory({'sharer': 'Pinterest'})
  }, [getShareData, saveSharePointHistory]);

  const shareToTwitter = useCallback(async () => {
    const shareData = await getShareData();
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    saveSharePointHistory({'sharer': 'Twitter'})
  }, [getShareData, saveSharePointHistory]);

  const shareToWhatsApp = useCallback(async () => {
    const shareData = await getShareData();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareData.title + ' ' + shareData.url)}`;
    window.open(whatsappUrl, '_blank');
    saveSharePointHistory({'sharer': 'WhatsApp'})
  }, [getShareData, saveSharePointHistory]);

  const shareToTikTok = useCallback(async () => {
    const shareData = await getShareData();
    const tiktokUrl = `https://www.tiktok.com/share?url=${encodeURIComponent(shareData.url)}`;
    window.open(tiktokUrl, '_blank');
    saveSharePointHistory({'sharer': 'TikTok'})
    alert('For TikTok sharing, you can save the content and upload it directly to the TikTok app.');
  }, [getShareData, saveSharePointHistory]);

  const copyToClipboard = useCallback(async () => {
    const shareData = await getShareData();
    try {
      await navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard!');
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = shareData.url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copied to clipboard!');
    }
  }, [getShareData]);

  const handleShareClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSharePopup(true);
  }, []);

  const closeSharePopup = useCallback(() => {
    setShowSharePopup(false);
  }, []);

  const sharePopup = showSharePopup
    ? ReactDOM.createPortal(
        <div className={classnames(styles.popupOverlay, styles.sharePopup)} onClick={closeSharePopup}>
          <div className={classnames(styles.popupContainer, styles.shareContainer)} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sharePopupHeader}>
              <h3>Share This Content</h3>
              <button 
                onClick={closeSharePopup}
                className={styles.closeButton}
                aria-label="Close share menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className={styles.shareOptions}>
              <button onClick={shareToFacebook} className={styles.shareOption}>
                <div className={classnames(styles.shareIcon, styles.facebook)}>
                  <svg width="2.2vw" height="2.2vw" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className={styles.shareLabel}>Facebook</span>
              </button>
              
              <button onClick={shareToInstagram} className={styles.shareOption}>
                <div className={classnames(styles.shareIcon, styles.instagram)}>
                  <svg width="2.2vw" height="2.2vw" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span className={styles.shareLabel}>Instagram</span>
              </button>
              
              <button onClick={shareToTwitter} className={styles.shareOption}>
                <div className={classnames(styles.shareIcon, styles.twitter)}>
                  <svg width="2.2vw" height="2.2vw" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2H21.5l-7.42 8.49L22.75 22h-6.02l-4.72-6.17L6.66 22H3.4l7.84-8.96L1.25 2h6.18l4.24 5.67L18.244 2zm-1.07 18.02h1.66L8.54 3.91H6.79l10.384 16.11z"/>
                  </svg>

                </div>
                <span className={styles.shareLabel}>Twitter/X</span>
              </button>
              
              <button onClick={shareToPinterest} className={styles.shareOption}>
                <div className={classnames(styles.shareIcon, styles.pinterest)}>
                  <svg width="2.2vw" height="2.2vw" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z"/>
                  </svg>
                </div>
                <span className={styles.shareLabel}>Pinterest</span>
              </button>
              
              <button onClick={shareToWhatsApp} className={styles.shareOption}>
                <div className={classnames(styles.shareIcon, styles.whatsapp)}>
                  <svg width="2.2vw" height="2.2vw" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                  </svg>
                </div>
                <span className={styles.shareLabel}>WhatsApp</span>
              </button>
              
              <button onClick={shareToTikTok} className={styles.shareOption}>
                <div className={classnames(styles.shareIcon, styles.tiktok)}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="2.2vw" height="2.2vw" fill="currentColor" aria-label="TikTok Icon" role="img">
                    <path d="M12.468 2h3.445a4.79 4.79 0 003.676 4.245c.33.08.672.13 1.02.149v3.57a7.561 7.561 0 01-4.238-1.308v3.572a6.329 6.329 0 11-5.8-6.32v3.5a2.895 2.895 0 103.183 4.51V2z"/>
                  </svg>

                </div>
                <span className={styles.shareLabel}>TikTok</span>
              </button>
              
              <button onClick={copyToClipboard} className={styles.shareOption}>
                <div className={classnames(styles.shareIcon, styles.link)}>
                  <svg width="2.2vw" height="2.2vw" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.465 11.293c1.133-1.133 3.109-1.133 4.242 0l.707.707 1.414-1.414-.707-.707c-.943-.944-2.199-1.465-3.535-1.465s-2.592.521-3.535 1.465L4.929 12a5.008 5.008 0 000 7.071 4.983 4.983 0 003.535 1.462A4.982 4.982 0 0012 19.071l.707-.707-1.414-1.414-.707.707a3.007 3.007 0 01-4.243 0 3.005 3.005 0 010-4.243l2.122-2.121z"></path>
                    <path d="M12 4.929l-.707.707 1.414 1.414.707-.707a3.007 3.007 0 014.243 0 3.005 3.005 0 010 4.243l-2.122 2.121c-1.133 1.133-3.109 1.133-4.242 0L10.586 12l-1.414 1.414.707.707c.943.944 2.199 1.465 3.535 1.465s2.592-.521 3.535-1.465L19.071 12a5.008 5.008 0 000-7.071 5.006 5.006 0 00-7.071 0z"></path>
                  </svg>
                </div>
                <span className={styles.shareLabel}>Copy Link</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return {
    showSharePopup,
    handleShareClick,
    closeSharePopup,
    sharePopup
  };
};