// React Imports

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OurAdventureSection2 = ({ data }: { data?: []; }) => {
  
  return (
    <section className={classnames(styles.our_desti_sec2, styles.our_adven_sec2)}>
        <div className="container">
            <div className="head_text_center">
                {data?.feature_adventure_title && (<h2 className={classnames("fs_55")}>{data?.feature_adventure_title}</h2>)}
            </div>
            <div className={classnames(styles.feature_desti_row, styles.feature_adven_row)}>
                <div className={classnames(styles.feature_adven_box)}>
                    <div className={classnames(styles.feature_adven_top)}>
                        <div className={classnames(styles.feature_adven_img)}>
                            <img className="bx_sd" src="/images/sub-pages/adven1.jpg" />
                        </div>
                        <div className={classnames(styles.feature_adven_img_text)}>
                            <div className={classnames(styles.adven_star)}>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="86" height="13.955" viewBox="0 0 86 13.955">
                                      <g id="Group_404" data-name="Group 404" transform="translate(-735 -3122)">
                                        <path id="Path_480" data-name="Path 480" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(735 3122)" fill="#e7c268"/>
                                        <path id="Path_481" data-name="Path 481" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(752.832 3122)" fill="#e7c268"/>
                                        <path id="Path_482" data-name="Path 482" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(770.664 3122)" fill="#e7c268"/>
                                        <path id="Path_483" data-name="Path 483" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(788.495 3122)" fill="#e7c268"/>
                                        <path id="Path_484" data-name="Path 484" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(806.327 3122)" fill="#e7c268"/>
                                      </g>
                                    </svg>
                                </div>
                                <span className="extra_bold">4.75/5</span>
                            </div>
                        </div>
                    </div>
                    <div className={classnames(styles.feature_adven_bot)}>
                        <h3>Surf Costa Rica’s Wild Coast</h3>
                        <span className={classnames(styles.days_price)}><span className="extra_bold">14</span> days   |  from <span className="extra_bold">USD 6,299</span>/pp <span className={classnames(styles.taxes)}>(price includes taxes and fees)</span></span>
                        <p><span className="extra_bold">NEW TRIP:</span> Ride world-class waves where the jungle meets the sea. This Costa Rica surf adventure takes you to hidden beaches, uncrowded breaks, and laid-back coastal towns—guided by locals who know every swell. Whether you’re chasing barrels or just starting out.</p>
                        <div className={classnames(styles.btn, 'btn')}>
                            <a href="#" tabIndex="0">View Trip</a>
                        </div>
                    </div>
                </div>
                <div className={classnames(styles.feature_adven_box)}>
                    <div className={classnames(styles.feature_adven_top)}>
                        <div className={classnames(styles.feature_adven_img)}>
                            <img className="bx_sd" src="/images/sub-pages/adven2.jpg" />
                        </div>
                        <div className={classnames(styles.feature_adven_img_text)}>
                            <div className={classnames(styles.adven_star)}>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="86" height="13.955" viewBox="0 0 86 13.955">
                                      <g id="Group_404" data-name="Group 404" transform="translate(-735 -3122)">
                                        <path id="Path_480" data-name="Path 480" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(735 3122)" fill="#e7c268"/>
                                        <path id="Path_481" data-name="Path 481" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(752.832 3122)" fill="#e7c268"/>
                                        <path id="Path_482" data-name="Path 482" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(770.664 3122)" fill="#e7c268"/>
                                        <path id="Path_483" data-name="Path 483" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(788.495 3122)" fill="#e7c268"/>
                                        <path id="Path_484" data-name="Path 484" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(806.327 3122)" fill="#e7c268"/>
                                      </g>
                                    </svg>
                                </div>
                                <span className="extra_bold">4.55/5</span>
                            </div>
                        </div>
                    </div>
                    <div className={classnames(styles.feature_adven_bot)}>
                        <h3>the Wild Side of the DR</h3>
                        <span className={classnames(styles.days_price)}><span className="extra_bold">10</span> days   |  from <span className="extra_bold">USD 5,299</span>/pp <span className={classnames(styles.taxes)}>(price includes taxes and fees)</span></span>
                        <p>From misty mountain trails to hidden waterfalls and lush tropical valleys, this Dominican Republic adventure tour dives deep into the island’s untamed beauty. Hike, raft, zipline, and explore vibrant local culture—all guided by experts who take you far beyond the resort zone.</p>
                        <div className={classnames(styles.btn, 'btn')}>
                            <a href="#" tabIndex="0">View Trip</a>
                        </div>
                    </div>
                </div>
                <div className={classnames(styles.feature_adven_box)}>
                    <div className={classnames(styles.feature_adven_top)}>
                        <div className={classnames(styles.feature_adven_img)}>
                            <img className="bx_sd" src="/images/sub-pages/adven3.jpg" />
                        </div>
                        <div className={classnames(styles.feature_adven_img_text)}>
                            <div className={classnames(styles.adven_star)}>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="86" height="13.955" viewBox="0 0 86 13.955">
                                      <g id="Group_404" data-name="Group 404" transform="translate(-735 -3122)">
                                        <path id="Path_480" data-name="Path 480" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(735 3122)" fill="#e7c268"/>
                                        <path id="Path_481" data-name="Path 481" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(752.832 3122)" fill="#e7c268"/>
                                        <path id="Path_482" data-name="Path 482" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(770.664 3122)" fill="#e7c268"/>
                                        <path id="Path_483" data-name="Path 483" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(788.495 3122)" fill="#e7c268"/>
                                        <path id="Path_484" data-name="Path 484" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(806.327 3122)" fill="#e7c268"/>
                                      </g>
                                    </svg>
                                </div>
                                <span className="extra_bold">4.95/5</span>
                            </div>
                        </div>
                    </div>
                    <div className={classnames(styles.feature_adven_bot)}>
                        <h3>Ultimate Belize Adventure</h3>
                        <span className={classnames(styles.days_price)}><span className="extra_bold">12</span> days   |  from <span className="extra_bold">USD 8,299</span>/pp <span className={classnames(styles.taxes)}>(price includes taxes and fees)</span></span>
                        <p>Dive into the heart of Belize, where jungle trails, ancient Maya ruins, and crystal-clear rivers set the stage for nonstop exploration. This guided tour takes you deep into the wild—think cave tubing, waterfall hikes, wildlife encounters, and rich cultural immersion—one unforgettable journey</p>
                        <div className={classnames(styles.btn, 'btn')}>
                            <a href="#" tabIndex="0">View Trip</a>
                        </div>
                    </div>
                </div>
                <div className={classnames(styles.feature_adven_box)}>
                    <div className={classnames(styles.feature_adven_top)}>
                        <div className={classnames(styles.feature_adven_img)}>
                            <img className="bx_sd" src="/images/sub-pages/adven1.jpg" />
                        </div>
                        <div className={classnames(styles.feature_adven_img_text)}>
                            <div className={classnames(styles.adven_star)}>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="86" height="13.955" viewBox="0 0 86 13.955">
                                      <g id="Group_404" data-name="Group 404" transform="translate(-735 -3122)">
                                        <path id="Path_480" data-name="Path 480" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(735 3122)" fill="#e7c268"/>
                                        <path id="Path_481" data-name="Path 481" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(752.832 3122)" fill="#e7c268"/>
                                        <path id="Path_482" data-name="Path 482" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(770.664 3122)" fill="#e7c268"/>
                                        <path id="Path_483" data-name="Path 483" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(788.495 3122)" fill="#e7c268"/>
                                        <path id="Path_484" data-name="Path 484" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(806.327 3122)" fill="#e7c268"/>
                                      </g>
                                    </svg>
                                </div>
                                <span className="extra_bold">4.75/5</span>
                            </div>
                        </div>
                    </div>
                    <div className={classnames(styles.feature_adven_bot)}>
                        <h3>Surf Costa Rica’s Wild Coast</h3>
                        <span className={classnames(styles.days_price)}><span className="extra_bold">14</span> days   |  from <span className="extra_bold">USD 6,299</span>/pp <span className={classnames(styles.taxes)}>(price includes taxes and fees)</span></span>
                        <p><span className="extra_bold">NEW TRIP:</span> Ride world-class waves where the jungle meets the sea. This Costa Rica surf adventure takes you to hidden beaches, uncrowded breaks, and laid-back coastal towns—guided by locals who know every swell. Whether you’re chasing barrels or just starting out.</p>
                        <div className={classnames(styles.btn, 'btn')}>
                            <a href="#" tabIndex="0">View Trip</a>
                        </div>
                    </div>
                </div>
                <div className={classnames(styles.feature_adven_box)}>
                    <div className={classnames(styles.feature_adven_top)}>
                        <div className={classnames(styles.feature_adven_img)}>
                            <img className="bx_sd" src="/images/sub-pages/adven2.jpg" />
                        </div>
                        <div className={classnames(styles.feature_adven_img_text)}>
                            <div className={classnames(styles.adven_star)}>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="86" height="13.955" viewBox="0 0 86 13.955">
                                      <g id="Group_404" data-name="Group 404" transform="translate(-735 -3122)">
                                        <path id="Path_480" data-name="Path 480" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(735 3122)" fill="#e7c268"/>
                                        <path id="Path_481" data-name="Path 481" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(752.832 3122)" fill="#e7c268"/>
                                        <path id="Path_482" data-name="Path 482" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(770.664 3122)" fill="#e7c268"/>
                                        <path id="Path_483" data-name="Path 483" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(788.495 3122)" fill="#e7c268"/>
                                        <path id="Path_484" data-name="Path 484" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(806.327 3122)" fill="#e7c268"/>
                                      </g>
                                    </svg>
                                </div>
                                <span className="extra_bold">4.55/5</span>
                            </div>
                        </div>
                    </div>
                    <div className={classnames(styles.feature_adven_bot)}>
                        <h3>the Wild Side of the DR</h3>
                        <span className={classnames(styles.days_price)}><span className="extra_bold">10</span> days   |  from <span className="extra_bold">USD 5,299</span>/pp <span className={classnames(styles.taxes)}>(price includes taxes and fees)</span></span>
                        <p>From misty mountain trails to hidden waterfalls and lush tropical valleys, this Dominican Republic adventure tour dives deep into the island’s untamed beauty. Hike, raft, zipline, and explore vibrant local culture—all guided by experts who take you far beyond the resort zone.</p>
                        <div className={classnames(styles.btn, 'btn')}>
                            <a href="#" tabIndex="0">View Trip</a>
                        </div>
                    </div>
                </div>
                <div className={classnames(styles.feature_adven_box)}>
                    <div className={classnames(styles.feature_adven_top)}>
                        <div className={classnames(styles.feature_adven_img)}>
                            <img className="bx_sd" src="/images/sub-pages/adven3.jpg" />
                        </div>
                        <div className={classnames(styles.feature_adven_img_text)}>
                            <div className={classnames(styles.adven_star)}>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="86" height="13.955" viewBox="0 0 86 13.955">
                                      <g id="Group_404" data-name="Group 404" transform="translate(-735 -3122)">
                                        <path id="Path_480" data-name="Path 480" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(735 3122)" fill="#e7c268"/>
                                        <path id="Path_481" data-name="Path 481" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(752.832 3122)" fill="#e7c268"/>
                                        <path id="Path_482" data-name="Path 482" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(770.664 3122)" fill="#e7c268"/>
                                        <path id="Path_483" data-name="Path 483" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(788.495 3122)" fill="#e7c268"/>
                                        <path id="Path_484" data-name="Path 484" d="M7.337,0,5.6,5.33H0L4.533,8.625,2.8,13.955,7.337,10.66l4.534,3.295-1.732-5.33L14.673,5.33h-5.6Z" transform="translate(806.327 3122)" fill="#e7c268"/>
                                      </g>
                                    </svg>
                                </div>
                                <span className="extra_bold">4.95/5</span>
                            </div>
                        </div>
                    </div>
                    <div className={classnames(styles.feature_adven_bot)}>
                        <h3>Ultimate Belize Adventure</h3>
                        <span className={classnames(styles.days_price)}><span className="extra_bold">12</span> days   |  from <span className="extra_bold">USD 8,299</span>/pp <span className={classnames(styles.taxes)}>(price includes taxes and fees)</span></span>
                        <p>Dive into the heart of Belize, where jungle trails, ancient Maya ruins, and crystal-clear rivers set the stage for nonstop exploration. This guided tour takes you deep into the wild—think cave tubing, waterfall hikes, wildlife encounters, and rich cultural immersion—one unforgettable journey</p>
                        <div className={classnames(styles.btn, 'btn')}>
                            <a href="#" tabIndex="0">View Trip</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default OurAdventureSection2
