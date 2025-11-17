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

const AdventuresDetailSection1 = ({ data }: { data?: []; }) => { 

    const [detailpageReviw, setDetailpageReviw] = useState(null)

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
    <section className={classnames(styles.home_section1, styles.our_desti_sec1, styles.destination_overview_sec1, styles.adv_details_sec1)}>
        <div className="container">
            {/*<div className={classnames(styles.destination_overview_tab)}>
                <ul className={classnames(styles.destination_tab)}>
                    <li><a href="#">Overview</a></li>
                    <li><a href="#">Resorts</a></li>
                    <li className={classnames(styles.active)}><a href="#">Adventures</a></li>
                    <li><a href="#">Stories</a></li>
                </ul>
            </div>*/}
            <div className={classnames(styles.adventure_right_text, styles.bikink_head)}>
                <div className={classnames(styles.advanture_text1)}>
                    {data?.about_title && <h2 className="c_black">{data?.about_title}</h2>}
                    {data?.about_button_text && data?.about_button_link && (
                        <a href={data?.about_button_link}> <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18">
                          <g id="Group_474" data-name="Group 474" transform="translate(-749 -1655)">
                            <g id="Group_473" data-name="Group 473" transform="translate(0 43)">
                              <g id="Ellipse_2" data-name="Ellipse 2" transform="translate(760 1612)" fill="none" stroke="#fff" strokeWidth="1">
                                <circle cx="3" cy="3" r="3" stroke="none"></circle>
                                <circle cx="3" cy="3" r="2.5" fill="none"></circle>
                              </g>
                              <g id="Ellipse_3" data-name="Ellipse 3" transform="translate(760 1624)" fill="none" stroke="#fff" strokeWidth="1">
                                <circle cx="3" cy="3" r="3" stroke="none"></circle>
                                <circle cx="3" cy="3" r="2.5" fill="none"></circle>
                              </g>
                              <g id="Ellipse_4" data-name="Ellipse 4" transform="translate(749 1617)" fill="none" stroke="#fff" strokeWidth="1">
                                <circle cx="3.5" cy="3.5" r="3.5" stroke="none"></circle>
                                <circle cx="3.5" cy="3.5" r="3" fill="none"></circle>
                              </g>
                              <g id="Group_472" data-name="Group 472">
                                <path id="Path_389" data-name="Path 389" d="M-643.592,1706.313l5.581,3.131" transform="translate(1399 -84)" fill="none" stroke="#fff" strokeWidth="1"></path>
                                <path id="Path_390" data-name="Path 390" d="M-643.592,1703.338l5.594-3.252" transform="translate(1399 -84)" fill="none" stroke="#fff" strokeWidth="1"></path>
                              </g>
                            </g>
                          </g>
                        </svg> {data?.about_button_text}</a>
                    )}
                </div>
            </div>
            <div className={classnames(styles.biking_row)}>
                <div className={classnames(styles.biking_left)}>
                    <div className="c_black" dangerouslySetInnerHTML={{
                        __html: (data?.about_content || ''),
                      }}>
                    </div>
                </div>
                <div className={classnames(styles.biking_right)}>
                    <div className={classnames(styles.network_travel_profile, 'network_travel_profile')}>
                        <div className={classnames(styles.network_travel_picture, 'network_travel_picture')}>
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
                        <div className={classnames(styles.adv_post_top_right, 'adv_post_top_right')}>
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
                    <LikesShare collectionName='reviews' collectionID={detailpageReviw?._id} />
                </div>
            </div>
        </div>
    </section>
  )
}

export default AdventuresDetailSection1
