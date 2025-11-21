// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

import LikesShare from '@/views/shared/like-share-section/LikeShareSection'

const BlogDetailSection1 = ({ data }: { data?: []; }) => {

    const formattedPostDate = data?.post_date
    ? new Date(data.post_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  
    return (
        <section className={classnames(styles.home_section1, styles.our_desti_sec1, styles.destination_overview_sec1, styles.stories_details_sec1, styles.moab_sec1)}>
            <div className={classnames(styles.container, 'container')}>
                <div className={classnames(styles.surfing_row, styles.travel_stories_faq)}>
                    <div className={classnames(styles.network_travel_profile)}>
                        <div className={classnames(styles.adv_post_top_right)}>
                            <div className={classnames(styles.network_travel_profile_info)}>
                                <div className={classnames(styles.network_travel_profile_info_inner, styles.adventure_right_text)}>
                                    <div>
                                        <ul className={classnames(styles.network_travel_follow)}>
                                            {data?.author_name && (
                                                <>
                                                    <li>{data?.author_name}</li>
                                                    <li><span>•</span></li>
                                                </>
                                            )}
                                            {data?.site_url && (
                                                <>
                                                    <li><a href={`https://${data.site_url}`} target="_blank">{data.site_url}</a></li>
                                                    <li><span>•</span></li>
                                                </>
                                            )}
                                            {formattedPostDate && <li>{formattedPostDate}</li>}
                                        </ul>
                                    </div>
                                    <div className={classnames(styles.advanture_text1)}>
                                        <a href="#"> <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18">
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
                                        </svg> Share</a>
                                    </div>
                                    {(data && data?.posted_user && data?.posted_user !== '') ? (
                                        data?.social_engagement === 'yes' ? (
                                            <div className={classnames(styles.social_engagement)}>
                                                <LikesShare
                                                    collectionName="adventure_guide"
                                                    collectionID={data?._id}
                                                />
                                            </div>
                                        ) : null
                                    ) : (
                                        <div className={classnames(styles.social_engagement)}>
                                            <LikesShare
                                                collectionName="adventure_guide"
                                                collectionID={data?._id}
                                            />
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                    {data?.content_sections?.[0]?.fields?.[0]?.type === 'content' && (
                        <>
                            <div className={classnames(styles.surfing_text)} dangerouslySetInnerHTML={{
                                  __html: (data?.content_sections?.[0]?.fields?.[0]?.value || '').replace(/<h3>/g, '<h3 class="fs_35">'),
                                }}>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}

export default BlogDetailSection1
