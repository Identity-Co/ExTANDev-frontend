import { useState, useCallback } from 'react';
import { addSaved, removeSaved } from '@/app/server/saved';

interface UseSaveProps {
  collectionName: string;
  collectionID: string;
  isUserLoggedIn: boolean;
  userData: any;
  showPopupOnce: () => void;
}

export const useSave = ({ 
  collectionName, 
  collectionID, 
  isUserLoggedIn, 
  userData,
  showPopupOnce 
}: UseSaveProps) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSaved = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isUserLoggedIn || !userData?.user?.id) {
      showPopupOnce(); // Call the popup function
      return;
    }

    const previousIsSaved = isSaved;
    setIsSaved(!previousIsSaved);

    try {
      const formData = {
        user_id: userData.user.id,
        collection_name: collectionName,
        collection_id: collectionID
      };

      if (previousIsSaved) {
        await removeSaved(formData);
      } else {
        await addSaved(formData);
      }
    } catch (error) {
      console.error('Error updating saved:', error);
      setIsSaved(previousIsSaved);
    }
  }, [collectionName, collectionID, isUserLoggedIn, userData, isSaved, showPopupOnce]);

  return {
    isSaved,
    setIsSaved,
    handleSaved
  };
};