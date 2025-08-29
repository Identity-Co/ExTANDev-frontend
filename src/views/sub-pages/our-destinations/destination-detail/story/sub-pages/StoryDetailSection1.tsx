// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const StoryDetailSection1 = () => {
  
  return (
    <section className={classnames(styles.home_section1, styles.our_desti_sec1, styles.destination_overview_sec1, styles.stories_details_sec1)}>
        <div className={classnames(styles.container, 'container')}>
            <div className={classnames(styles.destination_overview_tab)}>
                <ul className={classnames(styles.destination_tab)}>
                    <li><a href="#">Overview</a></li>
                    <li><a href="#">Resorts</a></li>
                    <li><a href="#">Adventures</a></li>
                    <li className={classnames(styles.active)}><a href="#">Stories</a></li>
                </ul>
            </div>
            <div className={classnames(styles.surfing_row, styles.travel_stories_faq)}>
                <div className={classnames(styles.network_travel_profile)}>
                    <div className={classnames(styles.network_travel_picture)}>
                        <img src="/images/sub-pages/storie-info1.jpg" />
                    </div>
                    <div className={classnames(styles.adv_post_top_right)}>
                        <div className={classnames(styles.network_travel_profile_info)}>
                            <div className={classnames(styles.network_travel_profile_info_inner, styles.adventure_right_text)}>
                                <h4>Mikey February </h4>
                                <div className={classnames(styles.network_travel_follow)}>
                                    <span>•</span>
                                    <a href="#" tabIndex="-1">FOLLOW</a>
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
                            <span>@mikeyfebruarysurfs</span>
                        </div>
                        <div className={classnames(styles.adv_trailblazer)}>
                            <span>September 3, 2025</span>
                        </div>
                    </div>
                </div>
                <div className={classnames(styles.surfing_text)}>
                    <h3 className="fs_35">My Journey Through the Waves That Raised Me</h3>
                    <p>You can hear it before you see it—the low, rolling hum of water moving with purpose. The wind carries salt and energy. Somewhere beyond the dunes, a wave peels clean and long, drawing a perfect line across the horizon. <span className="extra_bold"><em>And then he appears: Mikey February, effortlessly gliding into frame, his style unmistakable—fluid, upright, elegant, like jazz on water.</em></span></p>
                    <p>This is Jeffreys Bay, South Africa’s crown jewel of surf. It’s a place of legend—of endless right-hand point breaks, sandstone ledges, and the kind of waves that live in surf films and daydreams. But for Mikey, this isn’t just a bucket-list stop. It’s part of a deeper rhythm—one that beats through the towns, people, and coasts of the country he calls home.</p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default StoryDetailSection1
