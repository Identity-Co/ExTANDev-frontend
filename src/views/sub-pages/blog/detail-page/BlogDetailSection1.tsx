// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const BlogDetailSection1 = () => {
  
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
                                        <li>Deven McCoy</li>
                                        <li><span>•</span></li>
                                        <li><a href="#">bikemag.com</a></li>
                                        <li><span>•</span></li>
                                        <li>March 11, 2025</li>
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
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classnames(styles.surfing_text)}>
                    <h3 className="fs_35">Moab, Utah, is undeniably one of the most popular mountain biking destinations in the lower 48.</h3>
                    <p>This guide will help you figure out what to do, what trails to ride, and where to stay when visiting this mountain bike playground. The Mesozoic-aged sedimentary sandstone of Moab creates some of the most recognizable trails and is a must-visit destination for mountain bikers. However, with so many options for riding in the area, it can be a challenge to narrow it down, especially if you are only in town for a couple of days. I recently took a trip down to the red dirt of Moab and put together this quick guide for anyone looking to maximize their time in what was once called the Uranium Capital of the World.</p>
                    <h3 className="fs_35">Where To Camp in Moab</h3>
                    <p>One of the many great things about Moab is how much camping there is. Most of it is pretty private and much cheaper than staying in a hotel. Thanks to the abundance of public lands near Moab, there are plenty of free options, and if you don’t mind dispersed camping, this is a great option. If you want to have a few amenities, there are some great BLM campgrounds or National Park options. If you choose a BLM campground, bring plenty of extra water to cook and stay hydrated.</p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default BlogDetailSection1
