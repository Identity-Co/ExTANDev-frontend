// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const AdventuresDetailSection1 = () => {
  
  return (
    <section className={classnames(styles.home_section1, styles.our_desti_sec1, styles.destination_overview_sec1, styles.adv_details_sec1)}>
        <div className="container">
            <div className={classnames(styles.destination_overview_tab)}>
                <ul className={classnames(styles.destination_tab)}>
                    <li><a href="#">Overview</a></li>
                    <li><a href="#">Resorts</a></li>
                    <li className={classnames(styles.active)}><a href="#">Adventures</a></li>
                    <li><a href="#">Stories</a></li>
                </ul>
            </div>
            <div className={classnames(styles.adventure_right_text, styles.bikink_head)}>
                <div className={classnames(styles.advanture_text1)}>
                    <h2 className="c_black">Grip It and Rip It: DR Edition</h2>
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
            </div>
            <div className={classnames(styles.biking_row)}>
                <div className={classnames(styles.biking_left)}>
                    <p className="c_black"><span className="extra_bold"><em>The Dominican Republic is packed full of wild tropical forests, vibrant small towns and picturesque mountain paths just waiting to be explored.</em></span> There’s so much to see and do beyond the resorts, and one of the best ways to see it all is to take to the land by mountain bike.</p>
                    <p className="c_black">Mountain biking in the Dominican Republic opens up incredible trails to discover, with paths varying across a wide range of difficulties and unique terrains. The central highlands offer traffic-free trails through enchanted “cloud” forests, with unbelievable views of the mountains and plantations. The coastal regions have some really special mountain bike routes where you can trace winding rivers, swim underneath waterfalls, and even explore cave systems.</p>
                </div>
                <div className={classnames(styles.biking_right)}>
                    <div className={classnames(styles.network_travel_profile, 'network_travel_profile')}>
                        <div className={classnames(styles.network_travel_picture, 'network_travel_picture')}>
                            <img src="/images/sub-pages/garret.jpg" />
                        </div>
                        <div className={classnames(styles.adv_post_top_right, 'adv_post_top_right')}>
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
                    <p><span className="extra_bold"><em>Mountain biking in the Dominican Republic was pure adrenaline and awe.</em></span> We rode through lush valleys, rugged mountain trails, and hidden villages—each turn revealing epic views and local charm. The mix of terrain, culture, and challenge made it one of the most unforgettable rides of my life.</p>
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
    </section>
  )
}

export default AdventuresDetailSection1
