'use client'

// React Imports
import { useEffect, useState } from 'react'

import { getResortByIds } from '@/app/server/destinations'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const BlogDetailSection3 = ({ data }: { data?: []; }) => {

    const [resortsLists, setResortsLists] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchResorts = async () => {
          try {
            setLoading(true)
            const resorts = await getResortByIds(data?.fields[0]?.resorts_list)
            setResortsLists(resorts || [])
          } catch (error) {
            console.error('Error fetching resorts:', error)
            setResortsLists([])
          } finally {
            setLoading(false)
          }
        }

        fetchResorts()
     }, [data])

  return (
    <section className={classnames(styles.destination_resort_sec2, styles.moab_sec3, 'py_50')}>
        <div className="container">
            <div className="head_text_center">
                {data?.fields[0]?.resort_title && <h2 className="fs_55">{data?.fields[0]?.resort_title}</h2> }
            </div>
            <div className={classnames(styles.feature_resort_row)}>
                {resortsLists?.map((item, index) => (
                    <div key={index} className={classnames(styles.network_travel_box)}>
                        <div className={classnames(styles.network_travel_top)}>
                            <a className={classnames(styles.fl_bx_lnk_glb, 'fl_bx_lnk_glb')} href="#"></a>
                            <div className={classnames(styles.network_travel_img)}>
                                <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${item?.image}`} />
                            </div>
                            <div className={classnames(styles.network_travel_img_text)}>
                                {item?.location && <span>{item?.location}</span>}
                                {item?.title && <h4>{item?.title}</h4>}
                                <span dangerouslySetInnerHTML={{
                                    __html: (item?.content || ''),
                                }}></span>
                                <div className={classnames(styles.btn, 'btn')}>
                                    <a href="#">BOOK NOW</a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={classnames(styles.moab_resort_row)}>
                <div className="grid2 gap_64">
                    <div className={classnames(styles.grid_box, styles.biking_right)}>
                        <div className={classnames(styles.network_travel_profile)}>
                            <div className={classnames(styles.network_travel_picture)}>
                                <img src="/images/sub-pages/garret.jpg" />
                            </div>
                            <div className={classnames(styles.adv_post_top_right)}>
                                <div className={classnames(styles.network_travel_profile_info)}>
                                    <div className={classnames(styles.network_travel_profile_info_inner)}>
                                        <h4>Garret beal</h4>
                                        <div className={classnames(styles.network_travel_follow)}>
                                            <span>•</span>
                                            <a href="#" tabIndex="-1">FOLLOW</a>
                                        </div>
                                    </div>
                                    <span>@garrettbealrides</span>
                                </div>
                            </div>
                        </div>
                        <p><span className="extra_bold"><em>Mountain biking in Moab, Utah is like riding through another planet—</em></span> red rock canyons, slickrock trails, and endless desert views that take your breath away. The terrain is intense but addictive, with every climb rewarded by an epic descent. It’s raw, rugged, and absolutely unforgettable—a true bucket-list ride for any serious biker.</p>
                        <div className={classnames(styles.network_travel_likes)}>
                            <span>3w</span>
                            <span>45 likes</span>
                            <span>Reply</span>
                            <ul>
                                <li><a href="#" tabIndex="0"><svg xmlns="http://www.w3.org/2000/svg" width="11.743" height="13.953" viewBox="0 0 11.743 13.953">
                                  <path id="" data-name="Path 796" d="M0,.006V13.92l6.037-3.857,5.706,3.9V.006Z" transform="translate(0 -0.006)" fill="#696767"></path>
                                </svg>
                                </a></li>
                                <li><a href="#" tabIndex="0"><svg xmlns="http://www.w3.org/2000/svg" width="15.16" height="13.46" viewBox="0 0 15.16 13.46">
                                  <path id="" data-name="Path 1207" d="M19.708,1.393l-.15-.15a4.064,4.064,0,0,0-5.732,0l-.515.515-.519-.519a4.152,4.152,0,0,0-5.724,0l-.15.15A4.034,4.034,0,0,0,5.729,4.268,3.983,3.983,0,0,0,6.918,7.126l6.4,6.4L19.708,7.13v0a4.068,4.068,0,0,0,0-5.732" transform="translate(-5.729 -0.063)" fill="#696767"></path>
                                </svg>
                                </a></li>
                                <li><a href="#" tabIndex="0"><svg xmlns="http://www.w3.org/2000/svg" width="14.159" height="14" viewBox="0 0 14.159 14">
                                  <path id="" data-name="Path 1208" d="M25.51,9.482A6.874,6.874,0,0,0,25.964,7a7,7,0,1,0-6.994,7,6.8,6.8,0,0,0,2.845-.609l4.316.356Z" transform="translate(-11.973)" fill="#696767"></path>
                                </svg>
                                </a></li>
                                <li><a href="#" tabIndex="0"><svg xmlns="http://www.w3.org/2000/svg" width="15.456" height="13.735" viewBox="0 0 15.456 13.735">
                                  <g id="" data-name="Group 876" transform="translate(18.256 -130.131)">
                                    <path id="" data-name="Path 798" d="M32.689.03l-9.3,5.4-5.5-5.4Z" transform="translate(-36.143 130.1)" fill="#696767"></path>
                                    <path id="" data-name="Path 799" d="M28.752.25l-7.4,12.794-2.072-7.29Z" transform="translate(-31.551 130.822)" fill="#696767"></path>
                                  </g>
                                </svg>
                                </a></li>
                            </ul>
                        </div>
                    </div>
                    <div className={classnames(styles.grid_box, styles.biking_right)}>
                        <div className={classnames(styles.network_travel_profile)}>
                            <div className={classnames(styles.network_travel_picture)}>
                                <img src="/images/sub-pages/darby.jpg" />
                            </div>
                            <div className={classnames(styles.adv_post_top_right)}>
                                <div className={classnames(styles.network_travel_profile_info)}>
                                    <div className={classnames(styles.network_travel_profile_info_inner)}>
                                        <h4>Darby West</h4>
                                        <div className={classnames(styles.network_travel_follow)}>
                                            <span>•</span>
                                            <a href="#" tabIndex="-1">FOLLOW</a>
                                        </div>
                                    </div>
                                    <span>@darbywestreviews</span>
                                </div>
                            </div>
                        </div>
                        <p><span className="extra_bold"><em>Staying at Sorrel River Ranch was an unforgettable blend of luxury and wild Utah beauty.</em></span> Nestled along the Sorrel River with red rock cliffs rising in every direction, the views alone are worth the trip. The ranch perfectly balances upscale comfort with rustic charm—think handcrafted wood interiors, private decks, and stargazing by the fire.</p>
                        <div className={classnames(styles.network_travel_likes)}>
                            <span>3w</span>
                            <span>45 likes</span>
                            <span>Reply</span>
                            <ul>
                                <li><a href="#" tabIndex="0"><svg xmlns="http://www.w3.org/2000/svg" width="11.743" height="13.953" viewBox="0 0 11.743 13.953">
                                  <path id="" data-name="Path 796" d="M0,.006V13.92l6.037-3.857,5.706,3.9V.006Z" transform="translate(0 -0.006)" fill="#696767"></path>
                                </svg>
                                </a></li>
                                <li><a href="#" tabIndex="0"><svg xmlns="http://www.w3.org/2000/svg" width="15.16" height="13.46" viewBox="0 0 15.16 13.46">
                                  <path id="" data-name="Path 1207" d="M19.708,1.393l-.15-.15a4.064,4.064,0,0,0-5.732,0l-.515.515-.519-.519a4.152,4.152,0,0,0-5.724,0l-.15.15A4.034,4.034,0,0,0,5.729,4.268,3.983,3.983,0,0,0,6.918,7.126l6.4,6.4L19.708,7.13v0a4.068,4.068,0,0,0,0-5.732" transform="translate(-5.729 -0.063)" fill="#696767"></path>
                                </svg>
                                </a></li>
                                <li><a href="#" tabIndex="0"><svg xmlns="http://www.w3.org/2000/svg" width="14.159" height="14" viewBox="0 0 14.159 14">
                                  <path id="" data-name="Path 1208" d="M25.51,9.482A6.874,6.874,0,0,0,25.964,7a7,7,0,1,0-6.994,7,6.8,6.8,0,0,0,2.845-.609l4.316.356Z" transform="translate(-11.973)" fill="#696767"></path>
                                </svg>
                                </a></li>
                                <li><a href="#" tabIndex="0"><svg xmlns="http://www.w3.org/2000/svg" width="15.456" height="13.735" viewBox="0 0 15.456 13.735">
                                  <g id="" data-name="Group 876" transform="translate(18.256 -130.131)">
                                    <path id="" data-name="Path 798" d="M32.689.03l-9.3,5.4-5.5-5.4Z" transform="translate(-36.143 130.1)" fill="#696767"></path>
                                    <path id="" data-name="Path 799" d="M28.752.25l-7.4,12.794-2.072-7.29Z" transform="translate(-31.551 130.822)" fill="#696767"></path>
                                  </g>
                                </svg>
                                </a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default BlogDetailSection3
