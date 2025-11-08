import { useState, useCallback } from 'react';
import { addLike, removeLike } from '@/app/server/likes';

interface UseLikeProps {
  collectionName: string;
  collectionID: string;
  isUserLoggedIn: boolean;
  userData: any;
  showPopupOnce: () => void;
}

export const useLike = ({ 
  collectionName, 
  collectionID, 
  isUserLoggedIn, 
  userData,
  showPopupOnce 
}: UseLikeProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);

  const handleLike = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isUserLoggedIn || !userData?.user?.id) {
      showPopupOnce(); // Call the popup function
      return;
    }

    const previousIsLiked = isLiked;
    const previousLikesCount = likesCount;

    setIsLiked(!previousIsLiked);
    setLikesCount(previousIsLiked ? previousLikesCount - 1 : previousLikesCount + 1);

    try {
      const formData = {
        user_id: userData.user.id,
        collection_name: collectionName,
        collection_id: collectionID
      };

      if (previousIsLiked) {
        await removeLike(formData);
      } else {
        await addLike(formData);
      }
    } catch (error) {
      console.error('Error updating like:', error);
      setIsLiked(previousIsLiked);
      setLikesCount(previousLikesCount);
    }
  }, [collectionName, collectionID, isUserLoggedIn, userData, isLiked, likesCount, showPopupOnce]);

  return {
    isLiked,
    setIsLiked,
    likesCount,
    setLikesCount,
    handleLike
  };
};