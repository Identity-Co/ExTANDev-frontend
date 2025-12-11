'use client'

// React Imports
import { useState, useEffect } from 'react'

import { Avatar } from '@mui/material';

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

import { getEntry } from '@/app/server/reviews'

import LikesShare from '@/views/shared/like-share-section/LikeShareSection'
import FollowUnfollow from '@/views/shared/follow-unfollow-button/FollowUnfollowButton'

const ResortsSection1 = ({ data }: { data?: []; }) => {  
  if(!data)
    return
  
  const [detailpageReviw, setDetailpageReviw] = useState(null)

  useEffect(() => {
    const jade_jungle_rooms_sec3 = document.querySelectorAll('.jade_jungle_rooms_sec3');
    
    jade_jungle_rooms_sec3.forEach((bgSec) => {
      const backgroundUrl = bgSec.getAttribute('databackground');
      if (backgroundUrl) {
        bgSec.style.backgroundImage = `url("${backgroundUrl}")`;
        bgSec.style.backgroundPosition = 'center center';
        bgSec.style.backgroundRepeat = 'no-repeat';
      }
    });
  }, [data?.review_background]);

  useEffect(() => {
    const getReviewData = async () => {
      const review = await getEntry(data?.selected_review);
      if(review){
        setDetailpageReviw(review);
      }
    };
    getReviewData();
  }, []);

  const getInitials = (name: string) => {
      return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };
  
  return (
    <section className={classnames(styles.jade_jungle_rooms_sec3, 'jade_jungle_rooms_sec3 py_150')} databackground={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${data?.review_background}`} style={{ backgroundImage: `url("${process.env.NEXT_PUBLIC_UPLOAD_URL}/${data?.review_background }")` }} >
      <div className={classnames(styles.container, 'container')}>
          <div className={classnames(styles.biking_right)}>
              <div className={classnames(styles.network_travel_profile)}>
                  <div className={classnames(styles.network_travel_picture)}>
                    {detailpageReviw?.user_info?.profile_picture ? (
                      <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${detailpageReviw?.user_info?.profile_picture}`} alt="User Profile" />
                    ) : (
                      <Avatar
                        className={classnames(styles.contact_review_img_default)}
                        sx={{
                          bgcolor: 'primary.main',
                        }}
                      >
                        {getInitials(detailpageReviw?.user_info?.first_name +' '+detailpageReviw?.user_info?.last_name)}
                      </Avatar>
                    )}
                  </div>
                  <div className={classnames(styles.adv_post_top_right)}>
                      <div className={classnames(styles.network_travel_profile_info)}>
                          <div className={classnames(styles.network_travel_profile_info_inner)}>
                              {detailpageReviw?.user_info?.first_name && <h4>{detailpageReviw?.user_info?.first_name} {detailpageReviw?.user_info?.last_name}</h4>}
                              <div className={classnames(styles.network_travel_follow)}>
                                  <span>•</span>
                                  <FollowUnfollow type="user" followID={detailpageReviw?.user_id} />
                              </div>
                          </div>
                          {detailpageReviw?.user_info?.first_name && <span>@{detailpageReviw?.user_info?.first_name}{detailpageReviw?.user_info?.last_name}</span>}
                      </div>
                  </div>
              </div>
              {detailpageReviw?.review_text && <p>{detailpageReviw?.review_text}</p>}
              <LikesShare collectionName='reviews' collectionID={detailpageReviw?._id} color='white' />
          </div>
      </div>
    </section>
  )
}

export default ResortsSection1
